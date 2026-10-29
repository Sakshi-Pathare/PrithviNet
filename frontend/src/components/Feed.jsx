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
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Hero Welcome Banner — Glassmorphism */}
      <div className="relative mb-8 p-7 sm:p-9 rounded-3xl overflow-hidden glass-card border-0">
        {/* Ambient gradient blob */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-gradient-to-br from-[#7C9D8E]/20 to-[#587B6C]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-tr from-[#E8EFEA]/60 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm text-[#2C4A3E] text-xs font-semibold mb-3 border border-[#7C9D8E]/30 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#587B6C] animate-pulse" />
              <span>Pune Community Stream</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2C4A3E] leading-tight">
              Real Actions.<br className="sm:hidden" />
              <span className="text-[#587B6C]"> Real Impact.</span>
            </h1>
            <p className="text-sm text-[#8C857B] mt-2 max-w-lg leading-relaxed">
              See verified eco-actions from neighbours across Pune. Plant trees, clean trails, save CO₂, earn Green Points.
            </p>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="btn-sage shrink-0 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Share Proof</span>
          </button>
        </div>
      </div>

      {/* Filter Bar — Glassmorphism */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-7 p-3 rounded-2xl glass-card border-0 shadow-sm">

        {/* Sort Toggle */}
        <div className="flex items-center gap-1 bg-[#F5F2EB]/80 p-1 rounded-xl border border-[#E2DDD1]/60 text-xs backdrop-blur-sm">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'impact', label: 'Top Impact', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                sortBy === id
                  ? 'bg-white text-[#2C4A3E] font-bold shadow-sm'
                  : 'text-[#8C857B] hover:text-[#2C4A3E]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#587B6C]" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-[#587B6C] text-white shadow-sm scale-105'
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
        <div className="flex flex-col items-center justify-center py-24">
          <div className="relative w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#E8EFEA]" />
            <div className="absolute inset-0 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin" />
          </div>
          <p className="text-[#8C857B] text-sm">Loading community eco-actions…</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-[#E8EFEA] flex items-center justify-center mx-auto mb-4 animate-float">
            <Leaf className="w-8 h-8 text-[#7C9D8E]" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#2C4A3E] mb-2">No actions yet in this category</h3>
          <p className="text-sm text-[#8C857B] max-w-md mx-auto mb-6 leading-relaxed">
            Take the lead! Snap a photo of your cleanup, tree planting, or composting and share it with your group.
          </p>
          <button
            onClick={onOpenUploadModal}
            className="btn-sage px-6 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider"
          >
            + Post First Action
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, i) => {
            const cheers = cheeredPosts[post.id] || 0;
            return (
              <article
                key={post.id}
                className="post-card rounded-3xl overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="p-6">
                  {/* Author row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={post.user_avatar || `https://api.dicebear.com/7.x/thumbs/svg?seed=${post.user_name}`}
                          alt={post.user_name}
                          className="w-11 h-11 rounded-2xl object-cover border border-[#E2DDD1] shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#587B6C] border-2 border-white flex items-center justify-center text-[8px]">✓</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-[#2C4A3E] text-sm">{post.user_name}</span>
                          {post.group_name && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm border border-[#7C9D8E]/25 text-[#2C4A3E] text-[11px] font-medium flex items-center gap-1">
                              <Users className="w-3 h-3 text-[#587B6C]" />
                              {post.group_name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#8C857B] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#587B6C]" />
                          <span>{post.location_name}</span>
                          <span>·</span>
                          <span>{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Photo Check badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card-sage text-[#2C4A3E] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
                      <span className="hidden sm:inline">Photo Checked</span>
                      <span className="sm:hidden">✓</span>
                    </div>
                  </div>

                  {/* Photo */}
                  <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#E2DDD1]/60 max-h-[380px] bg-[#EFECE4] group">
                    <img
                      src={post.photo_url}
                      alt="Action Proof"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Category pill */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 text-xs font-semibold text-[#2C4A3E] flex items-center gap-1.5 shadow-sm">
                      <Leaf className="w-3 h-3 text-[#587B6C]" />
                      {post.category}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#2C4A3E] text-sm leading-relaxed mb-4">{post.description}</p>

                  {/* Impact metrics glass box */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#F5F2EB]/80 to-[#E8EFEA]/50 border border-[#E2DDD1]/60 backdrop-blur-sm mb-4">
                    <div className="text-center">
                      <span className="text-[11px] text-[#8C857B] block uppercase font-medium mb-0.5">CO₂ Saved</span>
                      <span className="text-[#2C4A3E] font-bold text-lg leading-tight">+{post.co2_saved_kg} <span className="text-xs font-normal">kg</span></span>
                    </div>
                    <div className="text-center border-l border-[#E2DDD1]/60">
                      <span className="text-[11px] text-[#8C857B] block uppercase font-medium mb-0.5">Points Earned</span>
                      <span className="text-[#587B6C] font-bold text-lg leading-tight">+{post.points_awarded} <span className="text-xs">🌱</span></span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2DDD1]/50 text-xs text-[#8C857B]">
                    <button
                      onClick={() => handleCheer(post.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all duration-200 font-medium shadow-sm ${
                        cheers > 0
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1] hover:border-[#7C9D8E]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 transition-all ${cheers > 0 ? 'fill-red-500 scale-110' : ''}`} />
                      <span>Cheer {cheers > 0 ? `(${cheers})` : ''}</span>
                    </button>
                    <span className="text-[#8C857B] font-medium">Real-Action Proof ✓</span>
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
