import React from 'react';
import { CheckCircle2, AlertCircle, X, Leaf } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5">
      <div className={`p-4 rounded-2xl border shadow-lg flex items-start gap-3 ${
        isSuccess
          ? 'bg-white border-[#7C9D8E] shadow-[#7C9D8E]/20'
          : 'bg-white border-red-300 shadow-red-200/40'
      }`}>
        <div className={`p-1.5 rounded-xl shrink-0 ${
          isSuccess ? 'bg-[#E8EFEA] text-[#587B6C]' : 'bg-red-50 text-red-500'
        }`}>
          {isSuccess ? <Leaf className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-sm text-[#2C4A3E]">
            {toast.title}
          </h4>
          <p className="text-xs text-[#8C857B] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-[#8C857B] hover:text-[#2C4A3E] p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
