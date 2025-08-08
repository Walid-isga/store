import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Copy, ArrowLeft, Check } from 'lucide-react';
import { PLANS, COUNTRIES, PAYMENT_LINK_BASE } from '../config';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { formatPrice, convertPrice } from '../utils/currency';
import { generateOrderId } from '../utils/id';
import { saveOrder } from '../utils/orders';
import { generateWhatsAppMessage, openWhatsApp, copyToClipboard } from '../utils/whatsapp';

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  note?: string;
}

interface CheckoutPageProps {
  selectedCurrency: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ selectedCurrency }) => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const planId = searchParams.get('plan');
  const selectedPlan = PLANS.find(plan => plan.id === planId);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue
  } = useForm<CheckoutFormData>({
    mode: 'onChange'
  });

  useEffect(() => {
    if (!selectedPlan) {
      navigate(`/${lang}`);
    }
  }, [selectedPlan, navigate, lang]);

  useEffect(() => {
    // Auto-detect country based on language if possible
    const langToCountry: Record<string, string> = {
      fr: 'FR',
      de: 'DE',
      it: 'IT',
      es: 'ES',
      pt: 'PT',
      nl: 'NL'
    };
    
    const detectedCountry = langToCountry[lang || 'en'];
    if (detectedCountry) {
      setValue('country', detectedCountry);
    }
  }, [lang, setValue]);

  if (!selectedPlan) {
    return null;
  }

  const convertedPrice = convertPrice(selectedPlan.price, 'EUR', selectedCurrency);
  const formattedPrice = formatPrice(convertedPrice, selectedCurrency, i18n.language);

  const onSubmit = (data: CheckoutFormData) => {
    const orderId = generateOrderId();
    
    const orderData = {
      orderId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      planId: selectedPlan.id,
      planTitle: selectedPlan.title,
      price: convertedPrice,
      currency: selectedCurrency,
      duration: selectedPlan.durationDays,
      note: data.note,
      status: 'pending' as const,
    };

    // Save order to localStorage
    saveOrder(orderData);

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(orderData, t, i18n.language);

    // Open WhatsApp
    openWhatsApp(message);

    // Navigate to success page
    navigate(`/${lang}/success?orderId=${orderId}`);
  };

  const handleCopyPaymentLink = async () => {
    const success = await copyToClipboard(PAYMENT_LINK_BASE);
    if (success) {
      setIsCopySuccess(true);
      setTimeout(() => setIsCopySuccess(false), 2000);
    }
  };

  const getDurationText = () => {
    if (selectedPlan.durationDays === 30) {
      return `1 ${t('plans.month')}`;
    } else if (selectedPlan.durationDays === 90) {
      return `3 ${t('plans.months')}`;
    } else if (selectedPlan.durationDays === 365) {
      return `1 ${t('plans.year')}`;
    }
    return `${selectedPlan.durationDays} days`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/${lang}`)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Plans</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('checkout.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('checkout.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.form.name')} *
                    </label>
                    <input
                      {...register('name', { 
                        required: t('checkout.form.required'),
                        minLength: { value: 2, message: 'Name too short' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.form.email')} *
                    </label>
                    <input
                      {...register('email', { 
                        required: t('checkout.form.required'),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('checkout.form.invalidEmail')
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.form.phone')} *
                    </label>
                    <input
                      {...register('phone', { 
                        required: t('checkout.form.required'),
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: t('checkout.form.invalidPhone')
                        }
                      })}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.form.country')} *
                    </label>
                    <select
                      {...register('country', { required: t('checkout.form.required') })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.form.note')}
                    </label>
                    <textarea
                      {...register('note')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Any special requests or questions..."
                    />
                  </div>

                  <div className="pt-6">
                    <WhatsAppButton
                      onClick={handleSubmit(onSubmit)}
                      className={`w-full ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                      size="lg"
                    >
                      {t('checkout.payment.whatsapp')}
                    </WhatsAppButton>

                    <p className="text-sm text-gray-600 mt-4 text-center">
                      {t('checkout.payment.info')}
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t('checkout.summary.title')}
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('checkout.summary.plan')}</span>
                    <span className="font-semibold">{selectedPlan.title}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('checkout.summary.duration')}</span>
                    <span className="font-semibold">{getDurationText()}</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{t('checkout.summary.price')}</span>
                    <span className="text-2xl font-bold text-blue-600">{formattedPrice}</span>
                  </div>
                </div>

                {selectedPlan.features && (
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-900 mb-4">Included Features:</h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};