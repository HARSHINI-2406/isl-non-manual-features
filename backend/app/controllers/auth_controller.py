from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])
auth_service = AuthService()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(register_in: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user in the system.
    """
    return auth_service.register(db, register_in)

@router.post("/login", response_model=TokenResponse)
def login(login_in: LoginRequest, db: Session = Depends(get_db)):
    """
    Log in with email/password and obtain a JWT access token.
    """
    return auth_service.login(db, login_in)

@router.post("/logout")
def logout():
    """
    Stateless logout. Client should discard the authorization token.
    """
    return {"success": True, "detail": "Successfully logged out. Please discard client token."}
