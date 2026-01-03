# FestWish - Festival Wishing Platform

A production-ready web application for sending automated, personalized festival wishes. Create beautiful greeting cards with messages tailored to your relationships.

## Features

- **Multi-Festival Support**: 12+ festivals from different cultures (Diwali, Christmas, Eid, Holi, etc.)
- **Personalized Messages**: 50+ messages per festival-relationship combination
- **Relationship-Based**: 29 relationship types for personalized greetings
- **Card Generation**: Beautiful greeting cards with text overlay
- **Random Content**: Different experience on every visit
- **Cultural Content**: Festival stories, significance, traditions, and quotes
- **SEO-Friendly**: Dedicated pages for each festival
- **Future-Ready**: Messaging abstraction layer for WhatsApp/SMS/Email integration

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Card Generation | Pillow (Python) |

## Architecture

```
festwish/
├── backend/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── core/         # Config, database, exceptions
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   ├── migrations/       # SQL schema
│   ├── seeds/           # Seed data
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── store/        # Zustand store
│   └── package.json
└── README.md
```

## Prerequisites

- Python 3.12+
- Node.js 18+
- Supabase account (free tier works)

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   - Copy contents from `backend/migrations/001_initial_schema.sql`
   - Execute in SQL Editor
3. Create a storage bucket named `festwish-images`
4. Get your credentials from Project Settings > API:
   - Project URL
   - Anon public key
   - Service role key

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_project_url
# SUPABASE_KEY=your_anon_key
# SUPABASE_SERVICE_KEY=your_service_role_key

# Seed the database
python -m seeds.run_seed

# Run the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional, uses proxy by default)
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env

# Run development server
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts |
| `relationships` | 29 relationship types (database-driven) |
| `festivals` | Festival master data with cultural content |
| `festival_quotes` | Multiple quotes per festival |
| `festival_images` | 20+ images per festival |
| `wish_messages` | 50+ messages per festival-relationship |
| `user_uploaded_images` | User-uploaded images |
| `generated_wishes` | Wish history |
| `audit_logs` | System audit trail |

### Key Features

- UUID primary keys
- Automatic timestamps
- Soft delete support
- Database functions for random selection

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Festivals
- `GET /api/v1/festivals` - List all festivals
- `GET /api/v1/festivals/{id}` - Get festival details
- `GET /api/v1/festivals/slug/{slug}` - Get by URL slug
- `GET /api/v1/festivals/{id}/random-content` - Get random content

### Relationships
- `GET /api/v1/relationships` - List all relationships (20+)
- `GET /api/v1/relationships/categories` - Get categories

### Wishes
- `POST /api/v1/wishes/create` - Create a wish
- `GET /api/v1/wishes/preview` - Preview without saving
- `POST /api/v1/wishes/{id}/generate-card` - Generate card image
- `GET /api/v1/wishes/{id}/download` - Download card

### Images
- `POST /api/v1/images/upload` - Upload user image
- `GET /api/v1/images/festival/{id}` - Get festival images

## Seeded Content

### Festivals (12)
- Diwali, Christmas, Eid al-Fitr, Holi
- Chinese New Year, Thanksgiving, Easter
- Navratri, Hanukkah, New Year
- Raksha Bandhan, Valentine's Day

### Relationships (29)
- **Family**: Father, Mother, Brother, Sister, Son, Daughter, Grandparent, Grandchild, Uncle, Aunt, Cousin, In-Law, Relative
- **Romantic**: Husband, Wife, Partner, Girlfriend, Boyfriend
- **Friends**: Friend, Best Friend
- **Professional**: Colleague, Manager, Team Member, Teacher, Student, Client, Customer, Mentor
- **Other**: Neighbor

### Messages
- 10+ base templates per relationship
- Auto-generated variations to reach 50+ per festival-relationship combo
- 4 tones: warm, formal, casual, spiritual

## Future Integrations

The system is designed with an abstraction layer for messaging:

```python
class MessageChannel(ABC):
    @abstractmethod
    async def send(self, recipient: str, content: WishContent) -> SendResult:
        pass

# Implementations (stubs ready):
- WhatsAppChannel  # WhatsApp Business API
- SMSChannel       # Twilio
- EmailChannel     # SendGrid
- DownloadChannel  # Implemented (default)
```

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:3000
STORAGE_BUCKET=festwish-images
DEBUG=True
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Production Deployment

### Backend (Example: Railway/Render)
1. Set environment variables
2. Use `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Example: Vercel/Netlify)
1. Set `VITE_API_URL` to production API
2. Build: `npm run build`
3. Deploy `dist` folder

## Project Structure Details

### Backend Services
- `RelationshipService` - Manage relationship types
- `FestivalService` - Festival CRUD and random content
- `WishService` - Create and manage wishes
- `ImageService` - Image upload and management
- `CardService` - Generate greeting cards
- `AuthService` - User authentication
- `MessageChannelFactory` - Messaging abstraction

### Frontend Components
- `Layout` - Main layout with navigation
- `FestivalCard` - Festival display card
- `RelationshipSelect` - Grouped dropdown (20+ options)
- `CardPreview` - Live card preview
- `LoadingSpinner` - Loading state

### Custom Hooks
- `useFestivals` - Fetch festivals
- `useFestivalBySlug` - Fetch by URL slug
- `useRandomContent` - Get random content
- `useRelationships` - Fetch relationships

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use for personal or commercial projects.
