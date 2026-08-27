import React, { useState } from 'react';
import { 
  FirestoreOrder, 
  DateRangeType, 
  ProductRecord,
  DeliveryAreaRecord
} from '../types';
import { analyticsService, getDhakaDateString } from '../services/analyticsService';
import { 
  Calendar, 
  TrendingUp, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Users, 
  Download,
  AlertCircle,
  BarChart3,
  PieChart,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

interface AdminAnalyticsViewProps {
  orders: FirestoreOrder[];
  staffList: { uid: string; name: string; email: string; phone?: string }[];
  products: ProductRecord[];
  deliveryAreas: DeliveryAreaRecord[];
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  orders,
  staffList,
}) => {
  const [dateRange, setDateRange] = useState<DateRangeType>('LAST_7_DAYS');
  const [customStart, setCustomStart] = useState<string>(getDhakaDateString());
  const [customEnd, setCustomEnd] = useState<string>(getDhakaDateString());
  const [trendDays, setTrendDays] = useState<number>(7);

  // Filter orders according to date range
  const filteredOrders = analyticsService.filterOrdersByDateRange(
    orders,
    dateRange,
    customStart,
    customEnd
  );

  // Calculate Metrics from Real Firestore Data
  const orderStats = analyticsService.getOrderStats(filteredOrders);
  const productStats = analyticsService.getProductStats(filteredOrders);
  const deliveryTypeStats = analyticsService.getDeliveryTypeStats(filteredOrders);
  const areaStats = analyticsService.getAreaStats(filteredOrders);
  const dailyTrends = analyticsService.getDailyTrends(filteredOrders, trendDays);
  const deliveryPerf = analyticsService.getDeliveryPerformance(filteredOrders);
  const staffPerf = analyticsService.getStaffPerformance(filteredOrders, staffList);
  const customerProfiles = analyticsService.getCustomerProfiles(orders);
  const repeatCustomerOrders = filteredOrders.filter(o => {
    const prof = customerProfiles.find(p => p.phone === o.customerPhone.replace(/\D/g, ''));
    return prof && prof.totalOrders >= 2;
  }).length;

  const maxTrendOrderCount = Math.max(1, ...dailyTrends.map(t => t.orderCount));

  return (
    <div className="space-y-6">
      
      {/* Header & Date Range Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-sky-400" />
            <span>বিজনেস ইন্টেলিজেন্স ও অ্যানালিটিক্স</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            লাইভ ফায়ারস্টোর তথ্য থেকে রিয়েল-টাইম বিজনেস পারফরম্যান্স ও অর্ডার বিশ্লেষণ
          </p>
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <Calendar className="w-4 h-4 text-sky-400 ml-1.5" />
            <select
              value={dateRange}
              onChange={(e) => {
                const val = e.target.value as DateRangeType;
                setDateRange(val);
                if (val === 'TODAY' || val === 'YESTERDAY') setTrendDays(7);
                else if (val === 'LAST_7_DAYS') setTrendDays(7);
                else if (val === 'LAST_30_DAYS' || val === 'THIS_MONTH' || val === 'PREVIOUS_MONTH') setTrendDays(14);
                else setTrendDays(7);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-2"
            >
              <option value="TODAY" className="bg-slate-900 text-white">আজ (Today)</option>
              <option value="YESTERDAY" className="bg-slate-900 text-white">গতকাল (Yesterday)</option>
              <option value="LAST_7_DAYS" className="bg-slate-900 text-white">বিগত ৭ দিন (Last 7 Days)</option>
              <option value="LAST_30_DAYS" className="bg-slate-900 text-white">বিগত ৩০ দিন (Last 30 Days)</option>
              <option value="THIS_MONTH" className="bg-slate-900 text-white">চলতি মাস (This Month)</option>
              <option value="PREVIOUS_MONTH" className="bg-slate-900 text-white">পূর্ববর্তী মাস (Previous Month)</option>
              <option value="ALL_TIME" className="bg-slate-900 text-white">সর্বকালের রেকর্ড (All Time)</option>
              <option value="CUSTOM" className="bg-slate-900 text-white">কাস্টম তারিখ (Custom)</option>
            </select>
          </div>

          {dateRange === 'CUSTOM' && (
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-slate-900 text-white px-2 py-1 rounded-lg border border-slate-700 outline-none text-xs"
              />
              <span className="text-slate-400">থেকে</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-slate-900 text-white px-2 py-1 rounded-lg border border-slate-700 outline-none text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Row 1: Primary Order KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400">মোট অর্ডার</span>
          <span className="text-2xl font-black text-white mt-2">{orderStats.total}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-amber-400">অপেক্ষমাণ (Pending)</span>
          <span className="text-2xl font-black text-amber-400 mt-2">{orderStats.pending}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-blue-400">নিশ্চিত (Confirmed)</span>
          <span className="text-2xl font-black text-blue-400 mt-2">{orderStats.confirmed}</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-purple-400">প্রস্তুতি (Preparing)</span>
          <span className="text-2xl font-black text-purple-400 mt-2">{orderStats.preparing}</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-sky-400">ডেলিভারির পথে</span>
          <span className="text-2xl font-black text-sky-400 mt-2">{orderStats.outForDelivery}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-emerald-400">ডেলিভারি সম্পন্ন</span>
          <span className="text-2xl font-black text-emerald-400 mt-2">{orderStats.delivered}</span>
        </div>

        <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-red-400">বাতিলকৃত</span>
          <span className="text-2xl font-black text-red-400 mt-2">{orderStats.cancelled}</span>
        </div>
      </div>

      {/* Row 2: Secondary Volume & Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">২০ লিটার জার সরবরাহ</span>
            <Package className="w-5 h-5 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-sky-400 mt-3">
            {orderStats.totalJar20} <span className="text-sm font-bold text-slate-500">টি জার</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>শেয়ার: {productStats.jar20SharePercent}%</span>
            <span>{productStats.ordersWithJar20} টি অর্ডারে</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">৫ লিটার বোতল সরবরাহ</span>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400 mt-3">
            {orderStats.totalBottle5} <span className="text-sm font-bold text-slate-500">টি বোতল</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>শেয়ার: {productStats.bottle5SharePercent}%</span>
            <span>{productStats.ordersWithBottle5} টি অর্ডারে</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ইভেন্ট ও বাল্ক সাপ্লাই</span>
            <CalendarDays className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400 mt-3">
            {orderStats.eventBulk} <span className="text-sm font-bold text-slate-500">টি ইভেন্ট</span>
          </p>
          <div className="mt-2 text-xs text-slate-400">
            <span>মিলাদ মাহফিল, কনফারেন্স ও অনুষ্ঠান</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">পুনরাবৃত্ত গ্রাহক অর্ডার</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-3">
            {repeatCustomerOrders} <span className="text-sm font-bold text-slate-500">টি অর্ডার</span>
          </p>
          <div className="mt-2 text-xs text-slate-400">
            <span>রিপিট গ্রাহক রিটেনশন রেট: {orderStats.total > 0 ? Math.round((repeatCustomerOrders / orderStats.total) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Row 3: Daily Order Trend Visual Chart */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>দৈনিক অর্ডার ট্রেন্ড (Daily Order Trend)</span>
            </h3>
            <p className="text-xs text-slate-400">প্রতিদিনের অর্ডারের সংখ্যা ও পণ্যের ভলিউম প্রবাহ</p>
          </div>

          <div className="flex items-center gap-2">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                onClick={() => setTrendDays(days)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                  trendDays === days 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {days} দিন
              </button>
            ))}
          </div>
        </div>

        {/* Lightweight SVG Bar Chart */}
        <div className="pt-4">
          <div className="h-48 flex items-end gap-2 sm:gap-3 border-b border-slate-800 pb-2 px-2">
            {dailyTrends.map((t, idx) => {
              const heightPercent = Math.max(8, (t.orderCount / maxTrendOrderCount) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-800 text-white text-[10px] font-bold p-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-slate-700">
                    <p className="text-sky-300">{t.displayDateBn || t.displayDateEn}</p>
                    <p>মোট অর্ডার: {t.orderCount} টি</p>
                    <p className="text-slate-300">20L: {t.jar20Count} | 5L: {t.bottle5Count}</p>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">{t.orderCount}</span>
                  <div className="w-full max-w-[36px] bg-slate-900 rounded-t-lg overflow-hidden flex flex-col justify-end h-36">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        t.orderCount > 0 
                          ? 'bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-sky-300' 
                          : 'bg-slate-800'
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 truncate max-w-[40px] text-center">
                    {t.displayDateEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Product Analytics & Delivery Type Analytics Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Product Analytics: 20L vs 5L */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-400" />
              <span>পণ্য ভিত্তিক বিশ্লেষণ (20L vs 5L)</span>
            </h3>
            <span className="text-xs text-slate-500">মোট {productStats.totalUnits} ইউনিট</span>
          </div>

          <div className="space-y-4">
            {/* 20L Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-sky-400">২০ লিটার জার (20L Jar)</span>
                <span className="text-white">{productStats.jar20Units} টি ({productStats.jar20SharePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${productStats.jar20SharePercent}%` }}
                />
              </div>
            </div>

            {/* 5L Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400">৫ লিটার বোতল (5L Bottle)</span>
                <span className="text-white">{productStats.bottle5Units} টি ({productStats.bottle5SharePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${productStats.bottle5SharePercent}%` }}
                />
              </div>
            </div>

            {/* Product Combination Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-400 block">শুধুমাত্র ২০ লিটার</span>
                <span className="text-xs font-black text-sky-400 mt-1 block">
                  {productStats.ordersWithJar20 - productStats.ordersWithBoth} টি
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-400 block">শুধুমাত্র ৫ লিটার</span>
                <span className="text-xs font-black text-blue-400 mt-1 block">
                  {productStats.ordersWithBottle5 - productStats.ordersWithBoth} টি
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-400 block">উভয় পণ্য একসাথে</span>
                <span className="text-xs font-black text-purple-400 mt-1 block">
                  {productStats.ordersWithBoth} টি
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Type Analytics: Home vs Office vs Event */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>ডেলিভারি ধরন বিশ্লেষণ (Delivery Types)</span>
            </h3>
            <span className="text-xs text-slate-500">মোট {filteredOrders.length} টি অর্ডার</span>
          </div>

          <div className="space-y-4">
            {/* Home Delivery */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-400">বাসা/হোম ডেলিভারি (HOME)</span>
                <span className="text-white">{deliveryTypeStats.homeOrders} টি ({deliveryTypeStats.homeSharePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryTypeStats.homeSharePercent}%` }}
                />
              </div>
            </div>

            {/* Office Delivery */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-400">অফিস ও প্রতিষ্ঠান (OFFICE)</span>
                <span className="text-white">{deliveryTypeStats.officeOrders} টি ({deliveryTypeStats.officeSharePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryTypeStats.officeSharePercent}%` }}
                />
              </div>
            </div>

            {/* Event & Bulk Supply */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-purple-400">ইভেন্ট ও বাল্ক সাপ্লাই (EVENT_BULK)</span>
                <span className="text-white">{deliveryTypeStats.eventBulkOrders} টি ({deliveryTypeStats.eventBulkSharePercent}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${deliveryTypeStats.eventBulkSharePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: Area Analytics (Top Zones in Sylhet) */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>এলাকা ভিত্তিক চাহিদা বিশ্লেষণ (Sylhet Area Distribution)</span>
            </h3>
            <p className="text-xs text-slate-400">সর্বাধিক পানি সরবরাহকৃত প্রধান ডেলিভারি এলাকা</p>
          </div>
          <span className="text-xs text-slate-500">মোট {areaStats.length} টি সক্রিয় এলাকা</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {areaStats.slice(0, 9).map((area, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs truncate">{area.areaName}</h4>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-extrabold text-[10px]">
                  {area.sharePercent}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>অর্ডার: <strong className="text-white">{area.orderCount}</strong> টি</span>
                <span className="text-[11px] font-mono">20L: {area.jar20Count} | 5L: {area.bottle5Count}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 rounded-full" 
                  style={{ width: `${area.sharePercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 6: Delivery Performance & Staff Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Delivery Performance Times (Timestamp-based) */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>ডেলিভারি সময় ও পারফরম্যান্স (Delivery Times)</span>
            </h3>
            <p className="text-xs text-slate-400">
              * রেকর্ডকৃত টাইমস্ট্যাম্প অনুযায়ী সঠিক গড় সময় (Based on recorded timestamps)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">নিশ্চিতকরণ থেকে ডেলিভারি</span>
              <p className="text-xl font-black text-sky-400 mt-1.5">
                {deliveryPerf.avgMinutesConfirmedToDelivered !== null 
                  ? `${deliveryPerf.avgMinutesConfirmedToDelivered} মিনিট` 
                  : 'তথ্য সংগৃহীত হচ্ছে'}
              </p>
              <span className="text-[9px] text-slate-500 block mt-1">Confirmed → Delivered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">প্রস্তুতি থেকে ডেলিভারি</span>
              <p className="text-xl font-black text-purple-400 mt-1.5">
                {deliveryPerf.avgMinutesPreparingToDelivered !== null 
                  ? `${deliveryPerf.avgMinutesPreparingToDelivered} মিনিট` 
                  : 'তথ্য সংগৃহীত হচ্ছে'}
              </p>
              <span className="text-[9px] text-slate-500 block mt-1">Preparing → Delivered</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block font-bold">ডেলিভারি পথ থেকে সম্পন্ন</span>
              <p className="text-xl font-black text-emerald-400 mt-1.5">
                {deliveryPerf.avgMinutesOutToDelivered !== null 
                  ? `${deliveryPerf.avgMinutesOutToDelivered} মিনিট` 
                  : 'তথ্য সংগৃহীত হচ্ছে'}
              </p>
              <span className="text-[9px] text-slate-500 block mt-1">Out for Delivery → Done</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>মোট নির্ধারিত অর্ডার: <strong className="text-white">{deliveryPerf.totalAssigned}</strong></span>
            <span>সম্পন্ন হয়েছে: <strong className="text-emerald-400">{deliveryPerf.totalDelivered}</strong></span>
            <span>বাতিল: <strong className="text-red-400">{deliveryPerf.totalCancelled}</strong></span>
          </div>
        </div>

        {/* Staff Performance Breakdown Table */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>ডেলিভারি স্টাফ পারফরম্যান্স (Staff Performance)</span>
            </h3>
            <p className="text-xs text-slate-400">স্টাফ অনুযায়ী অ্যাসাইন ও সফল ডেলিভারির হার</p>
          </div>

          {staffPerf.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              কোনো স্টাফ তালিকা পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-2.5">স্টাফের নাম</th>
                    <th className="p-2.5">মোট অ্যাসাইন</th>
                    <th className="p-2.5">ডেলিভারির পথে</th>
                    <th className="p-2.5">সম্পন্ন</th>
                    <th className="p-2.5">সফলতার হার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {staffPerf.map((s) => {
                    const successRate = s.assignedCount > 0 
                      ? Math.round((s.deliveredCount / s.assignedCount) * 100) 
                      : 0;
                    return (
                      <tr key={s.staffUid} className="hover:bg-slate-900/60">
                        <td className="p-2.5 font-bold text-white">{s.staffName}</td>
                        <td className="p-2.5 font-mono">{s.assignedCount}</td>
                        <td className="p-2.5 font-mono text-sky-400">{s.outForDeliveryCount}</td>
                        <td className="p-2.5 font-mono text-emerald-400 font-bold">{s.deliveredCount}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                            successRate >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {successRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
