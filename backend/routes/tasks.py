from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db import get_session
from models import Task, TaskCreate, TaskRead

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


# TODO: Replace with actual auth - get user_id from JWT token
def get_current_user_id() -> str:
    return "temp-user-id"


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=user_id,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("", response_model=list[TaskRead])
def get_tasks(
    status: str = "all",
    sort: str = "created",
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id),
):
    query = select(Task).where(Task.user_id == user_id)

    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "pending":
        query = query.where(Task.completed == False)

    if sort == "title":
        query = query.order_by(Task.title)
    elif sort == "due_date":
        query = query.order_by(Task.due_date.asc().nulls_last())
    else:
        query = query.order_by(Task.created_at.desc())

    tasks = session.exec(query).all()
    return tasks
