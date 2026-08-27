import React, { useState } from 'react';
import { Language, ProductId } from '../types';
import { translations } from '../data/translations';
import { productsData } from '../data/products';
import { ShoppingBag, Phone, Check, Plus, Minus, Shield, Sparkles } from 'lucide-react';

interface ProductsProps {
  lang: Language;
  onOpenOrderModalWithProduct: (productId: ProductId, quantity: number) => void;
}

export const Products: React.FC<ProductsProps> = ({
  lang,
  onOpenOrderModalWithProduct,
}) => {
  const t = translations[lang];

  // Local state for quantity counters
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    jar_20l: 1,
    bottle_5l: 2,
  });

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, Math.min(100, current + delta));
      return { ...prev, [id]: next };
    });
  };

  return (
    <section id="products" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.products.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.products.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t.products.subheading}
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {productsData.map((prod) => {
            const isJar = prod.id === 'jar_20l';
            const name = lang === 'bn' ? prod.nameBn : prod.nameEn;
            const capacity = lang === 'bn' ? prod.capacityBn : prod.capacityEn;
            const desc = lang === 'bn' ? prod.descBn : prod.descEn;
            const features = lang === 'bn' ? prod.featuresBn : prod.featuresEn;
            const ideal = lang === 'bn' ? prod.idealForBn : prod.idealForEn;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Frame */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  
                  {/* Capacity Badge */}
                  <div className="absolute bottom-4 left-4 bg-sky-600/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                    {capacity}
                  </div>

                  {/* BSTI Assurance Pill */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>BSTI Approved</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                      {name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {desc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {features.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Ideal For Note */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600">
                      <strong className="text-slate-800 font-semibold">{lang === 'bn' ? 'ব্যবহার উপযোগী: ' : 'Ideal for: '}</strong>
                      {ideal}
                    </div>
                  </div>

                  {/* Bottom Controls & Order Actions */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        {t.products.qtyLabel}:
                      </span>
                      <div className="flex items-center gap-2 border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(prod.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 text-sm">
                          {quantities[prod.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(prod.id, 1)}
                          className="w-8 h-8 rounded-lg bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onOpenOrderModalWithProduct(prod.id as ProductId, quantities[prod.id])}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold text-sm shadow-sm transition hover:shadow-md"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.products.orderBtn}</span>
                      </button>

                      <a
                        href={`tel:${t.phone}`}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
                        title={t.modal.callDirect}
                        aria-label={t.modal.callDirect}
                      >
                        <Phone className="w-4 h-4 text-sky-600" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
