/**
 * Application-wide configuration constants
 */

export const APP_CONFIG = {
  APP_NAME: "RevenueAI",
  SUPPORT_EMAIL: "support@revenueai.dev",
  DEFAULT_CURRENCY: "INR",
  MAX_RECOVERY_ATTEMPTS: 3,
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const RECOVERY_CHANNELS = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  WHATSAPP: "WHATSAPP",
  PAYMENT_LINK: "PAYMENT_LINK",
} as const;

export const RECOVERY_STATUS = {
  LINK_CREATED: "LINK_CREATED",
  DISPATCHED: "DISPATCHED",
  RECOVERED: "RECOVERED",
  FAILED: "FAILED",
} as const;

export const FAILURE_REASON_DESCRIPTIONS: Record<string, string> = {
  INSUFFICIENT_FUNDS: "Insufficient funds in customer bank account",
  CARD_DECLINED: "Card declined by the issuing bank",
  AUTH_FAILED: "3D Secure OTP authentication failed or expired",
  TIMEOUT: "Payment session timed out before capture",
  UPI_AUTH_ERROR: "UPI PIN entry timed out or failed",
  BANK_DECLINED: "Declined by customer bank due to fraud or velocity checks",
  INTERNATIONAL_NOT_ALLOWED: "Card not configured for domestic or international online payments",
  LIMIT_EXCEEDED: "Daily or per-transaction spending limit exceeded",
};
