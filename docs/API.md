# REST API Reference — RevenueAI

Complete specification of all internal and external REST API endpoints.

## 1. Payments & Customers

### `GET /api/payments`
Retrieves all customer payments, failure statuses, and associated recovery attempt records.
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 90,
    "payments": [...]
  }
  ```

### `GET /api/payments/:id`
Fetch single payment details by ID.
- **Response**: `200 OK` or `404 Not Found`

---

## 2. Payment Recovery Flow

### `POST /api/recover`
Triggers AI analysis and creates a targeted recovery attempt.
- **Request Body**:
  ```json
  {
    "paymentId": "cmtdftt7l004gp8txryivfzfs"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Recovery link created & notifications dispatched to Email and SMS",
    "paymentLink": "http://localhost:3000/recover/..."
  }
  ```

### `POST /api/recover/cash`
Reconciles payment via manual cash collection.
- **Request Body**:
  ```json
  {
    "paymentId": "cmtdftt7l004gp8txryivfzfs",
    "cashReference": "CASH-REC-1234",
    "notes": "Collected in person",
    "collectedBy": "Staff Name"
  }
  ```

### `POST /api/recover/complete`
Validates Razorpay payment signature and marks payment captured.
- **Request Body**:
  ```json
  {
    "paymentId": "string",
    "razorpayOrderId": "order_xyz",
    "razorpayPaymentId": "pay_abc",
    "razorpaySignature": "hex_signature"
  }
  ```

---

## 3. Email Sandbox API

### `GET /api/notifications/sandbox`
Returns array of captured sandbox emails.

### `POST /api/notifications/sandbox`
Triggers a test notification directly into the sandbox buffer.
