import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { CheckSquare, Send, Truck } from 'lucide-react';

interface OrderProcessProps {
  lang: Language;
}

export const OrderProcess: React.FC<OrderProcessProps> = ({ lang }) => {
  const t = translations[lang];

  const steps = [
    {
      num: '01',
      icon: <CheckSquare className="w-6 h-6 text-sky-600" />,
      title: t.orderProcess.step1.title,
      desc: t.orderProcess.step1.desc,
    },
    {
      num: '02',
      icon: <Send className="w-6 h-6 text-blue-600" />,
      title: t.orderProcess.step2.title,
      desc: t.orderProcess.step2.desc,
    },
    {
      num: '03',
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: t.orderProcess.step3.title,
      desc: t.orderProcess.step3.desc,
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            {t.orderProcess.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t.orderProcess.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {step.icon}
                  </div>
                  <span className="text-xl font-black text-slate-300">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
