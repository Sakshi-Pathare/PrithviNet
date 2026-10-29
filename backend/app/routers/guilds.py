from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Guild, User
from app.schemas import GuildResponse

router = APIRouter(prefix="/api/guilds", tags=["guilds"])

@router.get("/", response_model=List[GuildResponse])
def get_guilds(db: Session = Depends(get_db)):
    """Returns all environmental guilds sorted by total impact score."""
    guilds = db.query(Guild).order_by(Guild.total_impact_score.desc()).all()
    results = []
    for g in guilds:
        results.append(
            GuildResponse(
                id=g.id,
                name=g.name,
                total_impact_score=g.total_impact_score,
                region_tag=g.region_tag,
                description=g.description,
                icon=g.icon,
                member_count=len(g.members)
            )
        )
    return results

@router.post("/{guild_id}/join", response_model=GuildResponse)
def join_guild(guild_id: int, user_id: int = Query(1), db: Session = Depends(get_db)):
    """Assigns the user to a chosen guild."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    guild = db.query(Guild).filter(Guild.id == guild_id).first()
    if not guild:
        raise HTTPException(status_code=404, detail="Guild not found")

    user.guild_id = guild.id
    db.commit()
    db.refresh(guild)

    return GuildResponse(
        id=guild.id,
        name=guild.name,
        total_impact_score=guild.total_impact_score,
        region_tag=guild.region_tag,
        description=guild.description,
        icon=guild.icon,
        member_count=len(guild.members)
    )

