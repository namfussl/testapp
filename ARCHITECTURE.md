# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages: Home, Login, Register, ClientHome, FeeEarnerHome │  │
│  │  Components: ProtectedRoute, Auth Context Provider       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Services Layer: API client with JWT token management           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST │ (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Routers:                                                │   │
│  │  • auth.py - Register, Login, Get Current User           │   │
│  │  • invites.py - Send Invite, Verify Invite               │   │
│  │  • home.py - Client Home, Fee Earner Home                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Core Services:                                          │   │
│  │  • security.py - JWT, bcrypt, password hashing           │   │
│  │  • database.py - SQLAlchemy ORM setup                    │   │
│  │  • config.py - Environment configuration                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Models:                                                 │   │
│  │  • User - Stores user info and roles                     │   │
│  │  • Invite - Manages registration invites                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                       SQL    │ (SQLAlchemy)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables:                                                 │   │
│  │  • users - User accounts with roles                      │   │
│  │  • invites - Registration invites with tokens            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Diagram

```
User Input
   │
   ▼
┌─────────────┐
│ Login Page  │
└─────────────┘
   │
   ▼ (Email, Password)
┌────────────────────┐
│ POST /api/auth/login │
└────────────────────┘
   │
   ▼
┌─────────────────────────────┐
│ Backend Validates Credentials │
├─────────────────────────────┤
│ 1. Find user by email       │
│ 2. Verify password (bcrypt) │
│ 3. Generate JWT token       │
└─────────────────────────────┘
   │
   ├─────────────────────────────┬─────────────────────────────┐
   │ Valid                        │ Invalid                      │
   ▼                              ▼
┌──────────────────┐         ┌──────────────────┐
│ Return Token     │         │ Error: 401       │
│ & User Data      │         │ Unauthorized     │
└──────────────────┘         └──────────────────┘
   │                              │
   ▼                              ▼
┌──────────────────┐         ┌──────────────────┐
│ Store Token in   │         │ Show Error Msg   │
│ localStorage     │         │ Stay on Login    │
└──────────────────┘         └──────────────────┘
   │
   ▼
┌──────────────────────────┐
│ Redirect to Home Page    │
│ (Based on User Role)     │
├──────────────────────────┤
│ Client → /client-home    │
│ Fee Earner → /fee-earner │
└──────────────────────────┘
```

## Registration Flow Diagram

```
Admin Creates Invite
       │
       ▼
┌─────────────────────────────┐
│ POST /api/invites/send-invite │
├─────────────────────────────┤
│ • Verify admin user         │
│ • Check email not registered│
│ • Create invite record      │
│ • Generate unique token     │
│ • Set expiration (7 days)   │
└─────────────────────────────┘
       │
       ▼
Return invite token to admin
       │
       ▼
Admin sends invite link to user:
/register?invite_token=xxxxx
       │
       ▼
User clicks link
       │
       ▼
┌──────────────────────┐
│ GET /api/invites/{token} │
├──────────────────────┤
│ • Verify token valid │
│ • Check not expired  │
│ • Get invite details │
└──────────────────────┘
       │
       ▼
Registration Page Loads
Pre-filled with email & role
       │
       ▼
User fills form & submits
       │
       ▼
┌─────────────────────────────┐
│ POST /api/auth/register     │
├─────────────────────────────┤
│ 1. Validate all fields      │
│ 2. Hash password (bcrypt)   │
│ 3. Create user account      │
│ 4. Set assigned role        │
│ 5. Mark invite as accepted  │
└─────────────────────────────┘
       │
       ▼
Redirect to Login Page
User now can sign in
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    role VARCHAR NOT NULL,  -- 'admin', 'client', 'fee_earner'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Invites Table
```sql
CREATE TABLE invites (
    id SERIAL PRIMARY KEY,
    invite_token VARCHAR UNIQUE NOT NULL,
    email VARCHAR NOT NULL,
    role VARCHAR NOT NULL,  -- 'client' or 'fee_earner'
    status VARCHAR DEFAULT 'pending',  -- 'pending', 'accepted', 'rejected'
    user_id INTEGER REFERENCES users(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);
```

## Key Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (not stored in plaintext)
   - Configurable hashing rounds

2. **JWT Authentication**
   - Stateless authentication
   - Tokens include user ID and role
   - Configurable expiration time
   - Secret key-based signing

3. **Role-Based Access Control**
   - Three roles: admin, client, fee_earner
   - Protected routes check user role
   - Home pages accessible only to appropriate roles

4. **Invite Token Security**
   - Unique tokens per invite
   - Expiration enforcement
   - Single-use tracking (marked as accepted)

5. **CORS Protection**
   - Whitelisted origins
   - Credentials handling
   - Method restrictions

## Scalability Considerations

### Current Implementation
- Single FastAPI instance
- PostgreSQL database
- In-memory authentication

### Future Enhancements
- Redis for caching and sessions
- Database connection pooling
- Load balancing with multiple FastAPI instances
- Microservices architecture
- Message queue for async tasks
- CDN for static assets
