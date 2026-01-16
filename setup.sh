#!/bin/bash

# Install backend dependencies
echo "Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
echo "Backend setup complete. Please edit backend/.env with your database credentials."

# Install frontend dependencies
cd ../frontend
echo "Setting up frontend..."
npm install

# Copy environment template
cp .env.example .env
echo "Frontend setup complete."

# Back to root
cd ..

echo ""
echo "Setup complete!"
echo ""
echo "To run the application:"
echo "1. Update backend/.env with PostgreSQL connection string"
echo "2. In one terminal: cd backend && source venv/bin/activate && python main.py"
echo "3. In another terminal: cd frontend && npm start"
echo ""
echo "Then visit: http://localhost:3000"
