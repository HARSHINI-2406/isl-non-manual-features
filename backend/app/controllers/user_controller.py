from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies import get_current_user, require_admin
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserPasswordUpdate
from app.repositories.user_repo import UserRepository
from app.core.security import get_password_hash, verify_password
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])
user_repo = UserRepository()

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get profile of the currently logged-in user.
    """
    return UserResponse.model_validate(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Update profile details for the current user.
    """
    # If email changes, check uniqueness
    if user_in.email and user_in.email != current_user.email:
        existing = user_repo.get_by_email(db, user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
            
    updated_user = user_repo.update(db, current_user, user_in)
    return UserResponse.model_validate(updated_user)

@router.put("/profile/password")
def change_password(
    pwd_in: UserPasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change password for the current user.
    """
    if not verify_password(pwd_in.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    
    hashed_pwd = get_password_hash(pwd_in.new_password)
    user_repo.change_password(db, current_user, hashed_pwd)
    return {"success": True, "detail": "Password updated successfully"}

# --- ADMIN ENDPOINTS ---

@router.get("", response_model=List[UserResponse])
def get_users_list(
    skip: int = 0,
    limit: int = 100,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get list of all users. Admin privileges required.
    """
    db_users = user_repo.get_all(db, skip=skip, limit=limit)
    return [UserResponse.model_validate(x) for x in db_users]

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a user. Admin privileges required.
    """
    # Cannot delete self
    if admin.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot delete their own account"
        )
        
    deleted = user_repo.delete(db, user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return {"success": True, "detail": f"User {user_id} deleted successfully"}
