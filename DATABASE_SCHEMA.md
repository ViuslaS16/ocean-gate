# Database Schema Documentation

MongoDB database schema for Ocean Gate International Stock Management System.

Database Name: `ocean-gate`

---

## Collections

### 1. categories

Stores lobster category definitions with species and weight ranges.

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String,              // Full category name (required)
  species: String,           // Species name (required)
  weightRange: String,       // Weight range (required)
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes:**
- Primary: `_id`

**Example Document:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Panulirus Homarus (Brown/Sand) 200-300g",
  "species": "Panulirus Homarus",
  "weightRange": "200-300g",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Constraints:**
- All fields are required
- Cannot be deleted if referenced by stock items

---

### 2. stocks

Stores inventory of live lobster stock items.

**Schema:**
```javascript
{
  _id: ObjectId,
  boxId: String,             // Unique box identifier (required, unique)
  category: ObjectId,        // Reference to categories collection (required)
  quantity: Number,          // Number of pieces (required, min: 0)
  weight: Number,            // Total weight in kg (required, min: 0)
  unitPrice: Number,         // Price per unit (required, min: 0)
  location: String,          // Storage location (optional)
  status: String,            // Enum: 'Available', 'Sold', 'DOA' (default: 'Available')
  notes: String,             // Additional notes (optional)
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes:**
- Primary: `_id`
- Unique: `boxId`
- Foreign Key: `category` → `categories._id`

**Example Document:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "boxId": "BOX-ABC123",
  "category": "65a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 10,
  "weight": 2.5,
  "unitPrice": 50.00,
  "location": "Warehouse A",
  "status": "Available",
  "notes": "",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Constraints:**
- `boxId` must be unique
- `category` must reference existing category
- `quantity`, `weight`, `unitPrice` must be non-negative
- `status` must be one of: 'Available', 'Sold', 'DOA'

---

### 3. invoices

Stores export invoices with customer, shipping, and line items.

**Schema:**
```javascript
{
  _id: ObjectId,
  invoiceNumber: String,     // Unique invoice number (required, unique)
  date: Date,                // Invoice date (required, default: now)
  customer: {
    name: String,            // Customer name (required)
    address: String,         // Customer address (required)
    phone: String,           // Customer phone (required)
    email: String            // Customer email (required)
  },
  shipping: {
    awbNumber: String,       // Air Waybill number (required)
    flightNumber: String,    // Flight number (required)
    destination: String      // Destination (required)
  },
  lineItems: [{
    stockId: ObjectId,       // Reference to stock (required)
    boxId: String,           // Box ID for reference (required)
    description: String,     // Item description (required)
    quantity: Number,        // Quantity sold (required, min: 1)
    unitPrice: Number,       // Unit price (required, min: 0)
    discount: Number,        // Discount percentage (default: 0, min: 0, max: 100)
    subtotal: Number         // Line item subtotal (required)
  }],
  status: String,            // Enum: 'Draft', 'Finalized' (default: 'Draft')
  subtotal: Number,          // Invoice subtotal (required, default: 0)
  tax: Number,               // Tax amount (default: 0)
  total: Number,             // Total amount (required, default: 0)
  totalWeight: Number,       // Total weight (default: 0)
  totalBoxes: Number,        // Total boxes (default: 0)
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes:**
- Primary: `_id`
- Unique: `invoiceNumber`
- Foreign Keys: `lineItems.stockId` → `stocks._id`

**Example Document:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
  "invoiceNumber": "INV-20240101-001",
  "date": "2024-01-01T00:00:00.000Z",
  "customer": {
    "name": "John Doe",
    "address": "123 Main St, City, Country",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "shipping": {
    "awbNumber": "AWB123456",
    "flightNumber": "FL123",
    "destination": "New York"
  },
  "lineItems": [
    {
      "stockId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "boxId": "BOX-ABC123",
      "description": "Panulirus Homarus (10 pcs)",
      "quantity": 5,
      "unitPrice": 50.00,
      "discount": 10,
      "subtotal": 225.00
    }
  ],
  "status": "Finalized",
  "subtotal": 225.00,
  "tax": 22.50,
  "total": 247.50,
  "totalWeight": 1.25,
  "totalBoxes": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Constraints:**
- `invoiceNumber` must be unique (format: INV-YYYYMMDD-XXX)
- All customer and shipping fields are required
- `lineItems` must have at least one item
- `status` must be one of: 'Draft', 'Finalized'
- Finalized invoices cannot be deleted or modified

---

### 4. doas

Stores Dead on Arrival (DOA) records.

**Schema:**
```javascript
{
  _id: ObjectId,
  stock: ObjectId,           // Reference to stocks collection (required)
  boxId: String,             // Box ID for reference (required)
  quantity: Number,          // DOA quantity (required, min: 1)
  weight: Number,            // DOA weight in kg (required, min: 0)
  notes: String,             // Notes/reason for DOA (optional)
  recordedAt: Date,          // Recording timestamp (default: now)
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes:**
- Primary: `_id`
- Foreign Key: `stock` → `stocks._id`

**Example Document:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
  "stock": "65a1b2c3d4e5f6g7h8i9j0k2",
  "boxId": "BOX-ABC123",
  "quantity": 2,
  "weight": 0.5,
  "notes": "Damaged during transport",
  "recordedAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Constraints:**
- `stock` must reference existing stock item
- `quantity` must not exceed available stock quantity
- `weight` is calculated proportionally from stock

---

## Relationships

```
categories (1) ────< (Many) stocks
                             │
                             │ (Referenced by)
                             ├──< invoices.lineItems
                             └──< doas
```

### Category → Stock
- One category can have many stock items
- Stock items cannot exist without a category
- Categories cannot be deleted if stock items reference them

### Stock → Invoice Line Items
- One stock item can be referenced in multiple invoice line items
- Line items store stockId for reference
- Stock quantities are deducted when invoice is finalized

### Stock → DOA
- One stock item can have multiple DOA records
- DOA records reference the stock item
- Stock quantities are reduced when DOA is recorded

---

## Business Rules

### Stock Management
1. Box IDs are auto-generated (UUID format) if not provided
2. Stock status changes:
   - `Available` → `Sold` when invoice is finalized and quantity reaches 0
   - `Available` → `DOA` when DOA quantity equals total quantity
3. Stock quantity can be reduced by:
   - Invoice finalization
   - DOA recording

### Invoice Processing
1. Invoice numbers are auto-generated: `INV-YYYYMMDD-XXX`
2. Draft invoices do NOT affect stock
3. Finalized invoices:
   - Deduct stock quantities (using MongoDB transaction)
   - Cannot be edited or deleted
   - Included in weekly income calculations

### DOA Handling
1. DOA quantity must not exceed available stock quantity
2. DOA weight is calculated: `(stock.weight / stock.quantity) * doa.quantity`
3. Stock quantity is reduced when DOA is recorded
4. If DOA quantity = stock quantity, status changes to 'DOA'

### Dashboard Metrics
1. **Total Stock**: Sum of all Available stock (quantity and weight)
2. **Weekly Income**: Sum of Finalized invoices from current week (Sunday-Saturday)
3. **Total DOA Weight**: Sum of all DOA weights
4. **Available Boxes**: Count of Available stock items

---

## Data Initialization

On fresh server start (development mode), all collections are cleared automatically.

### Initial Setup Flow:
1. Add categories from presets
2. Add stock items
3. Create invoices and finalize
4. Record DOA entries as needed

---

## Backup Recommendations

1. **Daily backups** of entire database
2. **Transaction logs** for point-in-time recovery
3. **Export critical data** (invoices, stock) to CSV regularly
4. Consider **MongoDB Atlas** for automated backups in production

---

## Performance Considerations

### Indexes
Consider adding indexes for:
- `stocks.status` - frequently queried
- `stocks.category` - used in joins
- `invoices.status` - for filtering
- `invoices.createdAt` - for weekly income calculation

### Aggregation Pipelines
Dashboard metrics use aggregation pipelines for:
- Stock totals by status
- Weekly income calculation
- Category distribution
- Recent activity queries

These should be monitored for performance as data grows.
