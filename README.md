# RevenueAI — Autonomous AI Revenue Recovery Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.9-2D3748?logo=prisma)](https://www.prisma.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Gateway-02042B?logo=razorpay)](https://razorpay.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google)](https://deepmind.google/technologies/gemini/)

RevenueAI is an enterprise-grade AI engine that detects failed payment transactions, analyzes customer behavioral profiles using Google Gemini AI, and automatically dispatches optimized, multi-channel recovery workflows across Email, SMS, WhatsApp, and 1-click checkout recovery links.

---

## Key Features

- **Automated Failure Detection**: Ingests failed payment signals with failure classification codes (insufficient funds, bank auth failure, card expired, timeout).
- **Gemini AI Recovery Reasoning**: Synthesizes customer lifetime value, historical transaction volume, and past retry responses to formulate custom recovery strategies.
- **Multi-Channel Notification Dispatcher**:
  - HTML transactional email notifications with dynamic Razorpay payment links
  - High-deliverability SMS alerts
  - Interactive WhatsApp recovery notifications
- **Live Email Sandbox Hub**: Built-in developer email sandbox capturing all outgoing simulated transactional emails with SPF/DKIM verification indicators and inspection modals.
- **Employee Cash Settlement Desk**: Allows counter and field staff to reconcile payments collected in person or via bank transfer, issuing instant official customer receipts.
- **Real-time Analytics Dashboard**: Funnel analytics tracking revenue at risk, total recovered capital, recovery rates, and AI success heuristics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3 (App Router & Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database** | SQLite with Prisma ORM 7.9 |
| **AI Engine** | Google Gemini 2.5 Flash via `@google/genai` |
| **Payments** | Razorpay Node.js SDK |
| **Deployment** | Vercel Serverless Platform |

---

## Quickstart

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ujjwal0701/AI-Revenue-Recovery.git
cd AI-Revenue-Recovery
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_google_gemini_api_key"
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

### 3. Initialize Database & Seed Records
```bash
npx prisma generate
npx prisma db push
npm run dev
```

Visit `http://localhost:3000` to access the RevenueAI recovery dashboard.

---

## Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specifications](docs/API.md)
- [Development Setup Guide](docs/SETUP.md)
- [Security Practices](docs/SECURITY.md)
- [Production Deployment](docs/DEPLOYMENT.md)
- [Contribution Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

---

## License
MIT License. Built for resilient payment operations.
