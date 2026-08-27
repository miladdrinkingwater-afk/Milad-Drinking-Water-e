import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  Download,
  Navigation,
  UserCheck,
  Copy,
  Check,
  Bell,
  Send,
  Kanban,
  BarChart3
} from 'lucide-react';
import { AdminAnalyticsView } from '../components/AdminAnalyticsView';
import { CustomerRetentionView } from '../components/CustomerRetentionView';
import { DailyOperationsBoard } from '../components/DailyOperationsBoard';

interface AdminDashboardPageProps {
  adminUser: AdminUser;
  lang: Language;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type TabType =
  | 'overview'
  | 'operations'
  | 'delivery'
  | 'orders'
  | 'eventOrders'
  | 'customers'
  | 'products'
  | 'deliveryAreas'
  | 'reports'
  | 'auditLogs'
  | 'settings';

const CANCEL_REASONS = [
  'গ্রাহক বাতিল করতে অনুরোধ করেছেন (Customer requested cancellation)',
  'ডেলিভারি এলাকা সাময়িকভাবে অনুপলব্ধ (Delivery unavailable)',
  'ভুল তথ্য বা অসম্পূর্ণ ঠিকানা (Incorrect customer information)',
  'ডুপ্লিকেট অর্ডার (Duplicate order)',
  'অন্যান্য কারণ (Other reason)'
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  adminUser,
  lang,
  onLogout,
  onNavigateHome,
}) => {
  // If staff, default to delivery tab
  const [activeTab, setActiveTab] = useState<TabType>(adminUser.role === 'STAFF' ? 'delivery' : 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Business Alert Configs
  const [reorderReminderDays, setReorderReminderDays] = useState<number>(14);
  const [longPendingHours, setLongPendingHours] = useState<number>(2);

  
  // Modals & Selected Order
  const [selectedOrder, setSelectedOrder] = useState<FirestoreOrder | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState(CANCEL_REASONS[0]);
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaffUid, setSelectedStaffUid] = useState<string>('');
  const [showWhatsAppTemplateModal, setShowWhatsAppTemplateModal] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);

  // Real-time New Order Banner State
  const [newOrderAlert, setNewOrderAlert] = useState<FirestoreOrder | null>(null);
  const isFirstLoad = useRef(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<string>('ALL');
  const [staffFilter, setStaffFilter] = useState<string>('ALL');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');

  // Pagination for order list
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  // Secondary Data
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryAreaRecord[]>([]);
  const [staffList, setStaffList] = useState<{ uid: string; name: string; email: string; phone?: string }[]>([]);

  // Subscribe to real-time orders
  useEffect(() => {
    setLoadingOrders(true);
    const unsubscribe = orderService.subscribeToAllOrders((all) => {
      // Check for incoming new order alert if not initial load
      if (!isFirstLoad.current && all.length > orders.length) {
        const latest = all[0];
        if (latest && latest.status === 'PENDING') {
          setNewOrderAlert(latest);
        }
      }
      isFirstLoad.current = false;
      setOrders(all);
      setLoadingOrders(false);
    });

    // Load reference data
    adminService.getProducts().then(setProducts);
    adminService.getDeliveryAreas().then(setDeliveryAreas);
    adminService.getAuditLogs().then(setAuditLogs);
    adminService.getStaffList().then(setStaffList);

    return () => unsubscribe();
  }, []);

  // Stats Calculations
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayDateStr));
  const pendingOrders = orders.filter(o => o.status === 'PENDING');
  const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING');
  const outForDeliveryOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
  const deliveredTodayOrders = todayOrders.filter(o => o.status === 'DELIVERED');
  const cancelledTodayOrders = todayOrders.filter(o => o.status === 'CANCELLED');
  const eventOrders = orders.filter(o => o.deliveryType === 'EVENT_BULK');

  const total20LToday = todayOrders.reduce((sum, o) => sum + (o.jar20Qty || 0), 0);
  const total5LToday = todayOrders.reduce((sum, o) => sum + (o.bottle5Qty || 0), 0);

  // Delivery staff specific orders
  const myAssignedOrders = orders.filter(o => 
    o.assignedTo === adminUser.uid || 
    (adminUser.role === 'ADMIN' && (o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY'))
  );

  // Filtered Orders Calculation
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.deliveryArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesDeliveryType = deliveryTypeFilter === 'ALL' || o.deliveryType === deliveryTypeFilter;
    const matchesArea = areaFilter === 'ALL' || o.deliveryArea === areaFilter;
    const matchesStaff = staffFilter === 'ALL' || o.assignedTo === staffFilter;

    let matchesDate = true;
    if (dateFilter === 'TODAY') {
      matchesDate = o.createdAt.startsWith(todayDateStr);
    } else if (dateFilter === 'YESTERDAY') {
      matchesDate = o.createdAt.startsWith(yesterdayDateStr);
    } else if (dateFilter === 'LAST_7_DAYS') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      matchesDate = o.createdAt >= sevenDaysAgo;
    } else if (dateFilter === 'LAST_30_DAYS') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
      matchesDate = o.createdAt >= thirtyDaysAgo;
    }

    if (activeTab === 'eventOrders') {
      return matchesSearch && o.deliveryType === 'EVENT_BULK';
    }

    return matchesSearch && matchesStatus && matchesDeliveryType && matchesArea && matchesStaff && matchesDate;
  });

  // Paginated list
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  // Status Change Handler
  const handleUpdateStatus = async (newStatus: OrderStatus, customNote?: string, reason?: string) => {
    if (!selectedOrder) return;
    setStatusUpdateLoading(true);

    const prev = selectedOrder.status;
    const finalNote = customNote !== undefined ? customNote : adminNoteInput;
    const success = await orderService.updateOrderStatus(
      selectedOrder.orderId,
      newStatus,
      finalNote || undefined,
      adminUser.email,
      reason
    );

    if (success) {
      await adminService.logAuditAction(
        adminUser.uid,
        adminUser.email,
        newStatus === 'CANCELLED' ? 'ORDER_CANCELLED' : 'ORDER_STATUS_CHANGED',
        'ORDER',
        selectedOrder.orderId,
        `Status updated from ${prev} to ${newStatus}.${reason ? ' Reason: ' + reason : ''}${finalNote ? ' Note: ' + finalNote : ''}`,
        prev,
        newStatus
      );

      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        adminNote: finalNote || selectedOrder.adminNote,
        cancelReason: reason || selectedOrder.cancelReason,
        cancelledBy: newStatus === 'CANCELLED' ? adminUser.email : selectedOrder.cancelledBy,
        updatedAt: new Date().toISOString()
      });
      setAdminNoteInput('');
      setShowCancelModal(false);
      adminService.getAuditLogs().then(setAuditLogs);
    }
    setStatusUpdateLoading(false);
  };

  // Quick Status Transition for Operations Board
  const handleQuickStatusTransition = async (order: FirestoreOrder, nextStatus: OrderStatus) => {
    setStatusUpdateLoading(true);
    const prev = order.status;
    const success = await orderService.updateOrderStatus(
      order.orderId,
      nextStatus,
      undefined,
      adminUser.email
    );
    if (success) {
      await adminService.logAuditAction(
        adminUser.uid,
        adminUser.email,
        'ORDER_STATUS_CHANGED',
        'ORDER',
        order.orderId,
        `Status quickly advanced from ${prev} to ${nextStatus}`,
        prev,
        nextStatus
      );
      adminService.getAuditLogs().then(setAuditLogs);
    }
    setStatusUpdateLoading(false);
  };

  // Staff Assignment Handler
  const handleAssignStaff = async () => {
    if (!selectedOrder || !selectedStaffUid) return;
    setStatusUpdateLoading(true);

    const staffObj = staffList.find(s => s.uid === selectedStaffUid);
    if (!staffObj) return;

    const success = await orderService.assignStaff(
      selectedOrder.orderId,
      staffObj,
      adminUser.email
    );

    if (success) {
      await adminService.logAuditAction(
        adminUser.uid,
        adminUser.email,
        'ORDER_ASSIGNED',
        'ORDER',
        selectedOrder.orderId,
        `Order assigned to delivery staff: ${staffObj.name} (${staffObj.email})`,
        selectedOrder.assignedTo || 'Unassigned',
        staffObj.uid
      );

      setSelectedOrder({
        ...selectedOrder,
        assignedTo: staffObj.uid,
        assignedStaff: staffObj,
        assignedAt: new Date().toISOString(),
        assignedBy: adminUser.email,
        updatedAt: new Date().toISOString()
      });
      setShowAssignModal(false);
      adminService.getAuditLogs().then(setAuditLogs);
    }
    setStatusUpdateLoading(false);
  };

  // Navigation URL Generator for Google Maps
  const getGoogleMapsUrl = (address: string, area: string) => {
    const query = `${address}, ${area}, Sylhet, Bangladesh`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">PENDING (অপেক্ষমাণ)</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">CONFIRMED (নিশ্চিত)</span>;
      case 'PREPARING':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">PREPARING (প্রস্তুতি)</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">OUT FOR DELIVERY (ডেলিভারিতে)</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">DELIVERED (সম্পন্ন)</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">CANCELLED (বাতিল)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Real-Time Live New Order Alert Notification Banner */}
      {newOrderAlert && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-2xl border border-amber-400 animate-bounce">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 animate-spin" />
              <span className="font-extrabold text-sm uppercase tracking-wider">নতুন অর্ডার এসেছে!</span>
            </div>
            <button onClick={() => setNewOrderAlert(null)} className="text-slate-950 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-xs font-bold space-y-0.5">
            <p>আইডি: <span className="font-mono">{newOrderAlert.orderId}</span></p>
            <p>গ্রাহক: {newOrderAlert.customerName} ({newOrderAlert.customerPhone})</p>
            <p>পরিমাণ: 20L: {newOrderAlert.jar20Qty} | 5L: {newOrderAlert.bottle5Qty}</p>
            <p>এলাকা: {newOrderAlert.deliveryArea}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                setSelectedOrder(newOrderAlert);
                setNewOrderAlert(null);
              }}
              className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition"
            >
              অর্ডার দেখুন (View)
            </button>
          </div>
        </div>
      )}

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Milad Logo" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-extrabold text-sm text-white block">MILAD WATER</span>
            <span className="text-[10px] text-sky-400 font-bold uppercase">{adminUser.role} PORTAL</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Business Identity */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="Milad Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-wider uppercase">
                MILAD WATER ERP
              </h2>
              <span className="inline-block px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-400/30 text-[10px] font-bold text-sky-300 uppercase">
                {adminUser.role} Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              ...(adminUser.role === 'ADMIN' ? [{ id: 'overview', icon: <LayoutDashboard className="w-4 h-4" />, label: 'ড্যাশবোর্ড (Overview)' }] : []),
              ...(adminUser.role === 'ADMIN' ? [{ id: 'operations', icon: <Kanban className="w-4 h-4 text-amber-400" />, label: 'অপারেশন বোর্ড (Live)', count: pendingOrders.length }] : []),
              { id: 'delivery', icon: <Truck className="w-4 h-4 text-sky-400" />, label: 'ডেলিভারি পরিচালনা (Staff)', count: myAssignedOrders.length },
              { id: 'orders', icon: <ShoppingCart className="w-4 h-4" />, label: 'পানির অর্ডারসমূহ (Orders)' },
              { id: 'eventOrders', icon: <CalendarCheck className="w-4 h-4" />, label: 'ইভেন্ট ও বাল্ক সাপ্লাই', count: eventOrders.length },
              ...(adminUser.role === 'ADMIN' ? [{ id: 'customers', icon: <Users className="w-4 h-4 text-emerald-400" />, label: 'গ্রাহক রিটেনশন (Retention)' }] : []),
              { id: 'products', icon: <Package className="w-4 h-4" />, label: 'পণ্য (20L & 5L Only)' },
              { id: 'deliveryAreas', icon: <MapPin className="w-4 h-4" />, label: 'ডেলিভারি এরিয়া' },
              ...(adminUser.role === 'ADMIN' ? [
                { id: 'reports', icon: <BarChart3 className="w-4 h-4 text-sky-400" />, label: 'বিজনেস অ্যানালিটিক্স (BI)' },
                { id: 'auditLogs', icon: <History className="w-4 h-4" />, label: 'অডিট লগ (Audit Trail)' },
                { id: 'settings', icon: <Settings className="w-4 h-4" />, label: 'বিজনেস সেটিংস' },
              ] : [])
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

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-900">
        
        {/* ==================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ==================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Header & Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  ব্যবসা পরিচালনা ড্যাশবোর্ড
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  সিলেট শহরের বিশুদ্ধ পানি সরবরাহ ও লাইভ অপারেশন কন্ট্রোল
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

            {/* Real Firestore Status Count Workload Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'আজকের মোট অর্ডার', val: todayOrders.length, color: 'border-sky-500/40 bg-sky-950/20 text-sky-400' },
                { label: 'অপেক্ষমাণ (Pending)', val: pendingOrders.length, color: 'border-amber-500/40 bg-amber-950/20 text-amber-400' },
                { label: 'নিশ্চিত (Confirmed)', val: confirmedOrders.length, color: 'border-blue-500/40 bg-blue-950/20 text-blue-400' },
                { label: 'প্রস্তুতি (Preparing)', val: preparingOrders.length, color: 'border-purple-500/40 bg-purple-950/20 text-purple-400' },
                { label: 'ডেলিভারির পথে', val: outForDeliveryOrders.length, color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-400' },
                { label: 'আজ ডেলিভারি সম্পন্ন', val: deliveredTodayOrders.length, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400' },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${stat.color} flex flex-col justify-between`}>
                  <span className="text-[11px] font-bold text-slate-400 leading-tight block">{stat.label}</span>
                  <span className="text-2xl font-black mt-2">{stat.val}</span>
                </div>
              ))}
            </div>

            {/* Volume Workload Summary */}
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

            {/* Priority & Real-Time Incoming Order Queue Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">লাইভ অপারেশনাল অর্ডার কিউ (Live Queue)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">অপেক্ষমাণ ও প্রস্তুতিতে থাকা অর্ডারসমূহ অগ্রাধিকার পাবে</p>
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
                      <th className="p-3.5">সময়</th>
                      <th className="p-3.5">গ্রাহক ও মোবাইল</th>
                      <th className="p-3.5">পণ্য ও পরিমাণ</th>
                      <th className="p-3.5">টাইপ ও এরিয়া</th>
                      <th className="p-3.5">স্টাফ</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.slice(0, 8).map((o) => (
                      <tr 
                        key={o.orderId} 
                        className={`hover:bg-slate-900/60 transition ${
                          o.status === 'PENDING' ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-sky-400">{o.orderId}</span>
                          {o.deliveryType === 'EVENT_BULK' && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                              EVENT / BULK
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-400 font-mono">
                          {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                        </td>
                        <td className="p-3.5">
                          {o.jar20Qty > 0 && <span className="mr-2 font-bold text-sky-300">20L: {o.jar20Qty}</span>}
                          {o.bottle5Qty > 0 && <span className="font-bold text-blue-300">5L: {o.bottle5Qty}</span>}
                        </td>
                        <td className="p-3.5">
                          <p className="font-medium text-slate-200">{o.deliveryArea}</p>
                          <p className="text-[10px] text-slate-400">{o.deliveryType}</p>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {o.assignedStaff?.name ? (
                            <span className="text-xs text-sky-300 font-medium">{o.assignedStaff.name}</span>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">নির্ধারিত নেই</span>
                          )}
                        </td>
                        <td className="p-3.5">{getStatusBadge(o.status)}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
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

        {/* ==================================================== */}
        {/* TAB 2: DELIVERY OPERATIONS VIEW (STAFF & MOBILE UX) */}
        {/* ==================================================== */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Truck className="w-6 h-6 text-sky-400" />
                  <span>ডেলিভারি অপারেশন ও স্টাফ ভিউ</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  মোবাইল-বান্ধব দ্রুত কল, হোয়াটসঅ্যাপ, ম্যাপ নেভিগেশন ও ডেলিভারি আপডেট
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-sky-300">
                  নির্ধারিত ডেলিভারি: {myAssignedOrders.length} টি
                </span>
              </div>
            </div>

            {/* Empty State */}
            {myAssignedOrders.length === 0 ? (
              <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800">
                <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">কোনো ডেলিভারি নির্ধারিত নেই</h3>
                <p className="text-xs text-slate-400 mt-1">আপনার জন্য এই মুহূর্তে কোনো সক্রিয় ডেলিভারি অ্যাসাইন করা নেই।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAssignedOrders.map((o) => (
                  <div 
                    key={o.orderId} 
                    className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
                  >
                    {/* Header with ID and Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400 text-sm">{o.orderId}</span>
                        {o.deliveryType === 'EVENT_BULK' && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                            EVENT
                          </span>
                        )}
                      </div>
                      {getStatusBadge(o.status)}
                    </div>

                    {/* Customer & Address Information (High Visibility) */}
                    <div className="space-y-1.5 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                      <p className="text-base font-bold text-white">{o.customerName}</p>
                      <p className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{o.customerPhone}</span>
                      </p>
                      <p className="text-xs text-slate-200 flex items-start gap-1.5 pt-1">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{o.deliveryArea} - {o.address}</span>
                      </p>
                      {o.deliveryNote && (
                        <p className="text-[11px] text-amber-300 italic pt-1">
                          নোট: "{o.deliveryNote}"
                        </p>
                      )}
                    </div>

                    {/* Quantity info */}
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-slate-400">অর্ডার ভলিউম:</span>
                      <div className="font-bold text-white space-x-2">
                        {o.jar20Qty > 0 && <span className="text-sky-400">20L: {o.jar20Qty} টি</span>}
                        {o.bottle5Qty > 0 && <span className="text-blue-400">5L: {o.bottle5Qty} টি</span>}
                      </div>
                    </div>

                    {/* Mobile-First Large Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <a
                        href={`tel:${o.customerPhone}`}
                        className="py-3 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                      >
                        <Phone className="w-4 h-4" />
                        <span>কল দিন</span>
                      </a>

                      <a
                        href={orderService.generateCustomerWhatsAppUrl(o, o.status)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={getGoogleMapsUrl(o.address, o.deliveryArea)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-md"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>নেভিগেশন</span>
                      </a>
                    </div>

                    {/* Delivery Progression Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                      {o.status === 'PREPARING' && (
                        <button
                          onClick={async () => {
                            setSelectedOrder(o);
                            await handleUpdateStatus('OUT_FOR_DELIVERY');
                          }}
                          className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Truck className="w-4 h-4" />
                          <span>START DELIVERY (ডেলিভারি শুরু)</span>
                        </button>
                      )}

                      {o.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={async () => {
                            setSelectedOrder(o);
                            await handleUpdateStatus('DELIVERED');
                          }}
                          className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>MARK DELIVERED (ডেলিভারি সম্পন্ন)</span>
                        </button>
                      )}

                      {o.status === 'DELIVERED' && (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-center text-xs font-black flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ডেলিভারি সফলভাবে সম্পন্ন হয়েছে</span>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: ORDERS MANAGEMENT & EVENT ORDERS */}
        {/* ==================================================== */}
        {(activeTab === 'orders' || activeTab === 'eventOrders') && (
          <div className="space-y-6">
            
            {/* Header & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {activeTab === 'eventOrders' ? 'ইভেন্ট ও বাল্ক সাপ্লাই অর্ডার' : 'পানির অর্ডার ব্যবস্থাপনা'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  মোট {filteredOrders.length} টি অর্ডার পাওয়া গেছে (পৃষ্ঠা {currentPage}/{totalPages})
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => adminService.exportOrdersToCSV(filteredOrders)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                  title="CSV এক্সপোর্ট"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>CSV Export</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="আইডি, নাম, ফোন, ঠিকানা..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                />
              </div>

              {/* Status Filter */}
              {activeTab !== 'eventOrders' && (
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="ALL">সকল স্ট্যাটাস (All)</option>
                  <option value="PENDING">PENDING (অপেক্ষমাণ)</option>
                  <option value="CONFIRMED">CONFIRMED (নিশ্চিত)</option>
                  <option value="PREPARING">PREPARING (প্রস্তুতি)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED (সম্পন্ন)</option>
                  <option value="CANCELLED">CANCELLED (বাতিল)</option>
                </select>
              )}

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="ALL">সকল তারিখ (All Time)</option>
                <option value="TODAY">আজকের অর্ডার (Today)</option>
                <option value="YESTERDAY">গতকালের অর্ডার (Yesterday)</option>
                <option value="LAST_7_DAYS">বিগত ৭ দিন (Last 7 Days)</option>
                <option value="LAST_30_DAYS">বিগত ৩০ দিন (Last 30 Days)</option>
              </select>

              {/* Area Filter */}
              <select
                value={areaFilter}
                onChange={(e) => {
                  setAreaFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="ALL">সকল এরিয়া (All Areas)</option>
                {deliveryAreas.map(a => (
                  <option key={a.id} value={a.nameBn}>{a.nameBn}</option>
                ))}
              </select>

              {/* Staff Filter */}
              <select
                value={staffFilter}
                onChange={(e) => {
                  setStaffFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="ALL">সকল স্টাফ (All Staff)</option>
                {staffList.map(s => (
                  <option key={s.uid} value={s.uid}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">অর্ডার আইডি</th>
                      <th className="p-3.5">সময় ও তারিখ</th>
                      <th className="p-3.5">গ্রাহক ও মোবাইল</th>
                      <th className="p-3.5">পণ্য ও পরিমাণ</th>
                      <th className="p-3.5">টাইপ ও এলাকা</th>
                      <th className="p-3.5">স্টাফ</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((o) => (
                        <tr 
                          key={o.orderId} 
                          className={`hover:bg-slate-900/60 transition ${
                            o.status === 'PENDING' ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-sky-400">{o.orderId}</span>
                            {o.deliveryType === 'EVENT_BULK' && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                                EVENT
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-[11px] text-slate-400">
                            {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{o.customerName}</p>
                            <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-0.5">
                              {o.jar20Qty > 0 && <span className="block font-bold text-sky-300">20L Jar: {o.jar20Qty} pcs</span>}
                              {o.bottle5Qty > 0 && <span className="block font-bold text-blue-300">5L Bottle: {o.bottle5Qty} pcs</span>}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-slate-200">{o.deliveryType}</p>
                            <p className="text-[11px] text-slate-400">{o.deliveryArea}</p>
                          </td>
                          <td className="p-3.5 text-slate-300">
                            {o.assignedStaff?.name || (
                              <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                            )}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>পৃষ্ঠা {currentPage} / {totalPages}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 text-white font-bold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 text-white font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: DAILY OPERATIONS BOARD (LIVE KANBAN) */}
        {/* ==================================================== */}
        {activeTab === 'operations' && (
          <DailyOperationsBoard
            orders={orders}
            adminUser={adminUser}
            staffList={staffList}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onQuickAssignStaff={(ord) => {
              setSelectedOrder(ord);
              setSelectedStaffUid(ord.assignedTo || '');
              setShowAssignModal(true);
            }}
            onUpdateStatus={handleQuickStatusTransition}
            longPendingHours={longPendingHours}
          />
        )}

        {/* ==================================================== */}
        {/* TAB 4: CUSTOMERS (RETENTION & PROFILES) */}
        {/* ==================================================== */}
        {activeTab === 'customers' && (
          <CustomerRetentionView
            orders={orders}
            reorderReminderDays={reorderReminderDays}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
          />
        )}

        {/* ==================================================== */}
        {/* TAB 5: PRODUCTS (20L & 5L Only) */}
        {/* ==================================================== */}
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

        {/* ==================================================== */}
        {/* TAB 6: DELIVERY AREAS */}
        {/* ==================================================== */}
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

        {/* ==================================================== */}
        {/* TAB 7: REPORTS & BUSINESS INTELLIGENCE (BI) */}
        {/* ==================================================== */}
        {activeTab === 'reports' && (
          <AdminAnalyticsView
            orders={orders}
            staffList={staffList}
            products={products}
            deliveryAreas={deliveryAreas}
          />
        )}

        {/* ==================================================== */}
        {/* TAB 8: AUDIT LOGS */}
        {/* ==================================================== */}
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

        {/* ==================================================== */}
        {/* TAB 9: SETTINGS */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black text-white">বিজনেস সেটিংস ও অটোমেশন কনফিগারেশন</h1>
              <p className="text-xs text-slate-400 mt-1">প্রাতিষ্ঠানিক অফিসিয়াল তথ্য ও অপারেশনাল অ্যালার্ট থ্রেশহোল্ড</p>
            </div>

            {/* Business Automation Controls */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 max-w-2xl">
              <h3 className="text-sm font-black text-sky-400 uppercase tracking-wider">
                অপারেশনাল অ্যালার্ট ও রিমাইন্ডার থ্রেশহোল্ড (Automation Controls)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">
                    রি-অর্ডার রিমাইন্ডার ব্যবধান (দিন):
                  </label>
                  <select
                    value={reorderReminderDays}
                    onChange={(e) => setReorderReminderDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-sky-500"
                  >
                    <option value={7}>৭ দিন (1 Week)</option>
                    <option value={10}>১০ দিন</option>
                    <option value={14}>১৪ দিন (2 Weeks - Default)</option>
                    <option value={21}>২১ দিন (3 Weeks)</option>
                    <option value={30}>৩০ দিন (1 Month)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block">
                    গ্রাহক এর চেয়ে বেশি দিন পানি না নিলে "রি-অর্ডার প্রত্যাশিত" হিসেবে চিহ্নিত হবে।
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">
                    অপেক্ষমাণ অর্ডার ওয়ার্নিং সীমা (ঘণ্টা):
                  </label>
                  <select
                    value={longPendingHours}
                    onChange={(e) => setLongPendingHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-sky-500"
                  >
                    <option value={1}>১ ঘণ্টা</option>
                    <option value={2}>২ ঘণ্টা (Default)</option>
                    <option value={3}>৩ ঘণ্টা</option>
                    <option value={4}>৪ ঘণ্টা</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block">
                    অর্ডার পেন্ডিং অবস্থায় এই সময়ের বেশি থাকলে অপারেশনে লাল সতর্কবার্তা দেখাবে।
                  </span>
                </div>
              </div>
            </div>

            {/* Official Enterprise Info */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 max-w-2xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                প্রতিষ্ঠানের তথ্যাবলী (Enterprise Profile)
              </h3>
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

      {/* ==================================================== */}
      {/* ORDER DETAIL MODAL */}
      {/* ==================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{selectedOrder.orderId}</span>
                  {selectedOrder.deliveryType === 'EVENT_BULK' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      EVENT / BULK
                    </span>
                  )}
                </div>
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
                <span className="text-slate-500 font-bold block">গ্রাহকের যোগাযোগ</span>
                <p className="font-bold text-white">নাম: {selectedOrder.customerName}</p>
                <p className="text-sky-400 font-mono">ফোন: {selectedOrder.customerPhone}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>কল দিন</span>
                  </a>
                  <button
                    onClick={() => setShowWhatsAppTemplateModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp মেসেজ</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-slate-500 font-bold block">ডেলিভারি ঠিকানা ও নেভিগেশন</span>
                <p className="font-bold text-white">{selectedOrder.deliveryArea}</p>
                <p className="text-slate-300">{selectedOrder.address}</p>
                {selectedOrder.deliveryNote && (
                  <p className="text-slate-400 italic">নোট: "{selectedOrder.deliveryNote}"</p>
                )}
                <div className="pt-2">
                  <a
                    href={getGoogleMapsUrl(selectedOrder.address, selectedOrder.deliveryArea)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 font-bold inline-flex items-center gap-1.5 text-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>ম্যাপে লোকেশন দেখুন (Navigate)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Products & Quantity */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-bold text-slate-500 block mb-2">অর্ডারকৃত পণ্য ও ভলিউম</span>
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

            {/* Staff Assignment Info & Trigger */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block">নির্ধারিত ডেলিভারি স্টাফ</span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {selectedOrder.assignedStaff?.name || 'কোনো স্টাফ নির্ধারিত নেই'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStaffUid(selectedOrder.assignedTo || '');
                  setShowAssignModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>স্টাফ পরিবর্তন / নির্ধারণ</span>
              </button>
            </div>

            {/* Cancellation Reason if cancelled */}
            {selectedOrder.status === 'CANCELLED' && selectedOrder.cancelReason && (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-xs text-red-300">
                <span className="font-bold block">বাতিলের কারণ:</span>
                <p className="mt-1">{selectedOrder.cancelReason}</p>
                {selectedOrder.cancelledBy && (
                  <p className="text-[11px] text-red-400 mt-1">কর্তৃক বাতিলকৃত: {selectedOrder.cancelledBy}</p>
                )}
              </div>
            )}

            {/* Status Transition Control Buttons */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 block">
                অর্ডার স্ট্যাটাস পরিবর্তন করুন (বর্তমান: {selectedOrder.status})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'CONFIRMED'}
                  onClick={() => handleUpdateStatus('CONFIRMED')}
                  className="py-2.5 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  Confirm (নিশ্চিত)
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'PREPARING'}
                  onClick={() => handleUpdateStatus('PREPARING')}
                  className="py-2.5 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  Preparing (প্রস্তুতি)
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'OUT_FOR_DELIVERY'}
                  onClick={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
                  className="py-2.5 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  Out for Delivery
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'DELIVERED'}
                  onClick={() => handleUpdateStatus('DELIVERED')}
                  className="py-2.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  Delivered (সম্পন্ন)
                </button>
                <button
                  disabled={statusUpdateLoading || selectedOrder.status === 'CANCELLED'}
                  onClick={() => setShowCancelModal(true)}
                  className="py-2.5 px-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs transition"
                >
                  Cancel (বাতিল)
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="অ্যাডমিন নোট যুক্ত করুন (ঐচ্ছিক)"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
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

      {/* ==================================================== */}
      {/* CANCEL REASON MODAL (MANDATORY REASON) */}
      {/* ==================================================== */}
      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-red-800/80 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-base font-bold text-white">অর্ডার বাতিলের কারণ</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              অর্ডারটি বাতিল করার জন্য একটি সুনির্দিষ্ট কারণ নির্বাচন করা বাধ্যতামূলক:
            </p>

            <div className="space-y-2">
              {CANCEL_REASONS.map((r, idx) => (
                <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer text-xs text-slate-200">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={selectedCancelReason === r}
                    onChange={() => setSelectedCancelReason(r)}
                    className="mt-0.5 text-sky-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {selectedCancelReason.includes('Other') && (
              <textarea
                placeholder="অন্যান্য কারণ লিখুন..."
                value={customCancelReason}
                onChange={(e) => setCustomCancelReason(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white outline-none"
              />
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                বাতিল করুন
              </button>
              <button
                disabled={statusUpdateLoading}
                onClick={() => {
                  const finalReason = selectedCancelReason.includes('Other') && customCancelReason
                    ? `Other: ${customCancelReason}`
                    : selectedCancelReason;
                  handleUpdateStatus('CANCELLED', undefined, finalReason);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                বাতিল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STAFF ASSIGNMENT MODAL */}
      {/* ==================================================== */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">ডেলিভারি স্টাফ নির্ধারণ</h3>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              অর্ডার #{selectedOrder.orderId} এর জন্য ডেলিভারি প্রতিনিধি নির্বাচন করুন:
            </p>

            <div className="space-y-2">
              {staffList.map((s) => (
                <label 
                  key={s.uid} 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedStaffUid === s.uid
                      ? 'bg-sky-950/40 border-sky-500/60 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="staffSelect"
                      value={s.uid}
                      checked={selectedStaffUid === s.uid}
                      onChange={() => setSelectedStaffUid(s.uid)}
                      className="text-sky-500"
                    />
                    <div>
                      <p className="font-bold text-xs">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </div>
                  </div>
                  {s.phone && (
                    <span className="text-[11px] font-mono text-sky-400">{s.phone}</span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold"
              >
                বন্ধ
              </button>
              <button
                disabled={!selectedStaffUid || statusUpdateLoading}
                onClick={handleAssignStaff}
                className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-bold"
              >
                নির্ধারণ সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* WHATSAPP TEMPLATE COMMUNICATION MODAL */}
      {/* ==================================================== */}
      {showWhatsAppTemplateModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">গ্রাহক WhatsApp মেসেজ টেমপ্লেট</h3>
              </div>
              <button onClick={() => setShowWhatsAppTemplateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as OrderStatus[]).map((st) => {
                const templateText = orderService.getCustomerMessageTemplate(selectedOrder, st);
                return (
                  <div key={st} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-sky-400">{st} Template</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(templateText);
                            setTemplateCopied(true);
                            setTimeout(() => setTemplateCopied(false), 2000);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                          title="Copy message"
                        >
                          {templateCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={orderService.generateCustomerWhatsAppUrl(selectedOrder, st)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>পাঠান</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 whitespace-pre-line bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      {templateText}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWhatsAppTemplateModal(false)}
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
