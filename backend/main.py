from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .auth.routes import router as auth_router
from .boards.routes import router as boards_router
from .database import get_db

app = FastAPI()

# Rutas ya creadas
app.include_router(auth_router)
app.include_router(boards_router)


@app.get("/ping")
def db_ping(db: Session = Depends(get_db)):
    """
    Endpoint sencillo para comprobar que FastAPI se conecta a PostgreSQL.
    """
    db.execute(text("SELECT 1"))
    return {"message": "Database connection OK"}
