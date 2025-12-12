from pydantic import BaseModel
from pydantic import BaseModel
from datetime import datetime

class BoardBase(BaseModel):
    name: str
    description: str | None = None

class BoardCreate(BoardBase):
    pass

class BoardOut(BoardBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

