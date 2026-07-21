from sqlalchemy.orm import Session
from app.repositories.history_repo import HistoryRepository
from app.schemas.history import PredictionHistoryResponse
from fastapi import HTTPException, status
from typing import List, Optional, Tuple, Dict, Any

class HistoryService:
    def __init__(self):
        self.history_repo = HistoryRepository()

    def list_history(
        self, 
        db: Session, 
        user_id: Optional[int] = None, 
        search: Optional[str] = None, 
        input_type: Optional[str] = None,
        skip: int = 0, 
        limit: int = 10
    ) -> Tuple[List[PredictionHistoryResponse], int]:
        db_items, total = self.history_repo.get_all(
            db, user_id=user_id, search=search, input_type=input_type, skip=skip, limit=limit
        )
        items = [PredictionHistoryResponse.model_validate(x) for x in db_items]
        return items, total

    def delete_history_item(self, db: Session, history_id: int, user_id: int, user_role: str) -> bool:
        item = self.history_repo.get_by_id(db, history_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="History item not found"
            )
            
        # Non-admins can only delete their own history
        if user_role != "admin" and item.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this history item"
            )
            
        return self.history_repo.delete(db, history_id)

    def clear_history(self, db: Session, user_id: int) -> int:
        return self.history_repo.clear_user_history(db, user_id)
