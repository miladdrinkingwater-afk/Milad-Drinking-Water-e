import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { PartyPopper, Phone, CalendarCheck, Sparkles } from 'lucide-react';

interface EventBannerProps {
  lang: Language;
  onOpenEventOrder: () => void;
}

export const EventBanner: React.FC<EventBannerProps> = ({
  lang,
  onOpenEventOrder,
}) => {
  const t = translations[lang];

  return (
    <section className="py-12 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Gradient Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.eventBanner.tag}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t.eventBanner.heading}
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t.eventBanner.desc}
              </p>

              {/* Event types chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-xs font-semibold text-slate-300">
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">✓ মিলাদ মাহফিল</span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">✓ বিয়ে ও রিসেপশন</span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">✓ সভা ও সেমিনার</span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">✓ কর্পোরেট ইভেন্ট</span>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={onOpenEventOrder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition transform hover:-translate-y-0.5"
              >
                <CalendarCheck className="w-5 h-5 text-slate-950" />
                <span>{t.eventBanner.btnOrder}</span>
              </button>

              <a
                href={`tel:${t.phone}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm sm:text-base transition"
              >
                <Phone className="w-5 h-5 text-sky-400" />
                <span>{t.eventBanner.btnCall}</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
