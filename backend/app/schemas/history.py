from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class PredictionHistoryBase(BaseModel):
    input_file: str
    detected_features: Optional[Dict[str, Any]] = None
    output_text: str
    confidence: float

class PredictionHistoryCreate(PredictionHistoryBase):
    user_id: int

class PredictionHistoryResponse(PredictionHistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
