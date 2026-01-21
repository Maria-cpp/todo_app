from datetime import datetime
from fastapi import Depends, HTTPException, Request, status
from sqlmodel import Session, select

from db import get_session
from models import User, Session as UserSession

SESSION_COOKIE_NAME = "session_token"


def get_current_user(
    request: Request,
    session: Session = Depends(get_session),
) -> dict:
    """
    Verify session from cookie and return user data.
    Returns user data if authenticated, raises 401 if not.
    """
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Find valid session
    user_session = session.exec(
        select(UserSession).where(
            UserSession.token == token,
            UserSession.expires_at > datetime.utcnow()
        )
    ).first()

    if not user_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    # Get user
    user = session.get(User, user_session.user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
    }


def get_current_user_id_from_user(user: dict) -> str:
    """Extract user ID from user dict."""
    return user.get("id", "")
