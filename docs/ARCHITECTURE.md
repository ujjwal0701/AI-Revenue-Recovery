# System Architecture — RevenueAI

This document outlines the architecture, data models, and operational lifecycle of the RevenueAI recovery platform.

## High-Level Architecture

```text
[ Payment Gateway / Webhook ]
              │ (Failed Payment Event)
              ▼
    [ Next.js API Layer ] ──> [ SQLite / Prisma ORM ]
              │
              ▼
   [ AI Reasoning Engine ]
   (Gemini 2.5 Flash Model)
              │
    ┌─────────┴─────────────────────┐
    ▼                               ▼
[ Multi-Channel Dispatcher ]    [ Cash Reconciler ]
  ├── Email (Sandbox & SMTP)      ├── Manual Settlement
  ├── SMS & WhatsApp              └── Field Agent Logs
  └── 1-Click Razorpay Link
```

---

## Core Components

### 1. Ingestion Pipeline
- Evaluates payment failures triggered by network timeouts, insufficient funds, or issuing bank declines.
- Persists failed records into SQLite with raw error codes and customer reference associations.

### 2. AI Decision Engine (`app/lib/gemini.ts`)
- Leverages Google Gemini 2.5 Flash to score recovery probability (0–100%) and determine channel urgency.
- Employs deterministic fallbacks if API limits or offline environments are encountered.

### 3. Dispatch & Sandbox Hub (`app/lib/notifications.ts`)
- Formats personalized recovery messaging based on channel constraints (SMS 160-char, WhatsApp markdown, Email HTML).
- Injects outbound emails into an in-memory test sandbox for instant audit and review.

### 4. Recovery Checkout (`app/recover/[id]/page.tsx`)
- Lightweight, responsive checkout UI allowing customers to pay with Razorpay standard checkout.
- Enforces idempotency to prevent double billing on already settled invoices.
