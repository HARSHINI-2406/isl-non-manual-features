from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import auth_controller, user_controller, predict_controller, history_controller, analytics_controller
from app.database.session import SessionLocal
from app.database.init_db import init_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app.main")

app = FastAPI(
    title="Indian Sign Language Non-Manual Feature Recognition System API",
    description="REST APIs to capture non-manual features (eyebrows, eyes, head, mouth, torso) from ISL inputs and translate them into text.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware to allow cross-origin requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Database Initializer
@app.on_event("startup")
def startup_db_init():
    db = SessionLocal()
    try:
        init_db(db)
        logger.info("Database initialized/seeded on startup.")
    except Exception as e:
        logger.error(f"Error during startup DB initialization: {str(e)}")
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": "Capturing Non-Manual Features of ISL and Converting It into Text",
        "swagger_docs": "/docs"
    }

# Register Routers
app.include_router(auth_controller.router, prefix="/api")
app.include_router(user_controller.router, prefix="/api")
app.include_router(predict_controller.router, prefix="/api")
app.include_router(history_controller.router, prefix="/api")
app.include_router(analytics_controller.router, prefix="/api")
