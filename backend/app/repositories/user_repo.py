from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from typing import List, Optional

class UserRepository:
    def get_by_id(self, db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()

    def create(self, db: Session, user_in: UserCreate, hashed_password: str) -> User:
        user = User(
            name=user_in.name,
            email=user_in.email,
            password_hash=hashed_password,
            role=user_in.role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def update(self, db: Session, db_user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def change_password(self, db: Session, db_user: User, hashed_password: str) -> User:
        db_user.password_hash = hashed_password
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def delete(self, db: Session, user_id: int) -> bool:
        db_user = self.get_by_id(db, user_id)
        if db_user:
            db.delete(db_user)
            db.commit()
            return True
        return False
