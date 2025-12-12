from backend.models import Board
from . import schemas, crud


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models
from ..auth.utils import get_current_user

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db

router = APIRouter(prefix="/boards", tags=["boards"])

@router.get("/", response_model=list[schemas.BoardOut])
def list_boards(db: Session = Depends(get_db)):
    return crud.get_boards(db)



@router.get("/ping")
def boards_ping(current_user: models.User = Depends(get_current_user)):
    return {"message": f"Boards API OK for user {current_user.email}"}


@router.get("/")
def list_boards(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    boards = (
        db.query(models.Board)
        .filter(models.Board.user_id == current_user.id)
        .order_by(models.Board.id)
        .all()
    )
    return boards
