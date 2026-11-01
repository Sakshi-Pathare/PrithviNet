import React, { useState, useEffect } from 'react';
import {
  Users, Trophy, GraduationCap, Waves, Sun, Leaf, Check, ArrowRight, TrendingUp, Medal
} from 'lucide-react';
import { fetchCommunityGroups, joinCommunityGroup } from '../api';

const GROUP_ICONS = { GraduationCap, Waves, Sun, Leaf, Users };

const RANK_COLORS = [
  'from-[#F5C842] to-[#E6A817]',  // Gold
  'from-[#9BA8B5] to-[#7A8994]',  // Silver
  'from-[#C8875A] to-[#A66A3E]',  // Bronze
  'from-[#7C9D8E] to-[#587B6C]',  // Sage (4th+)
];

export default function GroupsPage({ user, onUserUpdated, onToast }) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGroups() {
      setIsLoading(true);
      try {
        const data = await fetchCommunityGroups();
        if (isMounted) setGroups(data);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadGroups();
    return () => { isMounted = false; };
  }, []);

  const handleJoin = async (group) => {
    try {
      setJoiningId(group.id);
      await joinCommunityGroup(group.id, user?.id || 1);
      onUserUpdated?.({ ...user, community_group_id: group.id, community_group_name: group.group_name });
      onToast?.({ type: 'success', title: 'Group Joined! 🎉', message: `You are now part of ${group.group_name}!` });
      const updated = await fetchCommunityGroups();
      setGroups(updated);
    } catch (err) {
      onToast?.({ type: 'error', title: 'Could not join group', message: err.message });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8">

      {/* Banner — Glassmorphism */}
      <div className="relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden glass-card mb-5 sm:mb-8">
        <div className="absolute -top-10 -right-10 w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-gradient-to-br from-[#7C9D8E]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm border border-[#7C9D8E]/30 text-[#2C4A3E] text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 shadow-xs">
              <Trophy className="w-3.5 h-3.5 text-[#587B6C]" />
              <span>Community &amp; College Groups</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-3xl text-[#2C4A3E]">
              Team Up with <span className="text-[#587B6C]">Local Volunteers</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8C857B] mt-1.5 max-w-xl leading-relaxed">
              Join your college club or neighbourhood circle. Every cleanup or tree boosts your group's score on the Pune leaderboard.
            </p>
          </div>

          {/* Current group pill */}
          <div className="w-full sm:w-auto shrink-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card-sage text-center sm:min-w-[130px]">
            <span className="text-[10px] sm:text-[11px] text-[#8C857B] uppercase block font-medium mb-0.5">Your Group</span>
            <div className="font-display font-bold text-xs sm:text-sm text-[#2C4A3E] truncate">
              {user?.community_group_name || 'Not Joined Yet'}
            </div>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-10 h-10 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8EFEA]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin" />
          </div>
          <p className="text-[#8C857B] text-xs sm:text-sm">Loading community groups…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {groups.map((group, idx) => {
            const isCurrent = user?.community_group_id === group.id;
            const IconComp = GROUP_ICONS[group.icon] || Users;
            const rankGrad = RANK_COLORS[Math.min(idx, RANK_COLORS.length - 1)];

            return (
              <div
                key={group.id}
                className={`group p-4 sm:p-5 rounded-2xl sm:rounded-3xl overflow-hidden glass-card flex flex-col justify-between gap-3.5 transition-all duration-300 ${
                  isCurrent ? 'ring-2 ring-[#587B6C]/40 border-[#7C9D8E]/50 shadow-md bg-white/95' : 'border-[#E2DDD1]/80 hover:border-[#7C9D8E]/40 hover:bg-white/90'
                }`}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* Top: Rank + Icon + Info */}
                <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                  {/* Rank badge */}
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${rankGrad} flex items-center justify-center font-bold text-white text-xs sm:text-sm shrink-0 shadow-xs mt-0.5`}>
                    {idx === 0 ? <Medal className="w-4 h-4" /> : `#${idx + 1}`}
                  </div>

                  {/* Group icon */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/25 flex items-center justify-center text-[#587B6C] shrink-0 shadow-xs">
                    <IconComp className="w-5 h-5 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-display font-bold text-[#2C4A3E] text-sm sm:text-base truncate">{group.group_name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#F5F2EB]/80 border border-[#E2DDD1] text-[9px] sm:text-[10px] text-[#64786E] font-medium">
                        {group.city_tag}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E8EFEA] border border-[#7C9D8E]/40 text-[9px] sm:text-[10px] text-[#587B6C] font-bold">
                          Your Group
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64786E] mt-1 leading-relaxed line-clamp-2">{group.description}</p>
                  </div>
                </div>

                {/* Bottom: Score + Join Action */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD1]/60">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-[#8C857B] uppercase block font-medium">Total Impact</span>
                    <span className="font-bold text-[#2C4A3E] text-sm sm:text-base">{group.total_impact_score.toLocaleString()} <span className="text-xs font-normal">kg CO₂</span></span>
                    <span className="text-[10px] sm:text-[11px] text-[#8C857B] block">{group.member_count} active members</span>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#587B6C]/30 text-[#2C4A3E] text-xs font-bold flex items-center gap-1.5 shadow-xs">
                        <Check className="w-3.5 h-3.5 text-[#587B6C] stroke-[3]" />
                        <span>Joined</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoin(group)}
                        disabled={joiningId === group.id}
                        className="btn-sage px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-sage cursor-pointer"
                      >
                        {joiningId === group.id ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : (
                          <><span>Join Group</span> <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
