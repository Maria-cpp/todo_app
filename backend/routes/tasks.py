from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session, select

from db import get_session
from models import Task, TaskCreate, TaskRead, TaskUpdate
from auth import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    user: dict = Depends(get_current_user),
):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        due_date=task_data.due_date,
        user_id=user["id"],
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
    user: dict = Depends(get_current_user),
):
    query = select(Task).where(Task.user_id == user["id"])

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


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    session: Session = Depends(get_session),
    user: dict = Depends(get_current_user),
):
    task = session.get(Task, task_id)

    if not task or task.user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    user: dict = Depends(get_current_user),
):
    task = session.get(Task, task_id)

    if not task or task.user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    user: dict = Depends(get_current_user),
):
    task = session.get(Task, task_id)

    if not task or task.user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    session.delete(task)
    session.commit()
    return None


@router.patch("/{task_id}/complete", response_model=TaskRead)
def toggle_task_complete(
    task_id: int,
    session: Session = Depends(get_session),
    user: dict = Depends(get_current_user),
):
    task = session.get(Task, task_id)

    if not task or task.user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
