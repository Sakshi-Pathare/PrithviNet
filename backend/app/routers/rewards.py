import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, RewardItem, Redemption
from app.schemas import RewardItemResponse, RedeemRequest, RedemptionResponse

router = APIRouter(prefix="/api/rewards", tags=["rewards"])

@router.get("/", response_model=List[RewardItemResponse])
def get_rewards(db: Session = Depends(get_db)):
    """Returns all available eco-vouchers from local partner businesses."""
    return db.query(RewardItem).filter(RewardItem.stock > 0).all()

@router.post("/redeem", response_model=RedemptionResponse, status_code=status.HTTP_200_OK)
def redeem_reward(payload: RedeemRequest, db: Session = Depends(get_db)):
    """
    Deducts user green_points and issues a unique discount voucher code for local partner businesses.
    """
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    reward = db.query(RewardItem).filter(RewardItem.id == payload.reward_id).first()
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    if reward.stock <= 0:
        raise HTTPException(status_code=400, detail="This discount voucher is currently out of stock.")

    if user.green_points < reward.cost_in_points:
        raise HTTPException(
            status_code=400,
            detail=f"You need {reward.cost_in_points} Green Points for this reward, but you currently have {user.green_points} Green Points."
        )

    # Deduct Green Points
    user.green_points -= reward.cost_in_points
    reward.stock = max(0, reward.stock - 1)

    # Generate unique, simple readable voucher code
    store_prefix = "".join([c for c in reward.partner_store_name.upper() if c.isalnum()])[:4]
    unique_suffix = uuid.uuid4().hex[:6].upper()
    voucher_code = f"PN-{store_prefix}-{unique_suffix}"

    redemption = Redemption(
        user_id=user.id,
        reward_id=reward.id,
        voucher_code=voucher_code,
        cost_paid=reward.cost_in_points
    )
    db.add(redemption)
    db.commit()
    db.refresh(redemption)

    instructions = (
        f"Show this voucher code '{voucher_code}' at {reward.partner_store_name} "
        f"counter or during online checkout to claim your {reward.title}."
    )

    return RedemptionResponse(
        id=redemption.id,
        reward_title=reward.title,
        partner_store_name=reward.partner_store_name,
        voucher_code=voucher_code,
        cost_paid=reward.cost_in_points,
        new_green_points=user.green_points,
        redeemed_at=redemption.redeemed_at,
        instructions=instructions
    )
