from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TokenPayload(BaseModel):
    sub: Optional[int] = None # holds user ID
    role: Optional[str] = None
