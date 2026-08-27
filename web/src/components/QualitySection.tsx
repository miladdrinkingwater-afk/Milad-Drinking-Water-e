import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ShieldCheck, Droplets, Sparkles, Truck } from 'lucide-react';

interface QualitySectionProps {
  lang: Language;
}

export const QualitySection: React.FC<QualitySectionProps> = ({ lang }) => {
  const t = translations[lang];

  const icons = [
    <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    <Droplets className="w-6 h-6 text-sky-600" />,
    <Sparkles className="w-6 h-6 text-blue-600" />,
    <Truck className="w-6 h-6 text-indigo-600" />,
  ];

  return (
    <section id="quality" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.quality.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.quality.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.quality.desc}
          </p>
        </div>

        {/* 4 Quality Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.quality.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  {icons[idx]}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {idx === 0 && (
                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'সরকারি মানপ্রাপ্ত' : 'Govt. Quality Approved'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Plant Assurance Banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shrink-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Milad Official Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'মিরবক্সটুলা প্ল্যান্টের শতভাগ পরিচ্ছন্ন পরিবেশ' : '100% Hygienic Environment at Mirboxtula Facility'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {lang === 'bn'
                  ? 'বোতল সিলিং থেকে হ্যান্ডলিং—প্রতিটি ধাপে আমরা বজায় রাখি সর্বোচ্চ স্বাস্থ্যবিধি ও বিশুদ্ধতা।'
                  : 'From bottle sanitization to doorstep delivery—we maintain strict hygiene standards.'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BSTI Approved • Sylhet</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
