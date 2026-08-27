import React, { useState, useEffect } from 'react';
import { 
  AdminUser, 
  FirestoreOrder, 
  OrderStatus, 
  DeliveryType, 
  Language, 
  AuditLogRecord,
  ProductRecord,
  DeliveryAreaRecord
} from '../types';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { BUSINESS_CONFIG } from '../config/business';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  MapPin,
  CalendarCheck,
  FileText,
  Settings,
  History,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardPageProps {
  adminUser: AdminUser;
  lang: Language;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type TabType =
  | 'overview'
  | 'orders'
  | 'customers'
  | 'products'
  | 'deliveryAreas'
  | 'eventOrders'
  | 'reports'
  | 'settings'
  | 'auditLogs';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  adminUser,
  lang,
  onLogout,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>('ALL');

  // Secondary data
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryAreaRecord[]>([]);

  // Subscribe to orders real-time
  useEffect(() => {
    setLoadingOrders(true);
    const unsubscribe = orderService.subscribeToAllOrders((all) => {
      setOrders(all);
      setLoadingOrders(false);
    });

    // Load static/dynamic data
    adminService.getProducts().then(setProducts);
    adminService.getDeliveryAreas().then(setDeliveryAreas);
    adminService.getAuditLogs().then(setAuditLogs);

    return () => unsubscribe();
  }, []);

  // Stats
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayDateStr));
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const outForDeliveryOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');
  const eventOrders = orders.filter(o => o.deliveryType === 'EVENT_BULK');

  const total20LToday = todayOrders.reduce((sum, o) => sum + (o.jar20Qty || 0), 0);
  const total5LToday = todayOrders.reduce((sum, o) => sum + (o.bottle5Qty || 0), 0);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesDeliveryType = deliveryTypeFilter === 'ALL' || o.deliveryType === deliveryTypeFilter;

    if (activeTab === 'eventOrders') {
      return matchesSearch && o.deliveryType === 'EVENT_BULK';
    }

    return matchesSearch && matchesStatus && matchesDeliveryType;
  });

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setStatusUpdateLoading(true);

    const prev = selectedOrder.status;
    const success = await orderService.updateOrderStatus(
      selectedOrder.orderId,
      newStatus,
      adminNoteInput || undefined,
      adminUser.email
    );

    if (success) {
      await adminService.logAuditAction(
        adminUser.uid,
        adminUser.email,
        'ORDER_STATUS_CHANGED',
        'ORDER',
        selectedOrder.orderId,
        `Status updated from ${prev} to ${newStatus}. Note: ${adminNoteInput || 'None'}`,
        prev,
        newStatus
      );

      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        adminNote: adminNoteInput || selectedOrder.adminNote,
        updatedAt: new Date().toISOString()
      });
      setAdminNoteInput('');
      adminService.getAuditLogs().then(setAuditLogs);
    }
    setStatusUpdateLoading(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">PENDING (অপেক্ষমাণ)</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">CONFIRMED (নিশ্চিত)</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">PREPARING (প্রস্তুতি)</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">OUT FOR DELIVERY</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">DELIVERED (সম্পন্ন)</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">CANCELLED (বাতিল)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Milad Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-sm text-white">MILAD ERP</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="Milad Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-wider uppercase">
                MILAD WATER ERP
              </h2>
              <span className="inline-block px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-400/30 text-[10px] font-bold text-sky-300 uppercase">
                {adminUser.role} Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'ড্যাশবোর্ড (Overview)' },
              { id: 'orders', icon: <ShoppingCart className="w-4 h-4" />, label: 'পানির অর্ডারসমূহ (Orders)', count: pendingOrders.length },
              { id: 'eventOrders', icon: <CalendarCheck className="w-4 h-4" />, label: 'ইভেন্ট ও বাল্ক সাপ্লাই', count: eventOrders.length },
              { id: 'customers', icon: <Users className="w-4 h-4" />, label: 'গ্রাহক তালিকা (Customers)' },
              { id: 'products', icon: <Package className="w-4 h-4" />, label: 'পণ্য (20L & 5L Only)' },
              { id: 'deliveryAreas', icon: <MapPin className="w-4 h-4" />, label: 'ডেলিভারি এরিয়া' },
              { id: 'reports', icon: <FileText className="w-4 h-4" />, label: 'রিপোর্ট ও পরিসংখ্যান' },
              { id: 'auditLogs', icon: <History className="w-4 h-4" />, label: 'অডিট লগ (Audit Trail)' },
              { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'বিজনেস সেটিংস' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === item.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Admin info & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-slate-300 truncate">{adminUser.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{adminUser.email}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onNavigateHome}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold transition text-center"
            >
              Public Site
            </button>
            <button
              onClick={onLogout}
              className="py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-[11px] font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-900">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  ব্যবসা পরিচালনা ড্যাশবোর্ড
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  সিলেট শহরের বিশুদ্ধ পানি সরবরাহ ও অর্ডার মনিটরিং
                </p>
              </div>

              <button
                onClick={() => {
                  setLoadingOrders(true);
                  orderService.subscribeToAllOrders(setOrders);
                  setLoadingOrders(false);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'আজকের মোট অর্ডার', val: todayOrders.length, color: 'border-sky-500/40 bg-sky-950/20 text-sky-400' },
                { label: 'অপেক্ষমাণ (Pending)', val: pendingOrders.length, color: 'border-amber-500/40 bg-amber-950/20 text-amber-400' },
                { label: 'নিশ্চিত (Confirmed)', val: confirmedOrders.length, color: 'border-blue-500/40 bg-blue-950/20 text-blue-400' },
                { label: 'প্রস্তুতি (Preparing)', val: preparingOrders.length, color: 'border-purple-500/40 bg-purple-950/20 text-purple-400' },
                { label: 'ডেলিভারির পথে', val: outForDeliveryOrders.length, color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-400' },
                { label: 'ডেলিভারি সম্পন্ন', val: deliveredOrders.length, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${stat.color} flex flex-col justify-between`}>
                  <span className="text-[11px] font-bold text-slate-400 leading-tight block">{stat.label}</span>
                  <span className="text-2xl font-black mt-2">{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Volume Estimate Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">আজকের ২০ লিটার জার ভলিউম</span>
                <p className="text-3xl font-black text-sky-400 mt-2">{total20LToday} <span className="text-sm text-slate-500">টি জার</span></p>
                <p className="text-xs text-slate-500 mt-1">ডিসপেন্সার ও পারিবারিক রিফিল</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">আজকের ৫ লিটার বোতল ভলিউম</span>
                <p className="text-3xl font-black text-blue-400 mt-2">{total5LToday} <span className="text-sm text-slate-500">টি বোতল</span></p>
                <p className="text-xs text-slate-500 mt-1">পোর্টেবল হ্যান্ডেলযুক্ত বোতল</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ইভেন্ট ও বিশেষ অর্ডার</span>
                <p className="text-3xl font-black text-purple-400 mt-2">{eventOrders.length} <span className="text-sm text-slate-500">টি ইভেন্ট</span></p>
                <p className="text-xs text-slate-500 mt-1">মিলাদ মাহফিল, সভা ও কনফারেন্স</p>
              </div>
            </div>

            {/* Recent Incoming Orders Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">সাম্প্রতিক অর্ডারসমূহ</h3>
                  <p className="text-xs text-slate-400 mt-0.5">রিয়েল-টাইম লাইভ অর্ডার স্ট্রিম</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>সবগুলো দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">অর্ডার আইডি</th>
                      <th className="p-3.5">গ্রাহক ও মোবাইল</th>
                      <th className="p-3.5">পণ্য ও পরিমাণ</th>
                      <th className="p-3.5">এলাকা</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.orderId} className="hover:bg-slate-900/60 transition">
                        <td className="p-3.5 font-mono font-bold text-sky-400">{o.orderId}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                        </td>
                        <td className="p-3.5">
                          {o.jar20Qty > 0 && <span className="mr-2">20L: {o.jar20Qty}</span>}
                          {o.bottle5Qty > 0 && <span>5L: {o.bottle5Qty}</span>}
                        </td>
                        <td className="p-3.5">{o.deliveryArea}</td>
                        <td className="p-3.5">{getStatusBadge(o.status)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                          >
                            বিস্তারিত
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT & TAB 3: EVENT ORDERS */}
        {(activeTab === 'orders' || activeTab === 'eventOrders') && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {activeTab === 'eventOrders' ? 'ইভেন্ট ও বাল্ক সাপ্লাই অর্ডার' : 'পানির অর্ডার ব্যবস্থাপনা'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  মোট {filteredOrders.length} টি অর্ডার পাওয়া গেছে
                </p>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="আইডি, নাম, ফোন..."
                    className="pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                  />
                </div>

                {activeTab !== 'eventOrders' && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none"
                  >
                    <option value="ALL">সকল স্ট্যাটাস</option>
                    <option value="PENDING">PENDING (অপেক্ষমাণ)</option>
                    <option value="CONFIRMED">CONFIRMED (নিশ্চিত)</option>
                    <option value="PREPARING">PREPARING (প্রস্তুতি)</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED (সম্পন্ন)</option>
                    <option value="CANCELLED">CANCELLED (বাতিল)</option>
                  </select>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">অর্ডার আইডি</th>
                      <th className="p-3.5">তারিখ ও সময়</th>
                      <th className="p-3.5">গ্রাহকের নাম ও ফোন</th>
                      <th className="p-3.5">পণ্য</th>
                      <th className="p-3.5">ধরন ও এলাকা</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-slate-900/60 transition">
                          <td className="p-3.5 font-mono font-bold text-sky-400">{o.orderId}</td>
                          <td className="p-3.5 text-slate-400">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(o.createdAt).toLocaleDateString()})</td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{o.customerName}</p>
                            <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              {o.jar20Qty > 0 && <span className="block font-medium text-sky-300">20L: {o.jar20Qty} pcs</span>}
                              {o.bottle5Qty > 0 && <span className="block font-medium text-blue-300">5L: {o.bottle5Qty} pcs</span>}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{o.deliveryType}</p>
                            <p className="text-[11px] text-slate-400">{o.deliveryArea}</p>
                          </td>
                          <td className="p-3.5">{getStatusBadge(o.status)}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
                            >
                              অর্ডার ডিটেইল
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">গ্রাহক তালিকা (Customers)</h1>
              <p className="text-xs text-slate-400 mt-1">অর্ডার ইতিহাস অনুযায়ী স্বয়ংক্রিয় গ্রাহক তালিকা</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(orders.map(o => o.customerPhone))).map((phone) => {
                const customerOrders = orders.filter(o => o.customerPhone === phone);
                const latest = customerOrders[0];
                return (
                  <div key={phone} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{latest.customerName}</h3>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-xs font-bold">
                        {customerOrders.length} টি অর্ডার
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-sky-400" />
                        <span>{phone}</span>
                      </p>
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{latest.deliveryArea} - {latest.address}</span>
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                      <span>সর্বশেষ: {new Date(latest.createdAt).toLocaleDateString()}</span>
                      <a href={`tel:${phone}`} className="text-sky-400 font-bold hover:underline">কল দিন</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCTS (20L & 5L Only) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">পণ্য ব্যবস্থাপনা (Authorized Products)</h1>
              <p className="text-xs text-slate-400 mt-1">ব্যবসার সুনির্দিষ্ট নিয়ম অনুসারে শুধুমাত্র ২০ লিটার ও ৫ লিটারের পণ্য অনুমোদিত।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 font-extrabold text-xs">
                      সাইজ: {p.size}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{p.nameBn} ({p.nameEn})</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.descriptionBn}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>BSTI Approved Quality</span>
                    <span className="font-bold text-slate-300">Mirboxtula Plant</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DELIVERY AREAS */}
        {activeTab === 'deliveryAreas' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">ডেলিভারি এরিয়া তালিকা</h1>
              <p className="text-xs text-slate-400 mt-1">সিলেট সিটি ও পার্শ্ববর্তী ডেলিভারি পয়েন্টসমূহ</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {deliveryAreas.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <MapPin className="w-4 h-4 text-sky-400 mb-2" />
                  <h4 className="font-bold text-white text-sm">{a.nameBn}</h4>
                  <p className="text-xs text-slate-500">{a.nameEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">রিপোর্ট ও অর্ডার অ্যানালিটিক্স</h1>
              <p className="text-xs text-slate-400 mt-1">অফিসিয়াল তথ্য ভিত্তিক সারসংক্ষেপ</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">সর্বমোট অর্ডার সম্পন্ন</span>
                <p className="text-3xl font-black text-emerald-400 mt-2">{deliveredOrders.length}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">মোট ২০ লিটার সরবরাহ</span>
                <p className="text-3xl font-black text-sky-400 mt-2">{orders.reduce((acc, o) => acc + (o.jar20Qty || 0), 0)} টি</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">মোট ৫ লিটার সরবরাহ</span>
                <p className="text-3xl font-black text-blue-400 mt-2">{orders.reduce((acc, o) => acc + (o.bottle5Qty || 0), 0)} টি</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400">মোট বাতিলকৃত অর্ডার</span>
                <p className="text-3xl font-black text-red-400 mt-2">{cancelledOrders.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT LOGS */}
        {activeTab === 'auditLogs' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">অডিট লগ (Security & Audit Trail)</h1>
              <p className="text-xs text-slate-400 mt-1">সকল প্রশাসনিক কার্যাবলীর স্থায়ী ও নিরাপদ রেকর্ড</p>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">সময়</th>
                      <th className="p-3.5">ব্যবহারকারী (Actor)</th>
                      <th className="p-3.5">অ্যাকশন</th>
                      <th className="p-3.5">টার্গেট</th>
                      <th className="p-3.5">বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/60 transition">
                        <td className="p-3.5 font-mono text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="p-3.5 font-bold text-slate-200">{log.actorEmail}</td>
                        <td className="p-3.5 font-mono text-sky-400 font-bold">{log.action}</td>
                        <td className="p-3.5">{log.targetType}: {log.targetId}</td>
                        <td className="p-3.5 text-slate-300">{log.details || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">বিজনেস সেটিংস ও তথ্য</h1>
              <p className="text-xs text-slate-400 mt-1">প্রাতিষ্ঠানিক অফিসিয়াল কনফিগারেশন</p>
            </div>

            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">প্রতিষ্ঠানের নাম:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.nameBn} ({BUSINESS_CONFIG.nameEn})</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">স্লোগান:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.taglineBn}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">হটলাইন / মোবাইল:</span>
                  <p className="font-bold text-sky-400 text-sm mt-0.5">{BUSINESS_CONFIG.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">অফিসিয়াল ইমেইল:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.email}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">স্বত্বাধিকারী:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.proprietorBn} ({BUSINESS_CONFIG.proprietorEn})</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">প্ল্যান্টের ঠিকানা:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.factoryAddressBn}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">প্রতিষ্ঠা সাল:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{BUSINESS_CONFIG.establishedBn}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">মান সনদ:</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">{BUSINESS_CONFIG.certification}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-sky-400">{selectedOrder.orderId}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedOrder.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-500 font-bold block">গ্রাহকের তথ্য</span>
                <p className="font-bold text-white">নাম: {selectedOrder.customerName}</p>
                <p className="text-sky-400 font-mono">ফোন: {selectedOrder.customerPhone}</p>
                <div className="flex gap-2 pt-2">
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>কল দিন</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-500 font-bold block">ডেলিভারি ঠিকানা</span>
                <p className="font-bold text-white">{selectedOrder.deliveryArea}</p>
                <p className="text-slate-300">{selectedOrder.address}</p>
                {selectedOrder.deliveryNote && (
                  <p className="text-slate-400 italic">নোট: "{selectedOrder.deliveryNote}"</p>
                )}
              </div>
            </div>

            {/* Products & Quantity */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-500 block mb-2">অর্ডারকৃত পণ্য</span>
              <div className="space-y-1 text-sm font-bold text-white">
                {selectedOrder.jar20Qty > 0 && (
                  <div className="flex justify-between">
                    <span>২০ লিটার জার (20L Jar)</span>
                    <span className="text-sky-400">{selectedOrder.jar20Qty} টি</span>
                  </div>
                )}
                {selectedOrder.bottle5Qty > 0 && (
                  <div className="flex justify-between">
                    <span>৫ লিটার বোতল (5L Bottle)</span>
                    <span className="text-blue-400">{selectedOrder.bottle5Qty} টি</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Transition Control Buttons */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 block">
                অর্ডার স্ট্যাটাস পরিবর্তন করুন (বর্তমান: {selectedOrder.status})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'CONFIRMED'}
                  onClick={() => handleUpdateStatus('CONFIRMED')}
                  className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Confirm
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'PREPARING'}
                  onClick={() => handleUpdateStatus('PREPARING')}
                  className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Preparing
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'OUT_FOR_DELIVERY'}
                  onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                  className="py-2 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Dispatch
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'DELIVERED'}
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Deliver
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'CANCELLED'}
                  onClick={() => handleUpdateStatus('CANCELLED')}
                  className="py-2 px-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Cancel
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="অ্যাডমিন নোট (ঐচ্ছিক)"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Modal Close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
