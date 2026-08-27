import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { MapPin, Calendar, User, ShieldCheck, Factory, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <section id="about" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Image & Brand Heritage Frame (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Factory & Purity Photo */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="/img_factory_purity.jpg"
                alt="Milad Drinking Water Facility & Purity"
                className="w-full h-72 sm:h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Bottom Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Factory className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    {t.about.factoryHeading}
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  {t.about.factoryDesc}
                </p>
              </div>
            </div>

            {/* Official Logo Brand Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Milad Official Brand Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                  {t.about.officialBrandCard}
                </span>
                <p className="text-sm font-black text-slate-900 leading-tight mt-0.5">
                  MILAD DRINKING WATER
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t.about.officialBrandDesc}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Company Story & Key Credentials (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.about.tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.about.heading}
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-800 text-base sm:text-lg">
                {t.about.p1}
              </p>
              <p>
                {t.about.p2}
              </p>
            </div>

            {/* Founder Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 to-blue-50/50 border border-sky-100 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-sky-600 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    {t.about.founderCardTitle}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                    {t.about.founderName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {t.about.founderDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Fact Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'প্রতিষ্ঠিত' : 'Established'}</p>
                  <p className="text-xs font-bold text-slate-900">{t.establishedYear}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'প্ল্যান্টের অবস্থান' : 'Plant Location'}</p>
                  <p className="text-xs font-bold text-slate-900">{lang === 'bn' ? 'মিরবক্সটুলা, সিলেট' : 'Mirboxtula, Sylhet'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">{lang === 'bn' ? 'কোয়ালিটি সনদ' : 'Certification'}</p>
                  <p className="text-xs font-bold text-emerald-700">BSTI Approved</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
