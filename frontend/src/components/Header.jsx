import React, { useState, useEffect } from 'react';
import { 
  Sprout, Compass, Users, ShoppingBag, PlusCircle, Flame, Wind
} from 'lucide-react';

export default function Header({ user, activeTab, setActiveTab, onOpenUploadModal }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'feed',    label: 'Home Feed',       icon: Flame   },
    { id: 'map',     label: 'Community Map',   icon: Compass  },
    { id: 'groups',  label: 'My Group',        icon: Users    },
    { id: 'rewards', label: 'Rewards',         icon: ShoppingBag },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/75 backdrop-blur-xl shadow-[0_2px_24px_rgba(44,74,62,0.1)] border-b border-white/60'
          : 'bg-white/60 backdrop-blur-lg border-b border-white/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('feed')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/35 shadow-sm group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(124,157,142,0.35)] transition-all duration-300">
            <Sprout className="w-6 h-6 text-[#587B6C] group-hover:rotate-12 transition-transform duration-300" />
            {/* subtle floating ring */}
            <span className="absolute inset-0 rounded-2xl border border-[#7C9D8E]/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#2C4A3E]">
                Prithvi<span className="text-[#587B6C]">Net</span>
              </span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-gradient-to-r from-[#E8EFEA] to-[#D4E5DC] text-[#2C4A3E] border border-[#7C9D8E]/30 font-semibold shadow-sm">
                Pune
              </span>
            </div>
            <p className="text-[11px] text-[#8C857B] tracking-tight hidden sm:block font-medium">
              Connect for a Greener Tomorrow
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F5F2EB]/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2DDD1]/80 shadow-inner">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-[#2C4A3E] border border-[#7C9D8E]/50 shadow-md'
                  : 'text-[#64786E] hover:text-[#2C4A3E] hover:bg-white/60'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${activeTab === id ? 'text-[#587B6C]' : 'text-[#8C857B]'}`} />
              <span>{label}</span>
              {activeTab === id && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#587B6C] opacity-60" />
              )}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Green Points Pill */}
          <div
            onClick={() => setActiveTab('rewards')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl glass-card cursor-pointer hover:border-[#7C9D8E]/50 group"
            title="Your Green Points"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E8EFEA] to-[#C8DFCC] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
              🌱
            </div>
            <div className="text-right">
              <span className="font-bold text-[#2C4A3E] text-sm sm:text-base leading-none tabular-nums">
                {user?.green_points ?? 120}
              </span>
              <span className="text-[10px] text-[#8C857B] uppercase font-medium ml-1">pts</span>
            </div>
          </div>

          {/* Post Action Button */}
          <button
            onClick={onOpenUploadModal}
            className="btn-sage flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Post Action</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="flex md:hidden items-center justify-around mt-2 pt-2 px-4 border-t border-[#E2DDD1]/60 text-xs font-medium pb-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === id
                ? 'text-[#2C4A3E] font-bold'
                : 'text-[#8C857B] hover:text-[#2C4A3E]'
            }`}
          >
            <Icon className={`w-4 h-4 ${activeTab === id ? 'text-[#587B6C]' : 'text-[#8C857B]'}`} />
            <span className="text-[10px]">{label.split(' ')[0]}</span>
            {activeTab === id && (
              <span className="w-3 h-0.5 rounded-full bg-[#587B6C]" />
            )}
          </button>
        ))}
      </div>
    </header>
  );
}
