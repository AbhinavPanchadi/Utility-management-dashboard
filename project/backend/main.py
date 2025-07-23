from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select, col
from typing import Optional, List
from jose import JWTError, jwt
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from fastapi import APIRouter

from database import create_db_and_tables, get_session
from models import User, UserAnalytics, Role, Permission, UserRolePermission
from schemas import (
    UserCreate, UserRead, UserLogin, Token,
    RoleBase, RoleRead, PermissionBase, PermissionRead,
    UserRolePermissionBase, UserRolePermissionRead, AssignRolePermission
)
from auth import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from pydantic import BaseModel

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

class AdminUserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    status: Optional[str] = None
    last_login: Optional[str] = None
    avatar: Optional[str] = None
    roles: List[str] = []

    class Config:
        orm_mode = True

@app.get("/me/permissions")
def get_me_permissions(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == current_user.id)).all()
    role_ids = set([urp.role_id for urp in urps if urp.role_id])
    permission_ids = set([urp.permission_id for urp in urps if urp.permission_id])
    roles = []
    if role_ids:
        roles = [r.name for r in session.exec(select(Role).where(Role.id.in_(role_ids))).all()]
    permissions = []
    if permission_ids:
        permissions = [p.view_name for p in session.exec(select(Permission).where(Permission.id.in_(permission_ids))).all()]
    return {"roles": roles, "permissions": permissions}

# Utility to check if user has a permission
from fastapi import Request

def has_permission(user: User, permission: str, session: Session) -> bool:
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user.id)).all()
    permission_ids = [urp.permission_id for urp in urps if urp.permission_id]
    if not permission_ids:
        return False
    permissions = session.exec(select(Permission).where(Permission.id.in_(permission_ids))).all()
    return permission in [p.view_name for p in permissions]

# Update admin endpoints to check for 'admin_access' permission
@admin_router.get("/", response_model=List[AdminUserOut])
def list_admins(request: Request, session: Session = Depends(get_session), current_user: User = Depends(get_current_user), role: Optional[str] = None, search: Optional[str] = None):
    if not has_permission(current_user, "home_dashboard", session):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    # Get role ids for Admin, Sub-Admin, Analyst
    role_names = ["Admin", "Sub-Admin", "Analyst"]
    if role:
        role_names = [role]
    role_objs = session.exec(select(Role).where(Role.name.in_(role_names))).all()
    role_ids = [r.id for r in role_objs]
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.role_id.in_(role_ids))).all()
    user_ids = list(set([urp.user_id for urp in urps]))
    query = select(User).where(User.id.in_(user_ids))
    if search:
        query = query.where((User.username.contains(search)) | (User.email.contains(search)))
    users = session.exec(query).all()
    # Map user_id to roles
    user_roles_map = {}
    for urp in urps:
        user_roles_map.setdefault(urp.user_id, set()).add(urp.role_id)
    role_id_to_name = {r.id: r.name for r in role_objs}
    result = []
    for user in users:
        roles = [role_id_to_name[rid] for rid in user_roles_map.get(user.id, []) if rid in role_id_to_name]
        result.append(AdminUserOut(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            status=user.status,
            last_login=user.last_login.isoformat() if user.last_login else None,
            avatar=user.avatar,
            roles=roles
        ))
    return result

@admin_router.post("/", response_model=UserRead)
def create_admin(user: UserCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Only Super-Admin can create Admins
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == current_user.id)).all()
    role_ids = set([urp.role_id for urp in urps if urp.role_id])
    roles = []
    if role_ids:
        roles = [r.name for r in session.exec(select(Role).where(Role.id.in_(role_ids))).all()]
    if "Super-Admin" not in roles:
        raise HTTPException(status_code=403, detail="Only Super-Admin can create Admins")
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
        status=user.status
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    # Assign role via UserRolePermission (default to Admin if not provided)
    role_name = user.status if user.status in ["Admin", "Sub-Admin", "Analyst"] else "Admin"
    if role_name == "Admin" and "Super-Admin" not in roles:
        raise HTTPException(status_code=403, detail="Only Super-Admin can assign Admin role")
    role = session.exec(select(Role).where(Role.name == role_name)).first()
    if not role:
        raise HTTPException(status_code=400, detail="Role not found")
    # Assign all default permissions for Admin
    from init_roles_permissions import role_permissions
    perm_names = role_permissions[role_name]
    for perm_name in perm_names:
        perm = session.exec(select(Permission).where(Permission.view_name == perm_name)).first()
        if perm:
            urp = UserRolePermission(user_id=new_user.id, role_id=role.id, permission_id=perm.id)
            session.add(urp)
    session.commit()
    return new_user

