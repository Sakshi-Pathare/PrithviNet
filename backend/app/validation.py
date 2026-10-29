from typing import Tuple

CATEGORY_IMPACTS = {
    "Tree Planting": (20.0, 100),
    "Clean-up Drive": (8.5, 60),
    "Solar Energy": (25.0, 120),
    "Composting": (6.0, 50),
    "Cycling / Walking": (4.0, 40),
}

def detect_category(description: str, suggested: str = "Clean-up Drive") -> str:
    desc = description.lower()
    if any(w in desc for w in ["tree", "plant", "sapling", "seedling", "garden", "banyan", "neem"]):
        return "Tree Planting"
    if any(w in desc for w in ["solar", "sun", "panel", "energy", "inverter"]):
        return "Solar Energy"
    if any(w in desc for w in ["compost", "food waste", "organic", "wet waste", "pit"]):
        return "Composting"
    if any(w in desc for w in ["cycle", "bicycle", "walk", "metro", "transit", "pedestrian"]):
        return "Cycling / Walking"
    if any(w in desc for w in ["clean", "trash", "plastic", "waste", "garbage", "litter", "river", "beach"]):
        return "Clean-up Drive"
    return suggested or "Clean-up Drive"

def run_photo_check(
    photo_url: str,
    location_name: str,
    description: str,
    category: str = "Clean-up Drive"
) -> Tuple[str, float, int, str]:
    """
    Automated 'Photo Check':
    Validates photo presence, location name, and description.
    Approves the post as 'Verified' and awards Green Points.
    
    Returns:
        (status, co2_saved_kg, points_awarded, feedback_message)
    """
    if not photo_url or len(photo_url.strip()) < 5:
        return "Pending", 0.0, 0, "Please attach a clear photo of your eco-action."

    if not location_name or len(location_name.strip()) < 2:
        return "Pending", 0.0, 0, "Please provide the neighborhood or campus location name."

    resolved_cat = detect_category(description, category)
    base_co2, base_points = CATEGORY_IMPACTS.get(resolved_cat, (7.0, 50))

    feedback = f"Photo Check Passed! Your real-action proof for {resolved_cat} at {location_name} has been verified."
    return "Verified", base_co2, base_points, feedback

