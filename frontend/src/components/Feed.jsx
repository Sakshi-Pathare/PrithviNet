import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, MapPin, Sparkles, Clock, Heart, 
  Share2, Users, TrendingUp, Leaf, Plus, Filter
} from 'lucide-react';
import { fetchFeed } from '../api';

export default function Feed({ user, onOpenUploadModal, onToast }) {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [cheeredPosts, setCheeredPosts] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      setIsLoading(true);
      try {
        const data = await fetchFeed({ sortBy, category: selectedCategory });
        if (isMounted) setPosts(data);
      } catch (err) {
        console.error('Error fetching feed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => { isMounted = false; };
  }, [sortBy, selectedCategory]);

  const handleCheer = (postId) => {
    setCheeredPosts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    onToast?.({ type: 'success', title: 'Action Cheered! 💚', message: 'You cheered on a neighbour\'s green effort!' });
  };

  const categories = [
    { id: 'all',              label: 'All Actions' },
    { id: 'Tree Planting',    label: '🌱 Tree Planting' },
    { id: 'Clean-up Drive',   label: '🧹 Clean-up' },
    { id: 'Solar Energy',     label: '☀️ Solar' },
    { id: 'Composting',       label: '🍂 Composting' },
    { id: 'Cycling / Walking',label: '🚲 Cycling' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-4 py-4 sm:py-8">

      {/* Hero Welcome Banner — Glassmorphism */}
      <div className="relative mb-5 sm:mb-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden glass-card border-0">
        {/* Ambient gradient blob */}
        <div className="absolute -top-10 -right-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-gradient-to-br from-[#7C9D8E]/20 to-[#587B6C]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 sm:w-40 h-36 sm:h-40 rounded-full bg-gradient-to-tr from-[#E8EFEA]/60 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm text-[#2C4A3E] text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 border border-[#7C9D8E]/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#587B6C] animate-pulse" />
              <span>Pune Community Stream</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-3xl text-[#2C4A3E] leading-tight">
              Real Actions.<br className="sm:hidden" />
              <span className="text-[#587B6C]"> Real Impact.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8C857B] mt-1.5 max-w-lg leading-relaxed">
              Verified eco-actions across Pune. Plant trees, clean trails, save CO₂, earn Green Points.
            </p>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="btn-sage w-full sm:w-auto shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-sage"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Share Real Proof</span>
          </button>
        </div>
      </div>

      {/* Filter Bar — Glassmorphism & Touch Friendly */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 mb-5 sm:mb-7 p-2 sm:p-3 rounded-2xl glass-card border-0 shadow-xs">

        {/* Sort Toggle */}
        <div className="flex items-center gap-1 bg-[#F5F2EB]/90 p-1 rounded-xl border border-[#E2DDD1]/60 text-xs backdrop-blur-sm shrink-0">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'impact', label: 'Top Impact', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
                sortBy === id
                  ? 'bg-white text-[#2C4A3E] font-bold shadow-xs'
                  : 'text-[#8C857B] hover:text-[#2C4A3E]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#587B6C]" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Category Chips Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none touch-pan-x">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#587B6C] text-white shadow-xs font-semibold'
                  : 'text-[#8C857B] hover:text-[#2C4A3E] hover:bg-[#F5F2EB]/80 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Stream */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-10 h-10 mb-3">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8EFEA]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin" />
          </div>
          <p className="text-[#8C857B] text-xs sm:text-sm">Loading community eco-actions…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 sm:py-16 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10">
          <div className="w-14 h-14 rounded-2xl bg-[#E8EFEA] flex items-center justify-center mx-auto mb-3 animate-float">
            <Leaf className="w-7 h-7 text-[#7C9D8E]" />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#2C4A3E] mb-1.5">No actions yet in this category</h3>
          <p className="text-xs sm:text-sm text-[#8C857B] max-w-md mx-auto mb-5 leading-relaxed">
            Take the lead! Snap a photo of your cleanup, tree planting, or composting and share it with your group.
          </p>
          <button
            onClick={onOpenUploadModal}
            className="btn-sage px-5 py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider"
          >
            + Post First Action
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post, i) => {
            const cheers = cheeredPosts[post.id] || 0;
            return (
              <article
                key={post.id}
                className="post-card rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="p-4 sm:p-6">
                  {/* Author row */}
                  <div className="flex items-start justify-between gap-2.5 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={post.user_avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.user_name}`}
                          alt={post.user_name}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border border-[#E2DDD1] shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#587B6C] border-2 border-white flex items-center justify-center text-[7px] text-white">✓</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display font-bold text-[#2C4A3E] text-xs sm:text-sm truncate">{post.user_name}</span>
                          {post.group_name && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm border border-[#7C9D8E]/25 text-[#2C4A3E] text-[10px] sm:text-[11px] font-medium flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
                              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#587B6C] shrink-0" />
                              <span className="truncate">{post.group_name}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8C857B] mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#587B6C] shrink-0" />
                          <span className="truncate">{post.location_name}</span>
                          <span>·</span>
                          <span className="shrink-0">{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Photo Check badge */}
                    <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl glass-card-sage text-[#2C4A3E] text-[11px] sm:text-xs font-semibold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
                      <span className="hidden xs:inline">Photo Checked</span>
                    </div>
                  </div>

                  {/* Photo Proof */}
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 border border-[#E2DDD1]/60 h-56 sm:h-72 md:h-80 bg-[#EFECE4] group">
                    <img
                      src={post.photo_url}
                      alt="Action Proof"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {/* Category pill */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.8 sm:px-3 sm:py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[11px] sm:text-xs font-semibold text-[#2C4A3E] flex items-center gap-1.5 shadow-xs">
                      <Leaf className="w-3 h-3 text-[#587B6C]" />
                      <span>{post.category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#2C4A3E] text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{post.description}</p>

                  {/* Impact metrics box */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F5F2EB]/80 to-[#E8EFEA]/50 border border-[#E2DDD1]/60 backdrop-blur-sm mb-3 sm:mb-4">
                    <div className="text-center">
                      <span className="text-[10px] sm:text-[11px] text-[#8C857B] block uppercase font-medium mb-0.5">CO₂ Offset</span>
                      <span className="text-[#2C4A3E] font-bold text-base sm:text-lg leading-tight">+{post.co2_saved_kg} <span className="text-xs font-normal">kg</span></span>
                    </div>
                    <div className="text-center border-l border-[#E2DDD1]/60">
                      <span className="text-[10px] sm:text-[11px] text-[#8C857B] block uppercase font-medium mb-0.5">Points Earned</span>
                      <span className="text-[#587B6C] font-bold text-base sm:text-lg leading-tight">+{post.points_awarded} <span className="text-xs">🌱</span></span>
                    </div>
                  </div>

                  {/* Card Footer: Cheer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2DDD1]/50 text-xs text-[#8C857B]">
                    <button
                      onClick={() => handleCheer(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-medium text-xs min-h-[36px] ${
                        cheers > 0
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1] active:scale-95'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-all ${cheers > 0 ? 'fill-red-500 scale-110' : ''}`} />
                      <span>Cheer {cheers > 0 ? `(${cheers})` : ''}</span>
                    </button>
                    <span className="text-[11px] text-[#8C857B] font-medium">Real-Action Proof ✓</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
