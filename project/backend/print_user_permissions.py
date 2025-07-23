from sqlmodel import Session, select
from database import engine
from models import User, Role, Permission, UserRolePermission

USERNAME = 'abhi'

with Session(engine) as session:
    user = session.exec(select(User).where(User.username == USERNAME)).first()
    if not user:
        print(f"User {USERNAME} not found.")
    else:
        print(f"User: {user.username} (id={user.id})")
        # Get Super-Admin role
        super_admin_role = session.exec(select(Role).where(Role.name == "Super-Admin")).first()
        if not super_admin_role:
            print("Super-Admin role not found.")
        else:
            # Remove all existing UserRolePermission for this user
            urps_to_delete = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user.id)).all()
            for urp in urps_to_delete:
                session.delete(urp)
            session.commit()
            # Assign Super-Admin role (do not create entry with permission_id=None)
            # Assign all Super-Admin permissions
            from init_roles_permissions import role_permissions
            from models import Permission
            perm_names = role_permissions["Super-Admin"]
            for perm_name in perm_names:
                perm = session.exec(select(Permission).where(Permission.view_name == perm_name)).first()
                if perm:
                    urp = UserRolePermission(user_id=user.id, role_id=super_admin_role.id, permission_id=perm.id)
                    session.add(urp)
            session.commit()
        # Print roles and permissions
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