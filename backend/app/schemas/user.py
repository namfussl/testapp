from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class InviteRequest(BaseModel):
    email: EmailStr
    role: str  # 'client' or 'fee_earner'


class InviteResponse(BaseModel):
    id: int
    email: str
    role: str
    status: str
    invite_token: str
    created_at: datetime

    class Config:
        from_attributes = True
