/**
 * PrithviNet API Client
 * Connects to the FastAPI backend with clean fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchUserMe(userId = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/users/me?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  } catch (err) {
    console.warn('[PrithviNet API] Using default user profile:', err.message);
    return {
      id: 1,
      name: "Ananya Sharma",
      email: "ananya@prithvinet.org",
      community_group_id: 1,
      community_group_name: "MITAOE Green Warriors",
      green_points: 240,
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
      created_at: new Date().toISOString()
    };
  }
}

export async function fetchFeed({ sortBy = 'recent', category = 'all' } = {}) {
  try {
    const params = new URLSearchParams();
    if (sortBy) params.append('sort_by', sortBy);
    if (category && category !== 'all') params.append('category', category);

    const res = await fetch(`${API_BASE}/api/feed/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch feed');
    return await res.json();
  } catch (err) {
    console.warn('[PrithviNet API] Using fallback feed:', err.message);
    return [];
  }
}

export async function fetchMapPoints({ category = 'all' } = {}) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);

    const res = await fetch(`${API_BASE}/api/map/points?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch map points');
    return await res.json();
  } catch (err) {
    console.warn('[PrithviNet API] Using fallback map points:', err.message);
    return [];
  }
}

export async function createEcoPost(formData) {
  const res = await fetch(`${API_BASE}/api/posts/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Could not post action. Please try again.');
  }

  return await res.json();
}

export async function fetchRewards() {
  try {
    const res = await fetch(`${API_BASE}/api/rewards/`);
    if (!res.ok) throw new Error('Failed to fetch rewards');
    return await res.json();
  } catch (err) {
    console.warn('[PrithviNet API] Using fallback rewards:', err.message);
    return [];
  }
}

export async function redeemReward({ userId = 1, rewardId }) {
  const res = await fetch(`${API_BASE}/api/rewards/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, reward_id: rewardId })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Redemption failed. Please try again.');
  }

  return await res.json();
}

export async function fetchCommunityGroups() {
  try {
    const res = await fetch(`${API_BASE}/api/groups/`);
    if (!res.ok) throw new Error('Failed to fetch groups');
    return await res.json();
  } catch (err) {
    console.warn('[PrithviNet API] Using fallback groups:', err.message);
    return [];
  }
}

export async function joinCommunityGroup(groupId, userId = 1) {
  const res = await fetch(`${API_BASE}/api/groups/${groupId}/join?user_id=${userId}`, {
    method: 'POST'
  });

  if (!res.ok) throw new Error('Failed to join community group');
  return await res.json();
}

export async function fetchCommunityStats() {
  try {
    const res = await fetch(`${API_BASE}/api/users/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    return {
      total_co2_saved_kg: 121.0,
      total_green_points_awarded: 370,
      total_verified_actions: 5,
      total_volunteers: 4,
      trees_equivalent: 6
    };
  }
}
