import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${sizeClasses[size]} ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>{children}</span>
    </button>
  );
};