import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Shield, FileText, AlertTriangle } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('legal.title')}
            </h1>
            <p className="text-xl text-gray-600">
              Important information about our IPTV service
            </p>
          </div>

          <div className="space-y-8">
            {/* IPTV Disclaimer */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">{t('legal.disclaimer')}</h2>
              </div>
              
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>
                  {t('legal.content')}
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Service Terms</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Our IPTV service provides access to digital television content for personal use only.</li>
                  <li>Users must comply with all applicable local laws and regulations in their jurisdiction.</li>
                  <li>The service is intended for authorized users in European countries only.</li>
                  <li>We do not host any illegal content and comply with all copyright laws.</li>
                  <li>Users are responsible for their own internet connection and compatible devices.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Usage Guidelines</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The service is for personal, non-commercial use only.</li>
                  <li>Sharing account credentials with unauthorized users is prohibited.</li>
                  <li>Users should not attempt to redistribute or resell the service.</li>
                  <li>We reserve the right to terminate accounts that violate these terms.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Technical Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Stable internet connection (minimum 10 Mbps for HD, 25 Mbps for 4K)</li>
                  <li>Compatible device (Smart TV, Android/iOS device, or streaming device)</li>
                  <li>Updated software and applications for optimal performance</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                      <p className="text-yellow-800 text-sm">
                        By using our service, you acknowledge that you have read, understood, and agree to comply 
                        with all terms and conditions. You also confirm that you are legally authorized to access 
                        the content provided through our service in your jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">Contact & Support</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Legal Inquiries</h3>
                  <p className="text-gray-700">
                    For legal questions or compliance matters, please contact our legal department.
                  </p>
                  <p className="text-blue-600 font-medium mt-2">legal@iptveurope.com</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Technical Support</h3>
                  <p className="text-gray-700">
                    For technical issues or service-related questions, our support team is available 24/7.
                  </p>
                  <p className="text-blue-600 font-medium mt-2">support@iptveurope.com</p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm">
              <p>This legal information was last updated on January 1, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};