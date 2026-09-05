from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.organizer import router as organizer_router
from app.models.activity import Activity
from app.models.protected_folder import ProtectedFolder
from app.database.database import Base, engine

app = FastAPI(
    title="Smart File Organizer API",
    description="Backend API for Smart File Organizer",
    version="1.0.0",
)
app.include_router(organizer_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(organizer_router)


@app.get("/")
def root():
    return {
        "message": "Smart File Organizer API is running!",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }