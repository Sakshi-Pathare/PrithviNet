import React, { useState, useEffect } from 'react';
import { MapPin, Leaf, CheckCircle2, Users, Plus, ZoomIn, ZoomOut, X, Sparkles, Copy, Check } from 'lucide-react';
import { fetchMapPoints } from '../api';

const CATEGORY_EMOJIS = {
  'Tree Planting': '🌱',
  'Clean-up Drive': '🧹',
  'Solar Energy': '☀️',
  'Composting': '🍂',
  'Cycling / Walking': '🚲',
};

// 18 well-spaced node coordinates across the Pune map grid
const PIN_POSITIONS = [
  { left: '16%', top: '26%' },
  { left: '32%', top: '18%' },
  { left: '48%', top: '22%' },
  { left: '64%', top: '17%' },
  { left: '79%', top: '25%' },
  { left: '88%', top: '36%' },
  { left: '22%', top: '44%' },
  { left: '38%', top: '38%' },
  { left: '54%', top: '42%' },
  { left: '70%', top: '46%' },
  { left: '84%', top: '54%' },
  { left: '14%', top: '64%' },
  { left: '29%', top: '68%' },
  { left: '46%', top: '62%' },
  { left: '62%', top: '70%' },
  { left: '76%', top: '76%' },
  { left: '24%', top: '82%' },
  { left: '40%', top: '80%' },
];

const DEFAULT_ACTION_NODES = [
  {
    id: 1,
    action_code: 'PUN-TRE-001',
    category: 'Tree Planting',
    location_name: 'Alandi Riverbank, Pune',
    description: 'Planted 10 native neem and peepal saplings along Alandi riverbank with college classmates.',
    co2_saved_kg: 40.0,
    points_awarded: 100,
    user_name: 'Aarav Sharma',
    group_name: 'MITAOE Green Warriors',
    photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    action_code: 'PUN-CLN-002',
    category: 'Clean-up Drive',
    location_name: 'Koregaon Park Joggers Trail, Pune',
    description: 'Collected 4 large bags of plastic wrappers and discarded bottles near the park joggers trail.',
    co2_saved_kg: 12.5,
    points_awarded: 60,
    user_name: 'Rohan Mehta',
    group_name: 'Pune River Volunteers',
    photo_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    action_code: 'PUN-SOL-003',
    category: 'Solar Energy',
    location_name: 'Baner Bio-Park Area, Pune',
    description: 'Set up rooftop solar panels generating 5 clean units of power each afternoon.',
    co2_saved_kg: 45.0,
    points_awarded: 120,
    user_name: 'Priya Deshmukh',
    group_name: 'Alandi Solar Network',
    photo_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    action_code: 'PUN-COM-004',
    category: 'Composting',
    location_name: 'Viman Nagar Housing Society, Pune',
    description: 'Started apartment composting bin converting 25kg kitchen scraps into rich black soil.',
    co2_saved_kg: 15.0,
    points_awarded: 50,
    user_name: 'Amit Kulkarni',
    group_name: 'Green Leaf Composting Circle',
    photo_url: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    action_code: 'PUN-CYC-005',
    category: 'Cycling / Walking',
    location_name: 'FC Road to Shivajinagar, Pune',
    description: 'Organized a 12km cycle-to-college ride with 8 friends, leaving motorbikes at home.',
    co2_saved_kg: 8.5,
    points_awarded: 40,
    user_name: 'Aarav Sharma',
    group_name: 'MITAOE Green Warriors',
    photo_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    action_code: 'PUN-TRE-006',
    category: 'Tree Planting',
    location_name: 'Kothrud Hillside Green Belt, Pune',
    description: 'Planted 25 fruit trees and flowering shrubs along Kothrud hillside trail for bird biodiversity.',
    co2_saved_kg: 35.0,
    points_awarded: 85,
    user_name: 'Rohan Mehta',
    group_name: 'Green Leaf Circle',
    photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop'
  },
  {
    id: 7,
    action_code: 'PUN-CLN-007',
    category: 'Clean-up Drive',
    location_name: 'Pashan Lake Wetland, Pune',
    description: 'Cleared 6 bags of microplastics, snack packets, and glass bottles around Pashan wetland shores.',
    co2_saved_kg: 18.0,
    points_awarded: 70,
    user_name: 'Priya Deshmukh',
    group_name: 'Pune Clean River',
    photo_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    action_code: 'PUN-SOL-008',
    category: 'Solar Energy',
    location_name: 'Hinjewadi Phase 1 Tech Park, Pune',
    description: 'Installed a 3.5 kW micro solar pergola on IT office terrace powering all desk workstations.',
    co2_saved_kg: 55.0,
    points_awarded: 130,
    user_name: 'Amit Kulkarni',
    group_name: 'Alandi Solar Network',
    photo_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop'
  },
  {
    id: 9,
    action_code: 'PUN-COM-009',
    category: 'Composting',
    location_name: 'Kalyani Nagar Community Center, Pune',
    description: 'Built a two-bin aerobic compost pit converting neighborhood vegetable market organic waste.',
    co2_saved_kg: 22.0,
    points_awarded: 65,
    user_name: 'Aarav Sharma',
    group_name: 'Green Leaf Circle',
    photo_url: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop'
  },
  {
    id: 10,
    action_code: 'PUN-CYC-010',
    category: 'Cycling / Walking',
    location_name: 'Aundh DP Road Cycle Track, Pune',
    description: 'Morning community cycle caravan with 15 university students replacing car traffic on DP road.',
    co2_saved_kg: 14.0,
    points_awarded: 45,
    user_name: 'Rohan Mehta',
    group_name: 'MITAOE Green Warriors',
    photo_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop'
  },
  {
    id: 11,
    action_code: 'PUN-TRE-011',
    category: 'Tree Planting',
    location_name: 'Katraj Bio-Park Lake Shore, Pune',
    description: 'Planted 15 indigenous banyan and peepal cuttings to restore native tree canopy near lake border.',
    co2_saved_kg: 38.0,
    points_awarded: 95,
    user_name: 'Priya Deshmukh',
    group_name: 'MITAOE Green Warriors',
    photo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop'
  },
  {
    id: 12,
    action_code: 'PUN-CLN-012',
    category: 'Clean-up Drive',
    location_name: 'Sinhagad Foothills Trek Route, Pune',
    description: 'Weekend clean-up brigade collected 12 bags of trekker plastic waste along the hiking path.',
    co2_saved_kg: 24.0,
    points_awarded: 75,
    user_name: 'Amit Kulkarni',
    group_name: 'Pune Clean River',
    photo_url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop'
  },
  {
    id: 13,
    action_code: 'PUN-SOL-013',
    category: 'Solar Energy',
    location_name: 'Magarpatta City Tower B, Pune',
    description: 'Set up high-efficiency solar water heating and solar corridor lighting across residential towers.',
    co2_saved_kg: 62.0,
    points_awarded: 145,
    user_name: 'Aarav Sharma',
    group_name: 'Alandi Solar Network',
    photo_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop'
  },
  {
    id: 14,
    action_code: 'PUN-COM-014',
    category: 'Composting',
    location_name: 'Deccan Gymkhana Green Society, Pune',
    description: 'Zero-waste apartment club produced 120kg nutrient soil compost for society medicinal herb garden.',
    co2_saved_kg: 28.0,
    points_awarded: 70,
    user_name: 'Rohan Mehta',
    group_name: 'Green Leaf Circle',
    photo_url: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop'
  }
];

