# Ocean Gate International - Setup Guide

## Complete Step-by-Step Installation & Running Instructions

### Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should show v18.x or higher
   ```

2. **MongoDB** (v5.0 or higher)
   ```bash
   mongod --version  # Should show v5.x or higher
   ```

3. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

---

## Step 1: Start MongoDB

Open a new terminal window and start MongoDB:

```bash
# Option 1: If installed via Homebrew (macOS)
brew services start mongodb-community

# Option 2: Start manually
mongod
```

**Verification**: MongoDB should be running on `localhost:27017`

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd /Users/visula_s/ocean-gate/backend
```

###  2.2 Install Dependencies
If not already installed:
```bash
npm install
```

### 2.3 Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# The .env file should contain:
# MONGODB_URI=mongodb://localhost:27017/ocean-gate
# PORT=3000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000
```

### 2.4 Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
Server running on port 3000
MongoDB Connected: localhost
All data cleared for fresh start
```

✅ Backend is now running! Keep this terminal open.

---

## Step 3: Frontend Setup

### 3.1 Open New Terminal Window
Open a **NEW** terminal window (don't close the backend terminal)

### 3.2 Navigate to Frontend Directory
```bash
cd /Users/visula_s/ocean-gate/frontend
```

### 3.3 Install Dependencies
If not already installed:
```bash
npm install
```

### 3.4 Configure Environment
```bash
# Copy the example environment file
cp .env.local.example .env.local

# The .env.local file should contain:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3.5 Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

**Note**: If port 3000 is in use, Next.js will automatically use port 3001 or 3002.

✅ Frontend is now running! Keep this terminal open.

---

## Step 4: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

(Or the port shown in the Next.js output if different)

---

## Step 5: Initial Setup & Testing

### 5.1 Add Categories
1. Click on **Settings** in the navigation
2. Click any **preset category** cards (e.g., "Panulirus Homarus 200-300g")
3. Add at least 3 categories
4. Verify they appear in the Categories list below

### 5.2 Add Stock
1. Navigate to **Stock** page
2. Click **Add Stock** button
3. Fill in the form:
   - **Box ID**: Leave empty (auto-generates)
   - **Category**: Select from dropdown
   - **Quantity**: e.g., 10
   - **Weight**: e.g., 2.5
   - **Unit Price**: e.g., 35
4. Click **Add Stock**
5. Repeat to add 2-3 stock items

### 5.3 Create Invoice
1. Navigate to **Invoices** → **New Invoice**
2. Fill customer information (all required)
3. Fill shipping information (all required)
4. Click **Add Item** to add line items
5. Select stock from dropdown
6. Enter quantity
7. Click **Finalize & Download PDF**
8. PDF will download with invoice number as filename

### 5.4 Check Dashboard
1. Navigate to **Dashboard**
2. Verify metrics are updated:
   - Total Stock shows remaining quantities
   - This Week's Income shows finalized invoices
   - Charts display data

---

## Troubleshooting

### Issue: Port Already in Use

**Backend Port 3000 in use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# On macOS, port 5000 might be used by AirPlay Receiver
# Go to System Preferences → Sharing → Disable AirPlay Receiver
```

**Frontend Port in use:**
- Next.js will automatically use next available port (3001, 3002, etc.)
- Update backend .env: `FRONTEND_URL=http://localhost:3001` (use the port Next.js shows)
- Restart backend server

### Issue: MongoDB Connection Failed

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community
# OR
mongod
```

### Issue: "Failed to fetch" Errors

1. **Check backend is running** on correct port
   ```bash
   curl http://localhost:3000/api/categories
   # Should return: {"success":true,"data":[]}
   ```

2. **Check CORS configuration**
   - Backend `.env`: `FRONTEND_URL` should match frontend URL
   - Frontend `.env.local`: `NEXT_PUBLIC_API_URL` should match backend URL

3. **Restart both servers** after env changes

### Issue: Clean Start Needed

If you want to start fresh with empty database:

```bash
# Stop all servers (Ctrl+C in both terminals)
# Kill all node processes
killall -9 node

# Clear MongoDB data (optional - removes all data)
# In MongoDB shell:
use ocean-gate
db.dropDatabase()

# Restart backend (will auto-clear and create indexes)
cd backend
npm run dev

# Restart frontend
cd frontend
npm run dev
```

### Issue: PDF Not Downloading

1. Check browser console for errors (F12)
2. Ensure invoice is being finalized (check backend terminal for errors)
3. Verify jsPDF dependency is installed:
   ```bash
   cd frontend
   npm install jspdf
   ```

---

## Terminal Window Summary

When everything is running correctly, you should have **3 terminal windows**:

1. **MongoDB Terminal**: Running `mongod`
2. **Backend Terminal**: Running `npm run dev` in `/backend` (port 3000)
3. **Frontend Terminal**: Running `npm run dev` in `/frontend` (port 3000 or 3001)

---

## Stopping the Application

To stop all services:

1. In each terminal press `Ctrl + C`
2. Optionally kill all node processes:
   ```bash
   killall node
   ```
3. Stop MongoDB:
   ```bash
   brew services stop mongodb-community
   ```

---

## Quick Start (After First Setup)

Once initial setup is complete, starting the app is simple:

```bash
# Terminal 1: Start MongoDB
brew services start mongodb-community

# Terminal 2: Start Backend
cd /Users/visula_s/ocean-gate/backend && npm run dev

# Terminal 3: Start Frontend
cd /Users/visula_s/ocean-gate/frontend && npm run dev

# Open browser to http://localhost:3000
```

---

## Additional Notes

- **Data Persistence**: All data clears on backend restart (development mode)
- **Port Configuration**: Default is 3000 for both (Next.js auto-adjusts if needed)
- **PDF Filenames**: Auto-generated as `INV-YYYYMMDD-XXX.pdf`
- **Company Info**: Updated in PDF exports with contact details

---

## Support

For issues or questions:
1. Check terminal output for error messages
2. Review browser console (F12) for frontend errors
3. Verify environment variables are correct
4. Ensure MongoDB is running

## Features Overview

- ✅ **Category Management**: 9 preset lobster species with weight ranges
- ✅ **Stock Management**: Auto-generated Box IDs, search, filter
- ✅ **Invoice Generation**: Draft and finalize with PDF export
- ✅ **DOA Tracking**: Record Dead on Arrival items
- ✅ **Dashboard Analytics**: Real-time metrics and charts
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Floating Navigation**: Modern UI with backdrop blur effect

Enjoy using Ocean Gate International Stock Management System! 🦞
