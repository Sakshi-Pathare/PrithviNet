import React, { useState } from 'react';
import { 
  X, Copy, Check, Share2, Send, MessageCircle, ExternalLink, Leaf, Sparkles 
} from 'lucide-react';

export default function ShareModal({ isOpen, onClose, post, onToast }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const shareUrl = window.location.origin ? `${window.location.origin}?post=${post.id}` : `https://prithvinet.org?post=${post.id}`;
  const shareText = `Check out this verified eco-action by ${post.user_name} on PrithviNet: "${post.description}" (+${post.co2_saved_kg}kg CO₂ saved! 🌱)`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast?.({
        type: 'success',
        title: 'Link Copied! 📋',
        message: 'Share link copied to clipboard. Spread the green impact!'
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      onToast?.({
        type: 'info',
        title: 'Share Link',
        message: shareUrl
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PrithviNet Verified Eco-Action',
          text: shareText,
          url: shareUrl,
        });
        onToast?.({
          type: 'success',
          title: 'Shared! 🌿',
          message: 'Thank you for inspiring our Pune community!'
        });
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: '💬',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onToast?.({ type: 'success', title: 'Opening WhatsApp 💬', message: 'Sharing eco-action proof!' });
      }
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      bgColor: 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=PrithviNet,GreenPune,EcoAction`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onToast?.({ type: 'success', title: 'Opening X 𝕏', message: 'Ready to post your tweet!' });
      }
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bgColor: 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onToast?.({ type: 'success', title: 'Opening Telegram ✈️', message: 'Sharing to green group!' });
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-scale">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-2xl sm:rounded-3xl glass-card bg-white/95 p-5 sm:p-6 shadow-[0_20px_50px_rgba(44,74,62,0.2)] border border-[#E2DDD1] transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E2DDD1]/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#587B6C]">
              <Share2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#2C4A3E]">
                Share Eco-Action
              </h3>
              <p className="text-[11px] text-[#8C857B]">
                Inspire neighbours to take real-world climate action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EB] text-[#8C857B] hover:text-[#2C4A3E] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview Snippet */}
        <div className="my-4 p-3 rounded-xl bg-gradient-to-br from-[#F5F2EB]/90 to-[#E8EFEA]/60 border border-[#E2DDD1] flex items-center gap-3">
          <img
            src={post.photo_url}
            alt="Eco action"
            className="w-14 h-14 rounded-lg object-cover border border-[#E2DDD1]/80 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-xs text-[#2C4A3E] truncate">{post.user_name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-[#587B6C] font-semibold border border-[#7C9D8E]/30 shrink-0">
                🌱 +{post.points_awarded} pts
              </span>
            </div>
            <p className="text-[11px] text-[#64786E] line-clamp-2 leading-tight">
              {post.description}
            </p>
          </div>
        </div>

        {/* Quick Social Channels */}
        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C857B] block mb-2">
            Share directly to
          </span>
          <div className="grid grid-cols-3 gap-2">
            {shareChannels.map(({ name, icon, bgColor, action }) => (
              <button
                key={name}
                type="button"
                onClick={action}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${bgColor}`}
              >
                <span className="text-xl mb-1">{icon}</span>
                <span className="text-[11px]">{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C857B] block mb-1.5">
            Or copy share link
          </span>
          <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-[#F5F2EB] border border-[#E2DDD1]">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-[#2C4A3E] w-full outline-none font-mono selection:bg-[#7C9D8E]"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'btn-sage active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native Share button if available */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-[#7C9D8E]/50 bg-[#E8EFEA]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-[#587B6C]" />
            <span>More Device Sharing Options...</span>
          </button>
        )}
      </div>
    </div>
  );
}

