import React from 'react';
import { Language, SavedOrder } from '../types';
import { X, Clock, MapPin, Package, Trash2, CheckCircle2, History, RotateCcw } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orders: SavedOrder[];
  onClearOrders: () => void;
  onRepeatOrder?: (order: SavedOrder) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  orders,
  onClearOrders,
  onRepeatOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'bn' ? 'অর্ডার হিস্টোরি' : 'Recent Order History'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'আপনার সাম্প্রতিক পানির অর্ডারসমূহ' : 'Your recent water orders recorded locally'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Orders */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium">
                {lang === 'bn' ? 'এখনও কোনো অর্ডার রেকর্ড নেই।' : 'No recorded orders yet.'}
              </p>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'পানি অর্ডার করলে এখানে তালিকাটি সংরক্ষিত হবে।' : 'Once you place an order, it will appear here.'}
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id || ord.orderId}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 font-mono">
                    #{ord.orderId}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p>
                    <strong className="text-slate-900">{lang === 'bn' ? 'গ্রাহক:' : 'Customer:'}</strong> {ord.customerName} ({ord.customerPhone})
                  </p>
                  <p>
                    <strong className="text-slate-900">{lang === 'bn' ? 'পণ্য:' : 'Products:'}</strong>{' '}
                    {ord.jar20Qty > 0 && `20L Jar: ${ord.jar20Qty} pcs `}
                    {ord.bottle5Qty > 0 && `5L Bottle: ${ord.bottle5Qty} pcs`}
                  </p>
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{ord.deliveryArea} - {ord.address}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ord.createdAt).toLocaleString()}</span>
                  </div>

                  {onRepeatOrder && (
                    <button
                      onClick={() => onRepeatOrder(ord)}
                      className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-800 font-bold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{lang === 'bn' ? 'পুনরায় অর্ডার' : 'Repeat Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {orders.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              onClick={onClearOrders}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'হিস্ট্রি মুছুন' : 'Clear History'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