export default function MapPage({ onOpenUploadModal }) {
  const [points, setPoints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePoint, setActivePoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPoints() {
      setIsLoading(true);
      try {
        const data = await fetchMapPoints({ category: selectedCategory });
        if (isMounted) {
          let combined = data && data.length > 0 ? data : DEFAULT_ACTION_NODES;
          if (selectedCategory !== 'all') {
            combined = combined.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
          }
          const enriched = combined.map((p, idx) => ({
            ...p,
            action_code: p.action_code || `PUN-${(p.category?.substring(0,3) || 'ACT').toUpperCase()}-${String(p.id || idx + 1).padStart(3, '0')}`
          }));
          setPoints(enriched);
          if (enriched.length > 0) setActivePoint(enriched[0]);
        }
      } catch (err) {
        console.error('Error fetching map points, using local verified action nodes:', err);
        if (isMounted) {
          let fallback = DEFAULT_ACTION_NODES;
          if (selectedCategory !== 'all') {
            fallback = fallback.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));
          }
          setPoints(fallback);
          if (fallback.length > 0) setActivePoint(fallback[0]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadPoints();
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Action Codes' },
    { id: 'Tree Planting', label: '🌱 Trees' },
    { id: 'Clean-up Drive', label: '🧹 Clean-up' },
    { id: 'Solar Energy', label: '☀️ Solar' },
    { id: 'Composting', label: '🍂 Compost' },
    { id: 'Cycling / Walking', label: '🚲 Cycling' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-125px)] md:h-[calc(100vh-70px)] overflow-hidden map-canvas font-sans select-none">

      {/* ── Map Grid Overlay ── */}
      <div className="absolute inset-0 map-grid opacity-100 pointer-events-none" />

      {/* ── Ambient Deep Teal Atmosphere Glow ── */}
      <div className="absolute top-1/4 left-1/3 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#1F4040]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#162D2D]/60 blur-3xl pointer-events-none" />

      {/* ── Concentric Range Rings ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[580, 420, 260, 140].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border border-[#7C9D8E]/10"
            style={{ width: size, height: size, opacity: 0.6 - i * 0.12 }}
          />
        ))}
        {/* Animated pulse rings */}
        <div className="absolute w-40 h-40 rounded-full border border-[#7C9D8E]/30"
          style={{ animation: 'map-ripple 3s ease-out infinite' }} />
      </div>

      {/* ── Scan Line Effect ── */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C9D8E]/30 to-transparent pointer-events-none"
        style={{ animation: 'scan-line 4s linear infinite' }}
      />

      {/* ── Top Responsive Filter Bar ── */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Category & Code Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-dark backdrop-blur-xl border border-[#7C9D8E]/20 max-w-[calc(100%-88px)] sm:max-w-none pointer-events-auto shadow-lg scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#7C9D8E] text-white shadow-xs font-bold'
                  : 'text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Zoom Controls & Quick Action */}
        <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
          <div className="flex flex-col gap-0.5 glass-dark rounded-xl p-0.5 border border-[#7C9D8E]/20 shadow-md">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 1.8))}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/25 rounded-lg transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.7))}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#A8C4B8] hover:text-white hover:bg-[#7C9D8E]/25 rounded-lg transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Eco-Action Map Nodes / Action Codes ── */}
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
              key={pt.id || idx}
              style={{ left: pos.left, top: pos.top }}
              onClick={() => setActivePoint(pt)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 map-pin"
            >
              {/* Ripple on active/selected node */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 w-14 h-14 -translate-x-2 -translate-y-2 rounded-full bg-[#7C9D8E]/25"
                    style={{ animation: 'map-ripple 2s ease-out infinite' }} />
                </>
              )}

              {/* Pin Node Capsule */}
              <div className={`relative flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-2xl transition-all duration-300 shadow-md ${
                isSelected
                  ? 'bg-gradient-to-r from-[#7C9D8E] to-[#587B6C] text-white shadow-[0_0_20px_rgba(124,157,142,0.8)] scale-115 border border-white/60'
                  : 'bg-[#162D2D]/90 border border-[#7C9D8E]/40 text-[#E8EFEA] hover:bg-[#1E3B3B] hover:scale-110'
              }`}>
                <span className="text-xs sm:text-sm leading-none">{emoji}</span>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-tight opacity-90 hidden sm:inline">
                  {pt.action_code?.split('-').slice(1).join('-') || `ACT-${idx + 1}`}
                </span>
              </div>

              {/* Hover Tooltip (Desktop) */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30 hidden sm:block">
                <div className="px-3 py-1.5 rounded-xl glass-dark border border-[#7C9D8E]/40 text-xs font-semibold text-[#E8EFEA] whitespace-nowrap shadow-xl flex items-center gap-1.5">
                  <span className="font-mono text-[#A8C4B8] text-[10px]">{pt.action_code}</span>
                  <span>·</span>
                  <span>{pt.location_name?.split(',')[0]}</span>
                  <span>·</span>
                  <span className="text-[#00FF66]">+{pt.co2_saved_kg}kg</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#162D2D]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Grid Indicator (Desktop only to keep mobile clean) ── */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:block">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl glass-dark border border-[#7C9D8E]/20 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C9D8E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C9D8E]" />
            </span>
            <span className="text-[#A8C4B8] text-[11px] font-bold uppercase tracking-wider">PUNE GREEN GRID</span>
          </div>
          <div className="w-px h-3.5 bg-[#7C9D8E]/30" />
          <span className="text-[#7C9D8E] text-[11px] font-semibold font-mono">{points.length} ACTIVE CODES</span>
        </div>
      </div>

      {/* ── PHOTO CHECK PASS INSPECTOR: RESPONSIVE WARM BEIGE CARD (FLOATING ON MOBILE & DESKTOP) ── */}
      {activePoint && (
        <div
          className="absolute z-30 w-[calc(100%-1.5rem)] left-3 right-3 bottom-[68px] sm:left-auto sm:right-6 sm:w-96 sm:bottom-[64px] max-h-[70vh] sm:max-h-[80vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-[#DFD3C3] shadow-[0_16px_40px_rgba(40,30,20,0.25)] animate-slide-up"
          style={{
            background: 'linear-gradient(145deg, #FAF4EC 0%, #F5ECE0 55%, #EFE3D3 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Card Header — Photo Check Pass & Verification Code */}
          <div className="flex items-center justify-between px-4 sm:px-5 pt-3.5 pb-2.5 border-b border-[#DFD3C3]/80">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.8 sm:py-1 rounded-xl bg-[#E6EFE9] border border-[#7C9D8E]/40 text-[#2C4A3E] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
                Photo Check Passed
              </span>
              {/* Action Code Pill */}
              <button
                onClick={() => copyCode(activePoint.action_code)}
                className="flex items-center gap-1 px-2 py-0.8 rounded-lg bg-[#EAE0D2] border border-[#D8C7B2] text-[#4A3C2D] font-mono text-[10px] font-bold hover:bg-[#DFD3C3] transition-colors"
                title="Click to copy code"
              >
                <span>{activePoint.action_code}</span>
                {codeCopied ? <Check className="w-3 h-3 text-[#2C4A3E]" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
              </button>
            </div>

            <button
              onClick={() => setActivePoint(null)}
              className="text-[#8C7A68] hover:text-[#2C4A3E] hover:bg-[#EAE0D2] p-1.5 rounded-xl transition-all"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Real Photo Proof Frame */}
          <div className="relative h-36 sm:h-40 overflow-hidden border-b border-[#DFD3C3]/70 bg-[#E8DDD0]">
            <img
              src={activePoint.photo_url}
              alt={activePoint.location_name}
              className="w-full h-full object-cover"
            />
            {/* Soft gradient bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            
            {/* Category Tag on Photo */}
            <div className="absolute bottom-2.5 left-3 px-2.5 py-0.5 rounded-lg bg-[#FAF5EE]/95 backdrop-blur-md border border-[#DFD3C3] text-[10px] font-bold text-[#2C4A3E] shadow-xs flex items-center gap-1">
              <span>{CATEGORY_EMOJIS[activePoint.category] || '🌿'}</span>
              <span>{activePoint.category}</span>
            </div>
          </div>

          {/* Body Information */}
          <div className="px-4 sm:px-5 py-3 sm:py-4">
            <h3 className="font-display font-bold text-[#2C4A3E] text-sm sm:text-base line-clamp-1 mb-1">
              {activePoint.location_name}
            </h3>

            <p className="text-xs text-[#5E5142] mb-3 line-clamp-2 leading-relaxed">
              {activePoint.description}
            </p>

            {/* Impact & Points Metric Box in Warm Skin-Beige */}
            <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#EDE2D4]/80 border border-[#DCCEC0] mb-3 text-center">
              <div>
                <span className="text-[9px] sm:text-[10px] text-[#8C7A68] uppercase block font-semibold mb-0.5">CO₂ Offset</span>
                <span className="text-[#2C4A3E] font-bold text-xs sm:text-sm">
                  +{activePoint.co2_saved_kg} kg
                </span>
              </div>
              <div className="border-l border-[#DCCEC0]">
                <span className="text-[9px] sm:text-[10px] text-[#8C857B] uppercase block font-semibold mb-0.5">Points Awarded</span>
                <span className="text-[#3E6C5A] font-bold text-xs sm:text-sm">
                  +{activePoint.points_awarded} 🌱
                </span>
              </div>
            </div>

            {/* Contributor and Community Group Footer */}
            <div className="flex items-center justify-between text-xs text-[#7A6B5C] pt-2 border-t border-[#DFD3C3]/70">
              <span className="flex items-center gap-1 font-medium truncate max-w-[130px]">
                <Users className="w-3.5 h-3.5 text-[#587B6C] shrink-0" />
                <span className="truncate">{activePoint.user_name}</span>
              </span>
              <span className="font-semibold text-[#2C4A3E] max-w-[150px] truncate text-right">
                {activePoint.group_name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
