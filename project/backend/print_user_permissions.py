from sqlmodel import Session, select
from database import engine
from models import User, Role, Permission, UserRolePermission

USERNAME = 'arjun2024'

with Session(engine) as session:
    user = session.exec(select(User).where(User.username == USERNAME)).first()
    if not user:
        print(f"User {USERNAME} not found.")
    else:
        print(f"User: {user.username} (id={user.id})")
        urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user.id)).all()
        role_ids = set([urp.role_id for urp in urps if urp.role_id])
        permission_ids = set([urp.permission_id for urp in urps if urp.permission_id])
        roles = []
        if role_ids:
            roles = [r.name for r in session.exec(select(Role).where(Role.id.in_(role_ids))).all()]
        permissions = []
        if permission_ids:
            permissions = [p.view_name for p in session.exec(select(Permission).where(Permission.id.in_(permission_ids))).all()]
        print(f"Roles: {roles}")
        print(f"Permissions: {permissions}") 