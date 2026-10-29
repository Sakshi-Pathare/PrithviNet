from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CommunityGroup, User
from app.schemas import CommunityGroupResponse

router = APIRouter(prefix="/api/groups", tags=["groups"])

@router.get("/", response_model=List[CommunityGroupResponse])
def get_community_groups(db: Session = Depends(get_db)):
    """Returns community and college groups sorted by total environmental impact."""
    groups = db.query(CommunityGroup).order_by(CommunityGroup.total_impact_score.desc()).all()
    results = []
    for g in groups:
        results.append(
            CommunityGroupResponse(
                id=g.id,
                group_name=g.group_name,
                total_impact_score=g.total_impact_score,
                description=g.description,
                city_tag=g.city_tag,
                icon=g.icon,
                member_count=len(g.members)
            )
        )
    return results

@router.post("/{group_id}/join", response_model=CommunityGroupResponse)
def join_community_group(group_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    """Enlists the user into a selected community or campus group."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    group = db.query(CommunityGroup).filter(CommunityGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user.community_group_id = group.id
    db.commit()
    db.refresh(group)

    return CommunityGroupResponse(
        id=group.id,
        group_name=group.group_name,
        total_impact_score=group.total_impact_score,
        description=group.description,
        city_tag=group.city_tag,
        icon=group.icon,
        member_count=len(group.members)
    )

