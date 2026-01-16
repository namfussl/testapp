# SaaS Collaboration Platform

A web application that brings together clients and fee earners in a SaaS setting to collaborate on workflows. Built with React.js, FastAPI, and PostgreSQL.

## Tech Stack

- **Frontend**: React.js 18.2
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Features

### User Journeys

1. **Administrator Invite System**
   - Administrators can send invites to clients or fee earners
   - Invites include a unique token and expire after 7 days
   - Invites track email, role, and status

2. **Registration & Login**
   - New users can register using an invite link
   - Existing users can sign in with email and password
   - JWT tokens are issued upon successful login

3. **Role-Based Access**
   - **Client Dashboard**: View connected fee earners and manage projects
   - **Fee Earner Dashboard**: View client opportunities and manage engagements

## Project Structure

```
testapp/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # Configuration settings
│   │   │   ├── database.py        # Database connection
│   │   │   └── security.py        # JWT and password utilities
│   │   ├── models/
│   │   │   ├── user.py            # User model
│   │   │   └── invite.py          # Invite model
│   │   ├── schemas/
│   │   │   └── user.py            # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── invites.py         # Invite management endpoints
│   │   │   └── home.py            # Home page endpoints
│   │   └── __init__.py
│   ├── main.py                    # FastAPI application entry point
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js  # Route protection component
    │   ├── context/
    │   │   └── AuthContext.js     # Auth context provider
    │   ├── pages/
    │   │   ├── Home.js            # Landing page
    │   │   ├── Login.js           # Login page
    │   │   ├── Register.js        # Registration page
    │   │   ├── ClientHome.js      # Client dashboard
    │   │   └── FeeEarnerHome.js   # Fee earner dashboard
    │   ├── services/
    │   │   └── api.js             # API client
    │   ├── App.js                 # Main app component
    │   ├── index.js               # React entry point
    │   └── index.css              # Global styles
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: Strong secret key for JWT signing
   - `FRONTEND_URL`: Frontend URL (default: http://localhost:3000)

5. Create database tables:
   ```bash
   python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
   ```

6. Run the FastAPI server:
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

4. Start the React development server:
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:3000`

### Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE saas_db;
```

Update the `DATABASE_URL` in the backend `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost/saas_db
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "full_name": "John Doe",
    "password": "securepassword"
  }
  ```

- **POST** `/api/auth/login` - Login and get JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **GET** `/api/auth/me` - Get current user info (requires token)

### Invites

- **POST** `/api/invites/send-invite` - Send invite (admin only)
  ```json
  {
    "email": "newuser@example.com",
    "role": "client"  // or "fee_earner"
  }
  ```

- **GET** `/api/invites/invite/{invite_token}` - Verify invite token

### Home Pages

- **GET** `/api/client-home` - Get client dashboard (requires client role)
- **GET** `/api/fee-earner-home` - Get fee earner dashboard (requires fee_earner role)

## User Flow

### 1. Administrator Sends Invite
1. Admin logs in to the system
2. Admin creates an invite for a client or fee earner
3. Invite is sent with a unique token
4. Recipient receives invite link

### 2. User Registration
1. User clicks invite link (e.g., `/register?invite_token=xxxxx`)
2. User fills in registration form
3. User password is hashed with bcrypt
4. User account is created with assigned role

### 3. User Login
1. User goes to `/login`
2. User enters email and password
3. Credentials are verified
4. JWT token is issued
5. User is redirected to their home page based on role

### 4. Client Home Page
- Client can see active projects
- Client can view connected fee earners
- Client can start new projects
- Client can browse available fee earners

### 5. Fee Earner Home Page
- Fee earner can see active engagements
- Fee earner can view connected clients
- Fee earner can see pending collaboration requests
- Fee earner can update profile

## Authentication Flow

1. User logs in with credentials
2. Backend validates credentials and hashes password
3. JWT token is created with user ID and role
4. Token is stored in localStorage on the frontend
5. Token is sent with each API request in `Authorization` header
6. Backend validates token for protected routes

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for stateless authentication
- CORS middleware for cross-origin requests
- Token expiration (default: 30 minutes)
- Role-based access control for sensitive endpoints

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost/saas_db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000
```

## Testing the Application

### Manual Testing Workflow

1. **Create an Admin User** (via database):
   - Insert a user with role='admin' directly into the database, or create a registration endpoint for admins

2. **Admin Sends Invite**:
   - Use API endpoint: `POST /api/invites/send-invite`
   - Provide email and role (client or fee_earner)

3. **User Registration**:
   - Go to: `http://localhost:3000/register?invite_token=<token>`
   - Fill in registration form
   - Click Register

4. **User Login**:
   - Go to: `http://localhost:3000/login`
   - Enter credentials
   - Should be redirected to appropriate home page

## Troubleshooting

### Backend Issues

- **Database connection error**: Check `DATABASE_URL` in `.env`
- **Port already in use**: Change port in `main.py` or kill process using port 8000
- **Import errors**: Ensure virtual environment is activated

### Frontend Issues

- **API connection error**: Check `REACT_APP_API_URL` in `.env`
- **CORS errors**: Verify CORS is configured in backend with correct frontend URL
- **Auth token issues**: Check localStorage in browser DevTools

## Future Enhancements

- Real-time notifications using WebSockets
- Project and workflow management
- File sharing and document management
- Messaging system between clients and fee earners
- Payment processing integration
- Advanced user profile management
- Activity logging and audit trails
- Email notifications for invites and activities

## License

MIT License - See LICENSE file for details
