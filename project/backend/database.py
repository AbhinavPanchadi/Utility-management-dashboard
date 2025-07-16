from sqlmodel import SQLModel, create_engine, Session, select
from models import User, UserAnalytics
import json
from datetime import datetime
import random

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    create_fake_users()
    create_fake_analytics()

def get_session():
    with Session(engine) as session:
        yield session

def create_fake_users():
    with Session(engine) as session:
        if session.exec(select(User)).first():
            return  # Already has data
        fake_users = [
            User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password_hash="fakehash",
                full_name=f"User {i}",
                bio="Test user",
                avatar=None,
                created_at=datetime(2024, 1, 1, 12, 0, 0),
                status=random.choice(["active", "inactive"]),
                region=random.choice(["North", "South", "East", "West"]),
                segment=random.choice(["Residential", "Commercial", "Industrial"]),
                phase=random.choice(["1-phase", "3-phase"]),
            ) for i in range(1, 6)
        ]
        for user in fake_users:
            session.add(user)
        session.commit()

def create_fake_analytics():
    with Session(engine) as session:
        if session.exec(select(UserAnalytics)).first():
            return  # Already has data
        fake_analytics = [
            UserAnalytics(
                number=i,
                name=f"User {i}",
                email=f"user{i}@example.com",
                status=random.choice(["active", "inactive"]),
                region=random.choice(["North", "South", "East", "West"]),
                segment=random.choice(["Residential", "Commercial", "Industrial"]),
                phase=random.choice(["1-phase", "3-phase"]),
                createdAt="2024-01-01",
                usage_history=json.dumps([
                    {"month": m, "usage": random.randint(150, 300)} for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                ]),
                payment_history=json.dumps([
                    {"month": m, "paid": random.choice([0, 1])} for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                ]),
                alert_history=json.dumps([
                    {"month": m, "alerts": random.randint(0, 2)} for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
                ]),
                recent_activity=json.dumps([
                    f"2024-07-01: Paid bill",
                    f"2024-06-25: Usage alert triggered",
                    f"2024-06-15: Updated profile",
                    f"2024-06-01: Paid bill"
                ]),
            ) for i in range(1, 6)
        ]
        for analytics in fake_analytics:
            session.add(analytics)
        session.commit() 