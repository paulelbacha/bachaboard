from sqlalchemy import Column, Integer, String, DateTime, Enum, Table, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

# Association table for the many-to-many relationship between users (followers/following)
followers = Table(
    'followers',
    Base.metadata,
    Column('follower_id', Integer, ForeignKey('users.id')),
    Column('followed_id', Integer, ForeignKey('users.id'))
)

class ThemeType(enum.Enum):
    HELLO_KITTY = "hello_kitty"
    POKEMON = "pokemon"
    NEUTRAL = "neutral"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    theme = Column(Enum(ThemeType), default=ThemeType.NEUTRAL)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    reactions = relationship("Reaction", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")

    # Self-referential many-to-many for followers
    following = relationship(
        "User",
        secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref="followers"
    )