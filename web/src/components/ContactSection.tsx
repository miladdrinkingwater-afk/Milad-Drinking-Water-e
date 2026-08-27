import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { MapPin, Phone, Mail, User, Send, ExternalLink, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const encodedMsg = encodeURIComponent(
      `*Milad Drinking Water Website Inquiry*\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message || 'General Inquiry'}`
    );
    window.open(`https://wa.me/8801711102448?text=${encodedMsg}`, '_blank');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.contact.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.contact.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Company Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center p-1">
                  <img src="/logo.png" alt="Milad Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'bn' ? 'মিলাদ ড্রিংকিং ওয়াটার' : 'Milad Drinking Water'}
                  </h3>
                  <p className="text-xs text-sky-700 font-medium mt-0.5">
                    {lang === 'bn' ? 'বিশুদ্ধ পানির নির্ভরযোগ্য ঠিকানা' : 'Your Trusted Source for Pure Water'}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.contact.addressLabel}
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    {t.contact.addressVal}
                  </p>
                  <a
                    href="https://maps.google.com/?q=Mirboxtula,Sylhet,Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold mt-1"
                  >
                    <span>{t.contact.mapButton}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.contact.phoneLabel}
                  </span>
                  <a
                    href={`tel:${t.phone}`}
                    className="text-base font-extrabold text-slate-900 hover:text-sky-600 transition"
                  >
                    {t.contact.phoneVal}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.contact.emailLabel}
                  </span>
                  <a
                    href={`mailto:${t.email}`}
                    className="text-sm font-semibold text-slate-800 hover:text-sky-600 transition"
                  >
                    {t.contact.emailVal}
                  </a>
                </div>
              </div>

              {/* Proprietor */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">
                    {t.contact.proprietorLabel}
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    {t.contact.proprietorVal}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Fast WhatsApp Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {t.contact.quickInquiry}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                {lang === 'bn'
                  ? 'আপনার বার্তাটি সরাসরি আমাদের হটলাইন হোয়াটসঅ্যাপে চলে যাবে।'
                  : 'Your message will be sent directly to our official WhatsApp support.'}
              </p>

              {sentSuccess && (
                <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{lang === 'bn' ? 'বার্তাটি প্রস্তুত করা হয়েছে!' : 'Inquiry dispatched to WhatsApp!'}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.contact.formName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your full name'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t.contact.formPhone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t.contact.formMessage}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === 'bn' ? 'পানির পরিমাণ বা যেকোনো প্রশ্ন লিখুন...' : 'Write your requirement or questions...'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-900 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-sm shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.contact.formSubmit}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
