import React from 'react';
import { Language } from '../types';
import { Phone, MessageCircle, ShoppingBag } from 'lucide-react';

interface FloatingActionsProps {
  lang: Language;
  onOpenOrderModal: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  lang,
  onOpenOrderModal,
}) => {
  const phone = '+8801711102448';

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-3 left-3 right-3 z-30 md:hidden flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200">
      
      {/* Call Button */}
      <a
        href={`tel:${phone}`}
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition active:scale-98"
        aria-label="Direct Phone Call"
      >
        <Phone className="w-3.5 h-3.5 text-sky-600" />
        <span>{lang === 'bn' ? 'কল দিন' : 'Call'}</span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/8801711102448`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition active:scale-98"
        aria-label="WhatsApp Message"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>

      {/* Order Button */}
      <button
        onClick={onOpenOrderModal}
        className="flex-[1.2] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition active:scale-98"
        aria-label="Open Order Modal"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
      </button>

    </aside>
  );
};
