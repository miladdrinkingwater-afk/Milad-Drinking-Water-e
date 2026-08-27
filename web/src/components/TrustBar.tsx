import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Calendar, ShieldCheck, Truck, Users2 } from 'lucide-react';

interface TrustBarProps {
  lang: Language;
}

export const TrustBar: React.FC<TrustBarProps> = ({ lang }) => {
  const t = translations[lang];

  const icons = [
    <Calendar className="w-5 h-5 text-sky-600" />,
    <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    <Truck className="w-5 h-5 text-blue-600" />,
    <Users2 className="w-5 h-5 text-indigo-600" />,
  ];

  return (
    <section className="py-8 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {t.trust.items.map((item, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/60 border border-slate-200/70 hover:border-sky-200 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-slate-300 group-hover:text-sky-400 transition-colors">
                  {item.num}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center">
                  {icons[idx]}
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-900 mb-1 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
