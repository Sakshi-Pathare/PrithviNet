# 🌱 PrithviNet - Connect for a Greener Tomorrow

> **PrithviNet** is a hyper-local, gamified environmental action platform. It empowers citizens, college clubs, and neighborhood groups to log verified eco-actions (cleanups, tree-planting drives, composting, rooftop solar, and cycling), verify them with an automated **"Photo Check"**, track community CO₂ savings, earn **"Green Points"**, and redeem real-world discount vouchers at local partner shops.

---

## 🎯 Human-Friendly Language & Principles

PrithviNet strictly avoids complex technical jargon on the user interface:
- **"Photo Check"** instead of metadata verification / algorithmic scoring
- **"Real-Action Proof"** instead of cryptographic proof-of-work
- **"Community Map"** instead of geospatial node cluster
- **"Green Points"** instead of token minting
- **"My Group"** for neighborhood volunteers and college clubs (e.g., *MITAOE Green Warriors*, *Pune Clean Air & River Volunteers*)
- **"Local Perks"** for discounts at neighborhood organic cafes, plant nurseries, and transit passes

---

## 🛠️ Tech Stack

- **Backend:** Python (FastAPI), SQLAlchemy ORM, SQLite (zero-setup default) / PostgreSQL PostGIS support, Pydantic v2.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons.
- **Aesthetic:** Clean dark-mode background (`#0B130B`), frosted glass cards (`rgba(255, 255, 255, 0.05)`), and vibrant bio-luminescent emerald green accents (`#00FF66`).

---

## 📁 Project Structure

```
ParyavaranMitra/
├── implementation_plan.md          # Architectural plan & data specifications
├── README.md                       # Complete guide & documentation
├── start_prithvinet.bat            # 1-Click launcher for Windows
├── stop_prithvinet.bat             # 1-Click shutdown script
│
├── backend/                        # FastAPI Backend Application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application, CORS, static uploads & startup seed
│   │   ├── config.py               # Settings & upload directories
│   │   ├── database.py             # SQLAlchemy session, engine, and SQLite/PostgreSQL setup
│   │   ├── models.py               # User, CommunityGroup, EcoActionPost, RewardItem, Redemption
│   │   ├── schemas.py              # Pydantic v2 schemas
│   │   ├── validation.py           # Automated "Photo Check" validation & points calculation
│   │   ├── seed_data.py            # Initial seed records for Pune and community groups
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── posts.py            # POST /api/posts/ & GET /api/feed/
│   │       ├── map.py              # GET /api/map/points (Community Map pins)
│   │       ├── rewards.py          # GET /api/rewards/ & POST /api/rewards/redeem
│   │       ├── groups.py           # GET /api/groups/ & POST /api/groups/{id}/join
│   │       └── users.py            # GET /api/users/me & community impact stats
│   ├── tests/
│   │   └── test_api.py             # Pytest automated test suite (6/6 passing)
│   ├── uploads/                    # Local storage for user photo uploads
│   └── requirements.txt            # Python dependencies
│
└── frontend/                       # React 18+ Single Page Application
    ├── package.json
    ├── vite.config.js              # Vite server & API reverse proxy configuration
    ├── tailwind.config.js          # Dark mode (#0B130B) & Emerald (#00FF66) theme
    ├── index.html                  # HTML entrypoint with PrithviNet branding
    └── src/
        ├── index.css               # Clean frosted glass styling, glow scrollbars
        ├── api.js                  # Frontend API client with offline fallback states
        ├── App.jsx                 # Master controller, navigation tabs, user state
        └── components/
            ├── Header.jsx          # PrithviNet Logo, Tagline, Navigation, Green Points
            ├── Feed.jsx            # Card-based social stream of verified actions & cheers
            ├── UploadModal.jsx     # Clean 2-step wizard for photo upload & 1-sentence note
            ├── MapPage.jsx         # Interactive Community Map with green pins & action details
            ├── GroupsPage.jsx      # Community & College Groups leaderboard & 1-click join
            ├── RewardsPage.jsx     # Local eco-perks store with voucher code reveal
            ├── CommunityStatsBar.jsx # Live community impact ticker
            └── Toast.jsx           # Friendly notification popups
```

---

## ⚡ 1-Click Launch (Windows)

Simply double-click:
```bash
start_prithvinet.bat
```
This automatically spins up the FastAPI backend on port `8000` and the React frontend on port `5173`.

To stop the servers, double-click:
```bash
stop_prithvinet.bat
```

---

## 💻 Manual Step-by-Step Setup

### 1. Backend Setup (FastAPI & Python 3.10+)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   # Windows:
   py -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Database Setup & Migrations:
   By default, the backend runs with zero configuration using a local SQLite database (`sqlite:///./terrapulse.db`). On startup, tables are automatically initialized and pre-seeded with friendly sample groups (MITAOE Green Warriors, Pune River Volunteers), real actions, and partner discounts.

   *If you wish to use PostgreSQL / PostGIS:*
   ```bash
   # Windows PowerShell:
   $env:DATABASE_URL="postgresql+psycopg2://postgres:password@localhost:5432/prithvinet"

   # macOS / Linux:
   export DATABASE_URL="postgresql+psycopg2://postgres:password@localhost:5432/prithvinet"
   ```

5. Run the backend server:
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

---

### 2. Frontend Setup (React & Vite)

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   - **Frontend App:** [http://localhost:5173](http://localhost:5173)
   - **Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Running Automated Tests

Run the backend test suite:
```bash
cd backend
py -m pytest tests -v
```

All 6 test cases verify:
- Health check status (`/api/health`)
- Community feed stream (`/api/feed/`)
- Map location points (`/api/map/points`)
- Eco-action submission and "Photo Check" validation (`/api/posts/`)
- Automated validation calculation
- Green Points deduction and partner voucher issuance (`/api/rewards/redeem`)

---

## 📡 API Reference

### 1. Upload Eco-Action (`POST /api/posts/`)
- **Inputs:** `photo` (file or URL), `location_name` (e.g. "Alandi Riverbank, Pune"), `description` (1-sentence summary), `category`, `user_id`.
- **Behavior:** Runs automated "Photo Check". Marks post as "Verified", saves estimated CO₂ prevented, awards Green Points to the user, and credits the community group’s impact score.

### 2. Home Feed (`GET /api/feed/`)
- Returns list of verified actions with photo proof, volunteer name, location, and group affiliation.
- **Parameters:** `sort_by=recent` or `sort_by=impact`, `category`.

### 3. Community Map Pins (`GET /api/map/points`)
- Returns location points (`lat`, `lng`, `location_name`, `photo_url`, `co2_saved_kg`, `points_awarded`) to display green pins on the interactive map.

### 4. Claim Local Discount Voucher (`POST /api/rewards/redeem`)
- Deducts Green Points from user balance and generates a unique discount voucher code (e.g. `PN-CHAI-79B4`) redeemable at local partner stores.

---

## 💚 License

Built with pride for environmental action and community resilience. Open source under the MIT License.
