import React from 'react';
import { Flame, Compass, Users, ShoppingBag, Plus, User } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, onOpenUploadModal }) {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E2DDD1]/80 shadow-[0_-4px_24px_rgba(44,74,62,0.12)] px-2 py-1.5 flex items-center justify-around safe-area-pb select-none"
    >
      {/* Tab 1: Feed */}
      <button
        type="button"
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
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
        type="button"
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
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
      <div className="relative flex flex-col items-center justify-center -translate-y-3 px-1">
        <div className="absolute w-12 h-12 rounded-full bg-[#587B6C] opacity-30 animate-pulse-ring pointer-events-none" />
        <button
          type="button"
          onClick={onOpenUploadModal}
          className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#587B6C] to-[#7C9D8E] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(88,123,108,0.45)] border-2 border-white active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label="Post Eco-Action"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
        <span className="text-[9px] font-bold text-[#587B6C] uppercase tracking-wider mt-0.5">
          Post
        </span>
      </div>

      {/* Tab 3: Rewards / Perks */}
      <button
        type="button"
        onClick={() => setActiveTab('rewards')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
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

      {/* Tab 4: Profile */}
      <button
        type="button"
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-all cursor-pointer ${
          activeTab === 'profile' ? 'text-[#2C4A3E]' : 'text-[#8C857B] hover:text-[#2C4A3E]'
        }`}
      >
        <div className={`p-1 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-[#E8EFEA] text-[#587B6C]' : ''}`}>
          <User className="w-5 h-5" />
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${activeTab === 'profile' ? 'font-bold text-[#2C4A3E]' : 'font-medium'}`}>
          Profile
        </span>
      </button>
    </nav>
  );
}

