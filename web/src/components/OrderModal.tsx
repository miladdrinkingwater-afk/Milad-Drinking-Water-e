import React, { useState, useEffect } from 'react';
import { Language, ProductId, ServiceType, OrderFormData, FirestoreOrder } from '../types';
import { translations } from '../data/translations';
import { sylhetAreas } from '../data/products';
import { orderService } from '../services/orderService';
import { X, Send, Phone, AlertCircle, CheckCircle2, ShoppingCart, Plus, Minus, Eye, Sparkles, MessageCircle } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialProductId?: ProductId;
  initialServiceType?: ServiceType;
  onSaveOrder: (order: FirestoreOrder) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialProductId = 'jar_20l',
  initialServiceType = 'home_delivery',
  onSaveOrder,
}) => {
  const t = translations[lang];

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [jar20Qty, setJar20Qty] = useState(1);
  const [bottle5Qty, setBottle5Qty] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceType);
  const [deliveryArea, setDeliveryArea] = useState('মিরবক্সটুলা');
  const [customArea, setCustomArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<FirestoreOrder | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setSubmittedOrder(null);
      setSubmissionError(null);
      setServiceType(initialServiceType);
      if (initialProductId === 'jar_20l') {
        setJar20Qty(1);
        setBottle5Qty(0);
      } else if (initialProductId === 'bottle_5l') {
        setJar20Qty(0);
        setBottle5Qty(2);
      } else if (initialProductId === 'both') {
        setJar20Qty(2);
        setBottle5Qty(2);
      }
    }
  }, [isOpen, initialProductId, initialServiceType]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.name = lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন' : 'Please enter your name';
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    if (!cleanPhone) {
      newErrors.phone = lang === 'bn' ? 'মোবাইল নম্বর লিখুন' : 'Please enter phone number';
    } else if (!bdPhoneRegex.test(cleanPhone)) {
      newErrors.phone = lang === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711102448)' : 'Please enter a valid BD phone number';
    }

    if (jar20Qty === 0 && bottle5Qty === 0) {
      newErrors.quantity = lang === 'bn' ? 'কমপক্ষে একটি পণ্যের পরিমাণ নির্ধারণ করুন' : 'Select at least one product quantity';
    }

    if ((deliveryArea.includes('অন্যান্য') || deliveryArea.includes('Other')) && !customArea.trim()) {
      newErrors.customArea = lang === 'bn' ? 'এলাকার নাম লিখুন' : 'Please specify area name';
    }

    if (!fullAddress.trim()) {
      newErrors.address = lang === 'bn' ? 'পূর্ণ ঠিকানা ও বাসা/রোড নম্বর দিন' : 'Please provide full address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAreaString = () => {
    if (deliveryArea.includes('অন্যান্য') || deliveryArea.includes('Other')) {
      return customArea.trim() ? `${customArea.trim()} (সিলেট)` : 'অন্যান্য এলাকা (সিলেট)';
    }
    return deliveryArea;
  };

  const getProductString = () => {
    const parts = [];
    if (jar20Qty > 0) parts.push(`${lang === 'bn' ? '২০ লিটার জার' : '20L Jar'} (${jar20Qty} pcs)`);
    if (bottle5Qty > 0) parts.push(`${lang === 'bn' ? '৫ লিটার বোতল' : '5L Bottle'} (${bottle5Qty} pcs)`);
    return parts.join(' + ') || 'Water';
  };

  const getServiceTypeString = () => {
    if (serviceType === 'office_delivery') {
      return lang === 'bn' ? 'অফিস সাপ্লাই' : 'Office Supply';
    }
    if (serviceType === 'event_bulk_supply') {
      return lang === 'bn' ? 'ইভেন্ট ও বিশেষ আয়োজন' : 'Event / Bulk Supply';
    }
    return lang === 'bn' ? 'বাসায় ডেলিভারি' : 'Home Delivery';
  };

  const constructWhatsAppMessage = (orderId?: string) => {
    const totalQty = jar20Qty + bottle5Qty;
    return (
      `*MILAD DRINKING WATER*\n` +
      (orderId ? `*Order ID:* ${orderId}\n` : '') +
      `*Customer Name:* ${customerName}\n` +
      `*Mobile:* ${phone}\n` +
      `*Product:* ${getProductString()}\n` +
      `*Quantity:* 20L: ${jar20Qty} | 5L: ${bottle5Qty} (Total: ${totalQty})\n` +
      `*Delivery Type:* ${getServiceTypeString()}\n` +
      `*Area:* ${getAreaString()}\n` +
      `*Address:* ${fullAddress}\n` +
      `*Delivery Note:* ${deliveryNote || 'None'}\n\n` +
      `_Order placed via Milad Drinking Water Official Portal_`
    );
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowPreview(false);
      return;
    }

    setSubmitting(true);
    setSubmissionError(null);

    const orderPayload: OrderFormData = {
      customerName,
      phone,
      productId: jar20Qty > 0 && bottle5Qty > 0 ? 'both' : jar20Qty > 0 ? 'jar_20l' : 'bottle_5l',
      jar20Qty,
      bottle5Qty,
      serviceType,
      deliveryArea: getAreaString(),
      customArea,
      fullAddress,
      deliveryNote,
    };

    try {
      const saved = await orderService.createOrder(orderPayload);
      onSaveOrder(saved);
      setSubmittedOrder(saved);
    } catch (err) {
      console.error('Order creation error:', err);
      setSubmissionError(
        lang === 'bn'
          ? 'অর্ডার গ্রহণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন অথবা কল করুন +8801711102448'
          : 'Failed to submit order. Please try again or call +8801711102448'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isOtherArea = deliveryArea.includes('অন্যান্য') || deliveryArea.includes('Other');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 shrink-0 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="Milad Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {t.modal.title}
              </h3>
              <p className="text-xs text-sky-100 mt-0.5">
                {t.modal.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Success confirmation or form */}
        {submittedOrder ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Order ID: {submittedOrder.orderId}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">
                {lang === 'bn' ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে' : 'Order Received Successfully'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                {lang === 'bn'
                  ? 'আপনার অর্ডারটি আমাদের ডাটাবেজে রেকর্ড করা হয়েছে। বর্তমান স্ট্যাটাস: '
                  : 'Your order has been recorded in our system. Current Status: '}
                <strong className="text-amber-600 font-bold">
                  {lang === 'bn' ? 'অপেক্ষমাণ (Pending)' : 'PENDING'}
                </strong>
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
              <p><strong className="text-slate-800">{lang === 'bn' ? 'গ্রাহক:' : 'Customer:'}</strong> {submittedOrder.customerName} ({submittedOrder.customerPhone})</p>
              <p><strong className="text-slate-800">{lang === 'bn' ? 'পণ্য:' : 'Products:'}</strong> {submittedOrder.jar20Qty > 0 ? `20L Jar: ${submittedOrder.jar20Qty} pcs ` : ''}{submittedOrder.bottle5Qty > 0 ? `5L Bottle: ${submittedOrder.bottle5Qty} pcs` : ''}</p>
              <p><strong className="text-slate-800">{lang === 'bn' ? 'এলাকা:' : 'Area:'}</strong> {submittedOrder.deliveryArea}</p>
              <p><strong className="text-slate-800">{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</strong> {submittedOrder.address}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
              <a
                href={orderService.generateWhatsAppUrl(submittedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'WhatsApp এ জানান' : 'Notify on WhatsApp'}</span>
              </a>

              <a
                href="tel:+8801711102448"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>{lang === 'bn' ? 'কল করুন' : 'Call Support'}</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
              >
                {lang === 'bn' ? 'উইন্ডো বন্ধ করুন' : 'Close this window'}
              </button>
            </div>

          </div>
        ) : (
          /* Scrollable Form Body */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
            
            {submissionError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <form id="water-order-form" onSubmit={handleCreateOrder} className="space-y-6">
              
              {/* 1. Customer Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                  {t.modal.customerInfo}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.modal.nameLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t.modal.namePlaceholder}
                      className={`w-full px-3.5 py-2 rounded-xl border ${
                        errors.name ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none transition`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.modal.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.modal.phonePlaceholder}
                      className={`w-full px-3.5 py-2 rounded-xl border ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none transition`}
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* 2. Product Selection (Strictly 20L & 5L) */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                  {t.modal.productSelection}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 20L Jar Selector Card */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {lang === 'bn' ? '২০ লিটার জার' : '20L Water Jar'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'bn' ? 'বাসা ও অফিসের ডিসপেন্সার' : 'Home & Office Dispenser'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setJar20Qty(Math.max(0, jar20Qty - 1))}
                        className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 text-sm">{jar20Qty}</span>
                      <button
                        type="button"
                        onClick={() => setJar20Qty(jar20Qty + 1)}
                        className="w-7 h-7 rounded bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 5L Bottle Selector Card */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {lang === 'bn' ? '৫ লিটার বোতল' : '5L Water Bottle'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'bn' ? 'পোর্টেবল হ্যান্ডেলযুক্ত' : 'Portable with handle'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setBottle5Qty(Math.max(0, bottle5Qty - 1))}
                        className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 text-sm">{bottle5Qty}</span>
                      <button
                        type="button"
                        onClick={() => setBottle5Qty(bottle5Qty + 1)}
                        className="w-7 h-7 rounded bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {errors.quantity && <p className="text-xs text-red-600">{errors.quantity}</p>}
              </div>

              {/* 3. Delivery Type */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                  {lang === 'bn' ? 'ডেলিভারির ধরন' : 'Delivery Type'}
                </h4>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'home_delivery', label: t.services.home.title },
                    { id: 'office_delivery', label: t.services.office.title },
                    { id: 'event_bulk_supply', label: t.services.event.title },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setServiceType(st.id as ServiceType)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                        serviceType === st.id
                          ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Area & Address */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                  {lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.modal.deliveryArea} *
                    </label>
                    <select
                      value={deliveryArea}
                      onChange={(e) => setDeliveryArea(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none bg-white"
                    >
                      {sylhetAreas.map((area, idx) => (
                        <option key={idx} value={lang === 'bn' ? area.bn : area.en}>
                          {lang === 'bn' ? area.bn : area.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isOtherArea && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'আপনার নির্দিষ্ট এলাকার নাম লিখুন' : 'Specify Area Name'} *
                      </label>
                      <input
                        type="text"
                        value={customArea}
                        onChange={(e) => setCustomArea(e.target.value)}
                        placeholder={lang === 'bn' ? 'যেমন: টিলাগড়, পাঠানটুলা, শাহী ঈদগাহ...' : 'e.g. Tilagarh, Pathantula...'}
                        className={`w-full px-3.5 py-2 rounded-xl border ${
                          errors.customArea ? 'border-red-500' : 'border-slate-200'
                        } focus:border-sky-500 text-sm outline-none`}
                      />
                      {errors.customArea && <p className="text-xs text-red-600 mt-1">{errors.customArea}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.modal.addressLabel} *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder={t.modal.addressPlaceholder}
                      className={`w-full px-3.5 py-2 rounded-xl border ${
                        errors.address ? 'border-red-500' : 'border-slate-200'
                      } focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none`}
                    />
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t.modal.noteLabel}
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder={t.modal.notePlaceholder}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Review Preview Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-sky-700 hover:text-sky-800 font-bold inline-flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? (lang === 'bn' ? 'প্রিভিউ লুকান' : 'Hide Preview') : (lang === 'bn' ? 'মেসেজ প্রিভিউ দেখুন' : 'Review Order Message Preview')}</span>
                </button>

                {showPreview && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs whitespace-pre-line border border-slate-800 leading-relaxed">
                    {constructWhatsAppMessage()}
                  </div>
                )}
              </div>

            </form>

          </div>
        )}

        {/* Footer Actions */}
        {!submittedOrder && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            
            <a
              href={`tel:${t.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>{t.modal.callDirect}</span>
            </a>

            <button
              type="submit"
              form="water-order-form"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition"
            >
              {submitting ? (
                <span>{lang === 'bn' ? 'অর্ডার জমা হচ্ছে...' : 'Submitting Order...'}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order'}</span>
                </>
              )}
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
