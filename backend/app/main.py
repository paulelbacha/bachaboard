from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.routers import auth, posts, users, feedback, drawings
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BachaBoard API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Will be updated for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(drawings.router, prefix="/api/drawings", tags=["drawings"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])

# Serve static files (React build) in production
static_path = Path(__file__).parent.parent / "static"
if static_path.exists():
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "BachaBoard API"}