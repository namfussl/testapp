import sys
from sqlalchemy import text
from app.core.database import SessionLocal

def debug_db():
    db = SessionLocal()
    try:
        print("--- Inspecting 'users' table raw data ---")
        result = db.execute(text("SELECT email, role FROM users"))
        for row in result:
            print(f"Email: {row[0]}, Role: {row[1]}, Role Type: {type(row[1])}")
            
        print("\n--- Inspecting 'userrole' type ---")
        result = db.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'userrole'"))
        rows = result.fetchall()
        print(f"Enum values: {[r[0] for r in rows]}")

        print("\n--- Fixing data ---")
        db.execute(text("UPDATE users SET role = 'ADMIN' WHERE role = 'admin'"))
        db.commit()
        print("Updated 'admin' roles to 'ADMIN'")
        
        print("\n--- Verifying ---")
        result = db.execute(text("SELECT email, role FROM users"))
        for row in result:
            print(f"Email: {row[0]}, Role: {row[1]}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
