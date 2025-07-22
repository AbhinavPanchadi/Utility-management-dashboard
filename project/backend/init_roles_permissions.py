from sqlmodel import Session, select
from database import engine
from models import Role, Permission, UserRolePermission

# Define roles and permissions
roles = [
    {"name": "Admin"},
    {"name": "Analyst"},
    {"name": "Inspector"},
]
permissions = [
    {"view_name": "home_dashboard"},
    {"view_name": "analytics_dashboard"},
    {"view_name": "user_dashboard"},
]
# Role-permission mapping
role_permissions = {
    "Admin": ["home_dashboard", "analytics_dashboard", "user_dashboard"],
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
        # Assign permissions to roles (skip user_id=None mapping due to NOT NULL constraint)
        # for role_name, perm_names in role_permissions.items():
        #     role = role_objs[role_name]
        #     for perm_name in perm_names:
        #         perm = perm_objs[perm_name]
        #         # This would fail due to NOT NULL constraint on user_id
        #         # urp = UserRolePermission(user_id=None, role_id=role.id, permission_id=perm.id)
        #         # session.add(urp)
        # session.commit()
        print("Roles and permissions initialized.")

if __name__ == "__main__":
    main() 