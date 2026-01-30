# BachaBoard

A private family sharing app with themed experiences for kids and adults.

## Features

- 🔐 Password-protected authentication
- 🎨 User themes (Hello Kitty, Pokemon, Neutral)
- ✍️ Create posts with text, photos, or drawings
- 🎨 Drawing canvas with auto-save
- 💬 Comments and reactions on posts
- 👥 Follow system
- 💌 Feedback submission for character requests

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL
- **Storage**: Cloudinary for images
- **Deployment**: Railway

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/bachaboard
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Local Development

### Install dependencies:
```bash
# Install all dependencies
npm run install:all

# Or manually:
npm install
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
```

### Run development server:
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Deployment

The app is configured for Railway deployment:

1. Push to GitHub main branch
2. Railway automatically builds and deploys
3. Set environment variables in Railway dashboard

## User Management

Create users through the API or seed script:

```python
# backend/scripts/seed_users.py
python seed_users.py
```

## Project Structure

```
bachaboard/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Route pages
│   │   ├── stores/     # Zustand stores
│   │   └── themes/     # Theme configurations
├── backend/            # FastAPI app
│   ├── app/
│   │   ├── models/     # Database models
│   │   ├── routers/    # API endpoints
│   │   └── utils/      # Utilities
└── README.md
```

## License

Private family project - not for public use.