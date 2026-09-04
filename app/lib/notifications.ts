export type NotificationChannel = "EMAIL" | "SMS" | "WHATSAPP" | "PAYMENT_LINK";
export type NotificationEventType = "PAYMENT_FAILED" | "PAYMENT_SUCCESS" | "RECOVERY_LINK";

export interface NotificationPayload {
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string | null;
  amount: number;
  currency: string;
  failureReason?: string | null;
  paymentLink?: string;
  paymentId?: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  customMessage?: string;
  paidAt?: Date | string;
}

export interface NotificationResult {
  messageId: string;
  eventType: NotificationEventType;
  channel: NotificationChannel;
  recipient: string;
  status: "DELIVERED" | "SENT" | "FAILED";
  subject?: string;
  content: string;
  htmlContent?: string;
  timestamp: string;
  provider: "SIMULATED_DISPATCH" | "RESEND" | "TWILIO" | "SMTP" | "EMAIL_SANDBOX";
}

export interface SandboxEmail {
  id: string;
  messageId: string;
  eventType: NotificationEventType;
  to: string;
  toName: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  amount: number;
  currency: string;
  paymentId?: string;
  paymentLink?: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  status: string;
  latencyMs: number;
  spf: string;
  dkim: string;
  sentAt: string;
}

/**
 * Global sandbox store to persist captured emails across Next.js dev server hot-reloads.
 * This simulates an SMTP interceptor / mailtrap environment for developers to inspect
 * transactional recovery templates without sending real external emails.
 */
declare global {
  // eslint-disable-next-line no-var
  var __revenueai_email_sandbox: SandboxEmail[] | undefined;
}

/**
 * Initializes the in-memory circular buffer for captured sandbox emails.
 * Pre-populates sample transactional emails if the buffer is empty.
 *
 * @returns Mutable array of captured SandboxEmail objects
 */
