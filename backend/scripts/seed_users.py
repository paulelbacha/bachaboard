#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models import User, ThemeType
from app.utils.auth import get_password_hash

def create_initial_users():
    """Create initial user accounts and set up follow relationships"""

    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = Session(engine)

    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print(f"Database already has {existing_users} users. Skipping seed.")
        return

    # Create users
    users_data = [
        {
            "username": "uncle_paul",
            "password": "bachaboard123",  # Change this!
            "display_name": "Uncle Paul",
            "theme": ThemeType.NEUTRAL
        },
        {
            "username": "niece_lily",
            "password": "kitty2024",  # Change this!
            "display_name": "Lily",
            "theme": ThemeType.HELLO_KITTY
        },
        {
            "username": "nephew_max",
            "password": "pikachu2024",  # Change this!
            "display_name": "Max",
            "theme": ThemeType.POKEMON
        }
    ]

    created_users = []
    for user_data in users_data:
        user = User(
            username=user_data["username"],
            hashed_password=get_password_hash(user_data["password"]),
            display_name=user_data["display_name"],
            theme=user_data["theme"]
        )
        db.add(user)
        created_users.append(user)
        print(f"Created user: {user.username}")

    db.commit()

    # Set up follow relationships (everyone follows everyone)
    for user in created_users:
        for other_user in created_users:
            if user.id != other_user.id:
                user.following.append(other_user)

    db.commit()
    print("\nAll users now follow each other!")

    print("\n=== User Credentials ===")
    for user_data in users_data:
        print(f"Username: {user_data['username']}")
        print(f"Password: {user_data['password']}")
        print(f"Theme: {user_data['theme'].value}")
        print("---")

    print("\n✅ Seed completed successfully!")
    print("⚠️  IMPORTANT: Change these passwords before deploying to production!")

    db.close()

if __name__ == "__main__":
    create_initial_users()