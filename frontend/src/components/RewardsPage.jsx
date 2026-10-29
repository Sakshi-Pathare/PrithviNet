import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Tag, Copy, Check, X, CheckCircle2, Store, Sparkles, Lock
} from 'lucide-react';
import { fetchRewards, redeemReward } from '../api';

export default function RewardsPage({ user, onPointsUpdate, onToast }) {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadRewards() {
      setIsLoading(true);
      try {
        const data = await fetchRewards();
        if (isMounted) setRewards(data);
      } catch (err) {
        console.error('Failed to load rewards:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadRewards();
    return () => { isMounted = false; };
  }, []);

  const handleRedeem = async (reward) => {
    const userPoints = user?.green_points || 0;
    if (userPoints < reward.cost_in_points) {
      onToast?.({
        type: 'error',
        title: 'Need More Green Points',
        message: `You need ${reward.cost_in_points - userPoints} more points.`
      });
      return;
    }
    try {
      setRedeemingId(reward.id);
      const res = await redeemReward({ userId: user?.id || 1, rewardId: reward.id });
      onPointsUpdate?.(res.new_green_points);
      setActiveVoucher(res);
      onToast?.({ type: 'success', title: 'Voucher Unlocked! 🎟️', message: `Claimed ${reward.title}` });
    } catch (err) {
      onToast?.({ type: 'error', title: 'Could not claim', message: err.message });
    } finally {
      setRedeemingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-4 py-4 sm:py-8">

      {/* Header Banner — Glassmorphism */}
      <div className="relative p-5 sm:p-9 rounded-2xl sm:rounded-3xl overflow-hidden glass-card mb-5 sm:mb-8">
        <div className="absolute -top-12 -right-12 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-gradient-to-br from-[#7C9D8E]/15 to-[#587B6C]/8 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm border border-[#7C9D8E]/30 text-[#2C4A3E] text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 shadow-xs">
              <Store className="w-3.5 h-3.5 text-[#587B6C]" />
              <span>Local Partner Perks</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-3xl text-[#2C4A3E]">
              Spend Your <span className="text-[#587B6C]">Green Points</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8C857B] mt-1.5 max-w-xl leading-relaxed">
              Redeem your points for discounts at local organic cafes, sustainable nurseries, bus passes, and eco-friendly home goods.
            </p>
          </div>

          {/* Points display */}
          <div className="w-full sm:w-auto relative shrink-0 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl glass-card-sage text-center sm:min-w-[140px] flex sm:flex-col items-center justify-between sm:justify-center">
            <div className="flex items-center gap-2 sm:flex-col">
              <div className="text-2xl sm:text-3xl sm:mb-1 animate-float">🌱</div>
              <span className="text-[10px] sm:text-[11px] text-[#8C857B] uppercase block font-medium">Your Points</span>
            </div>
            <div className="font-display font-bold text-lg sm:text-2xl text-[#2C4A3E]">
              {user?.green_points ?? 120} <span className="text-xs font-normal text-[#8C857B] sm:hidden">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-10 h-10 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8EFEA]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin" />
          </div>
          <p className="text-[#8C857B] text-xs sm:text-sm">Loading partner vouchers…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rewards.map((reward, i) => {
            const userPoints = user?.green_points || 0;
            const canAfford = userPoints >= reward.cost_in_points;
            const isProcessing = redeemingId === reward.id;

            return (
              <div
                key={reward.id}
                className="reward-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 w-full bg-[#EFECE4] overflow-hidden group">
                  <img
                    src={reward.image_url}
                    alt={reward.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category pill */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.8 rounded-full bg-white/90 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-[#2C4A3E] shadow-xs">
                    {reward.category}
                  </div>

                  {/* Cost pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.8 rounded-full bg-white/95 backdrop-blur-md border border-[#7C9D8E]/40 text-xs font-bold text-[#2C4A3E] flex items-center gap-1 shadow-xs">
                    🌱 {reward.cost_in_points} pts
                  </div>

                  {/* Lock overlay if not affordable */}
                  {!canAfford && (
                    <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="p-2 rounded-full bg-white/80 shadow-xs">
                        <Lock className="w-5 h-5 text-[#8C857B]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex-1">
                  <span className="text-[10px] sm:text-[11px] uppercase text-[#8C857B] font-semibold block mb-0.5">{reward.partner_store_name}</span>
                  <h3 className="font-display font-bold text-[#2C4A3E] text-sm sm:text-base mb-1.5">{reward.title}</h3>
                  <p className="text-xs text-[#64786E] leading-relaxed line-clamp-2">{reward.description}</p>
                </div>

                {/* Action button */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isProcessing}
                    className={`w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 min-h-[42px] ${
                      canAfford
                        ? 'btn-sage active:scale-95 shadow-sage'
                        : 'bg-[#F5F2EB] text-[#8C857B] border border-[#E2DDD1] cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Unlocking…
                      </span>
                    ) : canAfford ? (
                      <><Tag className="w-3.5 h-3.5" /> <span>Claim Voucher</span></>
                    ) : (
                      <span>Need {reward.cost_in_points - userPoints} More Points</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Voucher Code Reveal Modal (Mobile Responsive) */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-scale">
          <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl glass-card shadow-2xl p-5 sm:p-8 text-center border border-[#7C9D8E]/30 max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-4 right-4 text-[#8C857B] hover:text-[#2C4A3E] p-1.5 rounded-xl hover:bg-[#F5F2EB] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/30 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xs animate-float">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#587B6C]" />
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#2C4A3E] mb-1">Voucher Ready! 🎉</h3>
            <p className="text-xs text-[#8C857B] mb-4 sm:mb-6">Store: <span className="font-semibold text-[#2C4A3E]">{activeVoucher.partner_store_name}</span></p>

            {/* Code box */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] mb-4">
              <span className="text-[10px] text-[#8C857B] uppercase block mb-1.5 font-semibold tracking-wide">Your Discount Code</span>
              <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-[#E2DDD1] shadow-xs">
                <span className="font-mono font-bold text-[#2C4A3E] text-base sm:text-lg tracking-widest truncate">{activeVoucher.voucher_code}</span>
                <button
                  onClick={() => copyToClipboard(activeVoucher.voucher_code)}
                  className={`p-2 rounded-xl transition-all shrink-0 ${copied ? 'bg-[#E8EFEA] text-[#587B6C]' : 'bg-[#F5F2EB] hover:bg-[#E8EFEA] text-[#2C4A3E]'}`}
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#64786E] leading-relaxed mb-4 sm:mb-5">{activeVoucher.instructions}</p>

            <button
              onClick={() => setActiveVoucher(null)}
              className="btn-sage w-full py-3 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
