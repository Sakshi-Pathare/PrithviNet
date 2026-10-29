# Implementation Plan - PrithviNet (Sage Green & Warm Beige Edition)

**Tagline:** *Connect for a Greener Tomorrow*  
**Mission:** A hyper-local, gamified environmental action platform connecting citizens, college clubs, and neighborhoods to log real-world eco-actions, verify them with automated photo checks, track community CO₂ savings, earn **Green Points**, and redeem rewards at local partner stores.

---

## 1. Aesthetic & Design System

### Color Palette (Sage Green & Warm Beige Theme):
- **Backgrounds:** Soft warm beige (`#F5F2EB` / `#EFECE4`) and clean cream card surfaces (`#FFFFFF`).
- **Primary Accents:** Muted organic sage green (`#7C9D8E` and `#587B6C`) for buttons, active navigation states, and borders.
- **Secondary Accents:** Deep earthy forest green (`#2C4A3E`) for strong headlines and high-contrast text, paired with warm stone gray (`#8C857B`) for secondary metadata and icons.
- **UI Language:** Strictly avoid complex technical jargon. Human-friendly terms:
  - *"Photo Check"* (automated action approval)
  - *"Real-Action Proof"* (photo and location submission)
  - *"Community Map"* (interactive map with sage green pins)
  - *"Green Points"* (earned points for verified actions)
  - *"My Group"* (neighborhood teams and campus clubs)
  - *"Local Perks"* (vouchers and discounts at neighborhood stores)

---

## 2. Directory Structure

```
ParyavaranMitra/
├── implementation_plan.md          # Architectural plan & palette specifications
├── README.md                       # Comprehensive guide & local setup instructions
├── start_prithvinet.bat            # 1-Click launcher for Windows
├── stop_prithvinet.bat             # 1-Click shutdown script
│
├── backend/                        # FastAPI Backend Application
│   ├── app/
│   │   ├── config.py               # Environment configuration & SQLite DB setup
│   │   ├── database.py             # SQLAlchemy session and engine
│   │   ├── models.py               # User, CommunityGroup, EcoActionPost, RewardItem, Redemption
│   │   ├── schemas.py              # Pydantic v2 schemas
│   │   ├── validation.py           # Automated "Photo Check" validation & points calculation
│   │   ├── seed_data.py            # Initial seed records for Pune and community groups
│   │   ├── main.py                 # FastAPI application, CORS, static uploads & startup seed
│   │   └── routers/
│   │       ├── posts.py            # POST /api/posts/ & GET /api/feed/
│   │       ├── map.py              # GET /api/map/points (Community Map pins)
│   │       ├── rewards.py          # GET /api/rewards/ & POST /api/rewards/redeem
│   │       ├── groups.py           # GET /api/groups/ & POST /api/groups/{id}/join
│   │       └── users.py            # GET /api/users/me & community impact stats
│   ├── tests/
│   │   └── test_api.py             # Pytest automated test suite (6/6 passing)
│   ├── uploads/                    # Local storage for user photo proof
│   └── requirements.txt            # Python dependencies
│
└── frontend/                       # React 18+ Single Page Application
    ├── package.json
    ├── vite.config.js              # Vite server & API reverse proxy configuration
    ├── tailwind.config.js          # Sage Green & Warm Beige palette configuration
    ├── index.html                  # HTML entrypoint with PrithviNet branding
    └── src/
        ├── index.css               # Warm beige theme, organic soft shadows, custom scrollbars
        ├── api.js                  # Frontend API client with offline fallback states
        ├── App.jsx                 # Master controller, navigation tabs, user state
        └── components/
            ├── Header.jsx          # PrithviNet Logo, Tagline, Navigation, Green Points
            ├── Feed.jsx            # Card-based social stream of verified actions & cheers
            ├── UploadModal.jsx     # Clean 2-step wizard for photo upload & 1-sentence note
            ├── MapPage.jsx         # Interactive Community Map with earthy tones & sage green pins
            ├── GroupsPage.jsx      # Community & College Groups leaderboard & 1-click join
            ├── RewardsPage.jsx     # Local eco-perks store with voucher code reveal
            ├── CommunityStatsBar.jsx # Live community impact ticker in soft beige
            └── Toast.jsx           # Friendly notification popups
```

---

## 3. Database Schema (`models.py`)

1. **User**: `id`, `name`, `email`, `community_group_id`, `green_points`.
2. **CommunityGroup**: `id`, `group_name`, `total_impact_score`, `description`, `city_tag`.
3. **EcoActionPost**: `id`, `user_id`, `group_id`, `description`, `photo_url`, `location_name`, `status` ("Pending", "Verified"), `co2_saved_kg`, `timestamp`.
4. **RewardItem**: `id`, `title`, `cost_in_points`, `partner_store_name`, `voucher_code`.
5. **Redemption**: `id`, `user_id`, `reward_id`, `voucher_code`, `cost_paid`, `redeemed_at`.

---

## 4. API Endpoints

- `POST /api/posts/`: Upload real-action proof (photo, location name, description). Runs Photo Check, marks verified, awards Green Points, and updates group score.
- `GET /api/feed/`: Stream of verified eco-posts sorted by recent activity or impact score.
- `GET /api/map/points`: Location data (`lat`, `lng`, `location_name`, `photo_url`, `co2_saved_kg`, `points_awarded`) for community map pins.
- `POST /api/rewards/redeem`: Deducts Green Points and issues unique discount voucher codes for local partner shops.
- `GET /api/rewards/`: Lists available partner discount vouchers.
- `GET /api/groups/`: Lists community & college groups with total impact scores.
- `POST /api/groups/{id}/join`: Enlists the user in a selected community group.
- `GET /api/users/me`: Current user profile and live Green Points balance.
