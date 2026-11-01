from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, EcoActionPost, CommunityGroup
from app.schemas import UserResponse, UserUpdateRequest, EcoActionPostResponse

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_current_user(user_id: int = Query(1), db: Session = Depends(get_db)):
    """Returns the current logged-in user's profile and live Green Points balance."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

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
        neighborhood=user.neighborhood or "Alandi, Pune",
        phone=user.phone or "",
        eco_interests=user.eco_interests or "Tree Planting, Clean-up Drive, Solar Energy",
        created_at=user.created_at
    )

@router.put("/me", response_model=UserResponse)
def update_current_user(
    update_data: UserUpdateRequest,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    """Updates the user's profile details including bio, neighborhood, phone, interests, and avatar."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.name is not None and update_data.name.strip():
        user.name = update_data.name.strip()
    if update_data.bio is not None:
        user.bio = update_data.bio.strip()
    if update_data.neighborhood is not None:
        user.neighborhood = update_data.neighborhood.strip()
    if update_data.phone is not None:
        user.phone = update_data.phone.strip()
    if update_data.eco_interests is not None:
        user.eco_interests = update_data.eco_interests.strip()
    if update_data.avatar_url is not None and update_data.avatar_url.strip():
        user.avatar_url = update_data.avatar_url.strip()
    if update_data.community_group_id is not None:
        user.community_group_id = update_data.community_group_id

    db.commit()
    db.refresh(user)

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
        neighborhood=user.neighborhood or "Alandi, Pune",
        phone=user.phone or "",
        eco_interests=user.eco_interests or "Tree Planting, Clean-up Drive, Solar Energy",
        created_at=user.created_at
    )

@router.get("/me/posts", response_model=List[EcoActionPostResponse])
def get_user_posts(user_id: int = Query(1), db: Session = Depends(get_db)):
    """Returns all verified action posts submitted by the user."""
    posts = (
        db.query(EcoActionPost)
        .filter(EcoActionPost.user_id == user_id)
        .order_by(EcoActionPost.timestamp.desc())
        .all()
    )

    user = db.query(User).filter(User.id == user_id).first()
    user_name = user.name if user else "You"
    user_avatar = user.avatar_url if user else None
    group_name = user.community_group.group_name if user and user.community_group else None

    results = []
    for post in posts:
        results.append(
            EcoActionPostResponse(
                id=post.id,
                user_id=post.user_id,
                user_name=user_name,
                user_avatar=user_avatar,
                group_id=post.group_id,
                group_name=group_name,
                description=post.description,
                photo_url=post.photo_url,
                location_name=post.location_name,
                lat=post.lat,
                lng=post.lng,
                status=post.status,
                co2_saved_kg=post.co2_saved_kg,
                points_awarded=post.points_awarded,
                category=post.category,
                timestamp=post.timestamp
            )
        )
    return results

@router.get("/stats")
def get_community_stats(db: Session = Depends(get_db)):
    """Returns platform-wide environmental stats."""
    posts = db.query(EcoActionPost).filter(EcoActionPost.status == "Verified").all()
    
    total_co2 = round(sum(p.co2_saved_kg for p in posts), 1)
    total_points = sum(p.points_awarded for p in posts)
    total_actions = len(posts)
    total_users = db.query(User).count()

    return {
        "total_co2_saved_kg": total_co2,
        "total_green_points_awarded": total_points,
        "total_verified_actions": total_actions,
        "total_volunteers": total_users,
        "trees_equivalent": int(total_co2 / 20.0)
    }
