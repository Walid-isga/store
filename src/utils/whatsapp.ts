// src/utils/whatsapp.ts
import { WHATSAPP_PHONE } from '../config';
import { formatPrice } from '../utils/currency';
import type { Order } from './orders';

export const generateWhatsAppMessage = (
  order: Omit<Order, 'id' | 'createdAt'>,
  t: (key: string, options?: any) => string,
  locale: string = 'en'
): string => {
  const price = formatPrice(order.price, order.currency, locale);

  const durationText =
    order.duration === 30 ? `1 ${t('plans.month')}` :
    order.duration === 90 ? `3 ${t('plans.months')}` :
    order.duration === 365 ? `1 ${t('plans.year')}` :
    `${order.duration} ${t('plans.days')}`;

  return t('whatsapp.orderMessage', {
    orderId: order.orderId,
    name: order.name,
    email: order.email,
    phone: order.phone,
    country: order.country,
    planTitle: order.planTitle,
    durationText,
    price,
    note: order.note || '—',
  });
};

const normalizePhoneE164 = (num: string) =>
  num.replace(/[^\d+]/g, '').replace(/^\+/, '');

export const generateWhatsAppLink = (message: string, isMobile = false): string => {
  const phoneNumber = normalizePhoneE164(WHATSAPP_PHONE);
  const encodedMessage = encodeURIComponent(message);
  return isMobile
    ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    : `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
};

export const openWhatsApp = (message: string): void => {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const url = generateWhatsAppLink(message, isMobile);
  window.open(url, '_blank');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback pour vieux navigateurs / HTTP
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-999999px';
    ta.style.top = '-999999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
};
