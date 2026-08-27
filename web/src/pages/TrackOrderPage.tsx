import React, { useState } from 'react';
import { FirestoreOrder, OrderStatus, Language } from '../types';
import { orderService } from '../services/orderService';
import { 
  Search, 
  Package, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TrackOrderPageProps {
  lang: Language;
  onBackToHome: () => void;
  onOpenOrderModal: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  lang,
  onBackToHome,
  onOpenOrderModal,
}) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await orderService.trackOrder(orderId, phone);
      if (res) {
        setOrder(res);
      } else {
        setOrder(null);
        setError(
          lang === 'bn'
            ? 'প্রদত্ত অর্ডার আইডি ও মোবাইল নম্বরে কোনো অর্ডার পাওয়া যায়নি। তথ্য সঠিক কিনা পরীক্ষা করুন।'
            : 'No order found with the provided Order ID and Mobile number. Please verify details.'
        );
      }
    } catch (err) {
      setError(
        lang === 'bn'
          ? 'সার্ভারের সাথে সংযোগ স্থাপন করা যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।'
          : 'Unable to connect to service. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { labelBn: 'অর্ডার গ্রহণ', labelEn: 'Order Received' },
    { labelBn: 'নিশ্চিত', labelEn: 'Confirmed' },
    { labelBn: 'প্রস্তুতি', labelEn: 'Preparing' },
    { labelBn: 'ডেলিভারির পথে', labelEn: 'Out for Delivery' },
    { labelBn: 'সম্পন্ন', labelEn: 'Delivered' },
  ];

  const currentStep = order ? getStatusStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition"
          >
            <span>← {lang === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Milad Logo" className="w-8 h-8 object-contain" />
            <span className="text-xs font-black text-slate-800">
              {lang === 'bn' ? 'মিলাদ ড্রিংকিং ওয়াটার' : 'Milad Drinking Water'}
            </span>
          </div>
        </div>

        {/* Tracking Search Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl mb-8">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {lang === 'bn' ? 'পানির অর্ডার ট্র্যাক করুন' : 'Track Your Water Order'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'bn'
                ? 'আপনার অর্ডার আইডি এবং অর্ডার করার সময় ব্যবহৃত মোবাইল নম্বর দিন'
                : 'Enter your Order ID and the Mobile number provided during ordering'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'অর্ডার আইডি (Order ID)' : 'Order ID'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MW-20260828-1234"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{lang === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching...'}</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Track Status'}</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Progress Result */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6 animate-in fade-in duration-300">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                    {order.orderId}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-2">
                  {lang === 'bn' ? 'গ্রাহক:' : 'Customer:'} {order.customerName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? 'অর্ডারের তারিখ:' : 'Order Date:'} {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {lang === 'bn' ? 'ডেলিভারির ধরন' : 'Delivery Type'}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {order.deliveryType === 'HOME' ? (lang === 'bn' ? 'বাসায় ডেলিভারি' : 'Home Delivery') :
                   order.deliveryType === 'OFFICE' ? (lang === 'bn' ? 'অফিস সাপ্লাই' : 'Office Supply') :
                   (lang === 'bn' ? 'ইভেন্ট ও বিশেষ সাপ্লাই' : 'Event / Bulk Supply')}
                </span>
              </div>
            </div>

            {/* Progress Stepper Bar (if not cancelled) */}
            {order.status !== 'CANCELLED' ? (
              <div className="py-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6">
                  {lang === 'bn' ? 'ডেলিভারি অগ্রগতি' : 'Delivery Progress'}
                </h3>

                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-4 left-4 right-4 h-1 bg-slate-200 z-0" />
                  <div
                    className="absolute top-4 left-4 h-1 bg-sky-600 z-0 transition-all duration-500"
                    style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 92}%` }}
                  />

                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md'
                              : isPassed
                              ? 'bg-sky-600 text-white'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-bold mt-2 text-center max-w-[65px] sm:max-w-none ${
                            isCurrent ? 'text-sky-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {lang === 'bn' ? step.labelBn : step.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">{lang === 'bn' ? 'অর্ডারটি বাতিল করা হয়েছে' : 'Order Cancelled'}</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    {order.adminNote || (lang === 'bn' ? 'প্রয়োজনে কল করুন +8801711102448' : 'Please contact +8801711102448 for details')}
                  </p>
                </div>
              </div>
            )}

            {/* Product & Address Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {lang === 'bn' ? 'অর্ডারকৃত পণ্য' : 'Ordered Products'}
                </span>
                <div className="space-y-1 text-sm font-bold text-slate-900">
                  {order.jar20Qty > 0 && (
                    <div className="flex justify-between">
                      <span>{lang === 'bn' ? '২০ লিটার জার' : '20L Jar'}</span>
                      <span className="text-sky-700">{order.jar20Qty} {lang === 'bn' ? 'টি' : 'pcs'}</span>
                    </div>
                  )}
                  {order.bottle5Qty > 0 && (
                    <div className="flex justify-between">
                      <span>{lang === 'bn' ? '৫ লিটার বোতল' : '5L Bottle'}</span>
                      <span className="text-sky-700">{order.bottle5Qty} {lang === 'bn' ? 'টি' : 'pcs'}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between font-normal">
                    <span>{lang === 'bn' ? 'মোট পরিমাণ' : 'Total Units'}:</span>
                    <strong className="text-slate-900 font-bold">{order.totalQuantity}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
                </span>
                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>{order.deliveryArea}</span>
                  </p>
                  <p className="leading-relaxed">{order.address}</p>
                  {order.deliveryNote && (
                    <p className="text-slate-500 italic mt-1">
                      {lang === 'bn' ? 'নোট:' : 'Note:'} "{order.deliveryNote}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Helpline CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                {lang === 'bn' ? 'যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন:' : 'For urgent updates, reach us directly:'}
              </span>
              <a
                href="tel:+8801711102448"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>+8801711102448</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
