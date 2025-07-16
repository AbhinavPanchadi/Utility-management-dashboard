import sqlite3

DB_PATH = 'project/backend/app.db'

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Update the first user to Admin
cursor.execute("UPDATE user SET role = 'Admin' WHERE id = (SELECT id FROM user LIMIT 1);")
conn.commit()

# Show the updated user
cursor.execute("SELECT id, username, role FROM user WHERE id = (SELECT id FROM user LIMIT 1);")
user = cursor.fetchone()
print(f"Updated user: ID={user[0]}, Username={user[1]}, Role={user[2]}")

conn.close() 