from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from database import get_db, engine, Base
import models

from auth.routes import router as auth_router
from boards.routes import router as boards_router
from cards.routes import router as cards_router, extras_router as cards_extras_router
from worklogs.routes import router as worklogs_router
from lists.routes import router as lists_router
from reportsweek.routes import router as reports_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(boards_router)
app.include_router(cards_router)
app.include_router(cards_extras_router)
app.include_router(worklogs_router)
app.include_router(lists_router)
app.include_router(reports_router)

@app.get("/ping")
def db_ping(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"message": "Database connection OK"}
