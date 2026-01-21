import secrets
import bcrypt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlmodel import Session, select

from db import get_session
from models import User, UserCreate, UserLogin, UserRead, Session as UserSession

router = APIRouter(prefix="/api/auth", tags=["auth"])

SESSION_DURATION_DAYS = 7
SESSION_COOKIE_NAME = "session_token"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_session_token() -> str:
    return secrets.token_urlsafe(32)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserCreate,
    response: Response,
    session: Session = Depends(get_session),
):
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hash_password(user_data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create session
    token = create_session_token()
    user_session = UserSession(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=SESSION_DURATION_DAYS),
    )
    session.add(user_session)
    session.commit()

    # Set cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=SESSION_DURATION_DAYS * 24 * 60 * 60,
        samesite="lax",
    )

    return user


@router.post("/login", response_model=UserRead)
def login(
    credentials: UserLogin,
    response: Response,
    session: Session = Depends(get_session),
):
    # Find user
    user = session.exec(
        select(User).where(User.email == credentials.email)
    ).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create session
    token = create_session_token()
    user_session = UserSession(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(days=SESSION_DURATION_DAYS),
    )
    session.add(user_session)
    session.commit()

    # Set cookie
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=SESSION_DURATION_DAYS * 24 * 60 * 60,
        samesite="lax",
    )

    return user


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    session: Session = Depends(get_session),
):
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if token:
        # Delete session from database
        user_session = session.exec(
            select(UserSession).where(UserSession.token == token)
        ).first()
        if user_session:
            session.delete(user_session)
            session.commit()

    # Clear cookie
    response.delete_cookie(key=SESSION_COOKIE_NAME)

    return {"message": "Logged out successfully"}


@router.get("/session")
def get_session_info(
    request: Request,
    session: Session = Depends(get_session),
):
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if not token:
        return {"user": None}

    # Find session
    user_session = session.exec(
        select(UserSession).where(
            UserSession.token == token,
            UserSession.expires_at > datetime.utcnow()
        )
    ).first()

    if not user_session:
        return {"user": None}

    # Get user
    user = session.get(User, user_session.user_id)

    if not user:
        return {"user": None}

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        }
    }
