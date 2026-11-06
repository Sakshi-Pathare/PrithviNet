from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc

from app.database import get_db
from app.models import User, CommunityGroup, EcoActionPost, Notification, ChatMessage, UserFollow
from app.schemas import (
    NotificationResponse, FollowToggleResponse,
    ChatMessageRequest, ChatMessageResponse, ConversationResponse
)
from app.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/social", tags=["social"])

def ensure_seed_notifications(db: Session, user_id: int):
    """Seed realistic initial notifications for user if none exist."""
    existing_count = db.query(Notification).filter(Notification.user_id == user_id).count()
    if existing_count == 0:
        other_user = db.query(User).filter(User.id != user_id).first()
        other_id = other_user.id if other_user else None

        seeds = [
            Notification(
                user_id=user_id,
                sender_id=other_id,
                notification_type="follow_request",
                title="Follow Request",
                message="requested to follow your Pune eco-actions stream.",
                status="active",
                is_read=0,
                created_at=datetime.utcnow()
            ),
            Notification(
                user_id=user_id,
                sender_id=other_id,
                notification_type="like",
                title="New Cheer 💚",
                message="cheered on your Alandi Riverbank Tree Planting action!",
                status="active",
                is_read=0,
                created_at=datetime.utcnow()
            ),
            Notification(
                user_id=user_id,
                sender_id=None,
                notification_type="points",
                title="Green Points Milestone 🌱",
                message="Welcome to PrithviNet! 100 Green Points credited to your eco-wallet.",
                status="active",
                is_read=1,
                created_at=datetime.utcnow()
            )
        ]
        db.add_all(seeds)
        db.commit()

