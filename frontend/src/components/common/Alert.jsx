import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  type = 'error', // 'success' | 'error' | 'warning' | 'info'
  message,
  onClose,
  className = '',
}) => {
  if (!message) return null;

  const configs = {
    error: {
      bg: 'bg-[#FFF1F0] border-[#FFD4D4] text-[#cb0233]',
      icon: AlertCircle,
      iconColor: 'text-[#cb0233]',
    },
    success: {
      bg: 'bg-[#E9FCD4] border-[#AAF27F] text-[#229a16]',
      icon: CheckCircle2,
      iconColor: 'text-[#229a16]',
    },
    warning: {
      bg: 'bg-[#FFF8CC] border-[#FFE16A] text-[#b78103]',
      icon: AlertTriangle,
      iconColor: 'text-[#ffc107]',
    },
    info: {
      bg: 'bg-[#E6F9FF] border-[#AAEBFE] text-[#0c53b7]',
      icon: Info,
      iconColor: 'text-[#1890ff]',
    },
  };

  const config = configs[type] || configs.error;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${config.bg} ${className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="text-xs font-semibold leading-relaxed flex-1 font-dm">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 -mr-1 -mt-1 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
