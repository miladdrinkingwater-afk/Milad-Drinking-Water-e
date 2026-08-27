import React, { useState } from 'react';
import { 
  FirestoreOrder, 
  CustomerAnalyticsProfile, 
  CustomerSegment,
  OrderStatus 
} from '../types';
import { analyticsService } from '../services/analyticsService';
import { BUSINESS_CONFIG } from '../config/business';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Package, 
  Download, 
  X, 
  Check, 
  Copy, 
  Send, 
  Clock, 
  Sparkles,
  Repeat,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface CustomerRetentionViewProps {
  orders: FirestoreOrder[];
  reorderReminderDays?: number;
  onSelectOrder?: (order: FirestoreOrder) => void;
}

export const CustomerRetentionView: React.FC<CustomerRetentionViewProps> = ({
  orders,
  reorderReminderDays = 14,
  onSelectOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');
  const [selectedProfile, setSelectedProfile] = useState<CustomerAnalyticsProfile | null>(null);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);
  const [customMsgText, setCustomMsgText] = useState('');

  // Calculate customer profiles
  const profiles = analyticsService.getCustomerProfiles(orders, reorderReminderDays);

  // Segment Summary Counts
  const totalCount = profiles.length;
  const repeatCount = profiles.filter(p => p.segment === 'REPEAT').length;
  const newCount = profiles.filter(p => p.segment === 'NEW').length;
  const activeCount = profiles.filter(p => p.segment === 'ACTIVE' || p.segment === 'REPEAT' || p.segment === 'NEW').length;
  const inactiveCount = profiles.filter(p => p.segment === 'INACTIVE').length;
  const eventCount = profiles.filter(p => p.segment === 'EVENT_CUSTOMER').length;
  const reorderDueCount = profiles.filter(p => p.isReorderDue).length;

  // Filtered Profiles
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.preferredArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastKnownAddress.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (segmentFilter === 'ALL') return true;
    if (segmentFilter === 'REORDER_DUE') return p.isReorderDue;
    return p.segment === segmentFilter;
  });

  const getSegmentBadge = (segment: CustomerSegment) => {
    switch (segment) {
      case 'REPEAT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"><Repeat className="w-3 h-3" /> REPEAT</span>;
      case 'NEW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">NEW</span>;
      case 'EVENT_CUSTOMER':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">EVENT / BULK</span>;
      case 'INACTIVE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-800 text-slate-400">INACTIVE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">{segment}</span>;
    }
  };

  // WhatsApp communication templates for Customer Profile Modal
  const getWhatsAppTemplates = (profile: CustomerAnalyticsProfile) => {
    const rawPhone = profile.phone.replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('880') ? rawPhone : (rawPhone.startsWith('0') ? `88${rawPhone}` : `880${rawPhone}`);

    return [
      {
        title: 'পানি রিফিল রিমাইন্ডার (Reorder Reminder)',
        desc: 'গ্রাহককে সময়মতো পানি পুনরায় অর্ডার করার বিনীত রিমাইন্ডার',
        message: `আসসালামু আলাইকুম ${profile.name} সাহেব,
মিলাদ ড্রিংকিং ওয়াটার থেকে যোগাযোগ করছি। আপনার শেষ পানি অর্ডারের পর বেশ কিছু দিন অতিবাহিত হয়েছে। আপনার বাসা/অফিসের জন্য ২০ লিটার বা ৫ লিটার বিশুদ্ধ পানি প্রয়োজন হলে জানাতে পারেন।

কল: ${BUSINESS_CONFIG.phone}
ধন্যবাদ,
${BUSINESS_CONFIG.nameBn}`,
        targetUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `আসসালামু আলাইকুম ${profile.name} সাহেব,\nমিলাদ ড্রিংকিং ওয়াটার থেকে যোগাযোগ করছি। আপনার শেষ পানি অর্ডারের পর বেশ কিছু দিন অতিবাহিত হয়েছে। আপনার বাসা/অফিসের জন্য ২০ লিটার বা ৫ লিটার বিশুদ্ধ পানি প্রয়োজন হলে জানাতে পারেন।\n\nকল: ${BUSINESS_CONFIG.phone}\nধন্যবাদ,\n${BUSINESS_CONFIG.nameBn}`
        )}`
      },
      {
        title: 'ধন্যবাদ ও ফিডব্যাক (Thank You & Feedback)',
        desc: 'মিলাদ ওয়াটার ব্যবহারের জন্য ধন্যবাদ ও সন্তুষ্টি যাচাই',
        message: `আসসালামু আলাইকুম ${profile.name} সাহেব,
মিলাদ ড্রিংকিং ওয়াটার বেছে নেওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ। আমাদের পানির গুণমান এবং ডেলিভারি সেবা আপনার কেমন লেগেছে জানালে আমরা আনন্দিত হব।

হটলাইন: ${BUSINESS_CONFIG.phone}
${BUSINESS_CONFIG.nameBn}`,
        targetUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `আসসালামু আলাইকুম ${profile.name} সাহেব,\nমিলাদ ড্রিংকিং ওয়াটার বেছে নেওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ। আমাদের পানির গুণমান এবং ডেলিভারি সেবা আপনার কেমন লেগেছে জানালে আমরা আনন্দিত হব।\n\nহটলাইন: ${BUSINESS_CONFIG.phone}\n${BUSINESS_CONFIG.nameBn}`
        )}`
      },
      {
        title: 'ইভেন্ট ও বাল্ক অফার (Event & Bulk Supply)',
        desc: 'যেকোনো মিলাদ, মাহফিল বা পারিবারিক অনুষ্ঠানের জন্য পানি সরবরাহ অফার',
        message: `আসসালামু আলাইকুম ${profile.name} সাহেব,
যেকোনো পারিবারিক অনুষ্ঠান, মিলাদ মাহফিল, সভা বা কনফারেন্সে নিরবচ্ছিন্ন বিশুদ্ধ ২০ লিটার ও ৫ লিটার পানির হোম ডেলিভারির জন্য মিলাদ ড্রিংকিং ওয়াটার সবসময় প্রস্তুত।

কল করুন: ${BUSINESS_CONFIG.phone}
${BUSINESS_CONFIG.nameBn}`,
        targetUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `আসসালামু আলাইকুম ${profile.name} সাহেব,\nযেকোনো পারিবারিক অনুষ্ঠান, মিলাদ মাহফিল, সভা বা কনফারেন্সে নিরবচ্ছিন্ন বিশুদ্ধ ২০ লিটার ও ৫ লিটার পানির হোম ডেলিভারির জন্য মিলাদ ড্রিংকিং ওয়াটার সবসময় প্রস্তুত।\n\nকল করুন: ${BUSINESS_CONFIG.phone}\n${BUSINESS_CONFIG.nameBn}`
        )}`
      }
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-400" />
            <span>গ্রাহক রিটেনশন ও প্রোফাইল সেন্টার (Customer Retention)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            মোট {totalCount} জন অনন্য গ্রাহকের অর্ডার ইতিহাস, রিটেনশন সেগমেন্ট ও রি-অর্ডার ট্র্যাকিং
          </p>
        </div>

        <button
          onClick={() => analyticsService.exportCustomersToCSV(profiles)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition self-start sm:self-auto shadow-sm"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>গ্রাহক তালিকা CSV Export</span>
        </button>
      </div>

      {/* Segment KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div 
          onClick={() => setSegmentFilter('ALL')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'ALL' ? 'border-sky-500 bg-sky-950/40 text-white' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 block">মোট গ্রাহক</span>
          <span className="text-2xl font-black mt-2 block">{totalCount}</span>
        </div>

        <div 
          onClick={() => setSegmentFilter('REPEAT')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'REPEAT' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-400 block">রিপিট গ্রাহক (Repeat)</span>
          <span className="text-2xl font-black text-emerald-400 mt-2 block">{repeatCount}</span>
        </div>

        <div 
          onClick={() => setSegmentFilter('REORDER_DUE')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'REORDER_DUE' ? 'border-amber-500 bg-amber-950/40 text-amber-300' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-400 block">রি-অর্ডার প্রত্যাশিত</span>
          <span className="text-2xl font-black text-amber-400 mt-2 block">{reorderDueCount}</span>
        </div>

        <div 
          onClick={() => setSegmentFilter('NEW')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'NEW' ? 'border-sky-500 bg-sky-950/40 text-sky-300' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-sky-400 block">নতুন গ্রাহক (New)</span>
          <span className="text-2xl font-black text-sky-400 mt-2 block">{newCount}</span>
        </div>

        <div 
          onClick={() => setSegmentFilter('EVENT_CUSTOMER')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'EVENT_CUSTOMER' ? 'border-purple-500 bg-purple-950/40 text-purple-300' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-purple-400 block">ইভেন্ট গ্রাহক (Bulk)</span>
          <span className="text-2xl font-black text-purple-400 mt-2 block">{eventCount}</span>
        </div>

        <div 
          onClick={() => setSegmentFilter('INACTIVE')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            segmentFilter === 'INACTIVE' ? 'border-slate-500 bg-slate-800 text-white' : 'border-slate-800 bg-slate-950 text-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 block">নিষ্ক্রিয় (Inactive)</span>
          <span className="text-2xl font-black text-slate-400 mt-2 block">{inactiveCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গ্রাহকের নাম, মোবাইল নম্বর, এলাকা বা ঠিকানা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 ml-1" />
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 outline-none focus:border-sky-500"
          >
            <option value="ALL">সকল সেগমেন্ট (All)</option>
            <option value="REPEAT">রিপিট গ্রাহক (Repeat)</option>
            <option value="REORDER_DUE">রি-অর্ডার প্রয়োজন ({reorderReminderDays}+ দিন)</option>
            <option value="NEW">নতুন গ্রাহক (New)</option>
            <option value="EVENT_CUSTOMER">ইভেন্ট গ্রাহক (Bulk)</option>
            <option value="INACTIVE">নিষ্ক্রিয় গ্রাহক (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Customers List / Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">গ্রাহকের নাম ও ফোন</th>
                <th className="p-4">সেগমেন্ট</th>
                <th className="p-4">মোট অর্ডার</th>
                <th className="p-4">মোট সরবরাহ</th>
                <th className="p-4">পছন্দের পণ্য ও এরিয়া</th>
                <th className="p-4">সর্বশেষ অর্ডার</th>
                <th className="p-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    কোনো গ্রাহক তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => (
                  <tr key={p.phone} className="hover:bg-slate-900/60 transition">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-xs text-sky-400 font-mono mt-0.5">{p.phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        {getSegmentBadge(p.segment)}
                        {p.isReorderDue && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> রি-অর্ডার ডিউ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white text-sm">{p.totalOrders}</span>
                      <span className="text-slate-500 text-[11px] block">সম্পন্ন: {p.deliveredOrders}</span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5 text-xs">
                        {p.totalJar20 > 0 && <span className="block text-sky-300 font-medium">20L: {p.totalJar20} টি</span>}
                        {p.totalBottle5 > 0 && <span className="block text-blue-300 font-medium">5L: {p.totalBottle5} টি</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-200">{p.preferredArea}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{p.favoriteProduct} | {p.preferredDeliveryType}</span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      <p>{new Date(p.lastOrderAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-500">({p.daysSinceLastOrder} দিন আগে)</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${p.phone}`}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800"
                          title="কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedProfile(p)}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                        >
                          প্রোফাইল
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal with Order History & WhatsApp Communication Center */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{selectedProfile.name}</h3>
                  {getSegmentBadge(selectedProfile.segment)}
                </div>
                <p className="text-xs text-sky-400 font-mono mt-0.5">{selectedProfile.phone}</p>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 font-bold block text-[10px]">মোট অর্ডার</span>
                <span className="text-lg font-black text-white mt-1 block">{selectedProfile.totalOrders} টি</span>
                <span className="text-[10px] text-emerald-400">ডেলিভারি: {selectedProfile.deliveredOrders}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 font-bold block text-[10px]">২০ লিটার জার ভলিউম</span>
                <span className="text-lg font-black text-sky-400 mt-1 block">{selectedProfile.totalJar20} টি</span>
                <span className="text-[10px] text-slate-400">লাইফটাইম ইউনিট</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 font-bold block text-[10px]">৫ লিটার বোতল ভলিউম</span>
                <span className="text-lg font-black text-blue-400 mt-1 block">{selectedProfile.totalBottle5} টি</span>
                <span className="text-[10px] text-slate-400">লাইফটাইম ইউনিট</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 font-bold block text-[10px]">শেষ অর্ডারের সময়</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">{selectedProfile.daysSinceLastOrder} দিন</span>
                <span className="text-[10px] text-slate-400">{new Date(selectedProfile.lastOrderAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Address & Preferences */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <span className="text-slate-500 font-bold block">ঠিকানা ও পছন্দের ধরন</span>
              <p className="text-white font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{selectedProfile.preferredArea} - {selectedProfile.lastKnownAddress}</span>
              </p>
              <div className="flex gap-4 pt-1 text-slate-400 text-[11px]">
                <span>পছন্দের পণ্য: <strong className="text-white">{selectedProfile.favoriteProduct}</strong></span>
                <span>পছন্দের ডেলিভারি: <strong className="text-white">{selectedProfile.preferredDeliveryType}</strong></span>
              </div>
            </div>

            {/* WhatsApp Communication Center (Pre-filled Bangla Templates) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>গ্রাহক যোগাযোগ কেন্দ্র (WhatsApp Communication Center)</span>
                </h4>
              </div>

              <div className="space-y-2.5">
                {getWhatsAppTemplates(selectedProfile).map((tpl, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-xs block">{tpl.title}</span>
                        <span className="text-[10px] text-slate-400">{tpl.desc}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(tpl.message);
                            setCopiedTemplateIdx(idx);
                            setTimeout(() => setCopiedTemplateIdx(null), 2000);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                          title="মেসেজ কপি করুন"
                        >
                          {copiedTemplateIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={tpl.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp পাঠান</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 whitespace-pre-line bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      {tpl.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Order History */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400">
                সাম্প্রতিক অর্ডার ইতিহাস ({selectedProfile.recentOrders.length} টি)
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedProfile.recentOrders.map((ord) => (
                  <div key={ord.orderId} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-sky-400">{ord.orderId}</span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        20L: {ord.jar20Qty} | 5L: {ord.bottle5Qty} | {ord.deliveryArea}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-800 text-slate-200">
                        {ord.status}
                      </span>
                      {onSelectOrder && (
                        <button
                          onClick={() => {
                            setSelectedProfile(null);
                            onSelectOrder(ord);
                          }}
                          className="text-sky-400 font-bold text-[11px] hover:underline"
                        >
                          অর্ডার দেখুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
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
