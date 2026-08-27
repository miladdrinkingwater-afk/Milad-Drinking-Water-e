import React from 'react';
import { Language, ServiceType } from '../types';
import { translations } from '../data/translations';
import { servicesData } from '../data/services';
import { Home, Building2, Calendar, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicesProps {
  lang: Language;
  onOpenOrderModalWithService: (serviceType: ServiceType) => void;
}

export const Services: React.FC<ServicesProps> = ({
  lang,
  onOpenOrderModalWithService,
}) => {
  const t = translations[lang];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'home_delivery':
        return <Home className="w-6 h-6 text-sky-600" />;
      case 'office_delivery':
        return <Building2 className="w-6 h-6 text-blue-600" />;
      case 'event_bulk_supply':
        return <Calendar className="w-6 h-6 text-indigo-600" />;
      default:
        return <Home className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.services.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.services.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {lang === 'bn'
              ? 'সিলেট শহরের প্রতিটি ঘরে ও কর্মস্থলে স্বাস্থ্যসম্মত উপায়ে বিশুদ্ধ পানির সরবরাহ'
              : 'Dedicated drinking water supply solutions for residences, corporations, and social gatherings in Sylhet'}
          </p>
        </div>

        {/* 3 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((srv) => {
            const title = lang === 'bn' ? srv.titleBn : srv.titleEn;
            const subtitle = lang === 'bn' ? srv.subtitleBn : srv.subtitleEn;
            const desc = lang === 'bn' ? srv.descBn : srv.descEn;
            const points = lang === 'bn' ? srv.bulletPointsBn : srv.bulletPointsEn;
            const cta = lang === 'bn' ? srv.ctaBn : srv.ctaEn;

            return (
              <div
                key={srv.id}
                className="rounded-3xl p-6 sm:p-8 bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Title Header */}
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center mb-6">
                    {getServiceIcon(srv.id)}
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">
                    {subtitle}
                  </span>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {desc}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2.5 mb-8">
                    {points.map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => onOpenOrderModalWithService(srv.id as ServiceType)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-sky-600 hover:text-white hover:border-sky-600 text-slate-800 font-semibold text-xs sm:text-sm shadow-2xs transition-all group"
                >
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
