# FestWish - System Architecture

## Overview
FestWish is a festival-wishing platform that enables users to send personalized, auto-generated festival wishes based on relationships.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Auth    │  │ Festival │  │  Wish    │  │    Card      │   │
│  │  Pages   │  │  Browser │  │ Creator  │  │  Generator   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Layer                              │  │
│  │  /auth  /festivals  /relationships  /wishes  /images     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Service Layer                            │  │
│  │  AuthService  FestivalService  WishService  CardService  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Messaging Abstraction Layer                  │  │
│  │  channel_type: whatsapp | sms | email (stubs for now)    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐   │
│  │ PostgreSQL │  │  Storage   │  │    Authentication      │   │
│  │  Database  │  │  (Images)  │  │   (Email/Password)     │   │
│  └────────────┘  └────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables
1. **users** - User accounts and profiles
2. **relationships** - Types of relationships (Father, Mother, Friend, etc.)
3. **festivals** - Festival master data with cultural content
4. **festival_quotes** - Multiple quotes per festival
5. **festival_images** - Multiple images per festival
6. **wish_messages** - Messages per festival-relationship combination
7. **user_uploaded_images** - Images uploaded by users
8. **generated_wishes** - Record of generated wishes
9. **audit_logs** - System audit trail

## API Endpoints

### Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me

### Festivals
- GET /festivals - List all festivals
- GET /festivals/{id} - Get festival details with content
- GET /festivals/{id}/random-content - Get random quote, image, message

### Relationships
- GET /relationships - List all relationship types

### Wishes
- POST /wishes/create - Create a new wish
- GET /wishes/preview - Preview generated card
- POST /wishes/download - Download card
- GET /wishes/history - User's wish history

### Images
- POST /images/upload - Upload user images
- GET /images/festival/{festival_id} - Get festival images

## Key Design Decisions

### 1. Randomness Strategy
- Use PostgreSQL's `ORDER BY RANDOM()` with `LIMIT 1`
- Cache exclusion for recently shown content per user session
- Weighted randomness for premium content

### 2. Card Generation
- Server-side image composition using Pillow
- Template-based card layouts
- Dynamic text overlay with proper typography

### 3. Messaging Abstraction
```python
class MessageChannel(ABC):
    @abstractmethod
    async def send(self, recipient: str, content: WishContent) -> bool:
        pass

class WhatsAppChannel(MessageChannel):  # Stub
class SMSChannel(MessageChannel):       # Stub
class EmailChannel(MessageChannel):     # Stub
```

### 4. Content Management
- All content stored in database
- Admin interface ready for content ingestion
- Metadata tracking for sources

## Technology Choices

| Component | Technology | Reason |
|-----------|------------|--------|
| Frontend | React + Vite | Fast development, modern tooling |
| Backend | FastAPI | Async support, auto docs, Pydantic |
| Database | PostgreSQL (Supabase) | Robust, scalable, built-in auth |
| Storage | Supabase Storage | Integrated with auth, CDN ready |
| Card Generation | Pillow | Python native, flexible |

## Future Integrations

### Messaging APIs (Designed but not implemented)
- WhatsApp Business API
- Twilio SMS
- SendGrid Email

### Enhancements
- AI-powered message generation
- Video greeting cards
- Scheduling wishes
- Analytics dashboard
