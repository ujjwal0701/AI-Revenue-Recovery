/**
 * Input validation helpers for API endpoints
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && !isNaN(amount) && amount > 0;
}

export function validateRecoveryRequest(body: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a valid JSON object" };
  }

  const { paymentId } = body as { paymentId?: unknown };

  if (!paymentId || typeof paymentId !== "string" || paymentId.trim().length === 0) {
    return { valid: false, error: "Payment ID is required and must be a non-empty string" };
  }

  return { valid: true };
}
