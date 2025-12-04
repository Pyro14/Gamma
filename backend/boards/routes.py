from fastapi import APIRouter

router = APIRouter(
    prefix="/boards",
    tags=["boards"],
)


@router.get("/ping")
def boards_ping():
    return {"message": "boards ok"}
