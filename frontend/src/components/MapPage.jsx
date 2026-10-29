import React, { useState, useEffect } from 'react';
import { MapPin, Leaf, CheckCircle2, Users, Plus, Compass, ZoomIn, ZoomOut, X } from 'lucide-react';
import { fetchMapPoints } from '../api';

const CATEGORY_EMOJIS = {
  'Tree Planting': '🌱',
  'Clean-up Drive': '🧹',
  'Solar Energy': '☀️',
  'Composting': '🍂',
  'Cycling / Walking': '🚲',
};

const PIN_POSITIONS = [
  { left: '18%', top: '30%' }, { left: '42%', top: '20%' },
  { left: '68%', top: '35%' }, { left: '78%', top: '58%' },
  { left: '30%', top: '62%' }, { left: '55%', top: '70%' },
  { left: '12%', top: '72%' }, { left: '88%', top: '25%' },
];

export default function MapPage({ onOpenUploadModal }) {
  const [points, setPoints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePoint, setActivePoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function loadPoints() {
      setIsLoading(true);
      try {
        const data = await fetchMapPoints({ category: selectedCategory });
        if (isMounted) {
          setPoints(data);
          if (data.length > 0) setActivePoint(data[0]);
        }
      } catch (err) {
        console.error('Error fetching map points:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPoints();
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Spots' },
    { id: 'Tree Planting', label: '🌱 Trees' },
    { id: 'Clean-up Drive', label: '🧹 Clean-up' },
    { id: 'Solar Energy', label: '☀️ Solar' },
    { id: 'Composting', label: '🍂 Compost' },
    { id: 'Cycling / Walking', label: '🚲 Cycling' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-70px)] overflow-hidden map-canvas">

      {/* ── Map Grid Overlay ── */}
      <div className="absolute inset-0 map-grid opacity-100 pointer-events-none" />

      {/* ── Ambient Glow Orbs (deep teal atmosphere) ── */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#1F4040]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#162D2D]/60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0F2020]/30 blur-[80px] pointer-events-none" />

      {/* ── Concentric Range Rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[600, 420, 260, 140].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border border-[#7C9D8E]/10"
            style={{ width: size, height: size, opacity: 0.6 - i * 0.12 }}
          />
        ))}
        {/* Animated pulse ring */}
        <div className="absolute w-40 h-40 rounded-full border border-[#7C9D8E]/30"
          style={{ animation: 'map-ripple 3s ease-out infinite' }} />
        <div className="absolute w-40 h-40 rounded-full border border-[#7C9D8E]/20"
          style={{ animation: 'map-ripple 3s ease-out infinite 1.5s' }} />
      </div>

      {/* ── Scan Line Effect ── */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C9D8E]/25 to-transparent pointer-events-none"
        style={{ animation: 'scan-line 4s linear infinite' }}
      />

      {/* ── Top Filter Bar ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3">
        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-dark backdrop-blur-xl border border-[#7C9D8E]/20 max-w-full pointer-events-auto shadow-lg">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-[#7C9D8E] text-white shadow-sm scale-105'
                  : 'text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Zoom controls */}
          <div className="flex flex-col gap-1 glass-dark rounded-xl p-1 border border-[#7C9D8E]/20">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
              className="w-8 h-8 flex items-center justify-center text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/20 rounded-lg transition-all">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
              className="w-8 h-8 flex items-center justify-center text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/20 rounded-lg transition-all">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Add Spot */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-[#7C9D8E] hover:bg-[#8DAE9F] text-white shadow-[0_4px_16px_rgba(124,157,142,0.4)] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Spot</span>
          </button>
        </div>
      </div>

      {/* ── Eco-Action Pins ── */}
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {!isLoading && points.map((pt, idx) => {
          const pos = PIN_POSITIONS[idx % PIN_POSITIONS.length];
          const isSelected = activePoint?.id === pt.id;
          const emoji = CATEGORY_EMOJIS[pt.category] || '🌿';

          return (
            <div
              key={pt.id}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => setActivePoint(pt)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 map-pin"
            >
              {/* Ripple rings */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 w-14 h-14 -translate-x-1 -translate-y-1 rounded-full bg-[#7C9D8E]/20"
                    style={{ animation: 'map-ripple 2s ease-out infinite' }} />
                  <div className="absolute inset-0 w-14 h-14 -translate-x-1 -translate-y-1 rounded-full bg-[#7C9D8E]/15"
                    style={{ animation: 'map-ripple 2s ease-out infinite 1s' }} />
                </>
              )}

              {/* Pin body */}
              <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isSelected
                  ? 'bg-[#7C9D8E] shadow-[0_0_24px_rgba(124,157,142,0.7)] scale-125'
                  : 'bg-[#162D2D]/90 border border-[#7C9D8E]/40 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:bg-[#7C9D8E]/30 hover:scale-110 hover:border-[#7C9D8E]/70'
              }`}>
                <span className="text-lg leading-none">{emoji}</span>
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                <div className="px-3 py-1.5 rounded-xl glass-dark border border-[#7C9D8E]/30 text-xs font-semibold text-[#E8EFEA] whitespace-nowrap shadow-xl">
                  {pt.location_name?.split(',')[0]} · +{pt.co2_saved_kg}kg CO₂
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#162D2D]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Stats Bar ── */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-dark border border-[#7C9D8E]/20 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C9D8E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7C9D8E]" />
            </span>
            <span className="text-[#A8C4B8] text-xs font-bold uppercase tracking-wide">PUNE COMMUNITY MAP</span>
          </div>
          <div className="w-px h-4 bg-[#7C9D8E]/30" />
          <span className="text-[#7C9D8E] text-xs font-semibold">{points.length} Active Spots</span>
        </div>
      </div>

      {/* ── Selected Spot Inspector Card ── */}
      {activePoint && (
        <div className="absolute bottom-4 right-4 z-30 w-80 sm:w-96 rounded-3xl glass-dark border border-[#7C9D8E]/25 shadow-2xl overflow-hidden animate-slide-up">

          {/* Card header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#7C9D8E]/20">
            <span className="text-xs font-bold text-[#A8C4B8] flex items-center gap-1.5 uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7C9D8E]" />
              Photo Check Passed
            </span>
            <button
              onClick={() => setActivePoint(null)}
              className="text-[#7C9D8E] hover:text-white p-1 rounded-lg hover:bg-[#7C9D8E]/20 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={activePoint.photo_url}
              alt={activePoint.location_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2020]/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded-lg bg-[#162D2D]/80 backdrop-blur-md border border-[#7C9D8E]/30 text-[10px] font-semibold text-[#A8C4B8]">
              {activePoint.category}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <h3 className="font-display font-bold text-white text-base mb-0.5 line-clamp-1">{activePoint.location_name}</h3>
            <p className="text-xs text-[#7C9D8E] mb-3 line-clamp-2 leading-relaxed">{activePoint.description}</p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0F2020]/50 border border-[#7C9D8E]/15 mb-3">
              <div className="text-center">
                <span className="text-[10px] text-[#7C9D8E] uppercase block font-medium mb-0.5">CO₂ Saved</span>
                <span className="text-white font-bold text-sm">+{activePoint.co2_saved_kg} kg</span>
              </div>
              <div className="text-center border-l border-[#7C9D8E]/20">
                <span className="text-[10px] text-[#7C9D8E] uppercase block font-medium mb-0.5">Points</span>
                <span className="text-[#A8C4B8] font-bold text-sm">+{activePoint.points_awarded} 🌱</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7C9D8E] pt-2 border-t border-[#7C9D8E]/15">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {activePoint.user_name}
              </span>
              <span className="font-semibold text-[#A8C4B8]">{activePoint.group_name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
