from sqlalchemy.orm import Session
from backend.models import Board

def get_boards(db: Session):
    return db.query(Board).all()