def ensure_seed_messages(db: Session, user_id: int):
    """Seed realistic initial direct messages for user if none exist."""
    existing_count = db.query(ChatMessage).filter(
        or_(ChatMessage.sender_id == user_id, ChatMessage.recipient_id == user_id)
    ).count()

    if existing_count == 0:
        volunteers = db.query(User).filter(User.id != user_id).limit(3).all()
        if volunteers:
            v1 = volunteers[0]
            db.add_all([
                ChatMessage(
                    sender_id=v1.id,
                    recipient_id=user_id,
                    text="Namaste! Saw your recent eco-action post. Are you joining our Sunday cleanup at Indrayani?",
                    is_read=1,
                    created_at=datetime.utcnow()
                ),
                ChatMessage(
                    sender_id=user_id,
                    recipient_id=v1.id,
                    text="Yes definitely! What time does the group meet at Alandi?",
                    is_read=1,
                    created_at=datetime.utcnow()
                ),
                ChatMessage(
                    sender_id=v1.id,
                    recipient_id=user_id,
                    text="Around 7:30 AM near the bridge. Bring gloves if you have them! 🌱",
                    reaction="🌱",
                    is_read=0,
                    created_at=datetime.utcnow()
                )
            ])
            db.commit()

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Returns active notifications for the current user with sender details."""
    uid = current_user.id if current_user else 1
    ensure_seed_notifications(db, uid)

    notes = (
        db.query(Notification, User)
        .outerjoin(User, Notification.sender_id == User.id)
        .filter(Notification.user_id == uid)
        .order_by(desc(Notification.created_at))
        .limit(20)
        .all()
    )

    results = []
    for note, sender in notes:
        results.append(
            NotificationResponse(
                id=note.id,
                user_id=note.user_id,
                sender_id=note.sender_id,
                sender_name=sender.name if sender else "PrithviNet Team",
                sender_avatar=sender.avatar_url if sender else "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop",
                notification_type=note.notification_type,
                title=note.title,
                message=note.message,
                post_id=note.post_id,
                is_read=bool(note.is_read),
                status=note.status or "active",
                created_at=note.created_at
            )
        )
    return results

@router.post("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Marks a single notification as read."""
    note = db.query(Notification).filter(Notification.id == notification_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")
    note.is_read = 1
    db.commit()
    return {"status": "success", "id": notification_id}

@router.post("/notifications/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Marks all user notifications as read."""
    uid = current_user.id if current_user else 1
    db.query(Notification).filter(Notification.user_id == uid).update({"is_read": 1})
    db.commit()
    return {"status": "success"}

@router.post("/notifications/{notification_id}/respond-follow")
def respond_follow_request(
    notification_id: int,
    action: str, # "accept" or "decline"
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Handles an Instagram-style follow request response."""
    note = db.query(Notification).filter(Notification.id == notification_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Notification not found")

    if action == "accept":
        note.status = "accepted"
        note.is_read = 1
        if note.sender_id:
            follow = db.query(UserFollow).filter(
                UserFollow.follower_id == note.sender_id,
                UserFollow.following_id == note.user_id
            ).first()
            if not follow:
                follow = UserFollow(
                    follower_id=note.sender_id,
                    following_id=note.user_id,
                    status="accepted"
                )
                db.add(follow)
            else:
                follow.status = "accepted"
    else:
        note.status = "declined"
        note.is_read = 1

    db.commit()
    return {"status": "success", "action": action, "notification_id": notification_id}

@router.post("/users/{target_id}/follow", response_model=FollowToggleResponse)
def toggle_follow_user(
    target_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggles follow status on another community member."""
    if target_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")

    target_user = db.query(User).filter(User.id == target_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(UserFollow).filter(
        UserFollow.follower_id == current_user.id,
        UserFollow.following_id == target_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        is_following = False
        follow_status = "none"
    else:
        new_follow = UserFollow(
            follower_id=current_user.id,
            following_id=target_id,
            status="accepted"
        )
        db.add(new_follow)

        # Create notification for target user
        notif = Notification(
            user_id=target_id,
            sender_id=current_user.id,
            notification_type="follow_request",
            title="New Follower",
            message=f"{current_user.name} started following your eco-actions!",
            status="accepted",
            is_read=0
        )
        db.add(notif)
        db.commit()
        is_following = True
        follow_status = "accepted"

    followers_count = db.query(UserFollow).filter(UserFollow.following_id == target_id).count()
    return FollowToggleResponse(
        target_user_id=target_id,
        is_following=is_following,
        status=follow_status,
        followers_count=followers_count
    )

@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Returns active conversations list (volunteers and groups)."""
    uid = current_user.id if current_user else 1
    ensure_seed_messages(db, uid)

    # 1. Other users with conversations
    other_users = db.query(User).filter(User.id != uid).limit(5).all()

    conversations = []
    for other in other_users:
        last_msg = (
            db.query(ChatMessage)
            .filter(
                or_(
                    and_(ChatMessage.sender_id == uid, ChatMessage.recipient_id == other.id),
                    and_(ChatMessage.sender_id == other.id, ChatMessage.recipient_id == uid)
                )
            )
            .order_by(desc(ChatMessage.created_at))
            .first()
        )

        unread_count = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.sender_id == other.id,
                ChatMessage.recipient_id == uid,
                ChatMessage.is_read == 0
            )
            .count()
        )

        conversations.append(
            ConversationResponse(
                id=f"u_{other.id}",
                target_type="user",
                target_id=other.id,
                name=other.name,
                avatar=other.avatar_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop",
                last_message=last_msg.text if last_msg else "Say hi to start coordinating eco-actions!",
                last_message_time=last_msg.created_at if last_msg else other.created_at,
                unread_count=unread_count,
                is_online=True
            )
        )

    # 2. Add community group chat
    group = db.query(CommunityGroup).first()
    if group:
        last_group_msg = (
            db.query(ChatMessage)
            .filter(ChatMessage.group_id == group.id)
            .order_by(desc(ChatMessage.created_at))
            .first()
        )
        conversations.insert(
            0,
            ConversationResponse(
                id=f"g_{group.id}",
                target_type="group",
                target_id=group.id,
                name=f"{group.group_name} (Official)",
                avatar="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop",
                last_message=last_group_msg.text if last_group_msg else "Welcome to Pune community group chat! 🌱",
                last_message_time=last_group_msg.created_at if last_group_msg else datetime.utcnow(),
                unread_count=1,
                is_online=True
            )
        )

    return conversations

@router.get("/messages/{target_type}/{target_id}", response_model=List[ChatMessageResponse])
def get_message_thread(
    target_type: str,
    target_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieves full chat message history with another user or group."""
    uid = current_user.id if current_user else 1

    if target_type == "group":
        messages = (
            db.query(ChatMessage, User)
            .join(User, ChatMessage.sender_id == User.id)
            .filter(ChatMessage.group_id == target_id)
            .order_by(ChatMessage.created_at.asc())
            .limit(50)
            .all()
        )
    else:
        # Mark incoming messages as read
        db.query(ChatMessage).filter(
            ChatMessage.sender_id == target_id,
            ChatMessage.recipient_id == uid
        ).update({"is_read": 1})
        db.commit()

        messages = (
            db.query(ChatMessage, User)
            .join(User, ChatMessage.sender_id == User.id)
            .filter(
                or_(
                    and_(ChatMessage.sender_id == uid, ChatMessage.recipient_id == target_id),
                    and_(ChatMessage.sender_id == target_id, ChatMessage.recipient_id == uid)
                )
            )
            .order_by(ChatMessage.created_at.asc())
            .limit(50)
            .all()
        )

    results = []
    for msg, sender in messages:
        results.append(
            ChatMessageResponse(
                id=msg.id,
                sender_id=msg.sender_id,
                sender_name=sender.name,
                sender_avatar=sender.avatar_url,
                recipient_id=msg.recipient_id,
                group_id=msg.group_id,
                text=msg.text,
                reaction=msg.reaction,
                is_read=bool(msg.is_read),
                created_at=msg.created_at,
                is_mine=(msg.sender_id == uid)
            )
        )
    return results

@router.post("/messages/{target_type}/{target_id}", response_model=ChatMessageResponse)
def send_message(
    target_type: str,
    target_id: int,
    data: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Sends an instant message to a user or group."""
    uid = current_user.id if current_user else 1
    sender_name = current_user.name if current_user else "You"
    sender_avatar = current_user.avatar_url if current_user else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"

    clean_text = data.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    new_msg = ChatMessage(
        sender_id=uid,
        recipient_id=target_id if target_type == "user" else None,
        group_id=target_id if target_type == "group" else None,
        text=clean_text,
        reaction=data.reaction,
        is_read=0,
        created_at=datetime.utcnow()
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    return ChatMessageResponse(
        id=new_msg.id,
        sender_id=uid,
        sender_name=sender_name,
        sender_avatar=sender_avatar,
        recipient_id=new_msg.recipient_id,
        group_id=new_msg.group_id,
        text=new_msg.text,
        reaction=new_msg.reaction,
        is_read=False,
        created_at=new_msg.created_at,
        is_mine=True
    )

@router.post("/messages/{message_id}/react")
def react_to_message(
    message_id: int,
    reaction: str, # e.g. "🌱", "❤️", "👏", "🔥"
    db: Session = Depends(get_db)
):
    """Adds a quick emoji reaction to a chat message."""
    msg = db.query(ChatMessage).filter(ChatMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.reaction = reaction
    db.commit()
    return {"status": "success", "message_id": message_id, "reaction": reaction}

