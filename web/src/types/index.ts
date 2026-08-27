export type Language = 'bn' | 'en';

export type ProductId = 'jar_20l' | 'bottle_5l' | 'both';

export type ServiceType = 'home_delivery' | 'office_delivery' | 'event_bulk_supply';

export type DeliveryType = 'HOME' | 'OFFICE' | 'EVENT_BULK';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type AdminRole = 'ADMIN' | 'STAFF';

export interface ProductItem {
  id: 'jar_20l' | 'bottle_5l';
  nameBn: string;
  nameEn: string;
  capacityBn: string;
  capacityEn: string;
  descBn: string;
  descEn: string;
  image: string;
  featuresBn: string[];
  featuresEn: string[];
  idealForBn: string;
  idealForEn: string;
}

export interface ServiceItem {
  id: ServiceType;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  descBn: string;
  descEn: string;
  bulletPointsBn: string[];
  bulletPointsEn: string[];
  ctaBn: string;
  ctaEn: string;
}

export interface OrderItem {
  productId: 'jar_20l' | 'bottle_5l';
  productNameBn: string;
  productNameEn: string;
  productSize: '20L' | '5L';
  quantity: number;
}

export interface FirestoreOrder {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  jar20Qty: number;
  bottle5Qty: number;
  totalQuantity: number;
  deliveryType: DeliveryType;
  deliveryArea: string;
  customArea?: string;
  address: string;
  deliveryNote?: string;
  status: OrderStatus;
  source: 'WEBSITE' | 'DIRECT_CALL' | 'WHATSAPP';
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  assignedTo?: string | null;
  adminNote?: string;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    changedBy?: string;
  }[];
}

// Backward compatibility
export type SavedOrder = FirestoreOrder;

export interface OrderFormData {
  customerName: string;
  phone: string;
  productId: ProductId;
  jar20Qty: number;
  bottle5Qty: number;
  serviceType: ServiceType;
  deliveryArea: string;
  customArea?: string;
  fullAddress: string;
  deliveryNote?: string;
}

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CustomerRecord {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  address?: string;
  defaultArea?: string;
  totalOrders: number;
  lastOrderAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecord {
  id: string;
  productId: 'jar_20l' | 'bottle_5l';
  nameBn: string;
  nameEn: string;
  size: '20L' | '5L';
  descriptionBn: string;
  descriptionEn: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAreaRecord {
  id: string;
  nameBn: string;
  nameEn: string;
  active: boolean;
  sortOrder: number;
}

export interface AuditLogRecord {
  id: string;
  actorUid: string;
  actorEmail: string;
  action: string;
  targetType: 'ORDER' | 'PRODUCT' | 'ADMIN' | 'CUSTOMER' | 'SETTING';
  targetId: string;
  previousValue?: string;
  newValue?: string;
  details?: string;
  createdAt: string;
}

export interface BusinessSettings {
  companyNameBn: string;
  companyNameEn: string;
  taglineBn: string;
  taglineEn: string;
  phone: string;
  email: string;
  factoryAddressBn: string;
  factoryAddressEn: string;
  proprietorBn: string;
  proprietorEn: string;
  established: string;
  certification: string;
}
