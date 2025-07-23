from sqlmodel import Session, select
from database import engine
from models import Role, Permission, UserRolePermission

# Define roles and permissions
roles = [
    {"name": "Super-Admin"},
    {"name": "Admin"},
    {"name": "Analyst"},
    {"name": "Inspector"},
]
permissions = [
    {"view_name": "home_dashboard"},
    {"view_name": "analytics_dashboard"},
    {"view_name": "user_dashboard"},
    {"view_name": "admin_management"},
    {"view_name": "role_assignment"},
    {"view_name": "all_charts"},
]
# Role-permission mapping
role_permissions = {
    "Super-Admin": ["home_dashboard", "analytics_dashboard", "user_dashboard", "admin_management", "role_assignment", "all_charts"],
    "Admin": ["home_dashboard", "analytics_dashboard", "user_dashboard", "role_assignment", "all_charts"],
    "Analyst": ["home_dashboard", "analytics_dashboard"],
    "Inspector": ["home_dashboard", "user_dashboard"],
}

def main():
    with Session(engine) as session:
        # Create roles
        role_objs = {}
        for role in roles:
            db_role = session.exec(select(Role).where(Role.name == role["name"])).first()
            if not db_role:
                db_role = Role(**role)
                session.add(db_role)
                session.commit()
                session.refresh(db_role)
            role_objs[role["name"]] = db_role
        # Create permissions
        perm_objs = {}
        for perm in permissions:
            db_perm = session.exec(select(Permission).where(Permission.view_name == perm["view_name"])).first()
            if not db_perm:
                db_perm = Permission(**perm)
                session.add(db_perm)
                session.commit()
                session.refresh(db_perm)
            perm_objs[perm["view_name"]] = db_perm
        # Assign permissions to roles using a dummy user_id (e.g., 1)
        dummy_user_id = 1
        for role_name, perm_names in role_permissions.items():
            role = role_objs[role_name]
            for perm_name in perm_names:
                perm = perm_objs[perm_name]
                # Check if mapping already exists
                existing = session.exec(select(UserRolePermission).where(
                    (UserRolePermission.user_id == dummy_user_id) &
                    (UserRolePermission.role_id == role.id) &
                    (UserRolePermission.permission_id == perm.id)
                )).first()
                if not existing:
                    urp = UserRolePermission(user_id=dummy_user_id, role_id=role.id, permission_id=perm.id)
                    session.add(urp)
        session.commit()
        print("Roles and permissions initialized.")

def assign_permissions_to_all_users():
    from models import User, UserRolePermission, Role, Permission
    from sqlmodel import select
    with Session(engine) as session:
        # Get all roles and permissions
        role_objs = {r.name: r for r in session.exec(select(Role)).all()}
        perm_objs = {p.view_name: p for p in session.exec(select(Permission)).all()}
        users = session.exec(select(User)).all()
        for user in users:
            # Get roles for user
            urps = session.exec(select(UserRolePermission).where(UserRolePermission.user_id == user.id)).all()
            user_role_ids = set([urp.role_id for urp in urps])
            for role_name, perm_names in role_permissions.items():
                role = role_objs.get(role_name)
                if not role:
                    continue
                if role.id in user_role_ids:
                    # Remove old permissions for this user/role
                    old_urps = session.exec(
                        select(UserRolePermission).where(
                            (UserRolePermission.user_id == user.id) & (UserRolePermission.role_id == role.id)
                        )
                    ).all()
                    for urp in old_urps:
                        session.delete(urp)
                    # Assign correct permissions
                    for perm_name in perm_names:
                        perm = perm_objs.get(perm_name)
                        if perm:
                            urp = UserRolePermission(user_id=user.id, role_id=role.id, permission_id=perm.id)
                            session.add(urp)
        session.commit()
        print("Permissions assigned to all users with Inspector or Analyst roles.")

if __name__ == "__main__":
    main()
    assign_permissions_to_all_users() 