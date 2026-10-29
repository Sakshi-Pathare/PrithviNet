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
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header Banner — Glass */}
      <div className="relative p-7 sm:p-9 rounded-3xl overflow-hidden glass-card mb-8">
        <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-gradient-to-br from-[#7C9D8E]/15 to-[#587B6C]/8 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm border border-[#7C9D8E]/30 text-[#2C4A3E] text-xs font-semibold mb-3 shadow-sm">
              <Store className="w-3.5 h-3.5 text-[#587B6C]" />
              <span>Local Partner Perks</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2C4A3E]">
              Spend Your <span className="text-[#587B6C]">Green Points</span>
            </h1>
            <p className="text-sm text-[#8C857B] mt-2 max-w-xl leading-relaxed">
              Redeem your hard-earned points for discounts at local organic cafes, sustainable nurseries, bus passes, and eco-friendly home goods.
            </p>
          </div>

          {/* Points display */}
          <div className="relative shrink-0 p-5 rounded-2xl glass-card-sage text-center min-w-[140px]">
            <div className="text-3xl mb-1 animate-float">🌱</div>
            <span className="text-[11px] text-[#8C857B] uppercase block font-medium mb-0.5">Your Points</span>
            <div className="font-display font-bold text-2xl text-[#2C4A3E]">{user?.green_points ?? 120}</div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8EFEA]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin" />
          </div>
          <p className="text-[#8C857B] text-sm">Loading partner vouchers…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, i) => {
            const userPoints = user?.green_points || 0;
            const canAfford = userPoints >= reward.cost_in_points;
            const isProcessing = redeemingId === reward.id;

            return (
              <div
                key={reward.id}
                className="reward-card rounded-3xl overflow-hidden flex flex-col justify-between"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-[#EFECE4] overflow-hidden group">
                  <img
                    src={reward.image_url}
                    alt={reward.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md text-[11px] font-semibold text-[#2C4A3E] shadow-sm">
                    {reward.category}
                  </div>

                  {/* Cost pill */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#7C9D8E]/40 text-xs font-bold text-[#2C4A3E] flex items-center gap-1 shadow-sm">
                    🌱 {reward.cost_in_points} pts
                  </div>

                  {/* Lock overlay if not affordable */}
                  {!canAfford && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="p-2 rounded-full bg-white/70 shadow-sm">
                        <Lock className="w-5 h-5 text-[#8C857B]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1">
                  <span className="text-[11px] uppercase text-[#8C857B] font-semibold block mb-1">{reward.partner_store_name}</span>
                  <h3 className="font-display font-bold text-[#2C4A3E] text-base mb-2">{reward.title}</h3>
                  <p className="text-xs text-[#64786E] leading-relaxed line-clamp-2">{reward.description}</p>
                </div>

                {/* Action */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isProcessing}
                    className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'btn-sage active:scale-95'
                        : 'bg-[#F5F2EB] text-[#8C857B] border border-[#E2DDD1] cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Unlocking…
                      </span>
                    ) : canAfford ? (
                      <><Tag className="w-3.5 h-3.5" /> Claim Voucher</>
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

      {/* Voucher Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-scale">
          <div className="relative w-full max-w-md rounded-3xl glass-card shadow-2xl p-7 sm:p-8 text-center border border-[#7C9D8E]/30">

            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-5 right-5 text-[#8C857B] hover:text-[#2C4A3E] p-1.5 rounded-xl hover:bg-[#F5F2EB] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/30 flex items-center justify-center mx-auto mb-4 shadow-sm animate-float">
              <CheckCircle2 className="w-8 h-8 text-[#587B6C]" />
            </div>

            <h3 className="font-display font-bold text-2xl text-[#2C4A3E] mb-1">Voucher Ready! 🎉</h3>
            <p className="text-xs text-[#8C857B] mb-6">Store: <span className="font-semibold text-[#2C4A3E]">{activeVoucher.partner_store_name}</span></p>

            {/* Code box */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] mb-4">
              <span className="text-[10px] text-[#8C857B] uppercase block mb-2 font-semibold tracking-wide">Your Discount Code</span>
              <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white border border-[#E2DDD1] shadow-sm">
                <span className="font-mono font-bold text-[#2C4A3E] text-lg tracking-widest">{activeVoucher.voucher_code}</span>
                <button
                  onClick={() => copyToClipboard(activeVoucher.voucher_code)}
                  className={`p-2 rounded-xl transition-all ${copied ? 'bg-[#E8EFEA] text-[#587B6C]' : 'bg-[#F5F2EB] hover:bg-[#E8EFEA] text-[#2C4A3E]'}`}
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#64786E] leading-relaxed mb-5">{activeVoucher.instructions}</p>

            <button
              onClick={() => setActiveVoucher(null)}
              className="btn-sage w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
