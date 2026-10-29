import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import User, CommunityGroup, EcoActionPost
from app.schemas import EcoActionPostResponse
from app.validation import run_photo_check, detect_category

router = APIRouter(prefix="/api", tags=["posts"])

@router.post("/posts/", response_model=EcoActionPostResponse, status_code=status.HTTP_201_CREATED)
async def create_eco_action_post(
    description: str = Form(...),
    location_name: str = Form(...),
    category: Optional[str] = Form("Clean-up Drive"),
    lat: Optional[float] = Form(18.5204),
    lng: Optional[float] = Form(73.8567),
    user_id: Optional[int] = Form(1),
    photo_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """
    Upload an eco-action post with photo proof, location name, and simple description.
    Runs automated Photo Check, awards Green Points, and adds to group impact.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    saved_photo_url = photo_url or ""

    # Handle file upload if provided
    if file and file.filename:
        file_ext = os.path.splitext(file.filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        destination = os.path.join(settings.UPLOAD_DIR, unique_filename)
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_photo_url = f"/uploads/{unique_filename}"

    if not saved_photo_url:
        # Default real-world action photo preview
        saved_photo_url = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop"

    # Automated Photo Check
    status_result, co2_saved, points_awarded, feedback = run_photo_check(
        photo_url=saved_photo_url,
        location_name=location_name,
        description=description,
        category=category
    )

    resolved_cat = detect_category(description, category)

    post = EcoActionPost(
        user_id=user.id,
        group_id=user.community_group_id,
        description=description,
        photo_url=saved_photo_url,
        location_name=location_name,
        lat=lat if lat is not None else 18.5204,
        lng=lng if lng is not None else 73.8567,
        status=status_result,
        co2_saved_kg=co2_saved,
        points_awarded=points_awarded,
        category=resolved_cat
    )

    db.add(post)

    # Award Green Points to User and Community Group
    if status_result == "Verified":
        user.green_points += points_awarded
        if user.community_group_id:
            group = db.query(CommunityGroup).filter(CommunityGroup.id == user.community_group_id).first()
            if group:
                group.total_impact_score = round(group.total_impact_score + co2_saved, 1)

    db.commit()
    db.refresh(post)

    group_name = user.community_group.group_name if user.community_group else None

    return EcoActionPostResponse(
        id=post.id,
        user_id=user.id,
        user_name=user.name,
        user_avatar=user.avatar_url,
        group_id=user.community_group_id,
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

@router.get("/feed/", response_model=List[EcoActionPostResponse])
def get_feed(
    sort_by: str = Query("recent", pattern="^(recent|impact)$"),
    category: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Returns real verified eco-action posts from local communities."""
    query = (
        db.query(EcoActionPost, User)
        .join(User, EcoActionPost.user_id == User.id)
        .filter(EcoActionPost.status == "Verified")
    )

    if category and category.lower() != "all":
        query = query.filter(EcoActionPost.category.ilike(f"%{category}%"))

    if sort_by == "impact":
        query = query.order_by(EcoActionPost.co2_saved_kg.desc())
    else:
        query = query.order_by(EcoActionPost.timestamp.desc())

    records = query.limit(limit).all()

    results = []
    for post, user in records:
        group_name = user.community_group.group_name if user.community_group else None
        results.append(
            EcoActionPostResponse(
                id=post.id,
                user_id=user.id,
                user_name=user.name,
                user_avatar=user.avatar_url,
                group_id=user.community_group_id,
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
