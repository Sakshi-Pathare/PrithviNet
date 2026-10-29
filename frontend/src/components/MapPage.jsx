import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Leaf, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Plus, 
  Clock, 
  ChevronRight,
  Compass
} from 'lucide-react';
import { fetchMapPoints } from '../api';

export default function MapPage({ onOpenUploadModal }) {
  const [points, setPoints] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePoint, setActivePoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    { id: 'all', label: 'All Community Actions' },
    { id: 'Tree Planting', label: '🌱 Tree Planting' },
    { id: 'Clean-up Drive', label: '🧹 Clean-up Drive' },
    { id: 'Solar Energy', label: '☀️ Solar Energy' },
    { id: 'Composting', label: '🍂 Composting' },
    { id: 'Cycling / Walking', label: '🚲 Clean Travel' }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-70px)] bg-[#EFECE4] overflow-hidden flex flex-col font-sans">
      
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2DDD1] pointer-events-auto shadow-sm max-w-full">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#587B6C] text-white shadow-sm'
                  : 'text-[#64786E] hover:text-[#2C4A3E] hover:bg-[#F5F2EB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Spot Button */}
        <button
          onClick={onOpenUploadModal}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#587B6C] hover:bg-[#48685A] text-white font-bold text-xs uppercase tracking-wider shadow-sage active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Spot</span>
        </button>

      </div>

      {/* Community Map Interactive Canvas with Earthy Tones */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        
        {/* Earthy Map Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#D6CEC2_1px,transparent_1px)] [background-size:26px_26px] opacity-75" />

        {/* Concentric rings in soft sage green */}
        <div className="absolute w-[560px] h-[560px] rounded-full border border-[#7C9D8E]/20 animate-ping" style={{ animationDuration: '9s' }} />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-[#7C9D8E]/30" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-[#7C9D8E]/35" />

        {/* Interactive Map Stage */}
        <div className="relative z-10 w-full max-w-5xl h-[500px] mx-auto p-4 flex flex-col justify-between">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/95 border border-[#E2DDD1] text-xs shadow-sm">
            <div className="flex items-center gap-2 text-[#2C4A3E] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#587B6C] animate-pulse" />
              <span>PUNE COMMUNITY GREEN MAP</span>
            </div>
            <span className="text-[#8C857B] font-medium">
              {points.length} Active Verified Action Spots
            </span>
          </div>

          {/* Interactive Spot Pins */}
          <div className="relative w-full h-[400px]">
            {points.map((pt, idx) => {
              const leftOffsets = ['22%', '45%', '68%', '80%', '34%', '58%'];
              const topOffsets = ['26%', '52%', '32%', '64%', '74%', '40%'];
              const leftPercent = leftOffsets[idx % leftOffsets.length];
              const topPercent = topOffsets[idx % topOffsets.length];
              const isSelected = activePoint?.id === pt.id;

              return (
                <div
                  key={pt.id}
                  style={{ left: leftPercent, top: topPercent }}
                  onClick={() => setActivePoint(pt)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    
                    {/* Soft sage ping ripple */}
                    <div className={`absolute w-10 h-10 rounded-full transition-all ${
                      isSelected ? 'bg-[#7C9D8E]/40 animate-ping' : 'bg-[#7C9D8E]/20 group-hover:bg-[#7C9D8E]/35'
                    }`} style={{ animationDuration: '3.5s' }} />

                    {/* Sage Green Pin */}
                    <div className={`w-10 h-10 rounded-2xl bg-white border-2 flex items-center justify-center transition-all shadow-md ${
                      isSelected 
                        ? 'border-[#587B6C] shadow-sage scale-125' 
                        : 'border-[#7C9D8E] hover:scale-110'
                    }`}>
                      <span className="text-base">🌱</span>
                    </div>

                    {/* Floating Spot Label */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                      <div className="px-3 py-1 rounded-xl bg-white border border-[#7C9D8E] text-xs font-semibold text-[#2C4A3E] whitespace-nowrap shadow-md">
                        {pt.location_name.split(',')[0]} • +{pt.co2_saved_kg}kg
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Selected Action Detail Card (Floating Cream Inspector) */}
      {activePoint && (
        <div className="absolute bottom-6 right-6 z-30 w-80 sm:w-96 rounded-3xl bg-white border border-[#E2DDD1] p-5 shadow-xl animate-in fade-in slide-in-from-bottom-3">
          
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2DDD1]">
            <span className="text-xs font-bold text-[#2C4A3E] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#587B6C]" />
              <span>PHOTO CHECK PASSED</span>
            </span>
            <button
              onClick={() => setActivePoint(null)}
              className="text-[#8C857B] hover:text-[#2C4A3E] text-xs font-semibold"
            >
              ✕ Close
            </button>
          </div>

          {/* Action Photo */}
          <div className="h-36 rounded-2xl overflow-hidden mb-3 border border-[#E2DDD1] relative bg-[#EFECE4]">
            <img 
              src={activePoint.photo_url} 
              alt={activePoint.title}
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[10px] text-[#2C4A3E] font-medium shadow-sm">
              {activePoint.category}
            </div>
          </div>

          <h3 className="font-display font-bold text-[#2C4A3E] text-base mb-1 line-clamp-1">
            {activePoint.location_name}
          </h3>
          <p className="text-xs text-[#64786E] mb-3 line-clamp-2 leading-relaxed">
            {activePoint.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-center p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5D9] mb-3">
            <div>
              <span className="text-[10px] text-[#8C857B] block uppercase font-medium">CO₂ Saved</span>
              <span className="text-[#2C4A3E] font-bold text-sm">
                +{activePoint.co2_saved_kg} kg CO₂
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8C857B] block uppercase font-medium">Points Awarded</span>
              <span className="text-[#587B6C] font-bold text-sm">
                +{activePoint.points_awarded} 🌱 Points
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8C857B] pt-2 border-t border-[#E2DDD1]">
            <span>By {activePoint.user_name}</span>
            <span className="text-[#2C4A3E] font-semibold">{activePoint.group_name}</span>
          </div>

        </div>
      )}

    </div>
  );
}
