from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db, haversine_distance
from app.models import EcoPost, User, VerificationStatus
from app.schemas import EcoPostResponse

router = APIRouter(prefix="/api/feed", tags=["feed"])

@router.get("/", response_model=List[EcoPostResponse])
def get_feed(
    sort_by: str = Query("recent", pattern="^(recent|impact|proximity)$"),
    user_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    user_lng: Optional[float] = Query(None, ge=-180.0, le=180.0),
    category: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Returns a feed of verified eco-posts, sorted by proximity, impact score, or recency.
    """
    query = (
        db.query(EcoPost, User)
        .join(User, EcoPost.user_id == User.id)
        .filter(EcoPost.verified_status == VerificationStatus.VERIFIED)
    )

    if category and category.lower() != "all":
        query = query.filter(EcoPost.category.ilike(f"%{category}%"))

    if sort_by == "impact":
        query = query.order_by(EcoPost.impact_co2_saved_kg.desc())
    elif sort_by == "recent" or sort_by != "proximity":
        query = query.order_by(EcoPost.timestamp.desc())

    records = query.offset(offset).limit(limit).all()

    results = []
    for post, user in records:
        distance = None
        if user_lat is not None and user_lng is not None:
            distance = round(haversine_distance(user_lat, user_lng, post.lat, post.lng), 1)

        guild_name = user.guild.name if user.guild else None

        results.append(
            EcoPostResponse(
                id=post.id,
                user_id=user.id,
                username=user.username,
                user_tier=user.tier_badge,
                user_avatar=user.avatar_url,
                guild_id=user.guild_id,
                guild_name=guild_name,
                description=post.description,
                lat=post.lat,
                lng=post.lng,
                media_url=post.media_url,
                verified_status=post.verified_status,
                impact_co2_saved_kg=post.impact_co2_saved_kg,
                verdants_awarded=post.verdants_awarded,
                ai_confidence_score=post.ai_confidence_score,
                category=post.category,
                timestamp=post.timestamp,
                distance_km=distance
            )
        )

    # If sorted by proximity and user coordinates supplied, sort by distance
    if sort_by == "proximity" and user_lat is not None and user_lng is not None:
        results.sort(key=lambda x: x.distance_km if x.distance_km is not None else float("inf"))

    return results
