# Ocean Gate - Server Startup Guide

## Quick Start

### Option 1: Using Shell Script (Recommended for Mac/Linux)

Run both servers with a single command:

```bash
./start.sh
```

This will:
- Start the backend server on port **3000**
- Start the frontend server on port **3001**
- Display status messages
- Allow you to stop both servers with `Ctrl+C`

### Option 2: Using NPM Script

First, install the required package:

```bash
npm install
```

Then run:

```bash
npm run dev
```

This uses the `concurrently` package to run both servers.

### Option 3: Manual Start (Two Terminal Windows)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Server Configuration

- **Backend**: http://localhost:3000
  - API routes: http://localhost:3000/api
  
- **Frontend**: http://localhost:3001
  - Main application interface

## Environment Variables

### Backend (.env in backend/)
```
MONGODB_URI=mongodb://localhost:27017/ocean-gate
PORT=3000
```

### Frontend (.env.local in frontend/)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Port Already in Use

If you see port conflicts:
1. Stop any running instances
2. Check for processes: `lsof -i :3000` and `lsof -i :3001`
3. Kill processes if needed

### 404 Errors on Pages

Clear Next.js cache:
```bash
cd frontend
rm -rf .next
npm run dev
```

### Database Reset

Clear all data:
```bash
node backend/clearDatabase.js
```

## Additional Scripts

- **Install all dependencies**: `npm run install-all`
- **Clear database**: `npm run clear-db`
