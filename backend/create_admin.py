import sys
import uuid
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User, UserRole
from datetime import timedelta
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings

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
            print(f"Admin user {admin_email} already exists. Resetting password and role...")
            hashed = get_password_hash("admin123")
            # Update role as well to ensure it matches the Enum (e.g. 'ADMIN' vs 'admin')
            update_sql = text("UPDATE users SET hashed_password = :password, role = :role WHERE email = :email")
            db.execute(update_sql, {"password": hashed, "role": admin_role_value, "email": admin_email})
            db.commit()
            print(f"Password reset to: admin123, Role set to: {admin_role_value}")
            
            # Generate and print token for existing user
            access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
            user = db.query(User).filter(User.email == admin_email).first()
            if user:
                 access_token = create_access_token(
                    data={"sub": user.email, "user_id": str(user.id), "role": user.role},
                    expires_delta=access_token_expires,
                )
                 print(f"\nYOUR_ADMIN_TOKEN (Bear this token for API calls):\n{access_token}")
            
            return

        print("Creating admin user...")
        password = "admin123"
        hashed = get_password_hash(password)
        
        insert_sql = text("""
            INSERT INTO users (user_uuid,email, full_name, hashed_password, role, is_active, created_at, updated_at)
            VALUES (:user_uuid,:email, :full_name, :password, :role, :is_active, NOW(), NOW())
        """)
        
        db.execute(insert_sql, {
            "user_uuid": uuid.uuid4(),
            "email": admin_email,
            "full_name": "Admin User",
            "password": hashed,
            "role": admin_role_value,
            "is_active": True
        })
        db.commit()
        
        # Generate access token for the admin
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        # Note: user_id must be a string as per our previous fix in auth.py
        # We need to fetch the user object first to get the ID if we just inserted it
        # However, for the insert case, we generated the UUID in Python, so we might know it if we captured it.
        # But let's just query the user back to be safe and consistent.
        
        user = db.query(User).filter(User.email == admin_email).first()
        
        if user:
            access_token = create_access_token(
                data={"sub": user.email, "user_id": str(user.id), "role": user.role},
                expires_delta=access_token_expires,
            )
            print("Admin user created/verified successfully!")
            print(f"Email: {admin_email}")
            print(f"Password: {password}")
            print(f"\nYOUR_ADMIN_TOKEN (Bear this token for API calls):\n{access_token}")
        else:
             print("Error: Could not retrieve user to generate token.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_and_create_admin()
