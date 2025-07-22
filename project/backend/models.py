from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: Optional[str] = "Active"  # 'Active' or 'Inactive'
    last_login: Optional[datetime] = None
    region: Optional[str] = None
    segment: Optional[str] = None
    phase: Optional[str] = None
    usage_history: Optional[str] = None  # JSON string
    payment_history: Optional[str] = None  # JSON string
    alert_history: Optional[str] = None  # JSON string
    recent_activity: Optional[str] = None  # JSON string
    # Relationships
    user_role_permissions: List["UserRolePermission"] = Relationship(back_populates="user")

class Role(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    # Relationships
    user_role_permissions: List["UserRolePermission"] = Relationship(back_populates="role")

class Permission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    view_name: str = Field(index=True, unique=True)
    # Relationships
    user_role_permissions: List["UserRolePermission"] = Relationship(back_populates="permission")

class UserRolePermission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role_id: int = Field(foreign_key="role.id")
    permission_id: int = Field(foreign_key="permission.id")
    # Relationships
    user: Optional[User] = Relationship(back_populates="user_role_permissions")
    role: Optional[Role] = Relationship(back_populates="user_role_permissions")
    permission: Optional[Permission] = Relationship(back_populates="user_role_permissions")

class UserAnalytics(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: int = Field(index=True, unique=True)
    name: str
    email: str
    status: str
    region: str
    segment: str
    phase: str
    createdAt: str
    usage_history: str  # JSON string
    payment_history: str  # JSON string
    alert_history: str  # JSON string
    recent_activity: str  # JSON string 