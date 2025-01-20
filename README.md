# Meeting Management System

## Project Overview
A comprehensive meeting management system with a Node.js/Express backend and a React frontend.

## Project Structure
- `/Backend` - Node.js/Express backend
- `/Frontend` - React frontend (coming soon)

## Getting Started

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following content:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/meeting-management
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Testing the System
1. Open http://localhost:3000 in your browser
2. Register a new account or use the default admin account:
   - Email: admin@example.com
   - Password: 123456

## Features
- User Authentication (Login/Register)
- Meeting Management
- Task Assignment
- Pain Points Tracking
- Role-based Access Control

### Important Notes
- Default port is 5001 (if 5000 is busy)
- Server will automatically find an available port
- Check MongoDB connection in the console

### API Documentation
See `/Backend/apidocs.md` for complete API documentation.

### Troubleshooting
If you see "Port in use" message:
1. The server will automatically try the next available port
2. Check the console for the actual running port
3. Use `npm run check-port` to see what's using the default port

### System Requirements
- Node.js (>= 14.17.0)
- npm (>= 6.14.13)
- React (>= 17.0.2)

### Contributing
Contributions are welcome. Please submit a pull request with a detailed description of changes. 