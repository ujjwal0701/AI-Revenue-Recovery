# Security Policy & Credential Handling

RevenueAI prioritizes payment safety, customer data protection, and secure webhook validation.

## Security Practices

### 1. Payment Verification & HMAC SHA-256
- All Razorpay checkout completions require server-side signature verification.
- In `app/api/recover/complete/route.ts`, the payload signature is validated:
  ```typescript
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  ```
- Any mismatch immediately terminates the transaction without capturing funds.

### 2. Zero Secret Exposure
- Client components NEVER receive sensitive secrets (`RAZORPAY_KEY_SECRET` or `GEMINI_API_KEY`).
- Only public Key IDs (`RAZORPAY_KEY_ID`) are passed to frontend SDK checkouts.

### 3. Reporting a Vulnerability
If you identify any security issue, please contact the maintainer directly via GitHub Security Advisories.
