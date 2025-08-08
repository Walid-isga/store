import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tv, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';

interface NavigationProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ selectedCurrency, onCurrencyChange }) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const baseLink = `/${lang}`;

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={baseLink} className="flex items-center space-x-2">
            <Tv className="w-8 h-8 text-orange-400" />
            <span className="text-xl font-bold">IPTV Europe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={baseLink} className="hover:text-orange-400 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to={`${baseLink}/legal`} className="hover:text-orange-400 transition-colors">
              {t('nav.legal')}
            </Link>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <CurrencySelector 
              selectedCurrency={selectedCurrency}
              onCurrencyChange={onCurrencyChange}
            />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link 
                to={baseLink} 
                className="hover:text-orange-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to={`${baseLink}/legal`} 
                className="hover:text-orange-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.legal')}
              </Link>
              <div className="flex items-center space-x-4 pt-4 border-t border-white/20">
                <CurrencySelector 
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={onCurrencyChange}
                />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};