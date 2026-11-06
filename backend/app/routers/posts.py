import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import User, CommunityGroup, EcoActionPost, PostLike, PostComment, PostBookmark
from app.schemas import (
    EcoActionPostResponse, CommentCreateRequest, CommentResponse, 
    LikeToggleResponse, BookmarkToggleResponse
)
from app.validation import run_photo_check, detect_category
from app.auth import get_current_user, get_optional_current_user

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
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Upload an eco-action post with photo proof, location name, and simple description.
    Runs automated Photo Check, awards Green Points, and adds to group impact.
    Uses authenticated user if logged in, otherwise falls back to provided user_id.
    """
    user = current_user or db.query(User).filter(User.id == user_id).first()
    if not user:
        # Fallback to first user in database
        user = db.query(User).first()
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
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Returns real verified eco-action posts from local communities with live social metrics."""
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

    # Get set of posts liked by current user
    user_liked_post_ids = set()
    user_bookmarked_post_ids = set()
    if current_user:
        user_liked_post_ids = {
            like.post_id for like in db.query(PostLike.post_id).filter(PostLike.user_id == current_user.id).all()
        }
        user_bookmarked_post_ids = {
            bm.post_id for bm in db.query(PostBookmark.post_id).filter(PostBookmark.user_id == current_user.id).all()
        }

    results = []
    for post, user in records:
        group_name = user.community_group.group_name if user.community_group else None
        
        # Real comments from database
        comments_query = (
            db.query(PostComment, User)
            .join(User, PostComment.user_id == User.id)
            .filter(PostComment.post_id == post.id)
            .order_by(PostComment.created_at.asc())
            .all()
        )
        comments_list = [
            CommentResponse(
                id=c.id,
                post_id=c.post_id,
                user_id=u.id,
                user_name=u.name,
                user_avatar=u.avatar_url,
                text=c.text,
                created_at=c.created_at
            )
            for c, u in comments_query
        ]

        likes_count = db.query(PostLike).filter(PostLike.post_id == post.id).count()

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
                timestamp=post.timestamp,
                likes_count=likes_count,
                is_liked=(post.id in user_liked_post_ids),
                is_bookmarked=(post.id in user_bookmarked_post_ids),
                comments_count=len(comments_list),
                latest_comments=comments_list[-5:] # Latest 5 comments inline
            )
        )
    return results

@router.post("/posts/{post_id}/like", response_model=LikeToggleResponse)
def toggle_like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggles like/cheer on a post for the authenticated user."""
    post = db.query(EcoActionPost).filter(EcoActionPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id,
        PostLike.user_id == current_user.id
    ).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()
        liked = False
    else:
        new_like = PostLike(post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        db.commit()
        liked = True

    total_likes = db.query(PostLike).filter(PostLike.post_id == post_id).count()
    return LikeToggleResponse(post_id=post_id, liked=liked, likes_count=total_likes)

@router.post("/posts/{post_id}/bookmark", response_model=BookmarkToggleResponse)
def toggle_bookmark_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggles bookmark/save on a post for the authenticated user."""
    post = db.query(EcoActionPost).filter(EcoActionPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_bm = db.query(PostBookmark).filter(
        PostBookmark.post_id == post_id,
        PostBookmark.user_id == current_user.id
    ).first()

    if existing_bm:
        db.delete(existing_bm)
        db.commit()
        bookmarked = False
    else:
        new_bm = PostBookmark(post_id=post_id, user_id=current_user.id)
        db.add(new_bm)
        db.commit()
        bookmarked = True

    return BookmarkToggleResponse(post_id=post_id, bookmarked=bookmarked)

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
def get_post_comments(post_id: int, db: Session = Depends(get_db)):
    """Returns all real comments for a post."""
    records = (
        db.query(PostComment, User)
        .join(User, PostComment.user_id == User.id)
        .filter(PostComment.post_id == post_id)
        .order_by(PostComment.created_at.asc())
        .all()
    )
    return [
        CommentResponse(
            id=c.id,
            post_id=c.post_id,
            user_id=u.id,
            user_name=u.name,
            user_avatar=u.avatar_url,
            text=c.text,
            created_at=c.created_at
        )
        for c, u in records
    ]

@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_post_comment(
    post_id: int,
    data: CommentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Creates a real comment stored in the database for the post."""
    text_clean = data.text.strip()
    if not text_clean:
        raise HTTPException(status_code=400, detail="Comment cannot be empty")

    post = db.query(EcoActionPost).filter(EcoActionPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = PostComment(
        post_id=post_id,
        user_id=current_user.id,
        text=text_clean
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        post_id=comment.post_id,
        user_id=current_user.id,
        user_name=current_user.name,
        user_avatar=current_user.avatar_url,
        text=comment.text,
        created_at=comment.created_at
    )
