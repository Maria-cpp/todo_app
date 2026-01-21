import os
import httpx
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from typing import Optional

from auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(request: Request):
    user = await get_current_user(request)
    return UserResponse(
        id=user.get("id", ""),
        email=user.get("email", ""),
        name=user.get("name"),
    )


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    request: Request,
    user_data: UserUpdate,
):
    user = await get_current_user(request)
    cookies = request.cookies

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{FRONTEND_URL}/api/auth/update-user",
                cookies=cookies,
                json={"name": user_data.name} if user_data.name else {},
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to update profile",
                )

            data = response.json()
            updated_user = data.get("user", user)

            return UserResponse(
                id=updated_user.get("id", user.get("id", "")),
                email=updated_user.get("email", user.get("email", "")),
                name=updated_user.get("name", user_data.name),
            )

    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable",
        )
