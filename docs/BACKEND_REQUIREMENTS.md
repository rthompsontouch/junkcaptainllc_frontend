# Backend Requirements for Junk Captain LLC

This document outlines the backend API requirements for the Junk Captain LLC monorepo. The frontend is already wired to these endpoints; the backend should implement them.

---

## Overview

- **Frontend**: Next.js (this repo) – public site + dashboard
- **Backend**: To be created as a separate service in a monorepo
- **Data flow**: Hero form → `/api/quote` (public) → MongoDB + Resend email

---

## 1. Public Endpoints (No Auth)

### `POST /api/quote` (or `/quote`)

**Purpose**: Handle quote request form submissions from the Hero component.

**Request body**:
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "address": "string (required)",
  "message": "string (optional)",
  "imageCount": "number (optional, default 0)"
}
```

**Future**: Support `multipart/form-data` for image uploads (up to 4 images).

**Backend responsibilities**:
1. Validate input
2. Save to MongoDB as a potential customer (lead)
3. Send email to business owner via **Resend** with form details
4. Return `{ success: true, message: "...", id: number }`

**Response**:
- `200`: `{ success: true, message: "Thank you! We'll be in touch soon.", id: 123 }`
- `400`: `{ error: "Name, email, phone, and address are required" }`
- `500`: `{ error: "Something went wrong. Please try again or call us." }`

---

## 2. Auth Endpoints

### `POST /api/login`

**Request body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**:
- `200`: `{ user: { id, name, email }, token: "jwt-string" }`
- `401`: `{ error: "Invalid credentials" }`

**Notes**: Replace demo login with real JWT auth. Consider bcrypt for passwords, JWT for tokens.

---

## 3. Dashboard Endpoints (Auth Required)

All dashboard endpoints require:
```
Authorization: Bearer <token>
```

### `GET /api/customers?type=potential`
Returns array of potential customers (leads).

### `GET /api/customers?type=active`
Returns array of active customers.

### `GET /api/customers`
Returns `{ potential: [...], active: [...] }`.

### `POST /api/customers`
Create a potential customer (manual entry from dashboard).

**Request body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "service": "string",
  "images": "number",
  "notes": "string"
}
```

### `PUT /api/customers`
Update or convert a customer.

**Update**:
```json
{
  "id": "number",
  "type": "potential" | "active",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "service": "string",
  "notes": "string",
  "lastServiceDate": "string (active only)",
  "serviceNote": "string (active only)"
}
```

**Convert potential → active**:
```json
{
  "action": "convert",
  "id": "number"
}
```

### `DELETE /api/customers`
**Request body**:
```json
{
  "id": "number",
  "type": "potential" | "active"
}
```

### `GET /api/notifications`
Returns array of notifications (e.g. new quote requests).

### `PUT /api/notifications/read`
**Request body**:
```json
{
  "id": "number"
}
```

---

## 4. Data Models (MongoDB)

### PotentialCustomer
```ts
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  address: string,
  service: string,
  date: string (ISO date),
  images: number,
  imageUrls?: string[],  // for uploaded images
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### ActiveCustomer
```ts
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  address: string,
  service: string,
  lastServiceDate: string,
  serviceNote: string,
  images: number,
  imageUrls?: string[],
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### User (for admin login)
```ts
{
  _id: ObjectId,
  email: string,
  passwordHash: string,
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```ts
{
  _id: ObjectId,
  customerId: ObjectId,
  type: "new_quote",
  read: boolean,
  createdAt: Date
}
```

---

## 5. External Services

- **Resend**: Email API for sending quote notifications to business owner
- **MongoDB**: Database (e.g. Atlas)
- **File storage** (optional): For image uploads (e.g. S3, Cloudinary)

---

## 6. Monorepo Structure (Suggested)

```
junkcaptain/
├── apps/
│   ├── backend/     # Node/Express or Fastify
│   └── frontend/    # This Next.js app (or keep separate)
├── packages/
│   ├── shared/      # Shared types, constants
│   └── db/          # MongoDB models, connection
└── package.json     # Turborepo or similar
```

---

## 7. Environment Variables (Backend)

```
MONGODB_URI=
JWT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
BUSINESS_OWNER_EMAIL=
```

---

## 8. Next Steps

1. Verify frontend flows end-to-end with mock API (current state)
2. Create backend project in monorepo
3. Implement `/api/quote` first (MongoDB + Resend)
4. Implement auth endpoints
5. Implement dashboard CRUD endpoints
6. Point frontend API base URL to backend (e.g. `NEXT_PUBLIC_API_URL`)
