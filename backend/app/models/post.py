from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class PostType(enum.Enum):
    TEXT = "text"
    PHOTO = "photo"
    DRAWING = "drawing"

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_type = Column(Enum(PostType), nullable=False)
    content = Column(Text, nullable=True)  # For text posts
    media_url = Column(String, nullable=True)  # For photos and drawings
    drawing_data = Column(Text, nullable=True)  # JSON data for canvas state
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    reactions = relationship("Reaction", back_populates="post", cascade="all, delete-orphan")