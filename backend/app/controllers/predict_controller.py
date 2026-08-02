import os
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.predict import PredictLiveRequest
from app.services.prediction_service import PredictionService
from app.api.dependencies import get_current_user
from app.models.user import User



router = APIRouter(
    prefix="/predict",
    tags=["ISL Recognition"]
)


prediction_service = PredictionService()


# Temporary upload folder
TEMP_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(__file__)
        )
    ),
    "temp_uploads"
)

os.makedirs(
    TEMP_DIR,
    exist_ok=True
)



# ==========================
# IMAGE PREDICTION
# ==========================

@router.post("/image")
async def predict_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    """
    Process uploaded image.
    """

    ext = os.path.splitext(
        file.filename
    )[1].lower()


    if ext not in [
        ".jpg",
        ".jpeg",
        ".png"
    ]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format"
        )


    contents = await file.read()


    result = prediction_service.predict_image(
        db,
        current_user.id,
        contents,
        file.filename
    )


    if not result.get("success"):

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result.get(
                "error",
                "Image processing failed"
            )
        )


    return result





# ==========================
# VIDEO PREDICTION
# ==========================

@router.post("/video")
async def predict_video(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    """
    Process uploaded video.
    """


    ext = os.path.splitext(
        file.filename
    )[1].lower()


    if ext not in [
        ".mp4",
        ".avi",
        ".mov"
    ]:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid video format"
        )


    temp_path = os.path.join(
        TEMP_DIR,
        f"{current_user.id}_{file.filename}"
    )


    try:

        with open(
            temp_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        result = prediction_service.predict_video(
            db,
            current_user.id,
            temp_path,
            file.filename
        )


    except Exception as e:


        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


    finally:

        if os.path.exists(temp_path):

            os.remove(temp_path)



    if not result.get("success"):

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result.get(
                "error",
                "Video processing failed"
            )
        )


    return result





# ==========================
# LIVE WEBCAM PREDICTION
# ==========================

@router.post("/live")
def predict_live(
    req: PredictLiveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    """
    Process webcam frame.
    """


    result = prediction_service.predict_live_frame(
        db,
        current_user.id,
        req.image_data_url,
        req.history
    )


    if not result.get("success"):

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result.get(
                "error",
                "Live prediction failed"
            )
        )


    return result