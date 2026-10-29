from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import User, CommunityGroup, EcoActionPost, RewardItem

def seed_initial_data(db: Session):
    """Fills the database with initial friendly community actions and rewards if empty."""
    if db.query(User).first() is not None:
        return

    print("[PrithviNet] Seeding friendly community groups, members, action posts, and rewards...")

    # 1. Community Groups
    group1 = CommunityGroup(
        id=1,
        group_name="MITAOE Green Warriors",
        total_impact_score=340.5,
        description="Student-led environmental club running campus tree-planting drives and river cleanups.",
        city_tag="Pune Campus",
        icon="GraduationCap"
    )
    group2 = CommunityGroup(
        id=2,
        group_name="Pune Clean Air & River Volunteers",
        total_impact_score=285.0,
        description="Neighborhood volunteers keeping parks, lakes, and riverfronts trash-free.",
        city_tag="Pune Metro",
        icon="Waves"
    )
    group3 = CommunityGroup(
        id=3,
        group_name="Alandi Solar & Rooftop Network",
        total_impact_score=420.2,
        description="Rooftop solar and clean energy adopters sharing tips to reduce grid emissions.",
        city_tag="Alandi Sector",
        icon="Sun"
    )
    group4 = CommunityGroup(
        id=4,
        group_name="Green Leaf Composting Circle",
        total_impact_score=190.8,
        description="Families turning kitchen wet waste into rich organic compost for gardens.",
        city_tag="Kothrud & Baner",
        icon="Leaf"
    )
    db.add_all([group1, group2, group3, group4])
    db.commit()

    # 2. Users
    user1 = User(
        id=1,
        name="Ananya Sharma",
        email="ananya@prithvinet.org",
        community_group_id=1,
        green_points=240,
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
    )
    user2 = User(
        id=2,
        name="Rohan Patil",
        email="rohan@prithvinet.org",
        community_group_id=2,
        green_points=180,
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
    )
    user3 = User(
        id=3,
        name="Priya Deshmukh",
        email="priya@prithvinet.org",
        community_group_id=3,
        green_points=310,
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop"
    )
    user4 = User(
        id=4,
        name="Amit Kulkarni",
        email="amit@prithvinet.org",
        community_group_id=4,
        green_points=150,
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop"
    )
    db.add_all([user1, user2, user3, user4])
    db.commit()

    # 3. Real Eco-Action Posts
    now = datetime.utcnow()
    posts = [
        EcoActionPost(
            user_id=1,
            group_id=1,
            description="Planted 10 native neem and peepal saplings along Alandi riverbank with college classmates.",
            photo_url="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
            location_name="Alandi Riverbank, Pune",
            lat=18.6756,
            lng=73.8967,
            status="Verified",
            co2_saved_kg=40.0,
            points_awarded=100,
            category="Tree Planting",
            timestamp=now - timedelta(hours=3)
        ),
        EcoActionPost(
            user_id=2,
            group_id=2,
            description="Collected 4 large bags of plastic wrappers and discarded bottles near the park joggers trail.",
            photo_url="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop",
            location_name="Koregaon Park Joggers Trail, Pune",
            lat=18.5362,
            lng=73.8958,
            status="Verified",
            co2_saved_kg=12.5,
            points_awarded=60,
            category="Clean-up Drive",
            timestamp=now - timedelta(hours=8)
        ),
        EcoActionPost(
            user_id=3,
            group_id=3,
            description="Set up rooftop solar panels generating 5 clean units of power each afternoon.",
            photo_url="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop",
            location_name="Baner Bio-Park Area, Pune",
            lat=18.5590,
            lng=73.7868,
            status="Verified",
            co2_saved_kg=45.0,
            points_awarded=120,
            category="Solar Energy",
            timestamp=now - timedelta(days=1, hours=2)
        ),
        EcoActionPost(
            user_id=4,
            group_id=4,
            description="Started apartment composting bin converting 25kg kitchen scraps into rich black soil.",
            photo_url="https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&auto=format&fit=crop",
            location_name="Viman Nagar Housing Society, Pune",
            lat=18.5679,
            lng=73.9143,
            status="Verified",
            co2_saved_kg=15.0,
            points_awarded=50,
            category="Composting",
            timestamp=now - timedelta(days=1, hours=6)
        ),
        EcoActionPost(
            user_id=1,
            group_id=1,
            description="Organized a 12km cycle-to-college ride with 8 friends, leaving motorbikes at home.",
            photo_url="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop",
            location_name="FC Road to Shivajinagar, Pune",
            lat=18.5284,
            lng=73.8432,
            status="Verified",
            co2_saved_kg=8.5,
            points_awarded=40,
            category="Cycling / Walking",
            timestamp=now - timedelta(days=2)
        )
    ]
    db.add_all(posts)
    db.commit()

    # 4. Local Partner Rewards
    rewards = [
        RewardItem(
            id=1,
            title="Free Organic Chai & Bun Maska",
            cost_in_points=50,
            partner_store_name="Chai Point Organic Cafe",
            voucher_code="PN-CHAI-FREE",
            description="Enjoy one free cup of freshly brewed ginger-cardamom organic chai with warm bun maska.",
            category="Food & Drinks",
            image_url="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop",
            stock=80
        ),
        RewardItem(
            id=2,
            title="25% Off Native Potted Plants",
            cost_in_points=80,
            partner_store_name="Paryavaran Green Nursery",
            voucher_code="PN-NURSERY-25",
            description="Get 25% discount on indoor air-purifying plants, herbs, and flowering native saplings.",
            category="Home & Garden",
            image_url="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop",
            stock=45
        ),
        RewardItem(
            id=3,
            title="1-Day City Electric Bus Pass",
            cost_in_points=60,
            partner_store_name="Pune City Transit Authority",
            voucher_code="PN-BUS-PASS",
            description="Unlimited electric bus rides for a whole day anywhere on the Pune metropolitan route.",
            category="Clean Travel",
            image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop",
            stock=100
        ),
        RewardItem(
            id=4,
            title="Bamboo Cutlery & Steel Straw Kit",
            cost_in_points=90,
            partner_store_name="Earthly Zero-Waste Living",
            voucher_code="PN-BAMBOO-KIT",
            description="Pocket travel kit containing bamboo fork, spoon, steel straw and cleaning brush in cotton pouch.",
            category="Eco Goods",
            image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop",
            stock=60
        ),
        RewardItem(
            id=5,
            title="Rs. 200 Off Solar Lantern Kit",
            cost_in_points=120,
            partner_store_name="Surya Urja Essentials",
            voucher_code="PN-SURYA-200",
            description="Rechargeable portable solar LED light for study desks, balconies, and camping trips.",
            category="Clean Energy",
            image_url="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop",
            stock=30
        )
    ]
    db.add_all(rewards)
    db.commit()

    print("[PrithviNet] Seeding finished successfully!")
