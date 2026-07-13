from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import Optional
from app.schemas.user import UserResponse

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str
    role: str = "user" # user or admin

    @model_validator(mode='after')
    def verify_passwords_match(self):
        pw = self.password
        cpw = self.confirm_password
        if pw != cpw:
            raise ValueError("Passwords do not match")
        return self

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: Optional[bool] = False

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
