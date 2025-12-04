from fastapi import FastAPI
from .auth.routes import router as auth_router
from .boards.routes import router as boards_router

app = FastAPI(title="NeoCare Backend")

app.include_router(auth_router)
app.include_router(boards_router)

@app.get("/")
def read_root():
    return {"message": "NeoCare backend is running"}


# BLOQUE PARA ARRANCAR EL SERVIDOR DIRECTAMENTE DESDE main.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",  # ruta a la app
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
