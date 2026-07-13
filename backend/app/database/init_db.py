from app.database.session import engine, Base
from app.models.user import User
from app.models.history import PredictionHistory
from app.models.model_info import ModelInformation
from app.core.security import get_password_hash
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger("app.database")

def init_db(db: Session):
    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")

    # Check if default admin exists
    admin_email = "admin@isl-nmf.org"
    db_admin = db.query(User).filter(User.email == admin_email).first()
    if not db_admin:
        hashed_password = get_password_hash("Admin@123")
        admin = User(
            name="System Admin",
            email=admin_email,
            password_hash=hashed_password,
            role="admin"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        logger.info("Default Admin user created (admin@isl-nmf.org / Admin@123).")

    # Check if default models exist
    model_count = db.query(ModelInformation).count()
    if model_count == 0:
        models = [
            ModelInformation(
                model_name="ISL Non-Manual Feature Classifier (Hybrid Rule-Based / SVM)",
                version="v1.0.0",
                accuracy=0.924
            ),
            ModelInformation(
                model_name="ISL Non-Manual Feature Classifier (ResNet3D + LSTM)",
                version="v2.1.0-alpha",
                accuracy=0.958
            )
        ]
        db.bulk_save_objects(models)
        db.commit()
        logger.info("Default models metadata seeded.")
