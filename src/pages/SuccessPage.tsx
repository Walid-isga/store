import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home, Copy, Check } from 'lucide-react';
import { getOrderById } from '../utils/orders';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { generateWhatsAppMessage, openWhatsApp, copyToClipboard } from '../utils/whatsapp';
import { formatPrice } from '../utils/currency';

export const SuccessPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        navigate(`/${lang}`);
      }
    } else {
      navigate(`/${lang}`);
    }
  }, [orderId, navigate, lang]);

  const handleOpenWhatsApp = () => {
    if (order) {
      const message = generateWhatsAppMessage(order, t);
      openWhatsApp(message);
    }
  };

  const handleCopyOrderId = async () => {
    if (order) {
      const success = await copyToClipboard(order.orderId);
      if (success) {
        setIsCopySuccess(true);
        setTimeout(() => setIsCopySuccess(false), 2000);
      }
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formattedPrice = formatPrice(order.price, order.currency, i18n.language);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('success.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('success.subtitle')}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">{t('success.orderId')}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-semibold">{order.orderId}</span>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {isCopySuccess ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Customer</span>
                <span className="font-semibold">{order.name}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-semibold">{order.email}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold">{order.planTitle}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold">{order.duration} days</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-lg font-semibold">Total Price</span>
                <span className="text-2xl font-bold text-blue-600">{formattedPrice}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <WhatsAppButton
              onClick={handleOpenWhatsApp}
              className="w-full"
              size="lg"
            >
              {t('success.whatsapp')}
            </WhatsAppButton>

            <button
              onClick={() => navigate(`/${lang}`)}
              className="w-full py-4 px-8 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>{t('success.home')}</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• You will be contacted via WhatsApp within 1-2 hours</li>
              <li>• Complete your payment using the provided link</li>
              <li>• Receive your IPTV access credentials within 24 hours</li>
              <li>• Enjoy unlimited streaming on all your devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};