from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.history import PredictionHistoryResponse
from app.services.history_service import HistoryService
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/history", tags=["History Management"])
history_service = HistoryService()

@router.get("")
def get_history(
    search: Optional[str] = Query(None, description="Search by output translation text"),
    input_type: Optional[str] = Query(None, description="Filter by input type: image, video, webcam"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get prediction history. 
    Admins see everyone's records. Regular users only see their own.
    """
    user_id = None if current_user.role == "admin" else current_user.id
    items, total = history_service.list_history(
        db, user_id=user_id, search=search, input_type=input_type, skip=skip, limit=limit
    )
    return {
        "items": items,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.delete("/{history_id}")
def delete_history_item(
    history_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific history prediction item.
    """
    history_service.delete_history_item(
        db, history_id=history_id, user_id=current_user.id, user_role=current_user.role
    )
    return {"success": True, "detail": "History item deleted successfully"}

@router.delete("")
def clear_all_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear all history for the logged-in user.
    """
    deleted_count = history_service.clear_history(db, user_id=current_user.id)
    return {"success": True, "detail": f"Cleared {deleted_count} history items"}
