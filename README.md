# Ocean Gate International - Stock Management & POS System

A comprehensive full-stack web application for managing live seafood inventory, generating export invoices, tracking Dead on Arrival (DOA) items, and providing business analytics for Ocean Gate International - a seafood export company specializing in live lobster exports.

## Features

### 📊 Dashboard
- Real-time metrics: Total Stock, Weekly Income, DOA Weight, Available Boxes
- Weekly stock movement line chart
- Category distribution pie chart
- Recent stock additions and invoices tables

### 📦 Stock Management
- Add new stock with auto-generated Box IDs
- Search and filter by category name and status
- View stock details with quantity, weight, and pricing
- Delete stock items with confirmation
- Pagination support (20 items per page)

### 🏷️ Category Management
- 9 preset lobster categories (Panulirus Homarus, Peniciliatus, Versicolor)
- Quick-add from preset categories
- Delete categories (with validation)
- Category details: Species and weight range

### 📄 Invoice Generation
- Create export invoices with customer and shipping details
- Auto-complete stock selection with real-time quantity validation
- Line items with quantity, price, and discount
- Real-time calculations (subtotal, tax, total, weight)
- Save as Draft or Finalize
- PDF generation and auto-download on finalization
- Stock deduction using MongoDB transactions

### ⚠️ DOA (Dead on Arrival) Management
- Record DOA items from available stock
- Quantity validation against available stock
- Automatic stock quantity adjustment
- DOA history with timestamps and notes
- Dashboard metrics tracking

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Features**: RESTful API, MongoDB Transactions, Auto-generation (Box ID, Invoice Number)

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with ocean-themed colors
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **State Management**: React Hooks

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
cd /Users/visula_s/ocean-gate
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/ocean-gate
# PORT=5000
# FRONTEND_URL=http://localhost:3000

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

**Note**: All data is cleared on fresh server start in development mode.

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:3000`

## Usage

### Initial Setup
1. Navigate to **Settings** to add categories from preset lobster categories
2. Go to **Stock** and add your inventory using the added categories
3. Access **Dashboard** to view real-time metrics

### Creating an Invoice
1. Navigate to **Invoices** → **New Invoice**
2. Fill in customer details (Name, Address, Phone, Email)
3. Fill in shipping details (AWB Number, Flight Number, Destination)
4. Add line items by selecting stock items (autocomplete shows available quantity)
5. Enter quantity and optional discount
6. Save as **Draft** (doesn't affect stock) or **Finalize** (deducts stock and downloads PDF)

### Recording DOA
1. Navigate to **DOA**
2. Select stock item from dropdown
3. Enter DOA quantity (validated against available quantity)
4. Add notes/reason
5. Submit to update stock and create DOA record

## Project Structure

```
ocean-gate/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose schemas (Category, Stock, Invoice, DOA)
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Error handling
│   └── server.js        # Express server entry point
│
├── frontend/
│   ├── app/             # Next.js pages (App Router)
│   │   ├── page.js      # Dashboard
│   │   ├── stock/       # Stock management
│   │   ├── invoices/    # Invoice list and creation
│   │   ├── doa/         # DOA management
│   │   └── settings/    # Category management
│   ├── components/      # React components
│   │   ├── Dashboard/   # Dashboard-specific components
│   │   ├── Stock/       # Stock management components
│   │   ├── Invoice/     # Invoice components
│   │   ├── DOA/         # DOA components
│   │   ├── Settings/    # Category components
│   │   └── UI/          # Reusable UI components
│   └── lib/             # Utilities and API client
│
└── README.md            # This file
```

## API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed database schema documentation.

## Key Business Logic

### Stock Deduction
- Invoices can be saved as **Draft** without affecting stock
- Only **Finalized** invoices trigger stock deduction
- Uses MongoDB transactions to ensure data consistency
- Stock status automatically updates to "Sold" when quantity reaches 0

### DOA Handling
- DOA quantity cannot exceed available stock quantity
- Stock quantity is reduced when DOA is recorded
- If DOA quantity equals total quantity, status changes to "DOA"
- DOA weight is calculated proportionally

### Weekly Income Calculation
- Only **Finalized** invoices are included in weekly income
- Week starts on Sunday at 00:00:00
- Real-time aggregation from MongoDB

## Production Deployment

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

Consider using:
- **PM2** for process management
- **Nginx** as reverse proxy
- **MongoDB Atlas** for cloud database
- **Vercel** or **Netlify** for frontend hosting

## Development

### Running Tests (Backend)
```bash
cd backend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm install --production

# Frontend
cd frontend
npm run build
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check `.env` file configuration
- Verify port 5000 is not in use

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS configuration in backend

### PDF generation fails
- Ensure jsPDF is installed: `npm install jspdf`
- Check browser console for errors
- Verify invoice data is complete

## License

MIT License - Ocean Gate International

## Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Ocean Gate International**
