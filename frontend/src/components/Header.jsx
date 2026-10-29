import React, { useState, useEffect } from 'react';
import { 
  Sprout, Compass, Users, ShoppingBag, PlusCircle, Flame, Plus
} from 'lucide-react';

export default function Header({ user, activeTab, setActiveTab, onOpenUploadModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'feed',    label: 'Feed',    fullLabel: 'Home Feed',     icon: Flame },
    { id: 'map',     label: 'Map',     fullLabel: 'Community Map', icon: Compass },
    { id: 'groups',  label: 'Groups',  fullLabel: 'My Group',      icon: Users },
    { id: 'rewards', label: 'Rewards', fullLabel: 'Rewards',       icon: ShoppingBag },
  ];

  return (
    <>
      {/* ── TOP STICKY APP BAR (DESKTOP & MOBILE) ── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-[0_2px_20px_rgba(44,74,62,0.08)] border-b border-white/60'
            : 'bg-white/70 backdrop-blur-md border-b border-white/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">

          {/* Brand Logo & City Tag */}
          <div
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/35 shadow-xs group-hover:scale-105 transition-all">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-[#587B6C] group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#2C4A3E]">
                  Prithvi<span className="text-[#587B6C]">Net</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-sans px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full bg-[#E8EFEA] text-[#2C4A3E] border border-[#7C9D8E]/30 font-semibold shadow-xs">
                  Pune
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8C857B] tracking-tight hidden sm:block font-medium">
                Connect for a Greener Tomorrow
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5F2EB]/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2DDD1]/80 shadow-inner">
            {navItems.map(({ id, fullLabel, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-white text-[#2C4A3E] border border-[#7C9D8E]/50 shadow-md'
                    : 'text-[#64786E] hover:text-[#2C4A3E] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${activeTab === id ? 'text-[#587B6C]' : 'text-[#8C857B]'}`} />
                <span>{fullLabel}</span>
                {activeTab === id && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#587B6C] opacity-70" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Green Points Pill */}
            <div
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-2xl glass-card cursor-pointer hover:border-[#7C9D8E]/50 group"
              title="Your Green Points"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#E8EFEA] to-[#C8DFCC] flex items-center justify-center text-xs sm:text-sm group-hover:scale-110 transition-transform">
                🌱
              </div>
              <div className="text-right">
                <span className="font-bold text-[#2C4A3E] text-xs sm:text-base leading-none tabular-nums">
                  {user?.green_points ?? 120}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#8C857B] uppercase font-medium ml-1 hidden xs:inline">
                  pts
                </span>
              </div>
            </div>

            {/* Desktop Post Action Button */}
            <button
              onClick={onOpenUploadModal}
              className="hidden md:flex btn-sage items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95 shadow-sage"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post Action</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── ERGONOMIC FIXED MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E2DDD1]/80 shadow-[0_-4px_24px_rgba(44,74,62,0.1)] px-3 py-1.5 flex items-center justify-around safe-area-pb"
      >
        {/* Tab 1: Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all ${
            activeTab === 'feed' ? 'text-[#2C4A3E]' : 'text-[#8C857B] hover:text-[#2C4A3E]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'feed' ? 'bg-[#E8EFEA] text-[#587B6C]' : ''}`}>
            <Flame className="w-5 h-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'feed' ? 'font-bold text-[#2C4A3E]' : 'font-medium'}`}>
            Feed
          </span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all ${
            activeTab === 'map' ? 'text-[#2C4A3E]' : 'text-[#8C857B] hover:text-[#2C4A3E]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'map' ? 'bg-[#E8EFEA] text-[#587B6C]' : ''}`}>
            <Compass className="w-5 h-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'map' ? 'font-bold text-[#2C4A3E]' : 'font-medium'}`}>
            Map
          </span>
        </button>

        {/* CENTER FLOATING ACTION BUTTON (FAB): POST ACTION */}
        <div className="relative flex flex-col items-center justify-center -translate-y-3.5">
          <button
            onClick={onOpenUploadModal}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#587B6C] to-[#7C9D8E] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(88,123,108,0.45)] border-2 border-white active:scale-90 transition-transform"
            aria-label="Post Eco-Action"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[9px] font-bold text-[#587B6C] uppercase tracking-wider mt-0.5">
            Post
          </span>
        </div>

        {/* Tab 3: Groups */}
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all ${
            activeTab === 'groups' ? 'text-[#2C4A3E]' : 'text-[#8C857B] hover:text-[#2C4A3E]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'groups' ? 'bg-[#E8EFEA] text-[#587B6C]' : ''}`}>
            <Users className="w-5 h-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'groups' ? 'font-bold text-[#2C4A3E]' : 'font-medium'}`}>
            Group
          </span>
        </button>

        {/* Tab 4: Rewards */}
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center justify-center w-14 py-1 transition-all ${
            activeTab === 'rewards' ? 'text-[#2C4A3E]' : 'text-[#8C857B] hover:text-[#2C4A3E]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'rewards' ? 'bg-[#E8EFEA] text-[#587B6C]' : ''}`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'rewards' ? 'font-bold text-[#2C4A3E]' : 'font-medium'}`}>
            Perks
          </span>
        </button>
      </nav>
    </>
  );
}
