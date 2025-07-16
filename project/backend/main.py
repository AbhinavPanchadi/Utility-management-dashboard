from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import Optional, List
from jose import JWTError, jwt
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from fastapi import APIRouter

from database import create_db_and_tables, get_session
from models import User, UserAnalytics
from schemas import UserCreate, UserRead, UserLogin, Token
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Utility to get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/auth/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    db_user = session.exec(select(User).where((User.username == user.username) | (User.email == user.email))).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        bio=user.bio,
        avatar=user.avatar
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username}, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=UserRead)
def update_profile(update: UserCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    current_user.full_name = update.full_name
    current_user.bio = update.bio
    current_user.avatar = update.avatar
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user

@app.put("/users/me/password")
def update_password(password: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    current_user.password_hash = get_password_hash(password)
    session.add(current_user)
    session.commit()
    return {"msg": "Password updated successfully"}

@app.get("/users/number/{number}")
def get_user_by_number(number: str, session: Session = Depends(get_session)):
    analytics = session.exec(select(UserAnalytics).where(UserAnalytics.number == number)).first()
    if not analytics:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(content={
        "name": analytics.name,
        "number": analytics.number,
        "email": analytics.email,
        "status": analytics.status,
        "region": analytics.region,
        "segment": analytics.segment,
        "phase": analytics.phase,
        "createdAt": analytics.createdAt,
        "usage_history": json.loads(analytics.usage_history) if analytics.usage_history else [],
        "payment_history": json.loads(analytics.payment_history) if analytics.payment_history else [],
        "alert_history": json.loads(analytics.alert_history) if analytics.alert_history else [],
        "recent_activity": json.loads(analytics.recent_activity) if analytics.recent_activity else [],
    })

admin_router = APIRouter(prefix="/admin", tags=["admin"])

@admin_router.get("/", response_model=List[UserRead])
def list_admins(session: Session = Depends(get_session), role: Optional[str] = None, search: Optional[str] = None):
    query = select(User).where(User.role.in_(["Admin", "Sub-Admin", "Analyst"]))
    if role:
        query = query.where(User.role == role)
    if search:
        query = query.where((User.username.contains(search)) | (User.email.contains(search)))
    return session.exec(query).all()

@admin_router.post("/", response_model=UserRead)
def create_admin(user: UserCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can create admins")
    db_user = session.exec(select(User).where((User.username == user.username) | (User.email == user.email))).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        bio=user.bio,
        avatar=user.avatar,
        role=user.role,
        status=user.status
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@admin_router.put("/{admin_id}", response_model=UserRead)
def update_admin(admin_id: int, update: UserCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can update admins")
    admin = session.get(User, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    admin.full_name = update.full_name
    admin.bio = update.bio
    admin.avatar = update.avatar
    admin.role = update.role
    admin.status = update.status
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin

@admin_router.delete("/{admin_id}")
def delete_admin(admin_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can delete admins")
    admin = session.get(User, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    session.delete(admin)
    session.commit()
    return {"msg": "Admin deleted"}

@admin_router.patch("/{admin_id}/status")
def toggle_admin_status(admin_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can toggle status")
    admin = session.get(User, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    admin.status = "Inactive" if admin.status == "Active" else "Active"
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin

@admin_router.get("/metrics")
def admin_metrics(session: Session = Depends(get_session)):
    total = len(session.exec(select(User).where(User.role.in_(["Admin", "Sub-Admin", "Analyst"]))).all())
    active = len(session.exec(select(User).where(User.role.in_(["Admin", "Sub-Admin", "Analyst"]) & (User.status == "Active"))).all())
    sub_admins = len(session.exec(select(User).where(User.role == "Sub-Admin")).all())
    analysts = len(session.exec(select(User).where(User.role == "Analyst")).all())
    return {"totalAdmins": total, "activeAdmins": active, "subAdmins": sub_admins, "analysts": analysts}

app.include_router(admin_router) 