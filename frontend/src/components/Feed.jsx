import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, MapPin, Sparkles, Clock, Heart, 
  Share2, Users, TrendingUp, Leaf, Plus, MessageSquare, Send,
  Bookmark
} from 'lucide-react';
import { fetchFeed, togglePostLike, togglePostBookmark, addPostComment } from '../api';
import ShareModal from './ShareModal';

const STORIES = [
  {
    id: 's0',
    title: 'Your Story',
    user_name: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
    caption: 'Planting native neem saplings along Alandi riverbank today!',
    isAdd: true
  },
  {
    id: 's1',
    title: 'River Cleanup',
    user_name: 'Pune Clean Air',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop',
    caption: 'Collected 40kg plastic waste from Indrayani banks this morning!'
  },
  {
    id: 's2',
    title: 'Solar Drive',
    user_name: 'Alandi Solar',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop',
    caption: 'New 5kW rooftop solar installed in Baner bio-zone!'
  },
  {
    id: 's3',
    title: 'Compost Club',
    user_name: 'Green Leaf',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop',
    caption: 'Batch #12 of pure organic black gold ready for kitchen gardens.'
  },
  {
    id: 's4',
    title: 'Metro Commute',
    user_name: 'Eco Commuters',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop',
    caption: 'Zero motorbike day! 14 students rode Pune Metro together.'
  }
];

