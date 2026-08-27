import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  FirestoreOrder, 
  OrderFormData, 
  OrderStatus, 
  DeliveryType, 
  OrderItem 
} from '../types';
import { BUSINESS_CONFIG } from '../config/business';

const STORAGE_KEY = 'milad_orders';

export class OrderService {
  // Generate human-friendly collision-safe order ID: e.g. MW-20260828-XXXX
  private generateReadableOrderId(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `MW-${yyyy}${mm}${dd}-${rand}`;
  }

  // Create Order in Firestore and update local storage cache
  async createOrder(formData: OrderFormData): Promise<FirestoreOrder> {
    const readableId = this.generateReadableOrderId();
    const nowIso = new Date().toISOString();

    const items: OrderItem[] = [];
    if (formData.jar20Qty > 0) {
      items.push({
        productId: 'jar_20l',
        productNameBn: '২০ লিটার জার',
        productNameEn: '20 Litre Jar',
        productSize: '20L',
        quantity: formData.jar20Qty
      });
    }
    if (formData.bottle5Qty > 0) {
      items.push({
        productId: 'bottle_5l',
        productNameBn: '৫ লিটার বোতল',
        productNameEn: '5 Litre Bottle',
        productSize: '5L',
        quantity: formData.bottle5Qty
      });
    }

    let deliveryType: DeliveryType = 'HOME';
    if (formData.serviceType === 'office_delivery') {
      deliveryType = 'OFFICE';
    } else if (formData.serviceType === 'event_bulk_supply') {
      deliveryType = 'EVENT_BULK';
    }

    const orderData: FirestoreOrder = {
      id: readableId,
      orderId: readableId,
      customerName: formData.customerName.trim(),
      customerPhone: formData.phone.trim(),
      items,
      jar20Qty: formData.jar20Qty,
      bottle5Qty: formData.bottle5Qty,
      totalQuantity: formData.jar20Qty + formData.bottle5Qty,
      deliveryType,
      deliveryArea: formData.deliveryArea,
      customArea: formData.customArea?.trim() || '',
      address: formData.fullAddress.trim(),
      deliveryNote: formData.deliveryNote?.trim() || '',
      status: 'PENDING',
      source: 'WEBSITE',
      createdAt: nowIso,
      updatedAt: nowIso,
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: nowIso,
          note: 'অর্ডার গ্রাহক কর্তৃক ওয়েবসাইটের মাধ্যমে প্রদান করা হয়েছে।'
        }
      ]
    };

    // 1. If Firebase is active, write to Cloud Firestore
    if (isFirebaseConfigured) {
      try {
        const orderDocRef = doc(db, 'orders', readableId);
        await setDoc(orderDocRef, {
          ...orderData,
          firestoreCreatedAt: serverTimestamp(),
          firestoreUpdatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.warn('Firestore direct write failed, falling back to cached persistence:', error);
      }
    }

    // 2. Cache in local storage for guest customer convenience
    this.saveToLocalStorage(orderData);

    return orderData;
  }

  // Retrieve an order by Order ID and Phone Number for Customer Tracking
  async trackOrder(orderId: string, phone: string): Promise<FirestoreOrder | null> {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    // Try Firestore first if configured
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'orders', cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreOrder;
          const storedPhoneClean = data.customerPhone.replace(/\D/g, '');
          if (storedPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(storedPhoneClean)) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Firestore tracking query failed, checking local cache:', err);
      }
    }

    // Fallback to local cache
    const localOrders = this.getLocalOrders();
    const matched = localOrders.find(
      (o) => o.orderId.toUpperCase() === cleanId && 
             (o.customerPhone.replace(/\D/g, '').endsWith(cleanPhone) || cleanPhone.endsWith(o.customerPhone.replace(/\D/g, '')))
    );

    return matched || null;
  }

  // Real-time listener for customer tracking an active order
  subscribeToOrder(orderId: string, onUpdate: (order: FirestoreOrder | null) => void): () => void {
    if (!isFirebaseConfigured) {
      const local = this.getLocalOrders().find(o => o.orderId.toUpperCase() === orderId.trim().toUpperCase()) || null;
      onUpdate(local);
      return () => {};
    }

    const docRef = doc(db, 'orders', orderId.trim().toUpperCase());
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as FirestoreOrder);
      } else {
        onUpdate(null);
      }
    }, (error) => {
      console.warn('Order subscription error:', error);
    });
  }

  // Admin: Real-time listener for all orders
  subscribeToAllOrders(onUpdate: (orders: FirestoreOrder[]) => void): () => void {
    if (!isFirebaseConfigured) {
      onUpdate(this.getLocalOrders());
      return () => {};
    }

    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const results: FirestoreOrder[] = [];
      snapshot.forEach(docSnap => {
        results.push(docSnap.data() as FirestoreOrder);
      });
      onUpdate(results);
    }, (error) => {
      console.warn('Firestore admin orders subscription error:', error);
      onUpdate(this.getLocalOrders());
    });
  }

  // Admin: Update Order Status
  async updateOrderStatus(
    orderId: string, 
    newStatus: OrderStatus, 
    note?: string, 
    actorEmail?: string
  ): Promise<boolean> {
    const nowIso = new Date().toISOString();
    const updatePayload: Partial<FirestoreOrder> & { [key: string]: any } = {
      status: newStatus,
      updatedAt: nowIso,
    };

    if (newStatus === 'CONFIRMED') updatePayload.confirmedAt = nowIso;
    if (newStatus === 'OUT_FOR_DELIVERY') updatePayload.dispatchedAt = nowIso;
    if (newStatus === 'DELIVERED') updatePayload.deliveredAt = nowIso;
    if (newStatus === 'CANCELLED') updatePayload.cancelledAt = nowIso;
    if (note) updatePayload.adminNote = note;

    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'orders', orderId);
        await updateDoc(docRef, {
          ...updatePayload,
          firestoreUpdatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Failed to update order status in Firestore:', err);
        return false;
      }
    }

    // Update local cache as well
    const local = this.getLocalOrders();
    const idx = local.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatePayload };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    }

    return true;
  }

  // Local Storage Utilities
  getLocalOrders(): FirestoreOrder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(order: FirestoreOrder) {
    try {
      const existing = this.getLocalOrders();
      const filtered = existing.filter(o => o.orderId !== order.orderId);
      const updated = [order, ...filtered].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache order in localStorage', e);
    }
  }

  clearLocalOrders() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  // Generate WhatsApp Message URL
  generateWhatsAppUrl(order: FirestoreOrder): string {
    const parts: string[] = [];
    if (order.jar20Qty > 0) parts.push(`20 Litre Jar (${order.jar20Qty} pcs)`);
    if (order.bottle5Qty > 0) parts.push(`5 Litre Bottle (${order.bottle5Qty} pcs)`);
    const productStr = parts.join(' + ') || 'Pure Drinking Water';

    let deliveryLabel = 'Home Delivery (বাসায় ডেলিভারি)';
    if (order.deliveryType === 'OFFICE') deliveryLabel = 'Office Delivery (অফিস সাপ্লাই)';
    if (order.deliveryType === 'EVENT_BULK') deliveryLabel = 'Event / Bulk Supply (ইভেন্ট ও বিশেষ আয়োজন)';

    const totalQty = order.totalQuantity || (order.jar20Qty + order.bottle5Qty);

    const message =
      `*MILAD DRINKING WATER*\n` +
      `*ORDER REQUEST*\n\n` +
      `*Order ID:* ${order.orderId}\n` +
      `*Customer Name:* ${order.customerName}\n` +
      `*Mobile:* ${order.customerPhone}\n` +
      `*Product:* ${productStr}\n` +
      `*Quantity:* 20L: ${order.jar20Qty} | 5L: ${order.bottle5Qty} (Total: ${totalQty})\n` +
      `*Delivery Type:* ${deliveryLabel}\n` +
      `*Delivery Area:* ${order.deliveryArea}\n` +
      `*Address:* ${order.address}\n` +
      `*Delivery Note:* ${order.deliveryNote || 'None'}\n\n` +
      `_Official Order received at Milad Drinking Water Portal_`;

    return `https://wa.me/${BUSINESS_CONFIG.phoneInternational}?text=${encodeURIComponent(message)}`;
  }
}

export const orderService = new OrderService();
