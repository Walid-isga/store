import { useState, useEffect } from 'react';
import { DEFAULT_CURRENCY, COUNTRY_TO_CURRENCY } from '../config';

export const useCurrency = (userLanguage?: string) => {
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    // Try to load from localStorage first
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
      return;
    }

    // Auto-detect based on language
    if (userLanguage) {
      const countryCode = userLanguage.toUpperCase();
      const detectedCurrency = COUNTRY_TO_CURRENCY[countryCode];
      if (detectedCurrency) {
        setSelectedCurrency(detectedCurrency);
        localStorage.setItem('currency', detectedCurrency);
      }
    }
  }, [userLanguage]);

  const updateCurrency = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  return { selectedCurrency, updateCurrency };
};