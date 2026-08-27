import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
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
