from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth.utils import get_current_user

from backend.cards.schemas import (
    CardCreate,
    CardUpdate,
    CardResponse,
    CardDeleteResponse
)
from backend.cards.models import Card
from backend.models import Board, List, User


router = APIRouter(
    prefix="/cards",
    tags=["Cards"]
)


# ---------------------------------------------------------
# POST /cards → Crear tarjeta
# ---------------------------------------------------------
@router.post("/", response_model=CardResponse)
def create_card(
    card: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Comprobar que el tablero pertenece al usuario
    board = db.query(Board).filter(
        Board.id == card.board_id,
        Board.user_id == current_user.id
    ).first()

    if not board:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para crear tarjetas en este tablero."
        )

    # Buscar la lista "Por hacer"
    por_hacer_list = db.query(List).filter(
        List.board_id == board.id,
        List.name.ilike("por hacer")
    ).first()

    if not por_hacer_list:
        raise HTTPException(
            status_code=400,
            detail="La lista 'Por hacer' no existe."
        )

    # Crear tarjeta (SIN order)
    new_card = Card(
        title=card.title,
        description=card.description,
        due_date=card.due_date,
        board_id=board.id,
        list_id=por_hacer_list.id,
        user_id=current_user.id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return new_card


# ---------------------------------------------------------
# GET /cards?board_id=...
# ---------------------------------------------------------
@router.get("/", response_model=list[CardResponse])
def list_cards(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    board = db.query(Board).filter(
        Board.id == board_id,
        Board.user_id == current_user.id
    ).first()

    if not board:
        raise HTTPException(status_code=403)

    cards = db.query(Card).filter(
        Card.board_id == board_id
    ).order_by(Card.list_id).all()

    return cards


# ---------------------------------------------------------
# PATCH /cards/{id} → Editar tarjeta
# ---------------------------------------------------------
@router.patch("/{card_id}", response_model=CardResponse)
def update_card(
    card_id: int,
    card_update: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    card = db.query(Card).filter(Card.id == card_id).first()

    if not card:
        raise HTTPException(status_code=404)

    if card.board.user_id != current_user.id:
        raise HTTPException(status_code=403)

    if card_update.title is not None:
        if not card_update.title.strip():
            raise HTTPException(status_code=400)
        card.title = card_update.title

    if card_update.description is not None:
        card.description = card_update.description

    if card_update.due_date is not None:
        card.due_date = card_update.due_date

    if card_update.list_id is not None:
        list_obj = db.query(List).filter(
            List.id == card_update.list_id,
            List.board_id == card.board_id
        ).first()

        if not list_obj:
            raise HTTPException(status_code=400)

        card.list_id = card_update.list_id

    db.commit()
    db.refresh(card)

    return card


# ---------------------------------------------------------
# DELETE /cards/{id}
# ---------------------------------------------------------
@router.delete("/{card_id}", response_model=CardDeleteResponse)
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    card = db.query(Card).filter(Card.id == card_id).first()

    if not card:
        raise HTTPException(status_code=404)

    if card.board.user_id != current_user.id:
        raise HTTPException(status_code=403)

    db.delete(card)
    db.commit()

    return {"message": "Tarjeta eliminada correctamente."}
