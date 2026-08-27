import React from 'react';
import { Language, ProductId, ServiceType } from '../types';
import { translations } from '../data/translations';
import { MapPin, Phone, Mail, ShieldCheck, Lock, Search } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onSelectProduct?: (productId: ProductId) => void;
  onSelectService?: (serviceType: ServiceType) => void;
  onNavigateTrackOrder?: () => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  lang,
  onNavigateTrackOrder,
  onNavigateAdmin 
}) => {
  const t = translations[lang];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Milad Drinking Water"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white tracking-tight">
                  {lang === 'bn' ? 'মিলাদ ড্রিংকিং ওয়াটার' : 'Milad Drinking Water'}
                </h4>
                <p className="text-xs text-sky-400 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BSTI Approved • Established 2006</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="text-slate-400 hover:text-sky-400 transition">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-sky-400 transition">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-sky-400 transition">
                  {t.nav.products} (20L & 5L)
                </a>
              </li>
              <li>
                <a href="#services" className="text-slate-400 hover:text-sky-400 transition">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateTrackOrder}
                  className="text-slate-400 hover:text-sky-400 transition flex items-center gap-1 text-left"
                >
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Your Order'}</span>
                </button>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-sky-400 transition">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.contact.tag}
            </h5>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{t.factoryLocation}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${t.phone}`} className="text-white hover:text-sky-400 font-bold transition">
                  {t.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${t.email}`} className="text-slate-300 hover:text-sky-400 transition">
                  {t.email}
                </a>
              </div>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-800">
                <span>{t.about.founderCardTitle}: </span>
                <strong className="text-slate-300 font-semibold">{t.proprietor}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright and Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Milad Drinking Water. {t.footer.allRights}</p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition text-[11px]"
              title="Authorized Personnel Access"
            >
              <Lock className="w-3 h-3 text-slate-600" />
              <span>{lang === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Staff Login'}</span>
            </button>
            <span className="text-slate-700">•</span>
            <span>{lang === 'bn' ? 'সিলেটের খাঁটি বিশুদ্ধতার প্রতীক' : 'Delivering pure hydration in Sylhet'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
