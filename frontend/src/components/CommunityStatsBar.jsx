import React, { useState, useEffect } from 'react';
import { Leaf, Users, CheckCircle2, TreePine, Sparkles, TrendingUp } from 'lucide-react';
import { fetchCommunityStats } from '../api';

export default function CommunityStatsBar() {
  const [stats, setStats] = useState({
    total_co2_saved_kg: 121.0,
    total_green_points_awarded: 370,
    total_verified_actions: 5,
    total_volunteers: 4,
    trees_equivalent: 6,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      const data = await fetchCommunityStats();
      if (isMounted) setStats(data);
    }
    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const statItems = [
    { icon: '🌿', label: 'CO₂ Saved', value: `${stats.total_co2_saved_kg.toLocaleString()} kg`, highlight: false },
    { icon: '🌳', label: 'Tree Equiv.', value: `${stats.trees_equivalent} Trees`, highlight: false },
    { icon: '✅', label: 'Actions Verified', value: stats.total_verified_actions, highlight: false },
    { icon: '🌱', label: 'Points Earned', value: stats.total_green_points_awarded.toLocaleString(), highlight: true },
    { icon: '👥', label: 'Volunteers', value: stats.total_volunteers, highlight: false },
  ];

  // Duplicate for seamless loop
  const ticker = [...statItems, ...statItems];

  return (
    <div className="w-full bg-gradient-to-r from-[#EFECE4] via-[#F0EDE5] to-[#EFECE4] border-y border-[#E2DDD1]/70 py-2 overflow-hidden relative">

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#EFECE4] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#EFECE4] to-transparent z-10 pointer-events-none" />

      <div className="ticker-track">
        {ticker.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-8 shrink-0">
            {/* Live indicator — only for first real item */}
            {i === 0 && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#587B6C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#587B6C]" />
                </span>
                <span className="text-[11px] font-bold text-[#2C4A3E] uppercase tracking-wide">Live</span>
              </div>
            )}

            <span className="text-sm leading-none">{item.icon}</span>
            <span className="text-[11px] text-[#8C857B] uppercase font-medium">{item.label}:</span>
            <span className={`text-[11px] font-bold ${item.highlight ? 'text-[#587B6C]' : 'text-[#2C4A3E]'}`}>
              {item.value}
            </span>

            {/* Divider dot */}
            <span className="text-[#C8C2B6] text-xs ml-2">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}
