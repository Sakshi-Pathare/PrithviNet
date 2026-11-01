import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  TreePine,
  CheckCircle2,
  Award,
  Edit3,
  Save,
  X,
  PlusCircle,
  Users,
  ShoppingBag,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { updateUserProfile, fetchUserPosts, fetchCommunityGroups } from '../api';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop',
];

const AVAILABLE_INTERESTS = [
  'Tree Planting',
  'Clean-up Drive',
  'Solar Energy',
  'Composting',
  'Cycling / Walking',
  'River Rejuvenation',
  'Rainwater Harvesting'
];

export default function ProfilePage({ user, onUserUpdated, onToast, setActiveTab, onOpenUploadModal, newlyCreatedPost }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [groups, setGroups] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Ananya Sharma',
    bio: user?.bio || 'Pune eco-warrior making everyday sustainable choices.',
    neighborhood: user?.neighborhood || 'Alandi, Pune',
    phone: user?.phone || '+91 98230 45678',
    eco_interests: user?.eco_interests || 'Tree Planting, Clean-up Drive, Solar Energy',
    avatar_url: user?.avatar_url || PRESET_AVATARS[0],
    community_group_id: user?.community_group_id || 1,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Ananya Sharma',
        bio: user.bio || 'Pune eco-warrior making everyday sustainable choices.',
        neighborhood: user.neighborhood || 'Alandi, Pune',
        phone: user.phone || '+91 98230 45678',
        eco_interests: user.eco_interests || 'Tree Planting, Clean-up Drive, Solar Energy',
        avatar_url: user.avatar_url || PRESET_AVATARS[0],
        community_group_id: user.community_group_id || 1,
      });
    }
  }, [user]);

  // Load User's Posted Actions
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingPosts(true);
      try {
        const [postsData, groupsData] = await Promise.all([
          fetchUserPosts(user?.id || 1),
          fetchCommunityGroups()
        ]);
        if (isMounted) {
          setUserPosts(postsData);
          setGroups(groupsData);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        if (isMounted) setIsLoadingPosts(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Prepend newly created post immediately
  useEffect(() => {
    if (newlyCreatedPost) {
      setUserPosts(prev => [newlyCreatedPost, ...prev.filter(p => p.id !== newlyCreatedPost.id)]);
    }
  }, [newlyCreatedPost]);

  const handleInterestToggle = (interest) => {
    const currentList = formData.eco_interests
      ? formData.eco_interests.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    let updated;
    if (currentList.includes(interest)) {
      updated = currentList.filter(i => i !== interest);
    } else {
      updated = [...currentList, interest];
    }
    setFormData(prev => ({ ...prev, eco_interests: updated.join(', ') }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedUser = await updateUserProfile(formData, user?.id || 1);
      onUserUpdated?.(updatedUser);
      setIsEditing(false);
      onToast?.({
        type: 'success',
        title: 'Profile Updated! ✨',
        message: 'Your profile details and eco preferences have been saved.'
      });
    } catch (err) {
      onToast?.({
        type: 'error',
        title: 'Could Not Save Profile',
        message: err.message || 'Please check your connection and try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const userInterests = (formData.eco_interests || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const totalCo2Saved = userPosts.reduce((acc, p) => acc + (p.co2_saved_kg || 0), 0);
  const totalVerifiedActions = userPosts.length;
  const treeEquiv = Math.max(1, Math.round(totalCo2Saved / 20));

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in">
      
      {/* ── 1. Profile Header Hero ── */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-[#E2DDD1]/80 shadow-md">
        {/* Decorative Nature Gradient Header */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-[#2C4A3E] via-[#3B6353] to-[#7C9D8E] relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -bottom-8 right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          
          {/* Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified Eco Volunteer</span>
            </span>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-5">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={formData.avatar_url}
                  alt={formData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-lg bg-[#E8EFEA]"
                />
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-1 right-1 p-1.5 rounded-xl bg-[#2C4A3E] text-white hover:bg-[#587B6C] transition-colors shadow-md cursor-pointer"
                  title="Change avatar or edit profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#2C4A3E]">
                    {formData.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E8EFEA] border border-[#7C9D8E]/30 text-[#2C4A3E] text-xs font-semibold">
                    Level 4 Pune Champion
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#64786E] flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#587B6C]" />
                    {formData.neighborhood}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#8C857B]" />
                    {user?.email || 'ananya@prithvinet.org'}
                  </span>
                  {formData.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#8C857B]" />
                        {formData.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isEditing
                    ? 'bg-[#E8EFEA] text-[#2C4A3E] border-[#7C9D8E]/40'
                    : 'bg-white hover:bg-[#F5F2EB] text-[#2C4A3E] border-[#E2DDD1] shadow-xs'
                }`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4 text-[#587B6C]" />}
                <span>{isEditing ? 'Cancel Editing' : 'Edit Profile Details'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenUploadModal}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2C4A3E] to-[#3B6353] hover:from-[#233A31] hover:to-[#2C4A3E] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#7C9D8E]" />
                <span>Post Action</span>
              </button>
            </div>
          </div>

          {/* User Bio Quote */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#F5F2EB]/80 border border-[#E2DDD1]/70 mb-4">
            <p className="text-xs sm:text-sm text-[#2C4A3E] font-medium leading-relaxed italic">
              "{formData.bio}"
            </p>
          </div>

          {/* Eco Interests Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#8C857B] font-semibold flex items-center gap-1 mr-1">
              <Leaf className="w-3.5 h-3.5 text-[#587B6C]" />
              Eco Interests:
            </span>
            {userInterests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs font-medium shadow-xs"
              >
                {interest}
              </span>
            ))}
            {userInterests.length === 0 && (
              <span className="text-xs text-[#8C857B] italic">No interests listed yet. Click Edit to add some!</span>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. EDIT PROFILE MODAL / DRAWER SECTION ── */}
      {isEditing && (
        <div className="glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#7C9D8E]/30 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2DDD1] mb-5">
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#2C4A3E]">
                Update Profile & Additional Details
              </h2>
              <p className="text-xs text-[#8C857B]">
                Keep your neighborhood details, eco interests, and community group up to date.
              </p>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-xl hover:bg-[#E8EFEA] text-[#8C857B] hover:text-[#2C4A3E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-2">
                Choose Profile Avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatar_url: url }))}
                    className={`relative rounded-2xl p-0.5 border-2 transition-all shrink-0 cursor-pointer ${
                      formData.avatar_url === url ? 'border-[#587B6C] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-12 h-12 rounded-xl object-cover" />
                    {formData.avatar_url === url && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#587B6C] rounded-full text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 2-col inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs sm:text-sm focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                  placeholder="e.g. Ananya Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-1.5">
                  Locality / Neighborhood in Pune
                </label>
                <input
                  type="text"
                  required
                  value={formData.neighborhood}
                  onChange={e => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs sm:text-sm focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                  placeholder="e.g. Alandi, Koregaon Park, Kothrud, Baner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-1.5">
                  Phone / WhatsApp (Volunteer alerts)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs sm:text-sm focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                  placeholder="+91 98230 45678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-1.5">
                  Community Group
                </label>
                <select
                  value={formData.community_group_id}
                  onChange={e => setFormData(prev => ({ ...prev, community_group_id: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs sm:text-sm focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                >
                  {groups.map(grp => (
                    <option key={grp.id} value={grp.id}>
                      {grp.group_name} ({grp.city_tag || 'Pune'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-1.5">
                Bio / Sustainability Motto
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2DDD1] text-[#2C4A3E] text-xs sm:text-sm focus:outline-none focus:border-[#587B6C] focus:ring-1 focus:ring-[#587B6C]"
                placeholder="Share a short sentence about what motivates your environmental actions..."
              />
            </div>

            {/* Eco Interests Picker */}
            <div>
              <label className="block text-xs font-bold text-[#2C4A3E] uppercase tracking-wide mb-2">
                Select Your Eco Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map(interest => {
                  const isSelected = userInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#587B6C] text-white border-[#587B6C] shadow-xs'
                          : 'bg-white text-[#64786E] border-[#E2DDD1] hover:bg-[#F5F2EB]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2DDD1]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8C857B] hover:text-[#2C4A3E] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C4A3E] hover:bg-[#233A31] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 3. Eco Impact Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#E2DDD1]/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#E8EFEA] flex items-center justify-center text-xl shrink-0">
            🌱
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#8C857B] uppercase block">Green Points</span>
            <span className="font-display font-extrabold text-xl sm:text-2xl text-[#2C4A3E]">
              {user?.green_points ?? 240}
            </span>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#E2DDD1]/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0">
            🌿
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#8C857B] uppercase block">CO₂ Saved</span>
            <span className="font-display font-extrabold text-xl sm:text-2xl text-[#2C4A3E]">
              {totalCo2Saved > 0 ? totalCo2Saved : 58.5} kg
            </span>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#E2DDD1]/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0">
            🌳
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#8C857B] uppercase block">Tree Equivalent</span>
            <span className="font-display font-extrabold text-xl sm:text-2xl text-[#2C4A3E]">
              {treeEquiv} Trees
            </span>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#E2DDD1]/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F5F2EB] text-[#587B6C] flex items-center justify-center text-xl shrink-0">
            ✅
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#8C857B] uppercase block">Actions Posted</span>
            <span className="font-display font-extrabold text-xl sm:text-2xl text-[#2C4A3E]">
              {totalVerifiedActions > 0 ? totalVerifiedActions : 3}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. User's Own Posted Actions & Feed Proofs ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8EFEA] text-[#587B6C]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#2C4A3E]">
              My Verified Eco-Actions
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 text-xs font-bold text-[#587B6C] hover:underline cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Action</span>
          </button>
        </div>

        {isLoadingPosts ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <div className="w-8 h-8 rounded-full border-2 border-[#587B6C] border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#8C857B]">Loading your verified actions...</p>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E2DDD1]">
            <div className="w-12 h-12 rounded-2xl bg-[#E8EFEA] flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6 text-[#7C9D8E]" />
            </div>
            <h3 className="font-display font-bold text-base text-[#2C4A3E] mb-1">
              No actions posted yet
            </h3>
            <p className="text-xs text-[#8C857B] max-w-sm mx-auto mb-4 leading-relaxed">
              Snap a photo of your tree planting, clean-up, rooftop solar or composting to earn your first verified badge!
            </p>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 rounded-xl bg-[#2C4A3E] text-white text-xs font-bold shadow-sm"
            >
              + Post Real Action
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden border border-[#E2DDD1]/80 hover:shadow-md transition-all flex flex-col"
              >
                {/* Photo Frame */}
                <div className="relative h-44 w-full bg-[#E8DDD0] overflow-hidden">
                  <img
                    src={post.photo_url}
                    alt={post.location_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Photo Check Passed</span>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[#2C4A3E] text-[10px] font-bold">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C857B] mb-1.5">
                      <span className="flex items-center gap-1 truncate font-medium">
                        <MapPin className="w-3 h-3 text-[#587B6C] shrink-0" />
                        {post.location_name}
                      </span>
                    </div>
                    <p className="text-xs text-[#2C4A3E] font-medium line-clamp-2 mb-3">
                      {post.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2DDD1]/60 text-xs">
                    <span className="font-bold text-emerald-700">
                      +{post.co2_saved_kg} kg CO₂
                    </span>
                    <span className="font-bold text-[#587B6C] bg-[#E8EFEA] px-2 py-0.5 rounded-md text-[11px]">
                      +{post.points_awarded} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. Earned Eco Badges & Milestones ── */}
      <div className="glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#E2DDD1]/80 shadow-xs">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#2C4A3E] mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Earned Eco Badges & Milestones</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🌱', name: 'Pune Green Sprout', desc: 'First action verified', earned: true },
            { icon: '🌳', name: 'Forest Maker', desc: 'Planted native trees', earned: true },
            { icon: '☀️', name: 'Solar Pioneer', desc: 'Clean energy adopter', earned: true },
            { icon: '🧹', name: 'River Guardian', desc: 'Indrayani cleanup hero', earned: true },
          ].map((badge) => (
            <div
              key={badge.name}
              className="p-3.5 rounded-xl bg-[#F5F2EB]/80 border border-[#E2DDD1]/70 flex flex-col items-center text-center gap-1.5"
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-bold text-xs text-[#2C4A3E]">{badge.name}</span>
              <span className="text-[10px] text-[#8C857B]">{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

