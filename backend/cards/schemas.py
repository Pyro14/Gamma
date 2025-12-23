from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field


# -------------------------------------------------------
# CREAR tarjeta
# -------------------------------------------------------
class CardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=80)
    description: Optional[str] = None
    due_date: Optional[date] = None
    board_id: int


# -------------------------------------------------------
# EDITAR tarjeta
# -------------------------------------------------------
class CardUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = None
    due_date: Optional[date] = None
    list_id: Optional[int] = None


# -------------------------------------------------------
# MOVER tarjeta
# -------------------------------------------------------
class CardMove(BaseModel):
    list_id: int
    order: int = Field(..., ge=0)


# -------------------------------------------------------
# RESPUESTA
# -------------------------------------------------------
class CardResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: Optional[date]
    board_id: int
    list_id: int
    order: int
    user_id: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# -------------------------------------------------------
# DELETE response
# -------------------------------------------------------
class CardDeleteResponse(BaseModel):
    message: str
