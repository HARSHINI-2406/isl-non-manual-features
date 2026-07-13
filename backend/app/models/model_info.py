from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.database.session import Base

class ModelInformation(Base):
    __tablename__ = "model_information"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    accuracy = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
