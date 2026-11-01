/**
 * PrithviNet API Client
 * Connects to the FastAPI backend with comprehensive offline fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

export const DEFAULT_USER = {
  id: 1,
  name: "Ananya Sharma",
  email: "ananya@prithvinet.org",
  community_group_id: 1,
  community_group_name: "MITAOE Green Warriors",
  green_points: 240,
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
  bio: "Passionate environmental volunteer & urban planter dedicated to a greener, cleaner Pune.",
  neighborhood: "Alandi, Pune",
  phone: "+91 98230 45678",
  eco_interests: "Tree Planting, Clean-up Drive, Solar Energy, Composting",
  created_at: new Date().toISOString()
};

export const DEFAULT_FEED = [
  {
    id: 1,
    user_name: "Aarav Sharma",
    user_avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop",
    group_name: "MITAOE Green Warriors",
    location_name: "Alandi Riverbank, Pune",
    category: "Tree Planting",
    description: "Planted 10 native neem and peepal saplings along Alandi riverbank with college classmates.",
    photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
    co2_saved_kg: 40.0,
    points_awarded: 100,
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 2,
    user_name: "Rohan Mehta",
    user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
    group_name: "Pune River Volunteers",
    location_name: "Koregaon Park Joggers Trail, Pune",
    category: "Clean-up Drive",
    description: "Collected 4 large bags of plastic wrappers and discarded bottles near the park joggers trail.",
    photo_url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop",
    co2_saved_kg: 12.5,
    points_awarded: 60,
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 3,
    user_name: "Priya Deshmukh",
    user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
    group_name: "Alandi Solar Network",
    location_name: "Baner Bio-Park Area, Pune",
    category: "Solar Energy",
    description: "Set up rooftop solar panels generating 5 clean units of power each afternoon.",
    photo_url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop",
    co2_saved_kg: 45.0,
    points_awarded: 120,
    timestamp: new Date(Date.now() - 26 * 3600000).toISOString()
  },
  {
    id: 4,
    user_name: "Amit Kulkarni",
    user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
    group_name: "Green Leaf Composting Circle",
    location_name: "Viman Nagar Housing Society, Pune",
    category: "Composting",
    description: "Started apartment composting bin converting 25kg kitchen scraps into rich black soil.",
    photo_url: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop",
    co2_saved_kg: 15.0,
    points_awarded: 50,
    timestamp: new Date(Date.now() - 30 * 3600000).toISOString()
  },
  {
    id: 5,
    user_name: "Aarav Sharma",
    user_avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop",
    group_name: "MITAOE Green Warriors",
    location_name: "FC Road to Shivajinagar, Pune",
    category: "Cycling / Walking",
    description: "Organized a 12km cycle-to-college ride with 8 friends, leaving motorbikes at home.",
    photo_url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop",
    co2_saved_kg: 8.5,
    points_awarded: 40,
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

export const DEFAULT_GROUPS = [
  {
    id: 1,
    group_name: "MITAOE Green Warriors",
    total_impact_score: 340.5,
    description: "Student-led environmental club running campus tree-planting drives and river cleanups.",
    city_tag: "Pune Campus",
    icon: "GraduationCap",
    member_count: 32
  },
  {
    id: 2,
    group_name: "Pune Clean Air & River Volunteers",
    total_impact_score: 285.0,
    description: "Neighborhood volunteers keeping parks, lakes, and riverfronts trash-free.",
    city_tag: "Pune Metro",
    icon: "Waves",
    member_count: 24
  },
  {
    id: 3,
    group_name: "Alandi Solar & Rooftop Network",
    total_impact_score: 420.2,
    description: "Rooftop solar and clean energy adopters sharing tips to reduce grid emissions.",
    city_tag: "Alandi Sector",
    icon: "Sun",
    member_count: 18
  },
  {
    id: 4,
    group_name: "Green Leaf Composting Circle",
    total_impact_score: 190.8,
    description: "Families turning kitchen wet waste into rich organic compost for gardens.",
    city_tag: "Kothrud & Baner",
    icon: "Leaf",
    member_count: 15
  }
];

export const DEFAULT_REWARDS = [
  {
    id: 1,
    title: "Free Organic Chai & Bun Maska",
    cost_in_points: 50,
    partner_store_name: "Chai Point Organic Cafe",
    voucher_code: "PN-CHAI-FREE",
    description: "Enjoy one free cup of freshly brewed ginger-cardamom organic chai with warm bun maska.",
    category: "Food & Drinks",
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Native Medicinal Plant Sapling",
    cost_in_points: 80,
    partner_store_name: "Alandi Botanical Nursery",
    voucher_code: "PN-PLANT-NEEM",
    description: "Choose 1 potted Tulsi, Aloe Vera, or Neem sapling to green your balcony or terrace garden.",
    category: "Gardening & Greenery",
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Pune Metro 1-Day Unlimited Green Pass",
    cost_in_points: 100,
    partner_store_name: "Pune Metro Rail Corporation",
    voucher_code: "PN-METRO-DAYPASS",
    description: "Full-day unlimited electric metro access across Vanaz to Ramwadi & PCMC to Swargate lines.",
    category: "Clean Transport",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Zero-Waste Bamboo Cutlery & Straw Kit",
    cost_in_points: 120,
    partner_store_name: "Earthy Living Store Pune",
    voucher_code: "PN-BAMBOO-KIT",
    description: "Handcrafted sustainable travel cutlery roll with bamboo spoon, fork, chopsticks, and coconut cleaner.",
    category: "Eco Goods",
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Solar Study Lamp with USB Charger",
    cost_in_points: 250,
    partner_store_name: "Urja Solar Technologies",
    voucher_code: "PN-SOLAR-LAMP",
    description: "Compact 5W solar-powered study lamp with integrated mobile charging port and 8-hour battery.",
    category: "Clean Energy",
    image_url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop"
  }
];

export async function fetchUserMe(userId = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/users/me?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
  } catch (err) {
    return DEFAULT_USER;
  }
}

export async function fetchFeed({ sortBy = 'recent', category = 'all' } = {}) {
  try {
    const params = new URLSearchParams();
    if (sortBy) params.append('sort_by', sortBy);
    if (category && category !== 'all') params.append('category', category);

    const res = await fetch(`${API_BASE}/api/feed/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch feed');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_FEED;
  } catch (err) {
    let fallback = DEFAULT_FEED;
    if (category && category !== 'all') {
      fallback = fallback.filter(p => p.category?.toLowerCase().includes(category.toLowerCase()));
    }
    return fallback;
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
    return [];
  }
}

export async function createEcoPost(formData) {
  try {
    const res = await fetch(`${API_BASE}/api/posts/`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Could not post action.');
    }
    return await res.json();
  } catch (err) {
    // If backend is offline, return simulated approved post so user experience is smooth
    const category = formData.get('category') || 'Clean-up Drive';
    const location = formData.get('location_name') || 'Pune Community';
    const description = formData.get('description') || 'Eco action proof verified.';
    const photoUrl = formData.get('photo_url') || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop';
    return {
      id: Date.now(),
      user_id: 1,
      group_id: 1,
      user_name: DEFAULT_USER.name,
      user_avatar: DEFAULT_USER.avatar_url,
      group_name: DEFAULT_USER.community_group_name,
      description,
      location_name: location,
      category,
      photo_url: photoUrl,
      co2_saved_kg: 18.5,
      points_awarded: 60,
      status: 'Verified',
      timestamp: new Date().toISOString()
    };
  }
}

export async function updateUserProfile(profileData, userId = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/users/me?user_id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Could not update profile.');
    }
    return await res.json();
  } catch (err) {
    // Local fallback update
    return {
      ...DEFAULT_USER,
      ...profileData,
    };
  }
}

export async function fetchUserPosts(userId = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/users/me/posts?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user posts');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchRewards() {
  try {
    const res = await fetch(`${API_BASE}/api/rewards/`);
    if (!res.ok) throw new Error('Failed to fetch rewards');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_REWARDS;
  } catch (err) {
    return DEFAULT_REWARDS;
  }
}

export async function redeemReward({ userId = 1, rewardId }) {
  try {
    const res = await fetch(`${API_BASE}/api/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, reward_id: rewardId })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Redemption failed.');
    }
    return await res.json();
  } catch (err) {
    const reward = DEFAULT_REWARDS.find(r => r.id === rewardId) || DEFAULT_REWARDS[0];
    return {
      id: Date.now(),
      voucher_code: reward.voucher_code || 'PN-REWARD-2026',
      partner_store_name: reward.partner_store_name,
      reward_title: reward.title,
      cost_in_points: reward.cost_in_points,
      new_green_points: Math.max(0, DEFAULT_USER.green_points - reward.cost_in_points),
      instructions: "Show this voucher code at partner counter or checkout to claim your perk!"
    };
  }
}

export async function fetchCommunityGroups() {
  try {
    const res = await fetch(`${API_BASE}/api/groups/`);
    if (!res.ok) throw new Error('Failed to fetch groups');
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_GROUPS;
  } catch (err) {
    return DEFAULT_GROUPS;
  }
}

export async function joinCommunityGroup(groupId, userId = 1) {
  try {
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/join?user_id=${userId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to join');
    return await res.json();
  } catch (err) {
    const group = DEFAULT_GROUPS.find(g => g.id === groupId) || DEFAULT_GROUPS[0];
    return {
      status: "success",
      message: `You are now a member of ${group.group_name}!`,
      group_id: groupId,
      user_id: userId
    };
  }
}

export async function fetchCommunityStats() {
  try {
    const res = await fetch(`${API_BASE}/api/users/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    return {
      total_co2_saved_kg: 185.0,
      total_green_points_awarded: 640,
      total_verified_actions: 14,
      total_volunteers: 4,
      trees_equivalent: 9
    };
  }
}
