from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    emoji = Column(String, nullable=False)  # Store emoji unicode or name
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    post = relationship("Post", back_populates="reactions")
    user = relationship("User", back_populates="reactions")

    # Ensure one reaction per user per post
    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='_post_user_uc'),)