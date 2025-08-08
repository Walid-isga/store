import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tv, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const baseLink = `/${lang}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Tv className="w-8 h-8 text-orange-400" />
              <span className="text-xl font-bold">IPTV Europe</span>
            </div>
            <p className="text-gray-300 mb-6">
              {t('footer.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">support@iptveurope.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Paris, France</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links.legal')}</h4>
            <div className="space-y-2">
              <Link 
                to={`${baseLink}/legal`} 
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                {t('footer.links.legal')}
              </Link>
              <Link 
                to={`${baseLink}/terms`} 
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                {t('footer.links.terms')}
              </Link>
              <Link 
                to={`${baseLink}/privacy`} 
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                {t('footer.links.privacy')}
              </Link>
              <Link 
                to={`${baseLink}/refund`} 
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                {t('footer.links.refund')}
              </Link>
              <Link 
                to={`${baseLink}/cookies`} 
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                {t('footer.links.cookies')}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <a 
                href={`/${lang}`}
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                FAQ
              </a>
              <a 
                href={`/${lang}`}
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                Contact
              </a>
              <a 
                href={`/${lang}`}
                className="block text-gray-300 hover:text-orange-400 transition-colors"
              >
                Setup Guide
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};