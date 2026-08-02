from sqlalchemy.orm import Session
from app.ml.pipeline import ISLPipeline
from app.repositories.history_repo import HistoryRepository
from app.schemas.history import PredictionHistoryBase
from typing import Dict, Any, List, Optional
import os

class PredictionService:
    def __init__(self):
        self.pipeline = ISLPipeline()
        self.history_repo = HistoryRepository()

    def predict_image(self, db: Session, user_id: int, file_content: bytes, filename: str) -> Dict[str, Any]:
        result = self.pipeline.predict_image(file_content)
        if result.get("success"):
            history_in = PredictionHistoryBase(
                input_file=filename,
                detected_features=result.get("features"),
                output_text=result.get("translation"),
                confidence=result.get("confidence")
            )
            self.history_repo.create(db, user_id, history_in)
        return result

    def predict_video(self, db: Session, user_id: int, temp_file_path: str, filename: str) -> Dict[str, Any]:
        result = self.pipeline.predict_video(temp_file_path)
        if result.get("success"):
            history_in = PredictionHistoryBase(
                input_file=filename,
                detected_features=result.get("features"),
                output_text=result.get("translation"),
                confidence=result.get("confidence")
            )
            self.history_repo.create(db, user_id, history_in)
        return result

    def predict_live_frame(self, db: Session, user_id: int, image_data_url: str, history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        result = self.pipeline.predict_live_frame(image_data_url, history)
        # To avoid overloading the DB with sub-second live frames,
        # we save to history only if a high-confidence prediction occurs.
        # This keeps the history clean and highly relevant.
        if result.get("success") and result.get("confidence") >= 80.0:
            # Check if this matches the last saved prediction recently to avoid duplicate flood
            recent_items, _ = self.history_repo.get_all(db, user_id=user_id, limit=1)
            if not recent_items or recent_items[0].output_text != result.get("translation"):
                history_in = PredictionHistoryBase(
                    input_file="live_webcam_frame.jpg",
                    detected_features=result.get("features"),
                    output_text=result.get("translation"),
                    confidence=result.get("confidence")
                )
                self.history_repo.create(db, user_id, history_in)
        return result
