import React from 'react';
import { AlertCircle, X, Leaf } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
        isSuccess
          ? 'bg-white/95 border-[#7C9D8E] shadow-[#7C9D8E]/20'
          : 'bg-white/95 border-red-300 shadow-red-200/40'
      }`}>
        <div className={`p-1.5 rounded-xl shrink-0 ${
          isSuccess ? 'bg-[#E8EFEA] text-[#587B6C]' : 'bg-red-50 text-red-500'
        }`}>
          {isSuccess ? <Leaf className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[#2C4A3E] truncate">
            {toast.title}
          </h4>
          <p className="text-xs text-[#8C857B] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-[#8C857B] hover:text-[#2C4A3E] p-1.5 rounded-lg hover:bg-[#F5F2EB] transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
