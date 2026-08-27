import React, { useState } from 'react';
import { 
  FirestoreOrder, 
  OrderStatus, 
  DeliveryType, 
  AdminUser 
} from '../types';
import { orderService } from '../services/orderService';
import { 
  Truck, 
  Phone, 
  MessageCircle, 
  Navigation, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CalendarDays, 
  Eye, 
  ArrowRight,
  Filter,
  Search,
  Check,
  Package,
  Sparkles
} from 'lucide-react';

interface DailyOperationsBoardProps {
  orders: FirestoreOrder[];
  adminUser: AdminUser;
  staffList: { uid: string; name: string; email: string; phone?: string }[];
  onSelectOrder: (order: FirestoreOrder) => void;
  onQuickAssignStaff: (order: FirestoreOrder) => void;
  onUpdateStatus: (order: FirestoreOrder, nextStatus: OrderStatus) => void;
  longPendingHours?: number;
}

export const DailyOperationsBoard: React.FC<DailyOperationsBoardProps> = ({
  orders,
  adminUser,
  staffList,
  onSelectOrder,
  onQuickAssignStaff,
  onUpdateStatus,
  longPendingHours = 2,
}) => {
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const now = Date.now();

  // Filter orders for today & active operations
  const activeOrders = orders.filter(o => {
    if (o.status === 'CANCELLED') return false;

    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (areaFilter !== 'ALL' && o.deliveryArea !== areaFilter) return false;
    if (deliveryTypeFilter !== 'ALL' && o.deliveryType !== deliveryTypeFilter) return false;

    return true;
  });

  // Columns
  const pendingList = activeOrders.filter(o => o.status === 'PENDING');
  const confirmedList = activeOrders.filter(o => o.status === 'CONFIRMED');
  const preparingList = activeOrders.filter(o => o.status === 'PREPARING');
  const outForDeliveryList = activeOrders.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const deliveredList = activeOrders.filter(o => o.status === 'DELIVERED').slice(0, 10);

  // Business Alerts calculations
  const unassignedOrders = activeOrders.filter(o => 
    !o.assignedTo && (o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PREPARING')
  );

  const longPendingOrders = activeOrders.filter(o => {
    if (o.status !== 'PENDING') return false;
    const createdTime = new Date(o.createdAt).getTime();
    if (isNaN(createdTime)) return false;
    const hoursWaiting = (now - createdTime) / (1000 * 60 * 60);
    return hoursWaiting >= longPendingHours;
  });

  const eventOrders = activeOrders.filter(o => o.deliveryType === 'EVENT_BULK' && o.status !== 'DELIVERED');

  const getGoogleMapsUrl = (address: string, area: string) => {
    const query = `${address}, ${area}, Sylhet, Bangladesh`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const renderOrderCard = (order: FirestoreOrder, nextStatus?: OrderStatus, nextLabel?: string) => {
    const createdTime = new Date(order.createdAt).getTime();
    const minutesAgo = !isNaN(createdTime) ? Math.floor((now - createdTime) / (1000 * 60)) : 0;
    const isLongWait = order.status === 'PENDING' && minutesAgo >= (longPendingHours * 60);

    return (
      <div 
        key={order.orderId}
        className={`p-4 rounded-2xl bg-slate-900 border transition-all space-y-3 shadow-md ${
          isLongWait ? 'border-amber-500/80 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        {/* Card Top: ID, Type & Time */}
        <div className="flex items-start justify-between gap-1">
          <div>
            <span className="font-mono font-bold text-sky-400 text-xs">{order.orderId}</span>
            {order.deliveryType === 'EVENT_BULK' && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                EVENT
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{minutesAgo < 60 ? `${minutesAgo}মি` : `${Math.floor(minutesAgo / 60)}ঘ`}</span>
          </span>
        </div>

        {/* Customer & Location */}
        <div>
          <p className="font-bold text-white text-xs">{order.customerName}</p>
          <p className="text-[11px] text-slate-400 truncate">{order.deliveryArea} - {order.address}</p>
        </div>

        {/* Product Volume */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {order.jar20Qty > 0 && <span className="text-sky-300">20L: {order.jar20Qty}</span>}
          {order.bottle5Qty > 0 && <span className="text-blue-300">5L: {order.bottle5Qty}</span>}
        </div>

        {/* Assigned Staff */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
          <span>স্টাফ:</span>
          {order.assignedStaff?.name ? (
            <span className="text-sky-300 font-bold truncate max-w-[120px]">{order.assignedStaff.name}</span>
          ) : (
            <button
              onClick={() => onQuickAssignStaff(order)}
              className="text-amber-400 font-bold hover:underline"
            >
              + নির্ধারণ করুন
            </button>
          )}
        </div>

        {/* Quick 1-Tap Action Toolbar */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <a
            href={`tel:${order.customerPhone}`}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-800"
            title="কল দিন"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a
            href={orderService.generateCustomerWhatsAppUrl(order, order.status)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 flex items-center justify-center border border-emerald-800"
            title="WhatsApp মেসেজ"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <a
            href={getGoogleMapsUrl(order.address, order.deliveryArea)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-300 flex items-center justify-center border border-blue-800"
            title="ম্যাপে লোকেশন দেখুন"
          >
            <Navigation className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onSelectOrder(order)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs"
            title="বিস্তারিত দেখুন"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fast Status Advancement Button */}
        {nextStatus && nextLabel && (
          <button
            onClick={() => onUpdateStatus(order, nextStatus)}
            className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <span>{nextLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-sky-400" />
            <span>দৈনিক অপারেশনাল বোর্ড (Daily Operations Board)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            কানবান স্টাইল লাইভ অর্ডার ডিসপ্যাচ ও দ্রুত ডেলিভারি সমন্বয়
          </p>
        </div>
      </div>

      {/* Operational Business Alerts Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {unassignedOrders.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="text-amber-300 block">{unassignedOrders.length} টি অর্ডারে স্টাফ নির্ধারিত নেই</strong>
                <span className="text-[11px] text-amber-400/80">দ্রুত ডেলিভারি প্রতিনিধি যুক্ত করুন</span>
              </div>
            </div>
          </div>
        )}

        {longPendingOrders.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <strong className="text-red-300 block">{longPendingOrders.length} টি অর্ডার দীর্ঘক্ষণ অপেক্ষমাণ ({longPendingHours}+ ঘণ্টা)</strong>
                <span className="text-[11px] text-red-400/80">দ্রুত কনফার্ম করে ডেলিভারি দিন</span>
              </div>
            </div>
          </div>
        )}

        {eventOrders.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <strong className="text-purple-300 block">{eventOrders.length} টি ইভেন্ট ও বাল্ক অর্ডার সক্রিয়</strong>
                <span className="text-[11px] text-purple-400/80">অনুষ্ঠান ও সম্মেলনের পানির বিশেষ সরবরাহ</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার আইডি, গ্রাহক, ফোন বা এলাকা খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={deliveryTypeFilter}
            onChange={(e) => setDeliveryTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
          >
            <option value="ALL">সকল ধরন (All Types)</option>
            <option value="HOME">HOME (বাসা)</option>
            <option value="OFFICE">OFFICE (অফিস)</option>
            <option value="EVENT_BULK">EVENT (ইভেন্ট)</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Column 1: PENDING */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">অপেক্ষমাণ (Pending)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
              {pendingList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {pendingList.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8">কোনো অপেক্ষমাণ অর্ডার নেই</p>
            ) : (
              pendingList.map(o => renderOrderCard(o, 'CONFIRMED', 'Confirm করুন'))
            )}
          </div>
        </div>

        {/* Column 2: CONFIRMED */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">নিশ্চিত (Confirmed)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
              {confirmedList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {confirmedList.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8">কোনো নিশ্চিত অর্ডার নেই</p>
            ) : (
              confirmedList.map(o => renderOrderCard(o, 'PREPARING', 'প্রস্তুতি শুরু'))
            )}
          </div>
        </div>

        {/* Column 3: PREPARING */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">প্রস্তুতি (Preparing)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
              {preparingList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {preparingList.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8">কোনো প্রস্তুতিাধীন অর্ডার নেই</p>
            ) : (
              preparingList.map(o => renderOrderCard(o, 'OUT_FOR_DELIVERY', 'ডেলিভারিতে পাঠান'))
            )}
          </div>
        </div>

        {/* Column 4: OUT FOR DELIVERY */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">ডেলিভারির পথে (Out)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold text-xs">
              {outForDeliveryList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {outForDeliveryList.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8">পথে কোনো ডেলিভারি নেই</p>
            ) : (
              outForDeliveryList.map(o => renderOrderCard(o, 'DELIVERED', 'সম্পন্ন (Delivered)'))
            )}
          </div>
        </div>

        {/* Column 5: RECENTLY DELIVERED */}
        <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">সম্পন্ন (Delivered)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
              {deliveredList.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {deliveredList.length === 0 ? (
              <p className="text-center text-slate-600 text-xs py-8">আজ কোনো ডেলিভারি রেকর্ড হয়নি</p>
            ) : (
              deliveredList.map(o => renderOrderCard(o))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
