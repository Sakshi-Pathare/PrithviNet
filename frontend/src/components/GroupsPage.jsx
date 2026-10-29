import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  GraduationCap, 
  Waves, 
  Sun, 
  Leaf, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { fetchCommunityGroups, joinCommunityGroup } from '../api';

const GROUP_ICONS = {
  GraduationCap: GraduationCap,
  Waves: Waves,
  Sun: Sun,
  Leaf: Leaf,
  Users: Users
};

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
      
      onUserUpdated?.({
        ...user,
        community_group_id: group.id,
        community_group_name: group.group_name
      });

      onToast?.({
        type: 'success',
        title: 'Group Joined! 🎉',
        message: `You are now a member of ${group.group_name}!`
      });

      const updated = await fetchCommunityGroups();
      setGroups(updated);
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Could not join group',
        message: err.message
      });
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DDD1] shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EFEA] border border-[#7C9D8E]/30 text-[#2C4A3E] text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#587B6C]" />
            <span>Community & College Groups</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2C4A3E]">
            Team Up with Local Green Volunteers
          </h1>
          <p className="text-sm text-[#8C857B] mt-1 max-w-xl leading-relaxed">
            Join your college club or neighborhood circle. Every cleanup or tree you plant boosts your group’s total score on the Pune leaderboard.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD1] text-right shrink-0">
          <span className="text-xs text-[#8C857B] uppercase block font-medium">Your Group</span>
          <div className="font-display font-bold text-base text-[#2C4A3E]">
            {user?.community_group_name || "Volunteer"}
          </div>
        </div>
      </div>

      {/* Groups List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin mb-3" />
          <p className="text-[#8C857B] text-sm">Loading community groups...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group, idx) => {
            const isCurrent = user?.community_group_id === group.id;
            const IconComp = GROUP_ICONS[group.icon] || Users;

            return (
              <div
                key={group.id}
                className={`p-6 rounded-3xl bg-white border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-sm hover:shadow-md ${
                  isCurrent 
                    ? 'border-[#587B6C] bg-[#FAF8F5] ring-1 ring-[#587B6C]/30' 
                    : 'border-[#E2DDD1]'
                }`}
              >
                {/* Group Details */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F5F2EB] border border-[#E2DDD1] flex items-center justify-center font-bold text-sm text-[#8C857B] shrink-0 mt-1 sm:mt-0">
                    #{idx + 1}
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] border border-[#7C9D8E]/30 flex items-center justify-center text-[#587B6C] shrink-0 shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-[#2C4A3E] text-base sm:text-lg">
                        {group.group_name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F2EB] border border-[#E2DDD1] text-[10px] text-[#64786E] font-medium">
                        {group.city_tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#64786E] mt-1 max-w-lg leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Score & Join Action */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2DDD1]">
                  
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#8C857B] uppercase block font-medium">Total CO₂ Saved</span>
                    <span className="font-bold text-[#2C4A3E] text-base sm:text-lg">
                      {group.total_impact_score.toLocaleString()} kg
                    </span>
                    <span className="text-[11px] text-[#8C857B] block">
                      {group.member_count} Members
                    </span>
                  </div>

                  <div>
                    {isCurrent ? (
                      <div className="px-4 py-2 rounded-2xl bg-[#E8EFEA] border border-[#587B6C] text-[#2C4A3E] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Check className="w-3.5 h-3.5 text-[#587B6C] stroke-[3]" />
                        <span>Joined</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoin(group)}
                        disabled={joiningId === group.id}
                        className="px-4 py-2 rounded-2xl bg-[#F5F2EB] hover:bg-[#587B6C] text-[#2C4A3E] hover:text-white border border-[#E2DDD1] hover:border-[#587B6C] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Join</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
