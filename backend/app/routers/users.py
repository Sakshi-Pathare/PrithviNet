from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, EcoActionPost
from app.schemas import UserResponse

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
        created_at=user.created_at
    )

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
