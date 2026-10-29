from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base

class CommunityGroup(Base):
    __tablename__ = "community_groups"

    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String(120), unique=True, nullable=False, index=True)
    total_impact_score = Column(Float, default=0.0, nullable=False)
    description = Column(Text, nullable=True)
    city_tag = Column(String(50), default="Pune", nullable=False)
    icon = Column(String(50), default="Users")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    members = relationship("User", back_populates="community_group")
    posts = relationship("EcoActionPost", back_populates="group")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    community_group_id = Column(Integer, ForeignKey("community_groups.id"), nullable=True)
    green_points = Column(Integer, default=120, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    community_group = relationship("CommunityGroup", back_populates="members")
    posts = relationship("EcoActionPost", back_populates="user", cascade="all, delete-orphan")
    redemptions = relationship("Redemption", back_populates="user", cascade="all, delete-orphan")

class EcoActionPost(Base):
    __tablename__ = "eco_action_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    group_id = Column(Integer, ForeignKey("community_groups.id"), nullable=True)
    description = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=False)
    location_name = Column(String(150), nullable=False)
    lat = Column(Float, nullable=True, default=18.5204)  # Default Pune latitude
    lng = Column(Float, nullable=True, default=73.8567)  # Default Pune longitude
    status = Column(String(20), default="Verified", nullable=False) # "Pending", "Verified"
    co2_saved_kg = Column(Float, default=5.0, nullable=False)
    points_awarded = Column(Integer, default=50, nullable=False)
    category = Column(String(50), default="Clean-up Drive", nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="posts")
    group = relationship("CommunityGroup", back_populates="posts")

class RewardItem(Base):
    __tablename__ = "reward_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    cost_in_points = Column(Integer, nullable=False)
    partner_store_name = Column(String(150), nullable=False)
    voucher_code = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), default="Food & Drinks")
    image_url = Column(String(500), nullable=True)
    stock = Column(Integer, default=100)

    # Relationships
    redemptions = relationship("Redemption", back_populates="reward")

class Redemption(Base):
    __tablename__ = "redemptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("reward_items.id"), nullable=False)
    voucher_code = Column(String(64), unique=True, nullable=False, index=True)
    cost_paid = Column(Integer, nullable=False)
    redeemed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="redemptions")
    reward = relationship("RewardItem", back_populates="redemptions")