@admin_router.put("/{admin_id}", response_model=UserRead)
def update_admin(admin_id: int, update: UserCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not has_permission(current_user, "home_dashboard", session):
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
def delete_admin(admin_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not has_permission(current_user, "home_dashboard", session):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    admin = session.get(User, admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    session.delete(admin)
    session.commit()
    return {"msg": "Admin deleted"}

@admin_router.patch("/{admin_id}/status")
def toggle_admin_status(admin_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if not has_permission(current_user, "home_dashboard", session):
        raise HTTPException(status_code=403, detail="Not enough permissions")
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
    # Get all roles of interest
    roles = session.exec(select(Role).where(Role.name.in_(["Admin", "Sub-Admin", "Analyst"]))).all()
    role_map = {r.name: r.id for r in roles}
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.role_id.in_(list(role_map.values())))).all()
    user_role_map = {}
    for urp in urps:
        user_role_map.setdefault(urp.role_id, set()).add(urp.user_id)
    total = len(set([urp.user_id for urp in urps]))
    active = len(set([urp.user_id for urp in urps if session.get(User, urp.user_id).status == "Active"]))
    sub_admins = len(user_role_map.get(role_map.get("Sub-Admin"), set()))
    analysts = len(user_role_map.get(role_map.get("Analyst"), set()))
    return {"totalAdmins": total, "activeAdmins": active, "subAdmins": sub_admins, "analysts": analysts}

app.include_router(admin_router)

@app.post("/roles", response_model=RoleRead)
def create_role(role: RoleBase, session: Session = Depends(get_session)):
    db_role = session.exec(select(Role).where(Role.name == role.name)).first()
    if db_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    new_role = Role(name=role.name)
    session.add(new_role)
    session.commit()
    session.refresh(new_role)
    return new_role

@app.get("/roles", response_model=List[RoleRead])
def list_roles(session: Session = Depends(get_session)):
    return session.exec(select(Role)).all()

@app.post("/permissions", response_model=PermissionRead)
def create_permission(permission: PermissionBase, session: Session = Depends(get_session)):
    db_perm = session.exec(select(Permission).where(Permission.view_name == permission.view_name)).first()
    if db_perm:
        raise HTTPException(status_code=400, detail="Permission already exists")
    new_perm = Permission(view_name=permission.view_name)
    session.add(new_perm)
    session.commit()
    session.refresh(new_perm)
    return new_perm

@app.get("/permissions", response_model=List[PermissionRead])
def list_permissions(session: Session = Depends(get_session)):
    return session.exec(select(Permission)).all()

@app.get("/roles/{role_id}/permissions", response_model=List[PermissionRead])
def get_permissions_for_role(role_id: int, session: Session = Depends(get_session)):
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.role_id == role_id)).all()
    permission_ids = [urp.permission_id for urp in urps if urp.permission_id]
    if not permission_ids:
        return []
    permissions = session.exec(select(Permission).where(Permission.id.in_(permission_ids))).all()
    return permissions

@app.post("/user-role-permissions", response_model=List[UserRolePermissionRead])
def assign_role_permissions(data: AssignRolePermission, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Robust: Only allow users to assign roles they have
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == current_user.id)).all()
    current_user_role_ids = set([urp.role_id for urp in urps if urp.role_id])
    if data.role_id not in current_user_role_ids:
        raise HTTPException(status_code=403, detail="You do not have permission to assign this role.")
    # Only allow assigning permissions the current user has for this role
    current_user_permission_ids = set([urp.permission_id for urp in urps if urp.role_id == data.role_id and urp.permission_id])
    if not all(pid in current_user_permission_ids for pid in data.permission_ids):
        raise HTTPException(status_code=403, detail="You do not have permission to assign one or more of these permissions.")
    # Remove existing assignments for this user/role
    session.exec(
        select(UserRolePermission).where(
            (UserRolePermission.user_id == data.user_id) &
            (UserRolePermission.role_id == data.role_id)
        )
    ).delete()
    # Assign new permissions
    new_assignments = []
    for perm_id in data.permission_ids:
        urp = UserRolePermission(user_id=data.user_id, role_id=data.role_id, permission_id=perm_id)
        session.add(urp)
        new_assignments.append(urp)
    session.commit()
    for urp in new_assignments:
        session.refresh(urp)
    return new_assignments

@app.get("/user-role-permissions/{user_id}", response_model=List[UserRolePermissionRead])
def get_user_role_permissions(user_id: int, session: Session = Depends(get_session)):
    return session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user_id)).all()

@app.get("/user-permissions/{user_id}", response_model=List[str])
def get_user_permissions(user_id: int, session: Session = Depends(get_session)):
    urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user_id)).all()
    permission_ids = [urp.permission_id for urp in urps]
    if not permission_ids:
        return []
    permissions = session.exec(select(Permission).where(Permission.id.in_(permission_ids))).all()
    return [perm.view_name for perm in permissions]

@app.get("/users", response_model=List[UserRead])
def list_users(session: Session = Depends(get_session)):
    users = session.exec(select(User).where(User.status == "Active")).all()
    user_list = []
    for user in users:
        try:
            urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user.id)).all()
            role_ids = [urp.role_id for urp in urps if urp.role_id]
            roles = [r.name for r in session.exec(select(Role).where(Role.id.in_(role_ids))).all()]
            user_dict = user.dict() if hasattr(user, 'dict') else dict(user)
            user_dict['roles'] = roles if roles else []
            user_list.append(user_dict)
        except Exception as e:
            user_dict = user.dict() if hasattr(user, 'dict') else dict(user)
            user_dict['roles'] = []
            user_list.append(user_dict)
    return user_list 