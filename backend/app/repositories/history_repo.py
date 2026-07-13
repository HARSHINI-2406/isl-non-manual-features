from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.models.history import PredictionHistory
from app.schemas.history import PredictionHistoryBase
from typing import List, Optional, Tuple

class HistoryRepository:
    def get_by_id(self, db: Session, history_id: int) -> Optional[PredictionHistory]:
        return db.query(PredictionHistory).filter(PredictionHistory.id == history_id).first()

    def get_all(
        self, 
        db: Session, 
        user_id: Optional[int] = None, 
        search: Optional[str] = None, 
        input_type: Optional[str] = None,
        skip: int = 0, 
        limit: int = 10
    ) -> Tuple[List[PredictionHistory], int]:
        query = db.query(PredictionHistory)
        
        # User filter (non-admins only see their own)
        if user_id is not None:
            query = query.filter(PredictionHistory.user_id == user_id)
            
        # Search query (case-insensitive on translated output text)
        if search:
            query = query.filter(PredictionHistory.output_text.ilike(f"%{search}%"))
            
        # Input type filter (matches file extension/tag e.g., webcam vs uploaded video)
        if input_type:
            if input_type == "webcam":
                query = query.filter(PredictionHistory.input_file.contains("webcam"))
            elif input_type == "video":
                query = query.filter(or_(
                    PredictionHistory.input_file.endswith(".mp4"),
                    PredictionHistory.input_file.endswith(".avi"),
                    PredictionHistory.input_file.endswith(".mov")
                ))
            elif input_type == "image":
                query = query.filter(or_(
                    PredictionHistory.input_file.endswith(".jpg"),
                    PredictionHistory.input_file.endswith(".jpeg"),
                    PredictionHistory.input_file.endswith(".png")
                ))

        total = query.count()
        results = query.order_by(desc(PredictionHistory.created_at)).offset(skip).limit(limit).all()
        return results, total

    def create(self, db: Session, user_id: int, history_in: PredictionHistoryBase) -> PredictionHistory:
        history_item = PredictionHistory(
            user_id=user_id,
            input_file=history_in.input_file,
            detected_features=history_in.detected_features,
            output_text=history_in.output_text,
            confidence=history_in.confidence
        )
        db.add(history_item)
        db.commit()
        db.refresh(history_item)
        return history_item

    def delete(self, db: Session, history_id: int) -> bool:
        item = self.get_by_id(db, history_id)
        if item:
            db.delete(item)
            db.commit()
            return True
        return False

    def clear_user_history(self, db: Session, user_id: int) -> int:
        deleted = db.query(PredictionHistory).filter(PredictionHistory.user_id == user_id).delete()
        db.commit()
        return deleted
