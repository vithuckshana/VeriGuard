from pydantic import BaseModel
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    password: str
    face_encoding: Optional[List[float]] = None

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class BiometricRequest(BaseModel):
    username: str
    image_base64: str

class Token(BaseModel):
    access_token: str
    token_type: str
