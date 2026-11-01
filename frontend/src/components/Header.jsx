import React, { useState, useEffect } from 'react';
import { 
  Compass, Users, ShoppingBag, PlusCircle, Flame, User
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
    { id: 'profile', label: 'Profile', fullLabel: 'My Profile',    icon: User },
  ];

  return (
    <>
      {/* ── TOP STICKY APP BAR (DESKTOP & MOBILE) ── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(44,74,62,0.08)] border-b border-white/60'
            : 'bg-white/80 backdrop-blur-md border-b border-[#E2DDD1]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">

          {/* Brand Logo & City Tag */}
          <div
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#E8EFEA] to-[#D4E5DC] border border-[#7C9D8E]/35 shadow-xs group-hover:scale-105 transition-all p-1">
              <img 
                src="/emblem.png" 
                alt="PrithviNet" 
                className="w-full h-full object-contain group-hover:rotate-6 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#2C4A3E]">
                  Prithvi<span className="text-[#587B6C]">Net</span>
                </span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#E8EFEA] text-[#2C4A3E] border border-[#7C9D8E]/30 font-semibold shadow-xs">
                  Pune
                </span>
              </div>
              <p className="text-[11px] text-[#8C857B] tracking-tight hidden sm:block font-medium">
                Discuss • Share • Create Change
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#FAF8F5]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2DDD1] shadow-xs">
            {navItems.map(({ id, fullLabel, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === id
                    ? 'bg-white text-[#2C4A3E] border border-[#7C9D8E]/40 shadow-sm'
                    : 'text-[#64786E] hover:text-[#2C4A3E] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${activeTab === id ? 'text-[#587B6C]' : 'text-[#8C857B]'}`} />
                <span>{fullLabel}</span>
                {activeTab === id && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#587B6C]" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Green Points Pill */}
            <div
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-2xl bg-white/90 border border-[#E2DDD1] hover:border-[#7C9D8E]/50 shadow-xs cursor-pointer transition-all hover:bg-white group"
              title="Your Green Points"
            >
              <span className="text-sm sm:text-base group-hover:scale-110 transition-transform">🌱</span>
              <div className="text-right flex items-baseline gap-1">
                <span className="font-bold text-[#2C4A3E] text-xs sm:text-sm tabular-nums leading-none">
                  {user?.green_points ?? 120}
                </span>
                <span className="text-[10px] text-[#8C857B] uppercase font-bold">
                  pts
                </span>
              </div>
            </div>

            {/* User Profile Quick Chip */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#E8EFEA] border-[#7C9D8E]/60 shadow-xs ring-1 ring-[#587B6C]'
                  : 'bg-white/90 border-[#E2DDD1] hover:border-[#7C9D8E]/40 hover:bg-white shadow-xs'
              }`}
              title="View & Edit Profile"
            >
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                alt={user?.name || 'User'}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-[#7C9D8E]/30"
              />
              <span className="font-bold text-xs text-[#2C4A3E] hidden xl:inline max-w-[90px] truncate">
                {user?.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>

            {/* Desktop Post Action Button */}
            <button
              onClick={onOpenUploadModal}
              className="hidden md:flex btn-sage items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider active:scale-95 shadow-sage cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post Action</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
