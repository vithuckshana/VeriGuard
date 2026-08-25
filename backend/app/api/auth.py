from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..services.ai_service import extract_face_encoding, verify_liveness, verify_gesture
from ..core.database import get_db
from ..models.user import AuditLog
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

class BiometricPayload(BaseModel):
    username: str
    image: str
    challenge: str = ""

class GoogleAuthPayload(BaseModel):
    credential: str

def log_event(db: Session, request: Request, username: str, event_type: str, status: str):
    ip = request.client.host if request.client else "127.0.0.1"
    db_log = AuditLog(
        username=username,
        event_type=event_type,
        status=status,
        ip_address=ip,
        location="Local Network"
    )
    db.add(db_log)
    db.commit()

@router.post("/google-login")
async def google_login(payload: GoogleAuthPayload, request: Request, db: Session = Depends(get_db)):
    try:
        # Verify Google Token
        idinfo = id_token.verify_oauth2_token(payload.credential, requests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo['email']
        log_event(db, request, email, "Google OAuth Login", "success")
        return {"status": "success", "username": email}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google Token")

@router.post("/verify-password")
async def verify_password(payload: BiometricPayload, request: Request, db: Session = Depends(get_db)):
    if payload.username == "":
        raise HTTPException(status_code=400, detail="Username required")
    log_event(db, request, payload.username, "Password Verification", "success")
    return {"status": "success"}

@router.post("/verify-face")
async def verify_face(payload: BiometricPayload, request: Request, db: Session = Depends(get_db)):
    encoding = extract_face_encoding(payload.image)
    if not encoding:
        log_event(db, request, payload.username, "Face Verification Failed (No Face)", "danger")
        raise HTTPException(status_code=400, detail="No face detected")
    log_event(db, request, payload.username, "Face Verified", "success")
    return {"status": "success", "message": "Face verified"}

@router.post("/verify-liveness")
async def check_liveness(payload: BiometricPayload, request: Request, db: Session = Depends(get_db)):
    is_live = verify_liveness(payload.image)
    if not is_live:
        log_event(db, request, payload.username, "Liveness Check Failed (Spoofing Attempt)", "danger")
        raise HTTPException(status_code=400, detail="Liveness check failed")
    log_event(db, request, payload.username, "Liveness Verified", "success")
    return {"status": "success", "message": "Liveness verified"}

@router.post("/verify-gesture")
async def check_gesture(payload: BiometricPayload, request: Request, db: Session = Depends(get_db)):
    is_valid = verify_gesture(payload.image, payload.challenge)
    if not is_valid:
        log_event(db, request, payload.username, f"Gesture Failed ({payload.challenge})", "warning")
        raise HTTPException(status_code=400, detail=f"Failed to detect {payload.challenge}")
    log_event(db, request, payload.username, "Login Success", "success")
    return {"status": "success", "message": "Gesture verified"}
