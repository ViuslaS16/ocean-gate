# API Documentation

Base URL: `http://localhost:5000/api`

All API responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Optional array of validation errors"]
}
```

---

## Categories

### GET /categories
Get all categories

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "category_id",
      "name": "Panulirus Homarus (Brown/Sand) 200-300g",
      "species": "Panulirus Homarus",
      "weightRange": "200-300g",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /categories
Create a new category

**Request Body:**
```json
{
  "name": "Panulirus Homarus (Brown/Sand) 200-300g",
  "species": "Panulirus Homarus",
  "weightRange": "200-300g"
}
```

**Response:** Returns created category object

### PUT /categories/:id
Update a category

**Request Body:** Same as POST

**Response:** Returns updated category object

### DELETE /categories/:id
Delete a category

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error:** Returns 400 if stock items reference this category

---

## Stock

### GET /stock
Get all stock items with optional filters and pagination

**Query Parameters:**
- `search` (optional): Search by category name
- `category` (optional): Filter by category ID
- `status` (optional): Filter by status (Available, Sold, DOA)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "stock_id",
      "boxId": "BOX-ABC123",
      "category": {
        "_id": "category_id",
        "name": "Panulirus Homarus (Brown/Sand) 200-300g",
        "species": "Panulirus Homarus",
        "weightRange": "200-300g"
      },
      "quantity": 10,
      "weight": 2.5,
      "unitPrice": 50.00,
      "location": "Warehouse A",
      "status": "Available",
      "notes": "",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### GET /stock/available
Get only available stock items (status: Available, quantity > 0)

**Response:** Array of stock items

### GET /stock/:id
Get a single stock item by ID

**Response:** Single stock object

### POST /stock
Create a new stock item

**Request Body:**
```json
{
  "boxId": "BOX-123",  // Optional, auto-generated if empty
  "category": "category_id",
  "quantity": 10,
  "weight": 2.5,
  "unitPrice": 50.00,
  "location": "Warehouse A",
  "notes": "Optional notes"
}
```

**Response:** Returns created stock object with populated category

### PUT /stock/:id
Update a stock item

**Request Body:** Same as POST (excluding boxId)

**Response:** Returns updated stock object

### DELETE /stock/:id
Delete a stock item

**Response:**
```json
{
  "success": true,
  "message": "Stock item deleted successfully"
}
```

---

## Invoices

### GET /invoices
Get all invoices

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "invoice_id",
      "invoiceNumber": "INV-20240101-001",
      "date": "2024-01-01",
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
          "stockId": "stock_id",
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
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /invoices/:id
Get a single invoice by ID

**Response:** Single invoice object

### POST /invoices
Create a new invoice (Draft status)

**Request Body:**
```json
{
  "date": "2024-01-01",
  "customer": {
    "name": "John Doe",
    "address": "123 Main St",
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
      "stockId": "stock_id",
      "boxId": "BOX-ABC123",
      "description": "Panulirus Homarus (10 pcs)",
      "quantity": 5,
      "unitPrice": 50.00,
      "discount": 10,
      "subtotal": 225.00
    }
  ],
  "subtotal": 225.00,
  "tax": 22.50,
  "total": 247.50,
  "totalWeight": 1.25,
  "totalBoxes": 1
}
```

**Response:** Returns created invoice with auto-generated invoice number

### PUT /invoices/:id/finalize
Finalize an invoice (deducts stock using MongoDB transaction)

**Response:** Returns updated invoice object

**Note:** This operation:
1. Validates stock availability
2. Deducts quantities from stock items
3. Updates stock status to "Sold" if quantity reaches 0
4. Changes invoice status to "Finalized"

### DELETE /invoices/:id
Delete an invoice (only Draft invoices can be deleted)

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

---

## DOA (Dead on Arrival)

### GET /doa
Get all DOA records

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "doa_id",
      "stock": {
        "_id": "stock_id",
        "boxId": "BOX-ABC123",
        "category": {
          "name": "Panulirus Homarus (Brown/Sand) 200-300g"
        }
      },
      "boxId": "BOX-ABC123",
      "quantity": 2,
      "weight": 0.5,
      "notes": "Damaged during transport",
      "recordedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /doa
Record a DOA entry

**Request Body:**
```json
{
  "stockId": "stock_id",
  "quantity": 2,
  "notes": "Damaged during transport"
}
```

**Response:** Returns created DOA record

**Note:** This operation:
1. Validates quantity doesn't exceed available stock
2. Calculates DOA weight proportionally
3. Reduces stock quantity
4. Updates stock status to "DOA" if quantity reaches 0

### DELETE /doa/:id
Delete a DOA record

**Response:**
```json
{
  "success": true,
  "message": "DOA record deleted successfully"
}
```

---

## Dashboard

### GET /dashboard/metrics
Get all dashboard metrics and data

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "totalStock": {
        "quantity": 100,
        "weight": 25.5
      },
      "thisWeekIncome": 1500.00,
      "totalDOAWeight": 2.5,
      "availableBoxes": 10
    },
    "recentStock": [ /* Last 10 stock items */ ],
    "recentInvoices": [ /* Last 10 invoices */ ],
    "weeklyMovement": [
      {
        "date": "2024-01-01",
        "weight": 20.5
      }
      // ... 7 days of data
    ],
    "categoryDistribution": [
      {
        "_id": "category_id",
        "name": "Panulirus Homarus (Brown/Sand) 200-300g",
        "weight": 15.5,
        "quantity": 50
      }
    ]
  }
}
```

**Notes:**
- `thisWeekIncome`: Only includes Finalized invoices from current week (Sunday-Saturday)
- `weeklyMovement`: Last 7 days of cumulative stock weight
- `categoryDistribution`: Only Available stock by category

---

## Error Codes

- **400**: Bad Request (validation errors, business logic violations)
- **404**: Not Found
- **500**: Internal Server Error

## Common Error Scenarios

### Stock Operations
- Cannot delete category with existing stock
- Cannot add stock with non-existent category
- Duplicate Box ID

### Invoice Operations
- Insufficient stock quantity
- Cannot finalize already finalized invoice
- Cannot delete finalized invoice

### DOA Operations
- DOA quantity exceeds available quantity
- Stock item not found
