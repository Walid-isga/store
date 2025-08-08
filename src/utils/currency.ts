import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../config';
export { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../config';

export const formatPrice = (amount: number, currency: string = DEFAULT_CURRENCY, locale: string = 'en'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to simple format
    return `${amount.toFixed(2)} ${currency}`;
  }
};

export const convertPrice = (amount: number, fromCurrency: string, toCurrency: string): number => {
  // Simple conversion rates - in production, use a real exchange rate API
  const rates: Record<string, number> = {
    EUR: 1.0,
    GBP: 0.85,
    CHF: 0.95,
    SEK: 11.0,
    DKK: 7.5,
    NOK: 10.5,
    PLN: 4.3,
    CZK: 24.0,
  };
  
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    return amount; // Return original if currency not found
  }
  
  // Convert to EUR first, then to target currency
  const inEur = amount / rates[fromCurrency];
  return inEur * rates[toCurrency];
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    EUR: '€',
    GBP: '£',
    CHF: 'CHF',
    SEK: 'kr',
    DKK: 'kr',
    NOK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
  };
  
  return symbols[currency] || currency;
};

export const getSupportedCurrencies = () => SUPPORTED_CURRENCIES;