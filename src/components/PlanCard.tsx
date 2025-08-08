import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';
import { Plan } from '../config';
import { formatPrice, convertPrice } from '../utils/currency';

interface PlanCardProps {
  plan: Plan;
  currency: string;
  locale: string;
  onSelect: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, currency, locale, onSelect }) => {
  const { t } = useTranslation();
  
  const convertedPrice = convertPrice(plan.price, 'EUR', currency);
  const formattedPrice = formatPrice(convertedPrice, currency, locale);
  
  const getDurationText = () => {
    if (plan.durationDays === 30) {
      return `1 ${t('plans.month')}`;
    } else if (plan.durationDays === 90) {
      return `3 ${t('plans.months')}`;
    } else if (plan.durationDays === 365) {
      return `1 ${t('plans.year')}`;
    }
    return `${plan.durationDays} days`;
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
      plan.popular ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200 hover:border-blue-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{t('plans.popular')}</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
        <div className="text-4xl font-bold text-blue-600 mb-1">{formattedPrice}</div>
        <p className="text-gray-600">{getDurationText()}</p>
      </div>
      
      {plan.features && (
        <div className="mb-8 space-y-3">
          <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            {t('plans.features')}
          </p>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={onSelect}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
          plan.popular
            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg hover:shadow-xl'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800'
        }`}
      >
        {t('plans.choose')}
      </button>
    </div>
  );
};