# Getting Started

## Quick Start

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb saas_db

# Or in PostgreSQL terminal
psql
CREATE DATABASE saas_db;
\q
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run the server
python main.py
```

The backend will be available at: http://localhost:8000

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the development server
npm start
```

The frontend will be available at: http://localhost:3000

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing the Workflow

### Create Admin User (One-time setup)
In PostgreSQL terminal:
```sql
INSERT INTO users (email, full_name, hashed_password, role, is_active) 
VALUES ('admin@example.com', 'Admin User', '$2b$12$...hashed_password...', 'admin', true);
```

### Send Invite via API -- Client
```bash
curl -X POST http://localhost:8000/api/invites/send-invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "client@example.com",
    "role": "client"
  }'
```

### Send Invite via API -- Fee Earner
```bash
curl -X POST http://localhost:8000/api/invites/send-invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "fee_earner@example.com",
    "role": "fee_earner"
  }'
```

### Register via UI
1. Go to: http://localhost:3000/register?invite_token=YOUR_TOKEN
2. Fill in registration form
3. Click Register

### Login
1. Go to: http://localhost:3000/login
2. Enter credentials
3. Redirected to appropriate dashboard

## Useful Commands

### Backend
```bash
# Run migrations (if using Alembic)
alembic upgrade head

# Access PostgreSQL
psql saas_db

# Drop all tables and recreate
python -c "from app.core.database import Base, engine; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)"
```

### Frontend
```bash
# Build for production
npm run build

# Run tests
npm test
```

## Default Configuration

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **Database**: PostgreSQL on localhost:5432
- **JWT Expiration**: 30 minutes
- **Invite Expiration**: 7 days

## Next Steps

1. Modify user roles and permissions as needed
2. Add project/workflow management features
3. Implement messaging system
4. Add file sharing capabilities
5. Set up email notifications
6. Deploy to production environment
