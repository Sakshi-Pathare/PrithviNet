from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, CommunityGroup
from app.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop",
]

def build_user_response(user: User) -> UserResponse:
    group_name = user.community_group.group_name if user.community_group else None
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        community_group_id=user.community_group_id,
        community_group_name=group_name,
        green_points=user.green_points,
        avatar_url=user.avatar_url,
        bio=user.bio or "Pune eco-warrior making everyday sustainable choices.",
        neighborhood=user.neighborhood or "Pune, Maharashtra",
        phone=user.phone or "",
        eco_interests=user.eco_interests or "Tree Planting, Clean-up Drive, Solar Energy",
        created_at=user.created_at
    )

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(data: UserRegisterRequest, db: Session = Depends(get_db)):
    """Creates a new real user in Supabase/PostgreSQL database with hashed password."""
    clean_email = data.email.strip().lower()
    clean_name = data.name.strip()

    if not clean_email or not clean_name:
        raise HTTPException(status_code=400, detail="Name and email are required.")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    # Assign default group if none exists
    target_group_id = data.community_group_id
    if target_group_id:
        group_exists = db.query(CommunityGroup).filter(CommunityGroup.id == target_group_id).first()
        if not group_exists:
            target_group_id = 1
    else:
        target_group_id = 1

    # Pick avatar index based on email hash
    avatar_idx = sum(ord(c) for c in clean_email) % len(DEFAULT_AVATARS)

    new_user = User(
        name=clean_name,
        email=clean_email,
        hashed_password=get_password_hash(data.password),
        community_group_id=target_group_id,
        green_points=100,  # Welcome bonus points for real signups!
        avatar_url=DEFAULT_AVATARS[avatar_idx],
        neighborhood=data.neighborhood or "Pune, Maharashtra",
        bio="New green volunteer active in Pune.",
        eco_interests="Tree Planting, Clean-up Drive, Solar Energy"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=build_user_response(new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login(data: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticates user with email and password and returns JWT token."""
    clean_email = data.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=build_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user profile."""
    return build_user_response(current_user)

