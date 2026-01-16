import sys
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def debug_and_create_admin():
    db = SessionLocal()
    try:
        # Debug: Check accepted enum values in Postgres
        print("Checking defined enum values in database...")
        result = db.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'userrole'"))
        rows = result.fetchall()
        valid_values = [r[0] for r in rows]
        print(f"Valid 'userrole' values in DB: {valid_values}")

        # Determine which value to use
        admin_role_value = "admin"
        if "ADMIN" in valid_values:
            admin_role_value = "ADMIN"
        elif "admin" in valid_values:
            admin_role_value = "admin"
        else:
            print(f"WARNING: Neither 'admin' nor 'ADMIN' found in DB enum values. Values found: {valid_values}")

        print(f"Using role value: {admin_role_value}")
        
        # Check if admin exists
        admin_email = "admin@example.com"
        # We might need to cast to run the query if python enum mismatches
        # For now, let's try standard ORM
        
        # Create user with raw SQL to bypass SQLAlchemy Enum validation if needed for the fix
        # But let's try ORM first with the correct value if possible
        
        # If the Python model is incompatible with DB, we might crash on ORM mapping.
        # Let's try raw insert for the admin user to ensure it works
        
        check_user_sql = text("SELECT email FROM users WHERE email = :email")
        existing_user = db.execute(check_user_sql, {"email": admin_email}).fetchone()
        
        if existing_user:
            print(f"Admin user {admin_email} already exists. Resetting password...")
            hashed = get_password_hash("admin123")
            update_sql = text("UPDATE users SET hashed_password = :password WHERE email = :email")
            db.execute(update_sql, {"password": hashed, "email": admin_email})
            db.commit()
            print("Password reset to: admin123")
            return

        print("Creating admin user...")
        password = "admin123"
        hashed = get_password_hash(password)
        
        insert_sql = text("""
            INSERT INTO users (email, full_name, hashed_password, role, is_active, created_at, updated_at)
            VALUES (:email, :full_name, :password, :role, :is_active, NOW(), NOW())
        """)
        
        db.execute(insert_sql, {
            "email": admin_email,
            "full_name": "Admin User",
            "password": hashed,
            "role": admin_role_value,
            "is_active": True
        })
        db.commit()
        
        print("Admin user created successfully!")
        print(f"Email: {admin_email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_and_create_admin()
