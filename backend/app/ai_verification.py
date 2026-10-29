import random
import re
from typing import Dict, Any, Tuple
from app.models import VerificationStatus

CATEGORY_CO2_BASE = {
    "Cleanup": 5.2,
    "Tree Planting": 22.0,
    "Renewable Energy": 34.5,
    "Composting": 3.8,
    "Green Mobility": 2.9,
    "E-Waste Recycling": 8.4,
}

def detect_category(description: str, suggested_category: str = "Cleanup") -> str:
    desc_lower = description.lower()
    
    if any(k in desc_lower for k in ["tree", "sapling", "plant", "forest", "seedling", "garden"]):
        return "Tree Planting"
    if any(k in desc_lower for k in ["solar", "panel", "photovoltaic", "wind", "renewable", "inverter"]):
        return "Renewable Energy"
    if any(k in desc_lower for k in ["compost", "organic", "food waste", "soil", "bio"]):
        return "Composting"
    if any(k in desc_lower for k in ["bike", "cycle", "walk", "metro", "transit", "pedestrian"]):
        return "Green Mobility"
    if any(k in desc_lower for k in ["e-waste", "electronic", "battery", "circuit", "cable"]):
        return "E-Waste Recycling"
    if any(k in desc_lower for k in ["trash", "litter", "plastic", "clean", "beach", "river", "debris"]):
        return "Cleanup"
        
    return suggested_category or "Cleanup"

def verify_eco_action(
    lat: float, 
    lng: float, 
    description: str, 
    media_url: str,
    category: str = "Cleanup"
) -> Tuple[VerificationStatus, float, int, float, str]:
    """
    Simulated AI Proof Engine:
    Validates geospatial coordinates, detects eco action categories, 
    computes estimated CO2 offset, awards Verdants, and computes confidence score.
    
    Returns:
        (status, impact_co2_saved_kg, verdants_awarded, ai_confidence_score, analysis_notes)
    """
    # 1. Spatial validity check
    if lat is None or lng is None:
        return VerificationStatus.REJECTED, 0.0, 0, 0.0, "Missing spatial coordinates."

    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lng <= 180.0):
        return VerificationStatus.REJECTED, 0.0, 0, 0.0, "Coordinates out of bounds."

    # Prevent Null Island (0.0, 0.0)
    if abs(lat) < 0.0001 and abs(lng) < 0.0001:
        return VerificationStatus.REJECTED, 0.0, 0, 0.0, "Location rejected: Null Island detected (0,0)."

    # 2. Media proof check
    if not media_url or len(media_url.strip()) < 5:
        return VerificationStatus.REJECTED, 0.0, 0, 0.0, "Visual proof media is missing or invalid."

    # 3. Text description check
    if not description or len(description.strip()) < 5:
        return VerificationStatus.REJECTED, 0.0, 0, 0.0, "Description is too brief to substantiate action."

    resolved_category = detect_category(description, category)
    base_co2 = CATEGORY_CO2_BASE.get(resolved_category, 4.5)

    # Dynamic multiplier based on content length and simulated variance
    random.seed(f"{round(lat, 3)}_{round(lng, 3)}_{len(description)}")
    multiplier = random.uniform(0.85, 1.35)
    
    # Calculate CO2 offset
    co2_saved = round(base_co2 * multiplier, 2)

    # Verdants formula: 10 Verdants per kg of CO2, min 25 verdants
    verdants_awarded = max(25, int(co2_saved * 10))

    # Simulated Computer Vision & Metadata Confidence
    confidence = round(random.uniform(0.93, 0.99), 2)

    notes = f"AI verified {resolved_category} activity. Spatial cluster confirmed at [{lat:.4f}, {lng:.4f}]. Visual telemetry matched environmental remediation patterns."

    return VerificationStatus.VERIFIED, co2_saved, verdants_awarded, confidence, notes

def calculate_tier(verdants_balance: int) -> str:
    """Helper to update user tier badge based on accumulated balance"""
    if verdants_balance >= 2500:
        return "Apex Earth Restorer"
    elif verdants_balance >= 1200:
        return "Solar Champion"
    elif verdants_balance >= 600:
        return "Forest Sentinel"
    elif verdants_balance >= 250:
        return "Neighborhood Guardian"
    else:
        return "Eco Initiate"

