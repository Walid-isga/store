import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPage } from './pages/LegalPage';
import { useCurrency } from './hooks/useCurrency';

// Language redirect component
const LanguageRedirect: React.FC = () => {
  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl'];
  const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';
  
  return <Navigate to={`/${defaultLang}`} replace />;
};

// Layout wrapper with language parameter
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const { selectedCurrency, updateCurrency } = useCurrency(lang);

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang || 'en';
    
    // Update page title with language
    const titles: Record<string, string> = {
      en: 'IPTV Europe - Premium TV Streaming for Europe',
      fr: 'IPTV Europe - Streaming TV Premium pour l\'Europe',
      es: 'IPTV Europe - Streaming TV Premium para Europa',
      de: 'IPTV Europe - Premium TV Streaming für Europa',
      it: 'IPTV Europe - Streaming TV Premium per l\'Europa',
      pt: 'IPTV Europe - Streaming TV Premium para a Europa',
      nl: 'IPTV Europe - Premium TV Streaming voor Europa',
    };
    
    document.title = titles[lang || 'en'] || titles.en;
  }, [lang, i18n]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        selectedCurrency={selectedCurrency}
        onCurrencyChange={updateCurrency}
      />
      {children}
      <Footer />
      <CookieBanner />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<LanguageRedirect />} />
        
        {/* Language-based routes */}
        <Route path="/:lang" element={
          <LayoutWrapper>
            <HomePage selectedCurrency={''} />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/checkout" element={
          <LayoutWrapper>
            <CheckoutPage selectedCurrency={''} />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/success" element={
          <LayoutWrapper>
            <SuccessPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/admin" element={
          <LayoutWrapper>
            <AdminPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/legal" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/terms" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/privacy" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/refund" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/cookies" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />

        {/* Catch all redirect */}
        <Route path="*" element={<LanguageRedirect />} />
      </Routes>
    </Router>
  );
}

// App wrapper with proper currency integration
const AppWithCurrency: React.FC = () => {
  const { selectedCurrency, updateCurrency } = useCurrency();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageRedirect />} />
        
        <Route path="/:lang" element={
          <LayoutWrapper>
            <HomePage selectedCurrency={selectedCurrency} />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/checkout" element={
          <LayoutWrapper>
            <CheckoutPage selectedCurrency={selectedCurrency} />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/success" element={
          <LayoutWrapper>
            <SuccessPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/admin" element={
          <LayoutWrapper>
            <AdminPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/legal" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/terms" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/privacy" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/refund" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />
        
        <Route path="/:lang/cookies" element={
          <LayoutWrapper>
            <LegalPage />
          </LayoutWrapper>
        } />

        <Route path="*" element={<LanguageRedirect />} />
      </Routes>
    </Router>
  );
};

export default AppWithCurrency;