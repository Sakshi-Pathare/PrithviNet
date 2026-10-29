import React, { useState, useEffect } from 'react';
import { Leaf, Users, CheckCircle2, TreePine, Sparkles } from 'lucide-react';
import { fetchCommunityStats } from '../api';

export default function CommunityStatsBar() {
  const [stats, setStats] = useState({
    total_co2_saved_kg: 121.0,
    total_green_points_awarded: 370,
    total_verified_actions: 5,
    total_volunteers: 4,
    trees_equivalent: 6
  });

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      const data = await fetchCommunityStats();
      if (isMounted) setStats(data);
    }
    loadStats();
    const interval = setInterval(loadStats, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-[#EFECE4] border-y border-[#E2DDD1] px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs font-sans">
        
        {/* Live Network Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#587B6C] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#587B6C]" />
          </span>
          <span className="text-[#2C4A3E] font-bold tracking-wide">
            PrithviNet Community Live
          </span>
        </div>

        {/* Total CO2 Saved */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#2C4A3E]">
          <span className="text-[#8C857B] uppercase text-[11px] font-medium">CO₂ Saved:</span>
          <span className="font-bold text-[#2C4A3E]">
            {stats.total_co2_saved_kg.toLocaleString()} kg
          </span>
        </div>

        {/* Trees Equivalent */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#2C4A3E] hidden sm:flex">
          <TreePine className="w-3.5 h-3.5 text-[#587B6C]" />
          <span className="text-[#8C857B] uppercase text-[11px] font-medium">Tree Equiv:</span>
          <span className="font-bold">
            {stats.trees_equivalent} Trees
          </span>
        </div>

        {/* Verified Actions */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#2C4A3E]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
          <span className="text-[#8C857B] uppercase text-[11px] font-medium">Verified Actions:</span>
          <span className="font-bold">
            {stats.total_verified_actions}
          </span>
        </div>

        {/* Total Green Points Awarded */}
        <div className="flex items-center gap-1.5 shrink-0 text-[#2C4A3E] hidden md:flex">
          <Sparkles className="w-3.5 h-3.5 text-[#587B6C]" />
          <span className="text-[#8C857B] uppercase text-[11px] font-medium">Points Earned:</span>
          <span className="text-[#587B6C] font-bold">
            {stats.total_green_points_awarded.toLocaleString()} 🌱
          </span>
        </div>

      </div>
    </div>
  );
}
