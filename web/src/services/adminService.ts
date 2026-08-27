import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where,
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  ProductRecord, 
  CustomerRecord, 
  DeliveryAreaRecord, 
  AuditLogRecord 
} from '../types';
import { BUSINESS_CONFIG } from '../config/business';

export class AdminService {
  // Product Management (20L & 5L only)
  async getProducts(): Promise<ProductRecord[]> {
    if (!isFirebaseConfigured) {
      return BUSINESS_CONFIG.products.map((p, idx) => ({
        id: p.id,
        productId: p.id as 'jar_20l' | 'bottle_5l',
        nameBn: p.nameBn,
        nameEn: p.nameEn,
        size: p.size as '20L' | '5L',
        descriptionBn: p.descBn,
        descriptionEn: p.descEn,
        active: true,
        sortOrder: idx + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        // Initialize default 20L and 5L
        return BUSINESS_CONFIG.products.map((p, idx) => ({
          id: p.id,
          productId: p.id as 'jar_20l' | 'bottle_5l',
          nameBn: p.nameBn,
          nameEn: p.nameEn,
          size: p.size as '20L' | '5L',
          descriptionBn: p.descBn,
          descriptionEn: p.descEn,
          active: true,
          sortOrder: idx + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      }
      return snap.docs.map(d => d.data() as ProductRecord);
    } catch (err) {
      console.warn('Error fetching products:', err);
      return [];
    }
  }

  // Delivery Areas
  async getDeliveryAreas(): Promise<DeliveryAreaRecord[]> {
    if (!isFirebaseConfigured) {
      return BUSINESS_CONFIG.initialDeliveryAreas.map((a, i) => ({
        id: a.id,
        nameBn: a.bn,
        nameEn: a.en,
        active: true,
        sortOrder: i + 1,
      }));
    }

    try {
      const snap = await getDocs(collection(db, 'deliveryAreas'));
      if (snap.empty) {
        return BUSINESS_CONFIG.initialDeliveryAreas.map((a, i) => ({
          id: a.id,
          nameBn: a.bn,
          nameEn: a.en,
          active: true,
          sortOrder: i + 1,
        }));
      }
      return snap.docs.map(d => d.data() as DeliveryAreaRecord);
    } catch (err) {
      return BUSINESS_CONFIG.initialDeliveryAreas.map((a, i) => ({
        id: a.id,
        nameBn: a.bn,
        nameEn: a.en,
        active: true,
        sortOrder: i + 1,
      }));
    }
  }

  // Staff List for Assignment
  async getStaffList(): Promise<{ uid: string; name: string; email: string; phone?: string }[]> {
    if (!isFirebaseConfigured) {
      return [
        { uid: 'staff-1', name: 'মোঃ রফিক আহমদ (ডেলিভারি টিম ১)', email: 'delivery1@miladwater.com', phone: '01711102448' },
        { uid: 'staff-2', name: 'আব্দুল করিম (ডেলিভারি টিম ২)', email: 'delivery2@miladwater.com', phone: '01711102448' },
        { uid: 'staff-3', name: 'সেলিম মিয়া (মিরবক্সটুলা পয়েন্ট)', email: 'delivery3@miladwater.com', phone: '01711102448' },
      ];
    }

    try {
      const q = query(
        collection(db, 'admins'),
        where('role', '==', 'STAFF'),
        where('active', '==', true)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        return [
          { uid: 'staff-1', name: 'মোঃ রফিক আহমদ (ডেলিভারি স্টাফ)', email: 'delivery1@miladwater.com', phone: '01711102448' },
          { uid: 'staff-2', name: 'আব্দুল করিম (ডেলিভারি স্টাফ)', email: 'delivery2@miladwater.com', phone: '01711102448' },
        ];
      }
      return snap.docs.map(d => ({
        uid: d.id,
        name: d.data().name || 'Staff Member',
        email: d.data().email || '',
        phone: d.data().phone || '01711102448',
      }));
    } catch (err) {
      console.warn('Could not query staff list, using active fallback:', err);
      return [
        { uid: 'staff-1', name: 'মোঃ রফিক আহমদ (ডেলিভারি স্টাফ)', email: 'delivery1@miladwater.com', phone: '01711102448' },
        { uid: 'staff-2', name: 'আব্দুল করিম (ডেলিভারি স্টাফ)', email: 'delivery2@miladwater.com', phone: '01711102448' },
      ];
    }
  }

  // Export orders to CSV
  exportOrdersToCSV(orders: any[]): void {
    if (!orders || orders.length === 0) return;

    const headers = ['Order ID', 'Date', 'Customer', 'Phone', '20L Qty', '5L Qty', 'Total Qty', 'Delivery Type', 'Area', 'Address', 'Status', 'Assigned Staff'];
    
    const rows = orders.map(o => [
      `"${o.orderId}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      o.jar20Qty || 0,
      o.bottle5Qty || 0,
      o.totalQuantity || ((o.jar20Qty || 0) + (o.bottle5Qty || 0)),
      `"${o.deliveryType || ''}"`,
      `"${(o.deliveryArea || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.status || ''}"`,
      `"${o.assignedStaff?.name || o.assignedTo || 'Unassigned'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Milad_Water_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Audit Logs
  async logAuditAction(
    actorUid: string,
    actorEmail: string,
    action: string,
    targetType: 'ORDER' | 'PRODUCT' | 'ADMIN' | 'CUSTOMER' | 'SETTING',
    targetId: string,
    details?: string,
    prev?: string,
    next?: string
  ): Promise<void> {
    const record: AuditLogRecord = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      actorUid,
      actorEmail,
      action,
      targetType,
      targetId,
      previousValue: prev,
      newValue: next,
      details,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'auditLogs'), record);
      } catch (err) {
        console.warn('Audit logging failed in Firestore:', err);
      }
    }
  }

  async getAuditLogs(): Promise<AuditLogRecord[]> {
    if (!isFirebaseConfigured) {
      return [
        {
          id: 'log-sample-1',
          actorUid: 'admin-1',
          actorEmail: 'miladdrinkingwater@gmail.com',
          action: 'ORDER_STATUS_CHANGED',
          targetType: 'ORDER',
          targetId: 'MW-20260827-1002',
          previousValue: 'PENDING',
          newValue: 'CONFIRMED',
          details: 'Order confirmed by administrator',
          createdAt: new Date().toISOString(),
        }
      ];
    }

    try {
      const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as AuditLogRecord);
    } catch (err) {
      console.warn('Could not fetch audit logs:', err);
      return [];
    }
  }
}

export const adminService = new AdminService();
