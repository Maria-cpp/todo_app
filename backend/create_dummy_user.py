"""Script to create a dummy user for testing."""
import os
import sys
from passlib.context import CryptContext
from sqlmodel import Session, select

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import engine, init_db
from models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_dummy_user():
    """Create a dummy user for testing if it doesn't exist."""
    init_db()

    with Session(engine) as session:
        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == "test@example.com")
        ).first()

        if existing_user:
            print("Dummy user already exists:")
            print(f"  Email: {existing_user.email}")
            print(f"  Name: {existing_user.name}")
            return

        # Create dummy user
        user = User(
            email="test@example.com",
            name="Test User",
            hashed_password=pwd_context.hash("password123"),
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        print("Dummy user created successfully!")
        print(f"  Email: test@example.com")
        print(f"  Password: password123")
        print(f"  Name: Test User")


if __name__ == "__main__":
    create_dummy_user()
