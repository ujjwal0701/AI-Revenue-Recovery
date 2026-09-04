# Local Development & Environment Setup

This guide details configuring your workstation to develop and test RevenueAI locally.

## Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Git**: v2.x or higher

---

## 1. Environment Configuration
Create a `.env` file in the project root:
```env
# SQLite Database connection
DATABASE_URL="file:./dev.db"

# Google Gemini API Key (Optional for heuristic fallback)
GEMINI_API_KEY="your_api_key_here"

# Razorpay Test Credentials (Optional for local simulated mode)
RAZORPAY_KEY_ID="rzp_test_placeholder"
RAZORPAY_KEY_SECRET="secret_placeholder"
```

---

## 2. Prisma Database Migration
Generate the Prisma Client and sync your local SQLite schema:
```bash
npx prisma generate
npx prisma db push
```

---

## 3. Launching Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000`. If `dev.db` is empty, the application automatically invokes `ensureSeededDatabase()` to populate 160 realistic customer profiles and 90 transaction records.
