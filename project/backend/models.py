from sqlmodel import SQLModel, Field
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
    status: Optional[str] = None
    region: Optional[str] = None
    segment: Optional[str] = None
    phase: Optional[str] = None
    usage_history: Optional[str] = None  # JSON string
    payment_history: Optional[str] = None  # JSON string
    alert_history: Optional[str] = None  # JSON string
    recent_activity: Optional[str] = None  # JSON string 

class UserAnalytics(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    number: str = Field(index=True, unique=True)
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