import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.seed_data import seed_initial_data
from app.validation import run_photo_check

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_initial_data(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_feed_endpoint():
    response = client.get("/api/feed/?sort_by=recent")
    assert response.status_code == 200
    posts = response.json()
    assert len(posts) > 0
    assert "co2_saved_kg" in posts[0]
    assert posts[0]["status"] == "Verified"

def test_map_points_endpoint():
    response = client.get("/api/map/points")
    assert response.status_code == 200
    points = response.json()
    assert len(points) > 0
    assert "lat" in points[0]
    assert "lng" in points[0]
    assert "location_name" in points[0]

def test_create_post_and_photo_check():
    payload = {
        "description": "Planted 5 neem saplings with campus friends near the gate.",
        "location_name": "MITAOE Campus, Alandi",
        "category": "Tree Planting",
        "user_id": 1,
        "lat": 18.675,
        "lng": 73.896,
        "photo_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
    }
    response = client.post("/api/posts/", data=payload)
    assert response.status_code == 201
    post = response.json()
    assert post["status"] == "Verified"
    assert post["co2_saved_kg"] > 0
    assert post["points_awarded"] >= 40

def test_photo_check_function():
    status, co2, points, feedback = run_photo_check(
        photo_url="https://example.com/tree.jpg",
        location_name="Pune Garden",
        description="Planted some trees"
    )
    assert status == "Verified"
    assert co2 > 0
    assert points > 0

def test_redeem_reward():
    user_res = client.get("/api/users/me?user_id=1")
    initial_points = user_res.json()["green_points"]

    rewards_res = client.get("/api/rewards/")
    assert rewards_res.status_code == 200
    rewards = rewards_res.json()
    assert len(rewards) > 0

    first_reward = rewards[0]
    if initial_points >= first_reward["cost_in_points"]:
        res = client.post("/api/rewards/redeem", json={"user_id": 1, "reward_id": first_reward["id"]})
        assert res.status_code == 200
        data = res.json()
        assert "voucher_code" in data
        assert data["new_green_points"] == initial_points - first_reward["cost_in_points"]
