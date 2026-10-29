import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  X, 
  CheckCircle2, 
  Store
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
        message: `You need ${reward.cost_in_points - userPoints} more points to claim this voucher.`
      });
      return;
    }

    try {
      setRedeemingId(reward.id);
      const res = await redeemReward({
        userId: user?.id || 1,
        rewardId: reward.id
      });

      onPointsUpdate?.(res.new_green_points);
      setActiveVoucher(res);

      onToast?.({
        type: 'success',
        title: 'Voucher Unlocked! 🎟️',
        message: `Claimed ${reward.title} for ${reward.cost_in_points} points.`
      });
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Could not claim',
        message: err.message
      });
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
      
      {/* Rewards Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DDD1] shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] border border-[#7C9D8E]/30 text-[#2C4A3E] text-xs font-semibold mb-2">
            <Store className="w-3.5 h-3.5 text-[#587B6C]" />
            <span>Local Partner Perks</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2C4A3E]">
            Spend Your Green Points
          </h1>
          <p className="text-sm text-[#8C857B] mt-1 max-w-xl leading-relaxed">
            Redeem your hard-earned points for discounts at local organic cafes, sustainable nurseries, bus passes, and eco-friendly home goods.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] text-right shrink-0">
          <span className="text-xs text-[#8C857B] uppercase block font-medium">Your Green Points</span>
          <div className="flex items-center justify-end gap-1.5 text-2xl font-bold text-[#2C4A3E]">
            <span>🌱</span>
            <span>{user?.green_points ?? 120}</span>
            <span className="text-xs text-[#8C857B] uppercase font-semibold">Points</span>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin mb-3" />
          <p className="text-[#8C857B] text-sm">Loading partner discount vouchers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const userPoints = user?.green_points || 0;
            const canAfford = userPoints >= reward.cost_in_points;
            const isProcessing = redeemingId === reward.id;

            return (
              <div
                key={reward.id}
                className="rounded-3xl bg-white border border-[#E2DDD1] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative h-44 w-full bg-[#EFECE4] overflow-hidden">
                    <img
                      src={reward.image_url}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-medium text-[#2C4A3E] shadow-sm">
                      {reward.category}
                    </div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#7C9D8E]/50 text-xs font-bold text-[#2C4A3E] flex items-center gap-1 shadow-sm">
                      <span>🌱 {reward.cost_in_points} Points</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] uppercase text-[#8C857B] font-semibold block mb-1">
                      {reward.partner_store_name}
                    </span>
                    <h3 className="font-display font-bold text-[#2C4A3E] text-base mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-[#64786E] leading-relaxed line-clamp-2">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isProcessing}
                    className={`w-full py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-[#587B6C] hover:bg-[#48685A] text-white shadow-sage active:scale-95'
                        : 'bg-[#F5F2EB] text-[#8C857B] border border-[#E2DDD1] cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <span>Unlocking...</span>
                    ) : canAfford ? (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>Claim Voucher</span>
                      </>
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

      {/* Voucher Code Reveal Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E2DDD1] shadow-2xl p-6 sm:p-8 text-center">
            
            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-5 right-5 text-[#8C857B] hover:text-[#2C4A3E]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] border border-[#7C9D8E]/30 flex items-center justify-center mx-auto mb-3 text-[#587B6C]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="font-display font-bold text-xl text-[#2C4A3E] mb-1">
              Voucher Ready!
            </h3>
            <p className="text-xs text-[#8C857B] mb-5">
              Store: {activeVoucher.partner_store_name}
            </p>

            {/* Voucher Code Box */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] mb-4">
              <span className="text-[10px] text-[#8C857B] uppercase block mb-1 font-semibold">
                Your Discount Code
              </span>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border border-[#E2DDD1] shadow-sm">
                <span className="font-mono font-bold text-[#2C4A3E] text-base tracking-wider">
                  {activeVoucher.voucher_code}
                </span>
                <button
                  onClick={() => copyToClipboard(activeVoucher.voucher_code)}
                  className="p-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#E8EFEA] text-[#2C4A3E] transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-[#587B6C]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-[#64786E] leading-relaxed mb-5">
              {activeVoucher.instructions}
            </p>

            <button
              onClick={() => setActiveVoucher(null)}
              className="w-full py-3 rounded-2xl bg-[#587B6C] hover:bg-[#48685A] text-white font-bold text-xs uppercase tracking-wider shadow-sage"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
