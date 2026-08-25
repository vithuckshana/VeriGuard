from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime
from ..core.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    face_encoding = Column(JSON, nullable=True)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=True)
    event_type = Column(String)
    status = Column(String)
    ip_address = Column(String, nullable=True)
    location = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)
