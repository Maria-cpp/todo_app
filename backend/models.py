from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import SQLModel, Field
from pydantic import field_validator, EmailStr


# ============ User Models ============

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: Optional[str] = None


class User(UserBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    email: str
    password: str = Field(min_length=8)
    name: Optional[str] = None


class UserLogin(SQLModel):
    email: str
    password: str


class UserRead(UserBase):
    id: str
    created_at: datetime


# ============ Session Models ============

class Session(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    token: str = Field(unique=True, index=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ============ Task Models ============


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    due_date: Optional[datetime] = Field(default=None)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    completed: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: int
    user_id: str
    completed: bool
    created_at: datetime
    updated_at: datetime
