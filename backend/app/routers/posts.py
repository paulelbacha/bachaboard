from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models import User, Post, PostType, Comment, Reaction
from app.utils.auth import get_current_user
from app.utils.cloudinary import upload_image

router = APIRouter()

class PostCreate(BaseModel):
    post_type: PostType
    content: Optional[str] = None
    media_url: Optional[str] = None
    drawing_data: Optional[str] = None

class CommentCreate(BaseModel):
    content: str

class ReactionCreate(BaseModel):
    emoji: str

class PostResponse(BaseModel):
    id: int
    author_id: int
    author_name: str
    author_avatar: Optional[str]
    post_type: PostType
    content: Optional[str]
    media_url: Optional[str]
    created_at: datetime
    comments_count: int
    reactions: List[dict]
    user_reaction: Optional[str]

    class Config:
        from_attributes = True

@router.get("/feed", response_model=List[PostResponse])
async def get_feed(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get posts from users the current user follows (including their own)
    following_ids = [u.id for u in current_user.following] + [current_user.id]

    posts = db.query(Post).filter(Post.author_id.in_(following_ids))\
        .order_by(desc(Post.created_at))\
        .offset(skip).limit(limit).all()

    response = []
    for post in posts:
        reactions_summary = {}
        user_reaction = None

        for reaction in post.reactions:
            if reaction.emoji not in reactions_summary:
                reactions_summary[reaction.emoji] = 0
            reactions_summary[reaction.emoji] += 1

            if reaction.user_id == current_user.id:
                user_reaction = reaction.emoji

        response.append({
            "id": post.id,
            "author_id": post.author_id,
            "author_name": post.author.display_name,
            "author_avatar": post.author.avatar_url,
            "post_type": post.post_type,
            "content": post.content,
            "media_url": post.media_url,
            "created_at": post.created_at,
            "comments_count": len(post.comments),
            "reactions": [{"emoji": k, "count": v} for k, v in reactions_summary.items()],
            "user_reaction": user_reaction
        })

    return response

@router.post("/", response_model=dict)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = Post(
        author_id=current_user.id,
        post_type=post_data.post_type,
        content=post_data.content,
        media_url=post_data.media_url,
        drawing_data=post_data.drawing_data
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {"id": new_post.id, "message": "Post created successfully"}

@router.post("/upload-image", response_model=dict)
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Upload to Cloudinary
    url = await upload_image(file, folder="posts")
    return {"url": url}

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    reactions_summary = {}
    user_reaction = None

    for reaction in post.reactions:
        if reaction.emoji not in reactions_summary:
            reactions_summary[reaction.emoji] = 0
        reactions_summary[reaction.emoji] += 1

        if reaction.user_id == current_user.id:
            user_reaction = reaction.emoji

    return {
        "id": post.id,
        "author_id": post.author_id,
        "author_name": post.author.display_name,
        "author_avatar": post.author.avatar_url,
        "post_type": post.post_type,
        "content": post.content,
        "media_url": post.media_url,
        "created_at": post.created_at,
        "comments_count": len(post.comments),
        "reactions": [{"emoji": k, "count": v} for k, v in reactions_summary.items()],
        "user_reaction": user_reaction
    }

@router.post("/{post_id}/comment", response_model=dict)
async def add_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    new_comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment_data.content
    )

    db.add(new_comment)
    db.commit()

    return {"message": "Comment added successfully"}

@router.post("/{post_id}/react", response_model=dict)
async def toggle_reaction(
    post_id: int,
    reaction_data: ReactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if reaction exists
    existing_reaction = db.query(Reaction).filter(
        Reaction.post_id == post_id,
        Reaction.user_id == current_user.id
    ).first()

    if existing_reaction:
        if existing_reaction.emoji == reaction_data.emoji:
            # Remove reaction if same emoji
            db.delete(existing_reaction)
            message = "Reaction removed"
        else:
            # Update to new emoji
            existing_reaction.emoji = reaction_data.emoji
            message = "Reaction updated"
    else:
        # Add new reaction
        new_reaction = Reaction(
            post_id=post_id,
            user_id=current_user.id,
            emoji=reaction_data.emoji
        )
        db.add(new_reaction)
        message = "Reaction added"

    db.commit()
    return {"message": message}

@router.get("/{post_id}/comments", response_model=list)
async def get_comments(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comments = db.query(Comment).filter(Comment.post_id == post_id)\
        .order_by(desc(Comment.created_at)).all()

    return [
        {
            "id": c.id,
            "author_name": c.author.display_name,
            "author_avatar": c.author.avatar_url,
            "content": c.content,
            "created_at": c.created_at
        } for c in comments
    ]