function initSandboxStore(): SandboxEmail[] {

  if (!globalThis.__revenueai_email_sandbox) {
    const initialEmails: SandboxEmail[] = [
      {
        id: "sbx_init_01",
        messageId: "msg_sbx_9921_initial",
        eventType: "PAYMENT_FAILED",
        to: "aarav.patel@enterprise.co.in",
        toName: "Aarav Patel",
        from: "RevenueAI Recovery <recovery@revenueai.dev>",
        subject: "Action Required: Complete your payment of INR 9,999 - RevenueAI",
        html: generatePaymentFailedEmailHtml({
          recipientName: "Aarav Patel",
          recipientEmail: "aarav.patel@enterprise.co.in",
          amount: 9999,
          currency: "INR",
          failureReason: "Card declined by issuing bank (3DS timeout)",
          paymentLink: "/recover/demo-1",
        }),
        text: "Hi Aarav Patel, we were unable to process your payment of INR 9,999 due to bank timeout. Retry securely here: /recover/demo-1",
        amount: 9999,
        currency: "INR",
        paymentId: "demo-1",
        paymentLink: "/recover/demo-1",
        status: "250 2.0.0 OK (Delivered)",
        latencyMs: 118,
        spf: "PASS (domain: revenueai.dev)",
        dkim: "PASS (rsa-sha256 signature verified)",
        sentAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: "sbx_init_02",
        messageId: "msg_sbx_9922_initial",
        eventType: "PAYMENT_SUCCESS",
        to: "priya.sharma@techcorp.in",
        toName: "Priya Sharma",
        from: "RevenueAI Billing <billing@revenueai.dev>",
        subject: "Payment Successful Receipt: INR 4,999 - RevenueAI",
        html: generatePaymentSuccessEmailHtml({
          recipientName: "Priya Sharma",
          recipientEmail: "priya.sharma@techcorp.in",
          amount: 4999,
          currency: "INR",
          razorpayPaymentId: "pay_test_TU32vEhZq5dH",
          razorpayOrderId: "order_test_9882190",
          paidAt: new Date(Date.now() - 1000 * 60 * 45),
        }),
        text: "RevenueAI: Success! Your payment of INR 4,999 is confirmed. Ref: pay_test_TU32vEhZq5dH. Thank you for your business.",
        amount: 4999,
        currency: "INR",
        paymentId: "demo-2",
        razorpayPaymentId: "pay_test_TU32vEhZq5dH",
        razorpayOrderId: "order_test_9882190",
        status: "250 2.0.0 OK (Delivered)",
        latencyMs: 94,
        spf: "PASS (domain: revenueai.dev)",
        dkim: "PASS (rsa-sha256 signature verified)",
        sentAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];

    globalThis.__revenueai_email_sandbox = initialEmails;
  }

  return globalThis.__revenueai_email_sandbox;
}

export function getSandboxEmails(): SandboxEmail[] {
  return initSandboxStore();
}

export function addSandboxEmail(email: SandboxEmail): void {
  const store = initSandboxStore();
  store.unshift(email);
  if (store.length > 50) {
    store.pop();
  }
}

export function clearSandboxEmails(): void {
  globalThis.__revenueai_email_sandbox = [];
}

/**
 * -------------------------------------------------------------
 * 1. PAYMENT FAILED / RECOVERY TEMPLATES
 * -------------------------------------------------------------
 */

/**
 * Generates an email-client compliant, responsive transactional HTML email
 * notifying the customer of a payment failure with a secure one-click Razorpay retry button.
 *
 * @param payload Notification parameters including recipient, amount, currency, and recovery link
 * @returns Fully formatted, cross-client compatible HTML string
 */
export function normalizePaymentLink(link?: string | null): string {
  if (!link) return "/recover/demo-1";
  if (link.startsWith("http://localhost:3000/")) {
    return link.replace("http://localhost:3000", "");
  }
  if (link === "http://localhost:3000") {
    return "/";
  }
  return link;
}

export function generatePaymentFailedEmailHtml(payload: NotificationPayload): string {
  const { recipientName, amount, currency, failureReason, paymentLink, customMessage } = payload;

  const formattedAmount = `${currency} ${amount.toLocaleString("en-IN")}`;
  const link = normalizePaymentLink(paymentLink);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Action Required - RevenueAI</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; }
    .container { max-width: 560px; margin: 30px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #020617; padding: 24px 32px; text-align: center; }
    .header-title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
    .header-sub { color: #f87171; font-size: 12px; font-weight: 600; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .content { padding: 32px; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0; }
    .text { font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .card-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
    .card-row:last-child { margin-bottom: 0; padding-top: 8px; border-top: 1px dashed #cbd5e1; }
    .card-label { color: #64748b; font-weight: 500; }
    .card-value { color: #0f172a; font-weight: 600; text-align: right; }
    .btn-container { text-align: center; margin: 32px 0 20px 0; }
    .btn { display: inline-block; background: #020617; color: #ffffff !important; text-decoration: none; padding: 14px 32px; font-size: 14px; font-weight: 600; border-radius: 10px; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5; }
    .badge-failed { display: inline-block; padding: 3px 8px; background: #fef2f2; color: #b91c1c; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid #fecaca; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="header-title">RevenueAI</h1>
      <p class="header-sub">Action Required: Payment Unsuccessful</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${recipientName},</p>
      <p class="text">
        ${customMessage || `We were unable to process your payment of <strong>${formattedAmount}</strong>. Your order is safely preserved for the next 24 hours, and you can retry securely using the button below.`}
      </p>
      
      <div class="card">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Amount Due:</td>
            <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0f172a;">${formattedAmount}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Status:</td>
            <td style="padding: 5px 0; text-align: right;"><span class="badge-failed">Payment Failed</span></td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Failure Reason:</td>
            <td style="padding: 5px 0; text-align: right; color: #dc2626; font-weight: 600;">${failureReason || "Temporary card / bank issue"}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Gateway:</td>
            <td style="padding: 5px 0; text-align: right; color: #0f172a;">Razorpay Test Mode</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="${link}" class="btn" target="_blank">Retry Payment Securely &rarr;</a>
      </div>

      <p class="text" style="font-size: 12px; color: #94a3b8; text-align: center;">
        Zero duplicate charges. Your transaction is protected with end-to-end 256-bit encryption.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">Secured by Razorpay Test Gateway &amp; RevenueAI Recovery Engine.</p>
      <p style="margin: 4px 0 0 0;">If you already initiated a retry, please disregard this alert.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Builds 160-char standard SMS copy for Payment Failure
 */
export function generatePaymentFailedSmsText(payload: NotificationPayload): string {
  const { recipientName, amount, currency, failureReason, paymentLink } = payload;
  const link = normalizePaymentLink(paymentLink);
  return `RevenueAI Alert: Hi ${recipientName}, your payment of ${currency} ${amount.toLocaleString(
    "en-IN"
  )} was declined (${failureReason || "Bank timeout"}). Retry in 1-click: ${link}`;
}

/**
 * Builds WhatsApp formatted message copy for Payment Failure
 */
export function generatePaymentFailedWhatsAppText(payload: NotificationPayload): string {
  const { recipientName, amount, currency, failureReason, paymentLink } = payload;
  const link = normalizePaymentLink(paymentLink);
  return `⚠️ *Payment Action Required - RevenueAI*

Hi *${recipientName}*,

Your payment of *${currency} ${amount.toLocaleString(
    "en-IN"
  )}* could not be processed.
*Reason:* _${failureReason || "Temporary bank timeout"}_

Your order is safely on hold. You can retry with an alternate card/UPI using the secure link below:

👉 *Complete Payment:* ${link}

_Secured via Razorpay Test Gateway._`;
}

/**
 * -------------------------------------------------------------
 * 2. PAYMENT SUCCESS / RECOVERY CONFIRMATION TEMPLATES
 * -------------------------------------------------------------
 */

/**
 * Builds responsive HTML template for Payment Success / Receipt emails
 */
export function generatePaymentSuccessEmailHtml(payload: NotificationPayload): string {
  const {
    recipientName,
    amount,
    currency,
    razorpayPaymentId,
    razorpayOrderId,
    paidAt,
  } = payload;
  const formattedAmount = `${currency} ${amount.toLocaleString("en-IN")}`;
  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - Receipt</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; }
    .container { max-width: 560px; margin: 30px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #020617; padding: 28px 32px; text-align: center; }
    .header-title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
    .header-sub { color: #34d399; font-size: 12px; font-weight: 600; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .content { padding: 32px; }
    .check-icon { display: inline-flex; width: 48px; height: 48px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 50%; color: #059669; font-size: 24px; line-height: 48px; text-align: center; margin: 0 auto 16px auto; }
    .greeting { font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; text-align: center; }
    .hero-amount { font-size: 32px; font-weight: 800; color: #020617; text-align: center; margin: 0 0 4px 0; }
    .hero-sub { font-size: 13px; color: #64748b; text-align: center; margin: 0 0 24px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .card-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
    .card-row:last-child { margin-bottom: 0; padding-top: 10px; border-top: 1px dashed #cbd5e1; }
    .card-label { color: #64748b; font-weight: 500; }
    .card-value { color: #0f172a; font-weight: 600; text-align: right; }
    .badge-success { display: inline-block; padding: 3px 8px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid #a7f3d0; }
    .btn-container { text-align: center; margin: 28px 0 16px 0; }
    .btn { display: inline-block; background: #020617; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 13px; font-weight: 600; border-radius: 10px; }
    .footer { padding: 20px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="header-title">RevenueAI</h1>
      <p class="header-sub">&#10003; Payment Successfully Recovered</p>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <div class="check-icon">&#10003;</div>
      </div>
      <p class="greeting">Thank you, ${recipientName}!</p>
      <p class="hero-amount">${formattedAmount}</p>
      <p class="hero-sub">Your payment has been successfully authorized and captured.</p>
      
      <div class="card">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Status:</td>
            <td style="padding: 5px 0; text-align: right;"><span class="badge-success">Captured / Recovered</span></td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Amount Paid:</td>
            <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0f172a;">${formattedAmount}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Razorpay Payment ID:</td>
            <td style="padding: 5px 0; text-align: right; font-family: monospace; font-size: 12px; color: #0f172a;">${razorpayPaymentId || "pay_test_" + Math.random().toString(36).substring(2, 9)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Razorpay Order ID:</td>
            <td style="padding: 5px 0; text-align: right; font-family: monospace; font-size: 12px; color: #0f172a;">${razorpayOrderId || "order_test_" + Math.random().toString(36).substring(2, 9)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #64748b;">Date &amp; Time:</td>
            <td style="padding: 5px 0; text-align: right; color: #0f172a;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <div class="btn-container">
        <a href="/" class="btn" target="_blank">Return to Workspace &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
        This receipt confirms your transaction is finalized. Keep this for your records.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">Processed via Razorpay Test Gateway &amp; RevenueAI Automated Recovery System.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Formats a high-conversion, concise SMS text compliant with telecom 160-character limits
 * for instant customer payment confirmation.
 *
 * @param payload Notification context containing customer name, amount, and payment reference
 * @returns Plain-text SMS message string
 */
export function generatePaymentSuccessSmsText(payload: NotificationPayload): string {
  const { recipientName, amount, currency, razorpayPaymentId } = payload;
  return `RevenueAI: Success! Hi ${recipientName}, your payment of ${currency} ${amount.toLocaleString(
    "en-IN"
  )} is confirmed (Ref: ${razorpayPaymentId || "Captured"}). Thank you for your business!`;
}

/**
 * Formats a rich WhatsApp text notification using WhatsApp native markdown syntax
 * (*bold*, _italic_) and payment receipt bullets.
 *
 * @param payload Notification context containing customer details and payment confirmation
 * @returns WhatsApp-formatted markdown text
 */
export function generatePaymentSuccessWhatsAppText(payload: NotificationPayload): string {

  const { recipientName, amount, currency, razorpayPaymentId, paidAt } = payload;
  const formattedDate = paidAt ? new Date(paidAt).toLocaleDateString("en-IN") : "Today";
  return `✅ *Payment Confirmed - RevenueAI Receipt*

Hi *${recipientName}*,

Your payment of *${currency} ${amount.toLocaleString("en-IN")}* has been successfully recovered and captured.

• *Ref ID:* ${razorpayPaymentId || "pay_test_verified"}
• *Status:* Captured / Successful
• *Date:* ${formattedDate}

Thank you for completing your transaction with us!

_Secured via Razorpay Test Mode._`;
}

/**
 * -------------------------------------------------------------
 * 3. GENERAL DISPATCHER WITH AUTOMATIC SANDBOX CAPTURE
 * -------------------------------------------------------------
 */

/**
 * Dispatches recovery notification across chosen channel (Email, SMS, WhatsApp)
 * and automatically captures emails into the in-app Email Sandbox Hub.
 */
export async function sendRecoveryNotification(
  channel: NotificationChannel,
  payload: NotificationPayload,
  eventType: NotificationEventType = "PAYMENT_FAILED"
): Promise<NotificationResult> {
  const timestamp = new Date().toISOString();
  const messageId = `msg_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;

  // Always generate HTML and capture email in sandbox if channel is EMAIL or if triggered via AI
  const isSuccess = eventType === "PAYMENT_SUCCESS";
  const html = isSuccess
    ? generatePaymentSuccessEmailHtml(payload)
    : generatePaymentFailedEmailHtml(payload);

  const subject = isSuccess
    ? `Payment Successful Receipt: ${payload.currency} ${payload.amount.toLocaleString("en-IN")} - RevenueAI`
    : `Action Required: Complete your payment of ${payload.currency} ${payload.amount.toLocaleString(
        "en-IN"
      )} - RevenueAI`;

  // Capture into Sandbox Store
  const sandboxEmail: SandboxEmail = {
    id: `sbx_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`,
    messageId,
    eventType,
    to: payload.recipientEmail,
    toName: payload.recipientName,
    from: isSuccess
      ? "RevenueAI Billing <billing@revenueai.dev>"
      : "RevenueAI Recovery <recovery@revenueai.dev>",
    subject,
    html,
    text: isSuccess
      ? generatePaymentSuccessSmsText(payload)
      : generatePaymentFailedSmsText(payload),
    amount: payload.amount,
    currency: payload.currency,
    paymentId: payload.paymentId,
    paymentLink: payload.paymentLink,
    razorpayPaymentId: payload.razorpayPaymentId,
    razorpayOrderId: payload.razorpayOrderId,
    status: "250 2.0.0 OK (Delivered to Sandbox)",
    latencyMs: Math.floor(Math.random() * 40) + 80, // realistic 80-120ms latency
    spf: "PASS (domain: revenueai.dev)",
    dkim: "PASS (rsa-sha256 signature verified)",
    sentAt: timestamp,
  };

  if (channel === "EMAIL") {
    addSandboxEmail(sandboxEmail);

    console.log(
      `📧 [EMAIL SANDBOX DISPATCH - ${eventType}] To: ${payload.recipientEmail} | Subject: ${subject}`
    );

    return {
      messageId,
      eventType,
      channel: "EMAIL",
      recipient: payload.recipientEmail,
      status: "DELIVERED",
      subject,
      content:
        payload.customMessage ||
        (isSuccess
          ? `Receipt sent to ${payload.recipientEmail}`
          : `Recovery link sent to ${payload.recipientEmail}`),
      htmlContent: html,
      timestamp,
      provider: "EMAIL_SANDBOX",
    };
  }

  if (channel === "SMS") {
    const text = isSuccess
      ? generatePaymentSuccessSmsText(payload)
      : generatePaymentFailedSmsText(payload);
    const recipient = payload.recipientPhone || "+919876543210";

    console.log(`📱 [SMS DISPATCHED - ${eventType}] To: ${recipient} | Body: ${text}`);

    return {
      messageId,
      eventType,
      channel: "SMS",
      recipient,
      status: "DELIVERED",
      content: text,
      timestamp,
      provider: "SIMULATED_DISPATCH",
    };
  }

  if (channel === "WHATSAPP") {
    const text = isSuccess
      ? generatePaymentSuccessWhatsAppText(payload)
      : generatePaymentFailedWhatsAppText(payload);
    const recipient = payload.recipientPhone || "+919876543210";

    console.log(`💬 [WHATSAPP DISPATCHED - ${eventType}] To: ${recipient} | Body: ${text}`);

    return {
      messageId,
      eventType,
      channel: "WHATSAPP",
      recipient,
      status: "DELIVERED",
      content: text,
      timestamp,
      provider: "SIMULATED_DISPATCH",
    };
  }

  // Default PAYMENT_LINK
  return {
    messageId,
    eventType,
    channel: "PAYMENT_LINK",
    recipient: payload.recipientEmail,
    status: "DELIVERED",
    content: `Payment recovery link created: ${normalizePaymentLink(payload.paymentLink)}`,
    timestamp,
    provider: "SIMULATED_DISPATCH",
  };
}

// Aliases for convenience
export const generateEmailHtml = generatePaymentFailedEmailHtml;
export const generateSmsText = generatePaymentFailedSmsText;
export const generateWhatsAppText = generatePaymentFailedWhatsAppText;

/**
 * Dispatches notification to BOTH customer email AND customer SMS simultaneously
 */
export async function sendMultiChannelNotification(
  payload: NotificationPayload,
  eventType: NotificationEventType = "PAYMENT_FAILED"
): Promise<{
  emailResult: NotificationResult;
  smsResult: NotificationResult;
  whatsappResult: NotificationResult;
}> {
  const emailResult = await sendRecoveryNotification("EMAIL", payload, eventType);
  const smsResult = await sendRecoveryNotification("SMS", payload, eventType);
  const whatsappResult = await sendRecoveryNotification("WHATSAPP", payload, eventType);

  console.log(
    `🚀 [MULTI-CHANNEL DISPATCHED - ${eventType}] Email sent to ${payload.recipientEmail} & SMS sent to ${
      payload.recipientPhone || "+91 98765 43210"
    }`
  );

  return { emailResult, smsResult, whatsappResult };
}

