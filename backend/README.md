# Junk Captain Backend

Express + Mongoose API for Junk Captain LLC. Handles quote submissions, dashboard auth, and customer management.

## MongoDB Connection

**Use Mongoose** (recommended) – it's an ODM built on top of the official MongoDB Node.js driver. It provides schemas, validation, and simpler APIs.

Your connection string goes in `.env` as `MONGODB_URI`:

- **MongoDB Atlas**: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority`
- **Local**: `mongodb://localhost:27017/junkcaptain`

## Setup

1. Copy `.env.example` to `.env` and fill in your values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies (from repo root):

   ```bash
   npm install
   ```

3. Create admin user for dashboard login:

   ```bash
   npm run seed
   ```

   Default: `admin@junkcaptainllc.com` / `ChangeMe123!` (override with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`)

4. Start the backend:

   ```bash
   npm run dev:backend
   ```

   Or from the `backend` folder: `npm run dev`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/quote` | No | Submit quote form (public) |
| POST | `/api/login` | No | Dashboard login |
| GET | `/api/customers?type=potential\|active` | Yes | List customers |
| POST | `/api/customers` | Yes | Create potential customer |
| PUT | `/api/customers` | Yes | Update or convert customer |
| DELETE | `/api/customers` | Yes | Delete customer |
| GET | `/api/notifications` | Yes | List notifications |
| PUT | `/api/notifications/read` | Yes | Mark notification read |

## Resend Email

Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `BUSINESS_OWNER_EMAIL` in `.env` to enable email notifications on new quote submissions. Without these, the app still saves to MongoDB but skips sending email.
