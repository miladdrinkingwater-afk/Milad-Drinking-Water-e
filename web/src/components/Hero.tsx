import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { CheckCircle2, Phone, ShoppingCart, ArrowDown, Droplet, ShieldCheck, Truck, Building2, Users } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onOpenOrderModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenOrderModal }) => {
  const t = translations[lang];

  return (
    <section id="home" className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/40 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Actions Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
              {lang === 'bn' ? (
                <>
                  বিশুদ্ধ পানির <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700">নির্ভরযোগ্য ঠিকানা</span>
                </>
              ) : (
                <>
                  Your Trusted Source for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700">Pure Drinking Water</span>
                </>
              )}
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onOpenOrderModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-base shadow-lg shadow-sky-600/20 hover:shadow-sky-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{t.hero.orderCta}</span>
              </button>

              <a
                href={`tel:${t.phone}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-sky-600 font-bold text-base shadow-xs hover:bg-slate-50 transition"
              >
                <Phone className="w-5 h-5 text-sky-600" />
                <span>{t.hero.callCta}</span>
              </a>

              <a
                href="#products"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-slate-600 hover:text-sky-600 transition"
              >
                <span>{t.hero.viewProductsCta}</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{t.hero.badges.bsti}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 shadow-2xs">
                <Droplet className="w-5 h-5 text-sky-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{t.hero.badges.since}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 shadow-2xs">
                <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{t.hero.badges.home}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 shadow-2xs">
                <Building2 className="w-5 h-5 text-slate-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{t.hero.badges.office}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-slate-200/60 shadow-2xs sm:col-span-2">
                <Users className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">{t.hero.badges.bulk}</span>
              </div>
            </div>

          </div>

          {/* Right Product & Banner Showcase (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Frame */}
              <div className="relative rounded-2xl bg-white p-3 sm:p-4 shadow-xl border border-slate-200/90 overflow-hidden">
                <div className="relative h-64 sm:h-72 md:h-80 w-full rounded-xl overflow-hidden bg-gradient-to-br from-sky-100 to-blue-50">
                  <img
                    src="/img_hero_water.jpg"
                    alt="Milad Drinking Water 20L and 5L Display"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Floating Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-white/60 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                        <Droplet className="w-4 h-4 fill-white" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 leading-tight">
                          {lang === 'bn' ? '২০ লিটার ও ৫ লিটার পানি' : '20L Jar & 5L Bottle'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                          {lang === 'bn' ? 'সিলেট শহরের সর্বত্র সরবরাহ' : 'Supplying across Sylhet City'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onOpenOrderModal}
                      className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition"
                    >
                      {lang === 'bn' ? 'অর্ডার' : 'Order'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating BSTI Badge */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white border border-emerald-200 shadow-lg rounded-xl p-2.5 flex items-center gap-2 z-10">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-emerald-800 leading-tight">BSTI Approved</p>
                  <p className="text-[9px] text-slate-500">{lang === 'bn' ? 'সরকারি মানপ্রাপ্ত' : 'Govt. Certified'}</p>
                </div>
              </div>

              {/* Floating Established Badge */}
              <div className="absolute -bottom-3 -left-2 sm:-left-4 bg-white border border-sky-200 shadow-lg rounded-xl p-2.5 flex items-center gap-2 z-10">
                <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs">
                  2006
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">{lang === 'bn' ? '২০০৬ থেকে' : 'Since 2006'}</p>
                  <p className="text-[9px] text-slate-500">{lang === 'bn' ? 'বিশ্বস্ত প্রতিষ্ঠান' : 'Trusted Brand'}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
