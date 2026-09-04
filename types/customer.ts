/**
 * Customer lifetime tier based on historical successful payments
 */
export type CustomerTier = "BRONZE" | "SILVER" | "GOLD" | "VIP";

/**
 * Customer profile structure
 */
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  successfulPayments: number;
  tier?: CustomerTier;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

/**
 * Payment failure classification category
 */
export type PaymentFailureCategory =
  | "INSUFFICIENT_FUNDS"
  | "CARD_DECLINED"
  | "AUTH_FAILED"
  | "TIMEOUT"
  | "UPI_AUTH_ERROR"
  | "BANK_DECLINED"
  | "INTERNATIONAL_NOT_ALLOWED"
  | "LIMIT_EXCEEDED"
  | "UNKNOWN";
