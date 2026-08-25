from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import AuditLog

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50).all()
    # Format for the frontend
    formatted_logs = []
    for log in logs:
        formatted_logs.append({
            "id": log.id,
            "time": log.timestamp.strftime("%I:%M:%S %p"),
            "user": log.username or "Unknown",
            "event": log.event_type,
            "status": log.status,
            "ip": log.ip_address or "127.0.0.1",
            "location": log.location or "Local Network"
        })
    return formatted_logs

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Very basic real stats based on logs
    success_logins = db.query(AuditLog).filter(AuditLog.event_type == "Login Success").count()
    failed_attempts = db.query(AuditLog).filter(AuditLog.status != "success").count()
    
    return {
        "activeSessions": max(1, success_logins // 10), # Mocking active sessions based on logins
        "successfulLogins": success_logins,
        "lockedSessions": failed_attempts // 3,
        "securityAlerts": failed_attempts
    }
