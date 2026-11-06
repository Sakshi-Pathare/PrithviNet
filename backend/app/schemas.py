from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# --- User Schemas ---
class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    neighborhood: Optional[str] = "Pune, Maharashtra"
    community_group_id: Optional[int] = 1

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    neighborhood: Optional[str] = None
    phone: Optional[str] = None
    eco_interests: Optional[str] = None
    avatar_url: Optional[str] = None
    community_group_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    community_group_id: Optional[int] = None
    community_group_name: Optional[str] = None
    green_points: int
    avatar_url: Optional[str] = None
    bio: Optional[str] = "Pune eco-warrior making everyday sustainable choices."
    neighborhood: Optional[str] = "Alandi, Pune"
    phone: Optional[str] = ""
    eco_interests: Optional[str] = "Tree Planting, Clean-up Drive, Solar Energy"
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

# --- Social Interaction Schemas ---
class CommentCreateRequest(BaseModel):
    text: str

class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    user_name: str
    user_avatar: Optional[str] = None
    text: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LikeToggleResponse(BaseModel):
    post_id: int
    liked: bool
    likes_count: int

class BookmarkToggleResponse(BaseModel):
    post_id: int
    bookmarked: bool

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
    likes_count: int = 0
    is_liked: bool = False
    is_bookmarked: bool = False
    comments_count: int = 0
    latest_comments: List[CommentResponse] = []

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
    action_code: Optional[str] = None

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

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    sender_id: Optional[int] = None
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    notification_type: str  # 'follow_request', 'like', 'comment', 'points', 'announcement'
    title: str
    message: str
    post_id: Optional[int] = None
    is_read: bool = False
    status: str = "active"  # 'active', 'accepted', 'declined'
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FollowToggleResponse(BaseModel):
    target_user_id: int
    is_following: bool
    status: str
    followers_count: int

# --- Chat & Messaging Schemas ---
class ChatMessageRequest(BaseModel):
    text: str
    reaction: Optional[str] = None

class ChatMessageResponse(BaseModel):
    id: int
    sender_id: int
    sender_name: str
    sender_avatar: Optional[str] = None
    recipient_id: Optional[int] = None
    group_id: Optional[int] = None
    text: str
    reaction: Optional[str] = None
    is_read: bool = False
    created_at: datetime
    is_mine: bool = False

    model_config = ConfigDict(from_attributes=True)

class ConversationResponse(BaseModel):
    id: str  # e.g. "u_2" or "g_1"
    target_type: str  # "user" or "group"
    target_id: int
    name: str
    avatar: str
    last_message: str
    last_message_time: datetime
    unread_count: int = 0
    is_online: bool = True

