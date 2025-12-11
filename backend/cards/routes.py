# cards/routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth.utils import get_current_user  # Obtener usuario desde JWT

from backend.cards.schemas import CardCreate, CardUpdate, CardResponse, CardDeleteResponse
from backend.cards.models import Card
from backend.models import Board, List, User  # Modelos ya existentes


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
    # 1. Validar que el tablero pertenece al usuario
    board = db.query(Board).filter(
        Board.id == card.board_id,
        Board.user_id == current_user.id
    ).first()

    if not board:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para crear tarjetas en este tablero."
        )

    # 2. Validar título no vacío
    if not card.title.strip():
        raise HTTPException(
            status_code=400,
            detail="El título no puede estar vacío."
        )

    # 3. Crear tarjeta
    new_card = Card(
        title=card.title,
        description=card.description,
        due_date=card.due_date,
        board_id=card.board_id,
        list_id=card.list_id,
        user_id=current_user.id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return new_card


# ---------------------------------------------------------
# GET /cards?board_id=... → Listar tarjetas de un tablero
# ---------------------------------------------------------
@router.get("/", response_model=list[CardResponse])
def list_cards(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1. Verificar que el tablero pertenece al usuario
    board = db.query(Board).filter(
        Board.id == board_id,
        Board.user_id == current_user.id
    ).first()

    if not board:
        raise HTTPException(
            status_code=403, detail="No puedes ver tarjetas de este tablero."
        )

    # 2. Obtener tarjetas del tablero
    cards = db.query(Card).filter(Card.board_id == board_id).all()

    return cards


# ---------------------------------------------------------
# GET /cards/{id} → Ver una tarjeta en detalle
# ---------------------------------------------------------
@router.get("/{card_id}", response_model=CardResponse)
def get_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    card = db.query(Card).filter(Card.id == card_id).first()

    if not card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada.")

    # Validar permiso del usuario
    if card.board.user_id != current_user.id:
        raise HTTPException(403, "No puedes ver esta tarjeta.")

    return card


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
        raise HTTPException(404, "Tarjeta no encontrada.")

    # Validar permiso del usuario
    if card.board.user_id != current_user.id:
        raise HTTPException(403, "No tienes permiso para editar esta tarjeta.")

    # Validar título si viene en la petición
    if card_update.title is not None:
        if not card_update.title.strip():
            raise HTTPException(400, "El título no puede estar vacío.")
        card.title = card_update.title

    if card_update.description is not None:
        card.description = card_update.description

    if card_update.due_date is not None:
        card.due_date = card_update.due_date

    if card_update.list_id is not None:
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
        raise HTTPException(404, "Tarjeta no encontrada.")

    if card.board.user_id != current_user.id:
        raise HTTPException(403, "No tienes permiso para eliminar esta tarjeta.")

    db.delete(card)
    db.commit()

    return {"message": "Tarjeta eliminada correctamente."}