export default function Feed({ user, onOpenUploadModal, onToast, setActiveTab, newlyCreatedPost }) {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentInputs, setNewCommentInputs] = useState({});
  const [shareModalPost, setShareModalPost] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [doubleTapHeart, setDoubleTapHeart] = useState({});
  const lastTapRef = useRef({});

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      setIsLoading(true);
      try {
        const data = await fetchFeed({ sortBy, category: selectedCategory });
        if (isMounted) {
          if (newlyCreatedPost) {
            setPosts([newlyCreatedPost, ...data.filter(p => p.id !== newlyCreatedPost.id)]);
          } else {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error('Error fetching feed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => { isMounted = false; };
  }, [sortBy, selectedCategory]);

  useEffect(() => {
    if (newlyCreatedPost) {
      setPosts(prev => {
        const exists = prev.some(p => p.id === newlyCreatedPost.id);
        if (exists) return prev;
        return [newlyCreatedPost, ...prev];
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [newlyCreatedPost]);

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const wasLiked = p.is_liked;
        return {
          ...p,
          is_liked: !wasLiked,
          likes_count: Math.max(0, (p.likes_count || 0) + (wasLiked ? -1 : 1))
        };
      }
      return p;
    }));

    try {
      const res = await togglePostLike(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_liked: res.liked, likes_count: res.likes_count } : p));
      if (res.liked) {
        onToast?.({ type: 'success', title: 'Action Cheered! 💚', message: 'You supported a neighbour\'s eco-action!' });
      }
    } catch (err) {
      onToast?.({ type: 'info', title: 'Sign In to Cheer', message: err.message || 'Please sign in to cheer posts.' });
    }
  };

  const handleDoubleTap = (postId) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[postId] || 0;
    if (now - lastTap < 300) {
      setDoubleTapHeart(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setDoubleTapHeart(prev => ({ ...prev, [postId]: false }));
      }, 900);

      const targetPost = posts.find(p => p.id === postId);
      if (targetPost && !targetPost.is_liked) {
        handleLike(postId);
      }
    }
    lastTapRef.current[postId] = now;
  };

  const handleBookmark = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, is_bookmarked: !p.is_bookmarked };
      }
      return p;
    }));

    try {
      const res = await togglePostBookmark(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_bookmarked: res.bookmarked } : p));
      onToast?.({
        type: 'success',
        title: res.bookmarked ? 'Saved to Bookmarks! 📌' : 'Removed from Bookmarks',
        message: res.bookmarked ? 'You can view this proof anytime from your profile.' : 'Bookmark removed.'
      });
    } catch (err) {
      onToast?.({ type: 'info', title: 'Sign In to Save', message: err.message });
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId) => {
    const text = newCommentInputs[postId]?.trim();
    if (!text) return;

    const tempComment = {
      id: `c_${Date.now()}`,
      post_id: postId,
      user_id: user?.id || 1,
      user_name: user?.name || 'You',
      user_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      text,
      created_at: new Date().toISOString()
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const comments = p.latest_comments || [];
        return {
          ...p,
          comments_count: (p.comments_count || 0) + 1,
          latest_comments: [...comments, tempComment]
        };
      }
      return p;
    }));
    setNewCommentInputs(prev => ({ ...prev, [postId]: '' }));

    try {
      const savedComment = await addPostComment(postId, text);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const list = (p.latest_comments || []).filter(c => c.id !== tempComment.id);
          return { ...p, latest_comments: [...list, savedComment] };
        }
        return p;
      }));
      onToast?.({
        type: 'success',
        title: 'Comment Shared! 💬',
        message: 'Your support inspires our Pune community to keep going green.'
      });
    } catch (err) {
      onToast?.({ type: 'info', title: 'Note', message: err.message || 'Comment recorded.' });
    }
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

      {/* Instagram-Style Stories Tray */}
      <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-2xl glass-card border-0 shadow-xs overflow-hidden">
        <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none pb-1 touch-pan-x">
          {STORIES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (s.isAdd) {
                  onOpenUploadModal();
                } else {
                  setActiveStory(s);
                }
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group cursor-pointer"
            >
              <div className="relative">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                  s.isAdd 
                    ? 'border-2 border-dashed border-[#587B6C]' 
                    : 'bg-gradient-to-tr from-emerald-500 via-[#587B6C] to-lime-400 shadow-xs'
                }`}>
                  <img
                    src={s.isAdd && user?.avatar_url ? user.avatar_url : s.avatar}
                    alt={s.title}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                {s.isAdd && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#587B6C] text-white flex items-center justify-center border-2 border-white text-xs font-bold shadow-xs">
                    +
                  </div>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-[#2C4A3E] max-w-[64px] truncate text-center">
                {s.isAdd ? 'Your Action' : s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Welcome Banner — Glassmorphism */}
      <div className="relative mb-5 sm:mb-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden glass-card border-0">
        <div className="absolute -top-10 -right-10 w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-gradient-to-br from-[#7C9D8E]/20 to-[#587B6C]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 sm:w-40 h-36 sm:h-40 rounded-full bg-gradient-to-tr from-[#E8EFEA]/60 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#E8EFEA]/80 backdrop-blur-sm text-[#2C4A3E] text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3 border border-[#7C9D8E]/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#587B6C] animate-pulse" />
              <span>Pune Community Stream · Supabase Live</span>
            </div>
            <h1 className="font-display font-bold text-xl sm:text-3xl text-[#2C4A3E] leading-tight">
              Real Actions.<br className="sm:hidden" />
              <span className="text-[#587B6C]"> Real Impact.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8C857B] mt-1.5 max-w-lg leading-relaxed">
              Real-time environmental social network for Pune. Plant trees, clean trails, save CO₂, earn Green Points.
            </p>
          </div>
          <button
            onClick={onOpenUploadModal}
            className="btn-sage w-full sm:w-auto shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 shadow-sage cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Share Real Proof</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 mb-5 sm:mb-7 p-2 sm:p-3 rounded-2xl glass-card border-0 shadow-xs">
        <div className="flex items-center gap-1 bg-[#F5F2EB]/90 p-1 rounded-xl border border-[#E2DDD1]/60 text-xs backdrop-blur-sm shrink-0">
          {[
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'impact', label: 'Top Impact', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSortBy(id)}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs cursor-pointer ${
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

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none touch-pan-x">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
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
          <p className="text-[#8C857B] text-xs sm:text-sm">Connecting to Supabase stream…</p>
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
            className="btn-sage px-5 py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            + Post First Action
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post, i) => {
            const likesCount = post.likes_count || 0;
            const isLiked = Boolean(post.is_liked);
            const isBookmarked = Boolean(post.is_bookmarked);
            const postComments = post.latest_comments || [];
            const commentsCount = post.comments_count || postComments.length;
            const isCommentsOpen = Boolean(expandedComments[post.id]);
            const isJustAdded = newlyCreatedPost && newlyCreatedPost.id === post.id;
            const showHeartBurst = Boolean(doubleTapHeart[post.id]);

            return (
              <article
                key={post.id}
                className={`post-card rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ${
                  isJustAdded ? 'ring-2 ring-[#587B6C] shadow-lg animate-in fade-in slide-in-from-top-4' : ''
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="p-4 sm:p-6">
                  {/* Author Header */}
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
                          {isJustAdded && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                              Just Shared
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8C857B] mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#587B6C]" />
                          <span className="truncate">{post.location_name}</span>
                          <span>·</span>
                          <span className="shrink-0">{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl glass-card-sage text-[#2C4A3E] text-[11px] sm:text-xs font-semibold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#587B6C]" />
                      <span className="hidden xs:inline">Photo Checked</span>
                    </div>
                  </div>

                  {/* Photo Proof with Instagram Double-Tap to Like */}
                  <div 
                    onClick={() => handleDoubleTap(post.id)}
                    className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 border border-[#E2DDD1]/60 h-64 sm:h-80 md:h-96 bg-[#EFECE4] group cursor-pointer select-none"
                  >
                    <img
                      src={post.photo_url}
                      alt="Action Proof"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />

                    {/* Instagram Pulsating Heart Animation on Double-Tap */}
                    {showHeartBurst && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <Heart className="w-24 h-24 text-red-500 fill-red-500 animate-ping opacity-90 drop-shadow-2xl" />
                      </div>
                    )}

                    {/* Category pill */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.8 sm:px-3 sm:py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[11px] sm:text-xs font-semibold text-[#2C4A3E] flex items-center gap-1.5 shadow-xs">
                      <Leaf className="w-3 h-3 text-[#587B6C]" />
                      <span>{post.category}</span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/40 text-white text-[10px] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Double-tap to cheer ❤️
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

                  {/* Social Action Bar: Cheer (Heart), Comment, Share, Bookmark */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2DDD1]/50 text-xs text-[#8C857B]">
                    <div className="flex items-center gap-2">
                      {/* Cheer button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-medium text-xs min-h-[36px] cursor-pointer ${
                          isLiked
                            ? 'bg-red-50 border-red-200 text-red-500 shadow-xs'
                            : 'bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1] active:scale-95'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                        <span>Cheer {likesCount > 0 ? `(${likesCount})` : ''}</span>
                      </button>

                      {/* Comment toggle button */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-200 font-medium text-xs min-h-[36px] cursor-pointer ${
                          isCommentsOpen
                            ? 'bg-[#E8EFEA] border-[#7C9D8E]/40 text-[#2C4A3E]'
                            : 'bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1] active:scale-95'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-[#587B6C]" />
                        <span>Comments {commentsCount > 0 ? `(${commentsCount})` : ''}</span>
                      </button>

                      {/* Share modal trigger */}
                      <button
                        onClick={() => setShareModalPost(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1] active:scale-95 transition-all cursor-pointer min-h-[36px]"
                        title="Share this action"
                      >
                        <Share2 className="w-4 h-4 text-[#587B6C]" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>

                    {/* Bookmark action */}
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isBookmarked 
                          ? 'bg-[#587B6C] text-white border-[#587B6C] shadow-xs' 
                          : 'bg-[#F5F2EB]/80 hover:bg-[#E8EFEA] text-[#2C4A3E] border-[#E2DDD1]'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save action'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Expandable Comments Drawer */}
                  {isCommentsOpen && (
                    <div className="mt-3.5 pt-3.5 border-t border-[#E2DDD1]/50 space-y-3 animate-in fade-in">
                      {/* Comments List */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {postComments.length === 0 ? (
                          <p className="text-xs text-[#8C857B] italic py-1">No comments yet. Be the first to leave a cheer or encouraging message!</p>
                        ) : (
                          postComments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F5F2EB]/60 border border-[#E2DDD1]/50 text-xs">
                              <img
                                src={c.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop'}
                                alt={c.user_name}
                                className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-bold text-[#2C4A3E] text-[11px]">{c.user_name}</span>
                                  <span className="text-[10px] text-[#8C857B]">
                                    {c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                                  </span>
                                </div>
                                <p className="text-[#3B4D45] text-xs leading-relaxed">{c.text}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment Input Form */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newCommentInputs[post.id] || ''}
                          onChange={(e) => setNewCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Write a message of support..."
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2DDD1] text-xs text-[#2C4A3E] focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 rounded-xl bg-[#2C4A3E] hover:bg-[#587B6C] text-white transition-colors cursor-pointer shrink-0"
                          title="Send comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={Boolean(shareModalPost)}
        onClose={() => setShareModalPost(null)}
        post={shareModalPost}
        onToast={onToast}
      />

      {/* Story View Modal */}
      {activeStory && (
        <div 
          onClick={() => setActiveStory(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm w-full bg-[#1A2621] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
          >
            {/* Top progress bar */}
            <div className="absolute top-3 left-3 right-3 h-1 bg-white/30 rounded-full overflow-hidden z-20">
              <div className="h-full bg-white animate-[pulse_3s_ease-in-out_infinite]" />
            </div>

            {/* Story Header */}
            <div className="absolute top-6 left-3 right-3 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.user_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <p className="text-white font-bold text-xs">{activeStory.user_name}</p>
                  <p className="text-white/70 text-[10px]">{activeStory.title}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm font-bold hover:bg-black/60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Story Image */}
            <div className="relative h-96 w-full bg-black">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            {/* Story Caption */}
            <div className="p-4 bg-[#1A2621] text-white">
              <p className="text-xs leading-relaxed text-white/90">{activeStory.caption}</p>
              <button
                onClick={() => {
                  setActiveStory(null);
                  onOpenUploadModal();
                }}
                className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                🌱 Join This Action Drive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}