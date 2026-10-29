from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# --- User Schemas ---
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    community_group_id: Optional[int] = None
    community_group_name: Optional[str] = None
    green_points: int
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Community Group Schemas ---
class CommunityGroupResponse(BaseModel):
    id: int
    group_name: str
    total_impact_score: float
    description: Optional[str] = None
    city_tag: Optional[str] = "Pune"
    icon: Optional[str] = "Users"
    member_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

# --- Eco Action Post Schemas ---
class EcoActionPostCreate(BaseModel):
    description: str
    location_name: str
    photo_url: Optional[str] = None
    lat: Optional[float] = 18.5204
    lng: Optional[float] = 73.8567
    category: Optional[str] = "Clean-up Drive"
    user_id: int = 1

class EcoActionPostResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_avatar: Optional[str] = None
    group_id: Optional[int] = None
    group_name: Optional[str] = None
    description: str
    photo_url: str
    location_name: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    status: str
    co2_saved_kg: float
    points_awarded: int
    category: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Map Point Schema ---
class MapPoint(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location_name: str
    lat: float
    lng: float
    co2_saved_kg: float
    points_awarded: int
    user_name: str
    group_name: Optional[str] = None
    photo_url: str
    status: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Reward Schemas ---
class RewardItemResponse(BaseModel):
    id: int
    title: str
    cost_in_points: int
    partner_store_name: str
    voucher_code: str
    description: Optional[str] = None
    category: Optional[str] = "Food & Drinks"
    image_url: Optional[str] = None
    stock: int

    model_config = ConfigDict(from_attributes=True)

class RedeemRequest(BaseModel):
    user_id: int = 1
    reward_id: int

class RedemptionResponse(BaseModel):
    id: int
    reward_title: str
    partner_store_name: str
    voucher_code: str
    cost_paid: int
    new_green_points: int
    redeemed_at: datetime
    instructions: str
