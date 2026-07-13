from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PredictLiveRequest(BaseModel):
    image_data_url: str # Base64 Data URL
    history: Optional[List[Dict[str, Any]]] = None # List of previous frame features for temporal analysis
