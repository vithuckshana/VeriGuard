from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services.ai_service import extract_face_encoding, verify_liveness, verify_gesture

router = APIRouter(prefix="/auth", tags=["Authentication"])

class BiometricPayload(BaseModel):
    image: str
    challenge: str = ""

@router.post("/verify-face")
async def verify_face(payload: BiometricPayload):
    encoding = extract_face_encoding(payload.image)
    if not encoding:
        raise HTTPException(status_code=400, detail="No face detected")
    # Here we would normally fetch the user's saved encoding from the DB and compare.
    # For now, if a face is detected and encoded, we pass it.
    return {"status": "success", "message": "Face verified"}

@router.post("/verify-liveness")
async def check_liveness(payload: BiometricPayload):
    is_live = verify_liveness(payload.image)
    if not is_live:
        raise HTTPException(status_code=400, detail="Liveness check failed")
    return {"status": "success", "message": "Liveness verified"}

@router.post("/verify-gesture")
async def check_gesture(payload: BiometricPayload):
    is_valid = verify_gesture(payload.image, payload.challenge)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Failed to detect {payload.challenge}")
    return {"status": "success", "message": "Gesture verified"}
