from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    status: Optional[str] = "Active"

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime
    status: Optional[str] = None
    last_login: Optional[datetime] = None
    region: Optional[str] = None
    segment: Optional[str] = None
    phase: Optional[str] = None
    usage_history: Optional[str] = None
    payment_history: Optional[str] = None
    alert_history: Optional[str] = None
    recent_activity: Optional[str] = None
    roles: Optional[List[str]] = []
    class Config:
        orm_mode = True

class RoleBase(BaseModel):
    name: str

class RoleRead(RoleBase):
    id: int
    class Config:
        orm_mode = True

class PermissionBase(BaseModel):
    view_name: str

class PermissionRead(PermissionBase):
    id: int
    class Config:
        orm_mode = True

class UserRolePermissionBase(BaseModel):
    user_id: int
    role_id: int
    permission_id: int

class UserRolePermissionRead(UserRolePermissionBase):
    id: int
    class Config:
        orm_mode = True

class AssignRolePermission(BaseModel):
    user_id: int
    role_id: int
    permission_ids: List[int]

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str 