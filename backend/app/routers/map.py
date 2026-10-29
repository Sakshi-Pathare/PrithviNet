from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import EcoActionPost, User
from app.schemas import MapPoint

router = APIRouter(prefix="/api/map", tags=["map"])

@router.get("/points", response_model=List[MapPoint])
def get_map_points(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns geo-location points for verified eco-actions 
    to populate the interactive community map pins.
    """
    query = (
        db.query(EcoActionPost, User)
        .join(User, EcoActionPost.user_id == User.id)
        .filter(EcoActionPost.status == "Verified")
    )

    if category and category.lower() != "all":
        query = query.filter(EcoActionPost.category.ilike(f"%{category}%"))

    records = query.all()

    points = []
    for post, user in records:
        group_name = user.community_group.group_name if user.community_group else "Neighborhood Volunteer"

        points.append(
            MapPoint(
                id=post.id,
                title=f"{post.category} at {post.location_name}",
                description=post.description,
                category=post.category,
                location_name=post.location_name,
                lat=post.lat or 18.5204,
                lng=post.lng or 73.8567,
                co2_saved_kg=post.co2_saved_kg,
                points_awarded=post.points_awarded,
                user_name=user.name,
                group_name=group_name,
                photo_url=post.photo_url,
                status=post.status,
                timestamp=post.timestamp
            )
        )

    return points
