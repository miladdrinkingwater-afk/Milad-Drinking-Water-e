export const BUSINESS_CONFIG = {
  nameEn: 'Milad Drinking Water',
  nameBn: 'মিলাদ ড্রিংকিং ওয়াটার',
  taglineBn: 'বিশুদ্ধ পানির নির্ভরযোগ্য ঠিকানা',
  taglineEn: 'Your Trusted Source for Pure Drinking Water',
  factoryAddressBn: 'মিরবক্সটুলা, সিলেট, বাংলাদেশ',
  factoryAddressEn: 'Mirboxtula, Sylhet, Bangladesh',
  establishedBn: '২০০৬ সাল',
  establishedEn: 'Since 2006',
  establishedYear: '2006',
  proprietorBn: 'হাজী মিলাদ আহমদ',
  proprietorEn: 'Haji Milad Ahmad',
  phone: '+8801711102448',
  phoneRaw: '01711102448',
  phoneInternational: '8801711102448',
  email: 'miladdrinkingwater@gmail.com',
  certification: 'BSTI Approved',
  products: [
    {
      id: 'jar_20l',
      size: '20L',
      nameBn: '২০ লিটার জার',
      nameEn: '20 Litre Jar',
      descBn: 'বাসা ও অফিসের ডিসপেন্সারের জন্য সেরা সমাধান',
      descEn: 'Ideal for home & office water dispensers with tamper-proof seal'
    },
    {
      id: 'bottle_5l',
      size: '5L',
      nameBn: '৫ লিটার বোতল',
      nameEn: '5 Litre Bottle',
      descBn: 'সহজে বহনযোগ্য ও হ্যান্ডেলযুক্ত পারিবারিক পোর্টেবল বোতল',
      descEn: 'Convenient portable bottle with handle for families and travel'
    }
  ],
  initialDeliveryAreas: [
    { id: 'mirboxtula', bn: 'মিরবক্সটুলা', en: 'Mirboxtula' },
    { id: 'zindabazar', bn: 'জিন্দাবাজার', en: 'Zindabazar' },
    { id: 'amberkhana', bn: 'আম্বরখানা', en: 'Amberkhana' },
    { id: 'shibgonj', bn: 'শিবগঞ্জ', en: 'Shibgonj' },
    { id: 'upashohor', bn: 'উপশহর', en: 'Upashohor' },
    { id: 'other', bn: 'অন্যান্য এলাকা (সিলেট)', en: 'Other Area (Sylhet)' }
  ]
} as const;
