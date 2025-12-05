from fastapi import FastAPI, Depends 
from sqlalchemy.orm import Session
from sqlalchemy import text  # 👈 ESTA LÍNEA NUEVA

from .database import get_db, engine, Base
from . import models
from .auth.routes import router as auth_router
from .boards.routes import router as boards_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(boards_router)

@app.get("/ping")
def db_ping(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"message": "Database connection OK"}
