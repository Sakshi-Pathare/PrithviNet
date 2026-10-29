import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Clock, 
  Heart, 
  Share2, 
  Users, 
  TrendingUp, 
  Leaf,
  Plus
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
        const data = await fetchFeed({
          sortBy,
          category: selectedCategory
        });
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
    setCheeredPosts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    onToast?.({
      type: 'success',
      title: 'Action Cheered! 💚',
      message: 'You cheered on a neighbor’s green effort!'
    });
  };

  const categories = [
    { id: 'all', label: 'All Actions' },
    { id: 'Tree Planting', label: '🌱 Tree Planting' },
    { id: 'Clean-up Drive', label: '🧹 Clean-up Drive' },
    { id: 'Solar Energy', label: '☀️ Solar Energy' },
    { id: 'Composting', label: '🍂 Composting' },
    { id: 'Cycling / Walking', label: '🚲 Cycling / Walking' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Friendly Community Welcome Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DDD1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFEA] text-[#2C4A3E] text-xs font-semibold mb-2 border border-[#7C9D8E]/30">
            <span>Pune Community Stream</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#2C4A3E]">
            Real Actions. Real Impact.
          </h1>
          <p className="text-sm text-[#8C857B] mt-1 max-w-lg leading-relaxed">
            See real environmental actions verified by neighbors across Pune. Clean up trails, plant trees, save CO₂, and earn Green Points.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="shrink-0 px-5 py-3 rounded-2xl bg-[#587B6C] hover:bg-[#48685A] text-white font-bold text-xs uppercase tracking-wider shadow-sage active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Share Proof</span>
        </button>
      </div>

      {/* Sorting & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 p-2.5 rounded-2xl bg-white border border-[#E2DDD1] shadow-sm">
        
        {/* Sort: Recent vs Top Impact */}
        <div className="flex items-center gap-1 bg-[#F5F2EB] p-1 rounded-xl border border-[#E2DDD1] text-xs">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              sortBy === 'recent'
                ? 'bg-white text-[#2C4A3E] font-bold shadow-sm'
                : 'text-[#8C857B] hover:text-[#2C4A3E]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#587B6C]" />
            <span>Recent</span>
          </button>

          <button
            onClick={() => setSortBy('impact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              sortBy === 'impact'
                ? 'bg-white text-[#2C4A3E] font-bold shadow-sm'
                : 'text-[#8C857B] hover:text-[#2C4A3E]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#587B6C]" />
            <span>Highest Impact</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#E8EFEA] text-[#2C4A3E] border border-[#7C9D8E] font-bold shadow-sm'
                  : 'text-[#8C857B] hover:text-[#2C4A3E] hover:bg-[#F5F2EB] border border-transparent'
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
          <div className="w-10 h-10 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin mb-3" />
          <p className="text-[#8C857B] text-sm">Loading community eco-actions...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E2DDD1] p-8 shadow-sm">
          <Leaf className="w-12 h-12 text-[#7C9D8E] mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-bold text-lg text-[#2C4A3E] mb-1">No actions in this category yet</h3>
          <p className="text-sm text-[#8C857B] max-w-md mx-auto mb-6">
            Take the lead! Snap a photo of your cleanup, tree planting, or composting and share it with your group.
          </p>
          <button
            onClick={onOpenUploadModal}
            className="px-6 py-2.5 rounded-2xl bg-[#587B6C] text-white font-bold text-xs uppercase tracking-wider shadow-sage"
          >
            + Post First Action
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const cheers = cheeredPosts[post.id] || 0;

            return (
              <article 
                key={post.id}
                className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                
                {/* Author & Group Information Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.user_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"} 
                      alt={post.user_name} 
                      className="w-11 h-11 rounded-2xl object-cover border border-[#E2DDD1] shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-[#2C4A3E] text-sm">
                          {post.user_name}
                        </span>
                        {post.group_name && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8EFEA] border border-[#7C9D8E]/30 text-[#2C4A3E] text-[11px] font-medium flex items-center gap-1">
                            <Users className="w-3 h-3 text-[#587B6C]" />
                            <span>{post.group_name}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8C857B] mt-0.5">
                        <span className="flex items-center gap-1 text-[#5C6E66]">
                          <MapPin className="w-3.5 h-3.5 text-[#587B6C]" />
                          <span>{post.location_name}</span>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Check Approved Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EFEA] border border-[#7C9D8E]/40 text-[#2C4A3E] text-xs font-semibold shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#587B6C]" />
                    <span className="hidden sm:inline">Photo Checked</span>
                    <span className="sm:hidden">Verified</span>
                  </div>
                </div>

                {/* Real-Action Photo Proof */}
                <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#E2DDD1] max-h-[400px] bg-[#EFECE4]">
                  <img 
                    src={post.photo_url} 
                    alt="Action Proof" 
                    className="w-full h-full object-cover"
                  />
                  {/* Category Pill Over Photo */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E2DDD1] text-xs font-semibold text-[#2C4A3E] flex items-center gap-1.5 shadow-sm">
                    <Leaf className="w-3.5 h-3.5 text-[#587B6C]" />
                    <span>{post.category}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#2C4A3E] text-sm sm:text-base leading-relaxed mb-4 font-normal">
                  {post.description}
                </p>

                {/* Action Impact & Earned Points Box */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE5D9] mb-4 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] text-[#8C857B] block uppercase font-medium">Estimated CO₂ Saved</span>
                    <span className="text-[#2C4A3E] font-bold text-base sm:text-lg">
                      +{post.co2_saved_kg} kg CO₂
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#8C857B] block uppercase font-medium">Green Points Earned</span>
                    <span className="text-[#587B6C] font-bold text-base sm:text-lg">
                      +{post.points_awarded} 🌱 Points
                    </span>
                  </div>
                </div>

                {/* Card Footer: Cheer & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD1] text-xs text-[#8C857B]">
                  <button
                    onClick={() => handleCheer(post.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5F2EB] hover:bg-[#E8EFEA] text-[#2C4A3E] border border-[#E2DDD1] hover:border-[#7C9D8E] transition-all font-medium shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${cheers > 0 ? 'fill-red-500 text-red-500' : 'text-[#8C857B]'}`} />
                    <span>Cheer {cheers > 0 ? `(${cheers})` : ''}</span>
                  </button>

                  <span className="text-xs text-[#8C857B]">
                    Real-Action Proof Approved
                  </span>
                </div>

              </article>
            );
          })}
        </div>
      )}

    </div>
  );
}
