from sqlmodel import Session, select, delete
from database import engine
from models import User, Role, UserRolePermission, Permission
from auth import get_password_hash

with Session(engine) as session:
    # Check if user already exists
    user = session.exec(select(User).where(User.username == 'abhi')).first()
    if not user:
        user = User(
            username='abhi',
            email='abhi@123.com',
            password_hash=get_password_hash('abhi@123'),
            full_name='abhi',
            status='Active'
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        print("User created.")
    else:
        print("User already exists.")

    # Assign Admin role and all permissions
    role = session.exec(select(Role).where(Role.name == 'Admin')).first()
    if not role:
        print("Admin role not found. Please initialize roles first.")
    else:
        # Get all permissions for Admin
        perm_objs = session.exec(select(Permission)).all()
        for perm in perm_objs:
            urp = session.exec(
                select(UserRolePermission).where(
                    (UserRolePermission.user_id == user.id) &
                    (UserRolePermission.role_id == role.id) &
                    (UserRolePermission.permission_id == perm.id)
                )
            ).first()
            if not urp:
                urp = UserRolePermission(user_id=user.id, role_id=role.id, permission_id=perm.id)
                session.add(urp)
        session.commit()
        print("Admin role and all permissions assigned.")

    # Add three users with Indian names and assign roles
    users_to_add = [
        {
            'username': 'arjun2024',
            'email': 'arjun2024@example.com',
            'password': 'Arjun@2024!',
            'full_name': 'Arjun Mehra',
            'role': 'Admin'
        },
        {
            'username': 'ishaana99',
            'email': 'ishaana99@example.com',
            'password': 'Ishaana@99!',
            'full_name': 'Ishaana Singh',
            'role': 'Analyst'
        },
        {
            'username': 'pranav88',
            'email': 'pranav88@example.com',
            'password': 'Pranav@88!',
            'full_name': 'Pranav Reddy',
            'role': 'Inspector'
        }
    ]

    for u in users_to_add:
        user = session.exec(select(User).where(User.username == u['username'])).first()
        if not user:
            user = User(
                username=u['username'],
                email=u['email'],
                password_hash=get_password_hash(u['password']),
                full_name=u['full_name'],
                status='Active'
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"User {u['username']} created.")
        else:
            print(f"User {u['username']} already exists.")
        # Always assign role and all relevant permissions
        role = session.exec(select(Role).where(Role.name == u['role'])).first()
        if not role:
            print(f"Role {u['role']} not found. Please initialize roles first.")
            continue
        perm_objs = session.exec(select(Permission)).all()
        # Remove any existing role-permission assignments for this user/role
        session.exec(delete(UserRolePermission).where((UserRolePermission.user_id == user.id) & (UserRolePermission.role_id == role.id)))
        # Assign all permissions for this role
        for perm in perm_objs:
            urp = UserRolePermission(user_id=user.id, role_id=role.id, permission_id=perm.id)
            session.add(urp)
        session.commit()
        print(f"Role {u['role']} and permissions assigned to {u['username']}.") 