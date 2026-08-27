import { 
  FirestoreOrder, 
  DateRangeType, 
  OrderStatsSummary, 
  ProductStatsSummary, 
  DeliveryTypeStatsSummary, 
  AreaStatItem, 
  DailyTrendPoint, 
  CustomerAnalyticsProfile, 
  DeliveryPerformanceMetrics, 
  StaffPerformanceMetric,
  CustomerSegment
} from '../types';

// Bangladesh timezone helper to get YYYY-MM-DD in Asia/Dhaka
export function getDhakaDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch (e) {
    return date.toISOString().slice(0, 10);
  }
}

// Convert ISO string to Dhaka date string
export function toDhakaDate(isoStr?: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    return getDhakaDateString(d);
  } catch {
    return '';
  }
}

// Format Bangla readable date
export function formatBanglaDate(dateStr: string): string {
  if (!dateStr) return '';
  const digitsMap: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const dayBn = String(day).split('').map(c => digitsMap[c] || c).join('');
      const yearBn = year.split('').map(c => digitsMap[c] || c).join('');
      const monthBn = monthsBn[monthIdx] || parts[1];

      return `${dayBn} ${monthBn} ${yearBn}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export const analyticsService = {
  // Filter orders by date range
  filterOrdersByDateRange(
    orders: FirestoreOrder[],
    rangeType: DateRangeType,
    customStart?: string,
    customEnd?: string
  ): FirestoreOrder[] {
    if (!orders || orders.length === 0) return [];
    if (rangeType === 'ALL_TIME') return orders;

    const todayStr = getDhakaDateString();
    const todayDate = new Date(todayStr);

    return orders.filter(o => {
      const orderDateStr = toDhakaDate(o.createdAt);
      if (!orderDateStr) return false;

      if (rangeType === 'TODAY') {
        return orderDateStr === todayStr;
      }

      if (rangeType === 'YESTERDAY') {
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = getDhakaDateString(yesterday);
        return orderDateStr === yStr;
      }

      if (rangeType === 'LAST_7_DAYS') {
        const past7 = new Date(todayDate);
        past7.setDate(past7.getDate() - 6);
        const past7Str = getDhakaDateString(past7);
        return orderDateStr >= past7Str && orderDateStr <= todayStr;
      }

      if (rangeType === 'LAST_30_DAYS') {
        const past30 = new Date(todayDate);
        past30.setDate(past30.getDate() - 29);
        const past30Str = getDhakaDateString(past30);
        return orderDateStr >= past30Str && orderDateStr <= todayStr;
      }

      if (rangeType === 'THIS_MONTH') {
        const currentMonthPrefix = todayStr.slice(0, 7); // YYYY-MM
        return orderDateStr.startsWith(currentMonthPrefix);
      }

      if (rangeType === 'PREVIOUS_MONTH') {
        const prevMonthDate = new Date(todayDate);
        prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
        const prevMonthPrefix = getDhakaDateString(prevMonthDate).slice(0, 7);
        return orderDateStr.startsWith(prevMonthPrefix);
      }

      if (rangeType === 'CUSTOM') {
        if (customStart && orderDateStr < customStart) return false;
        if (customEnd && orderDateStr > customEnd) return false;
        return true;
      }

      return true;
    });
  },

  // Calculate high-level order counts and volume stats
  getOrderStats(orders: FirestoreOrder[]): OrderStatsSummary {
    const summary: OrderStatsSummary = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0,
      eventBulk: 0,
      totalJar20: 0,
      totalBottle5: 0,
      totalUnits: 0,
    };

    for (const o of orders) {
      if (o.status === 'PENDING') summary.pending++;
      else if (o.status === 'CONFIRMED') summary.confirmed++;
      else if (o.status === 'PREPARING') summary.preparing++;
      else if (o.status === 'OUT_FOR_DELIVERY') summary.outForDelivery++;
      else if (o.status === 'DELIVERED') summary.delivered++;
      else if (o.status === 'CANCELLED') summary.cancelled++;

      if (o.deliveryType === 'EVENT_BULK') summary.eventBulk++;

      const jar20 = Number(o.jar20Qty) || 0;
      const bottle5 = Number(o.bottle5Qty) || 0;
      summary.totalJar20 += jar20;
      summary.totalBottle5 += bottle5;
    }

    summary.totalUnits = summary.totalJar20 + summary.totalBottle5;
    return summary;
  },

  // Calculate Product Breakdown (20L vs 5L)
  getProductStats(orders: FirestoreOrder[]): ProductStatsSummary {
    let jar20Units = 0;
    let bottle5Units = 0;
    let ordersWithJar20 = 0;
    let ordersWithBottle5 = 0;
    let ordersWithBoth = 0;

    for (const o of orders) {
      const jar20 = Number(o.jar20Qty) || 0;
      const bottle5 = Number(o.bottle5Qty) || 0;

      if (jar20 > 0) {
        jar20Units += jar20;
        ordersWithJar20++;
      }
      if (bottle5 > 0) {
        bottle5Units += bottle5;
        ordersWithBottle5++;
      }
      if (jar20 > 0 && bottle5 > 0) {
        ordersWithBoth++;
      }
    }

    const totalUnits = jar20Units + bottle5Units;
    const jar20SharePercent = totalUnits > 0 ? Math.round((jar20Units / totalUnits) * 100) : 0;
    const bottle5SharePercent = totalUnits > 0 ? Math.round((bottle5Units / totalUnits) * 100) : 0;

    return {
      jar20Units,
      bottle5Units,
      totalUnits,
      jar20SharePercent,
      bottle5SharePercent,
      ordersWithJar20,
      ordersWithBottle5,
      ordersWithBoth
    };
  },

  // Calculate Delivery Type Breakdown (HOME / OFFICE / EVENT_BULK)
  getDeliveryTypeStats(orders: FirestoreOrder[]): DeliveryTypeStatsSummary {
    let homeOrders = 0;
    let officeOrders = 0;
    let eventBulkOrders = 0;

    for (const o of orders) {
      if (o.deliveryType === 'OFFICE') officeOrders++;
      else if (o.deliveryType === 'EVENT_BULK') eventBulkOrders++;
      else homeOrders++;
    }

    const total = orders.length;
    return {
      homeOrders,
      officeOrders,
      eventBulkOrders,
      homeSharePercent: total > 0 ? Math.round((homeOrders / total) * 100) : 0,
      officeSharePercent: total > 0 ? Math.round((officeOrders / total) * 100) : 0,
      eventBulkSharePercent: total > 0 ? Math.round((eventBulkOrders / total) * 100) : 0,
    };
  },

  // Calculate Area Distribution
  getAreaStats(orders: FirestoreOrder[]): AreaStatItem[] {
    const areaMap: { [area: string]: { count: number; jar20: number; bottle5: number } } = {};

    for (const o of orders) {
      const area = (o.deliveryArea || 'অন্যান্য এলাকা (Other)').trim();
      if (!areaMap[area]) {
        areaMap[area] = { count: 0, jar20: 0, bottle5: 0 };
      }
      areaMap[area].count++;
      areaMap[area].jar20 += Number(o.jar20Qty) || 0;
      areaMap[area].bottle5 += Number(o.bottle5Qty) || 0;
    }

    const total = orders.length;
    const items: AreaStatItem[] = Object.entries(areaMap).map(([name, data]) => ({
      areaName: name,
      orderCount: data.count,
      jar20Count: data.jar20,
      bottle5Count: data.bottle5,
      sharePercent: total > 0 ? Math.round((data.count / total) * 100) : 0
    }));

    // Sort by order count descending
    items.sort((a, b) => b.orderCount - a.orderCount);
    return items;
  },

  // Daily Trend calculation for lightweight charts
  getDailyTrends(orders: FirestoreOrder[], daysCount: number = 7): DailyTrendPoint[] {
    const todayStr = getDhakaDateString();
    const todayDate = new Date(todayStr);

    const dateKeys: string[] = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      dateKeys.push(getDhakaDateString(d));
    }

    const trendMap: { [key: string]: DailyTrendPoint } = {};
    for (const key of dateKeys) {
      trendMap[key] = {
        dateStr: key,
        displayDateBn: formatBanglaDate(key),
        displayDateEn: new Date(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orderCount: 0,
        jar20Count: 0,
        bottle5Count: 0,
        deliveredCount: 0,
        cancelledCount: 0
      };
    }

    for (const o of orders) {
      const orderDate = toDhakaDate(o.createdAt);
      if (orderDate && trendMap[orderDate]) {
        trendMap[orderDate].orderCount++;
        trendMap[orderDate].jar20Count += Number(o.jar20Qty) || 0;
        trendMap[orderDate].bottle5Count += Number(o.bottle5Qty) || 0;
        if (o.status === 'DELIVERED') trendMap[orderDate].deliveredCount++;
        if (o.status === 'CANCELLED') trendMap[orderDate].cancelledCount++;
      }
    }

    return dateKeys.map(k => trendMap[k]);
  },

  // Customer Profiles & Retention Analytics
  getCustomerProfiles(
    orders: FirestoreOrder[],
    reorderReminderDays: number = 14
  ): CustomerAnalyticsProfile[] {
    const customerMap: { [phone: string]: FirestoreOrder[] } = {};

    for (const o of orders) {
      const cleanPhone = (o.customerPhone || '').replace(/\D/g, '');
      if (!cleanPhone) continue;
      if (!customerMap[cleanPhone]) {
        customerMap[cleanPhone] = [];
      }
      customerMap[cleanPhone].push(o);
    }

    const now = Date.now();
    const profiles: CustomerAnalyticsProfile[] = [];

    for (const [phone, ordList] of Object.entries(customerMap)) {
      // Sort newest first
      ordList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const latest = ordList[0];
      const earliest = ordList[ordList.length - 1];

      let delivered = 0;
      let cancelled = 0;
      let totalJar20 = 0;
      let totalBottle5 = 0;
      const areaFreq: { [area: string]: number } = {};
      const typeFreq: { [type: string]: number } = {};

      for (const ord of ordList) {
        if (ord.status === 'DELIVERED') delivered++;
        if (ord.status === 'CANCELLED') cancelled++;
        totalJar20 += Number(ord.jar20Qty) || 0;
        totalBottle5 += Number(ord.bottle5Qty) || 0;

        if (ord.deliveryArea) {
          areaFreq[ord.deliveryArea] = (areaFreq[ord.deliveryArea] || 0) + 1;
        }
        if (ord.deliveryType) {
          typeFreq[ord.deliveryType] = (typeFreq[ord.deliveryType] || 0) + 1;
        }
      }

      // Determine top area
      let preferredArea = latest.deliveryArea || 'অন্যান্য';
      let maxAreaCount = 0;
      for (const [aName, count] of Object.entries(areaFreq)) {
        if (count > maxAreaCount) {
          maxAreaCount = count;
          preferredArea = aName;
        }
      }

      // Determine top delivery type
      let preferredType = latest.deliveryType || 'HOME';
      let maxTypeCount = 0;
      for (const [tName, count] of Object.entries(typeFreq)) {
        if (count > maxTypeCount) {
          maxTypeCount = count;
          preferredType = tName as any;
        }
      }

      // Favorite product
      let favoriteProduct: '20L' | '5L' | '20L + 5L' = '20L';
      if (totalJar20 > 0 && totalBottle5 > 0) favoriteProduct = '20L + 5L';
      else if (totalBottle5 > totalJar20) favoriteProduct = '5L';

      // Days since last order
      const lastTime = new Date(latest.createdAt).getTime();
      const daysSinceLastOrder = !isNaN(lastTime) ? Math.max(0, Math.floor((now - lastTime) / (1000 * 60 * 60 * 24))) : 0;

      // Segment determination
      let segment: CustomerSegment = 'NEW';
      const hasEvent = ordList.some(o => o.deliveryType === 'EVENT_BULK');

      if (hasEvent) {
        segment = 'EVENT_CUSTOMER';
      } else if (ordList.length >= 2) {
        segment = 'REPEAT';
      } else if (daysSinceLastOrder <= 30) {
        segment = 'NEW';
      } else {
        segment = 'INACTIVE';
      }

      const isReorderDue = daysSinceLastOrder >= reorderReminderDays && segment !== 'INACTIVE';

      profiles.push({
        phone,
        name: latest.customerName || 'গ্রাহক',
        totalOrders: ordList.length,
        deliveredOrders: delivered,
        cancelledOrders: cancelled,
        totalJar20,
        totalBottle5,
        firstOrderAt: earliest.createdAt,
        lastOrderAt: latest.createdAt,
        preferredArea,
        favoriteProduct,
        preferredDeliveryType: preferredType,
        lastKnownAddress: latest.address || '',
        segment,
        daysSinceLastOrder,
        isReorderDue,
        recentOrders: ordList.slice(0, 5)
      });
    }

    // Sort by total orders descending, then lastOrderAt
    profiles.sort((a, b) => b.totalOrders - a.totalOrders || new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime());
    return profiles;
  },

  // Delivery performance based on actual recorded timestamps
  getDeliveryPerformance(orders: FirestoreOrder[]): DeliveryPerformanceMetrics {
    let totalMinutesConfirmedToDelivered = 0;
    let countConfirmedToDelivered = 0;

    let totalMinutesPreparingToDelivered = 0;
    let countPreparingToDelivered = 0;

    let totalMinutesOutToDelivered = 0;
    let countOutToDelivered = 0;

    let totalAssigned = 0;
    let totalOutForDelivery = 0;
    let totalDelivered = 0;
    let totalCancelled = 0;

    for (const o of orders) {
      if (o.assignedTo) totalAssigned++;
      if (o.status === 'OUT_FOR_DELIVERY') totalOutForDelivery++;
      if (o.status === 'DELIVERED') totalDelivered++;
      if (o.status === 'CANCELLED') totalCancelled++;

      if (o.status === 'DELIVERED' && o.deliveredAt) {
        const delTime = new Date(o.deliveredAt).getTime();

        if (o.confirmedAt) {
          const confTime = new Date(o.confirmedAt).getTime();
          if (delTime >= confTime) {
            totalMinutesConfirmedToDelivered += (delTime - confTime) / (1000 * 60);
            countConfirmedToDelivered++;
          }
        }

        if (o.preparingAt) {
          const prepTime = new Date(o.preparingAt).getTime();
          if (delTime >= prepTime) {
            totalMinutesPreparingToDelivered += (delTime - prepTime) / (1000 * 60);
            countPreparingToDelivered++;
          }
        }

        const outTimeStr = o.outForDeliveryAt || o.dispatchedAt;
        if (outTimeStr) {
          const outTime = new Date(outTimeStr).getTime();
          if (delTime >= outTime) {
            totalMinutesOutToDelivered += (delTime - outTime) / (1000 * 60);
            countOutToDelivered++;
          }
        }
      }
    }

    return {
      totalDeliveredWithTimestamps: countConfirmedToDelivered || totalDelivered,
      avgMinutesConfirmedToDelivered: countConfirmedToDelivered > 0 ? Math.round(totalMinutesConfirmedToDelivered / countConfirmedToDelivered) : null,
      avgMinutesPreparingToDelivered: countPreparingToDelivered > 0 ? Math.round(totalMinutesPreparingToDelivered / countPreparingToDelivered) : null,
      avgMinutesOutToDelivered: countOutToDelivered > 0 ? Math.round(totalMinutesOutToDelivered / countOutToDelivered) : null,
      totalAssigned,
      totalOutForDelivery,
      totalDelivered,
      totalCancelled,
    };
  },

  // Staff Performance Breakdown
  getStaffPerformance(
    orders: FirestoreOrder[],
    staffList: { uid: string; name: string; email: string }[]
  ): StaffPerformanceMetric[] {
    const staffMap: { [uid: string]: StaffPerformanceMetric } = {};

    for (const s of staffList) {
      staffMap[s.uid] = {
        staffUid: s.uid,
        staffName: s.name,
        staffEmail: s.email,
        assignedCount: 0,
        preparingCount: 0,
        outForDeliveryCount: 0,
        deliveredCount: 0,
        cancelledCount: 0
      };
    }

    for (const o of orders) {
      if (o.assignedTo && staffMap[o.assignedTo]) {
        const metric = staffMap[o.assignedTo];
        metric.assignedCount++;
        if (o.status === 'PREPARING') metric.preparingCount++;
        else if (o.status === 'OUT_FOR_DELIVERY') metric.outForDeliveryCount++;
        else if (o.status === 'DELIVERED') metric.deliveredCount++;
        else if (o.status === 'CANCELLED') metric.cancelledCount++;
      }
    }

    return Object.values(staffMap);
  },

  // Export Customer List to CSV (Admin only)
  exportCustomersToCSV(customers: CustomerAnalyticsProfile[]): void {
    if (!customers || customers.length === 0) return;

    const headers = [
      'Customer Name',
      'Phone Number',
      'Segment',
      'Total Orders',
      'Delivered',
      'Cancelled',
      '20L Units',
      '5L Units',
      'Preferred Area',
      'Favorite Product',
      'Preferred Delivery Type',
      'Last Order Date',
      'First Order Date',
      'Last Address'
    ];

    const rows = customers.map(c => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.segment}"`,
      c.totalOrders,
      c.deliveredOrders,
      c.cancelledOrders,
      c.totalJar20,
      c.totalBottle5,
      `"${(c.preferredArea || '').replace(/"/g, '""')}"`,
      `"${c.favoriteProduct}"`,
      `"${c.preferredDeliveryType}"`,
      `"${c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString() : ''}"`,
      `"${c.firstOrderAt ? new Date(c.firstOrderAt).toLocaleDateString() : ''}"`,
      `"${(c.lastKnownAddress || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Milad_Water_Customers_${getDhakaDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
