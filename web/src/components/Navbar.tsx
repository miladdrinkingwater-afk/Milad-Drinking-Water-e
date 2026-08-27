import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Phone, Menu, X, Globe, ShoppingBag, History, Search } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenOrderModal: () => void;
  onOpenHistoryModal: () => void;
  onNavigateTrackOrder: () => void;
  orderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  onOpenOrderModal,
  onOpenHistoryModal,
  onNavigateTrackOrder,
  orderCount,
}) => {
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.products, href: '#products' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.quality, href: '#quality' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center p-0.5 overflow-hidden transition-transform group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Milad Drinking Water Official Logo"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {lang === 'bn' ? 'মিলাদ ড্রিংকিং ওয়াটার' : 'Milad Drinking Water'}
              </span>
              <span className="text-[11px] sm:text-xs text-sky-700 font-medium leading-none mt-0.5">
                {lang === 'bn' ? 'মিরবক্সটুলা, সিলেট • ২০০৬ থেকে' : 'Mirboxtula, Sylhet • Est. 2006'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition shadow-xs"
              aria-label="Toggle language between Bengali and English"
            >
              <Globe className="w-4 h-4 text-sky-600" />
              <span className="uppercase">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Track Order Button */}
            <button
              onClick={onNavigateTrackOrder}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-xs sm:text-sm font-bold text-sky-800 transition"
              title={lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
            >
              <Search className="w-3.5 h-3.5 text-sky-600" />
              <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}</span>
            </button>

            {/* My Orders / History */}
            <button
              onClick={onOpenHistoryModal}
              className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
              title={t.nav.myOrders}
              aria-label={t.nav.myOrders}
            >
              <History className="w-4 h-4 text-slate-600" />
              {orderCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Direct Phone Call Button (Desktop) */}
            <a
              href={`tel:${t.phone}`}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.phone}</span>
            </a>

            {/* Primary Order CTA */}
            <button
              onClick={onOpenOrderModal}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.nav.orderNow}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-2 border-t border-slate-200 space-y-1 bg-white/95 rounded-xl p-3 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition"
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateTrackOrder();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-sky-700 bg-sky-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-600" />
              <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
            </button>

            <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`tel:${t.phone}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 py-1"
              >
                <Phone className="w-4 h-4" />
                {t.phone}
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="px-4 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-bold"
              >
                {t.nav.orderNow}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
