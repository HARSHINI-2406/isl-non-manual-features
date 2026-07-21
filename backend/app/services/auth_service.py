from sqlalchemy.orm import Session
from app.repositories.user_repo import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from fastapi import HTTPException, status
from typing import Optional

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    def register(self, db: Session, register_in: RegisterRequest) -> UserResponse:
        # Check if user email already exists
        existing_user = self.user_repo.get_by_email(db, register_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered"
            )
            
        hashed_password = get_password_hash(register_in.password)
        db_user = self.user_repo.create(db, register_in, hashed_password)
        return UserResponse.model_validate(db_user)

    def login(self, db: Session, login_in: LoginRequest) -> TokenResponse:
        db_user = self.user_repo.get_by_email(db, login_in.email)
        if not db_user or not verify_password(login_in.password, db_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Create access token
        access_token = create_access_token(
            data={"sub": str(db_user.id), "role": db_user.role}
        )
        
        user_response = UserResponse.model_validate(db_user)
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )

    def get_current_user(self, db: Session, user_id: int) -> UserResponse:
        db_user = self.user_repo.get_by_id(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return UserResponse.model_validate(db_user)
