import { GoogleGenAI } from "@google/genai";

export type RecoveryAction =
  | "PAYMENT_LINK"
  | "RETRY_LATER"
  | "EMAIL"
  | "SMS"
  | "WHATSAPP"
  | "NO_ACTION"
  | "MANUAL_REVIEW";

export type RecoveryUrgency = "LOW" | "MEDIUM" | "HIGH";

export interface PaymentRecoveryContext {
  paymentId: string;
  amount: number;
  currency: string;
  failureReason: string | null;
  failureCode: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    totalSpent: number;
    successfulPayments: number;
  };
  history: {
    totalPaymentsCount: number;
    failedPaymentsCount: number;
    successfulPaymentsCount: number;
    recoveryAttemptsCount: number;
    successfulRecoveriesCount: number;
  };
}

export interface AIRecoveryResult {
  recoveryProbability: number;
  recommendedAction: RecoveryAction;
  reason: string;
  urgency: RecoveryUrgency;
  message: string;
  source: "GEMINI_AI" | "DETERMINISTIC_FALLBACK";
}

/**
 * Deterministic fallback logic in case Gemini API is unreachable,
 * rate limited, or lacks API credentials.
 */
export function getDeterministicRecoveryFallback(
  context: PaymentRecoveryContext
): AIRecoveryResult {
  const { amount, failureReason, failureCode, customer, history } = context;
  const reasonText = (failureReason || "").toLowerCase();
  const codeText = (failureCode || "").toUpperCase();

  let probability = 50;
  let action: RecoveryAction = "PAYMENT_LINK";
  let urgency: RecoveryUrgency = "MEDIUM";
  let reason = "Standard automated recovery strategy based on transaction failure profile.";

  const isLoyalCustomer = customer.successfulPayments >= 3 || customer.totalSpent > 10000;
  const hasRecoveredBefore = history.successfulRecoveriesCount > 0;

  // High-value check -> Manual review if previous failure rate is also high
  if (amount >= 50000 && history.failedPaymentsCount > 2) {
    probability = 35;
    action = "MANUAL_REVIEW";
    urgency = "HIGH";
    reason = "High-value transaction with multiple failure history warrants account manager review.";
  } else if (
    reasonText.includes("insufficient") ||
    codeText.includes("INSUFFICIENT_FUNDS")
  ) {
    if (isLoyalCustomer || hasRecoveredBefore) {
      probability = 78;
      action = "PAYMENT_LINK";
      urgency = "HIGH";
      reason = "Customer has a strong payment history and usually completes recovery upon retry.";
    } else {
      probability = 58;
      action = "PAYMENT_LINK";
      urgency = "MEDIUM";
      reason = "Temporary balance deficit; personalized payment link retry recommended.";
    }
  } else if (
    reasonText.includes("timeout") ||
    reasonText.includes("timed out") ||
    codeText.includes("TIMEOUT")
  ) {
    probability = 85;
    action = "PAYMENT_LINK";
    urgency = "HIGH";
    reason = "Technical or gateway timeout. Immediate payment link retry has high recovery probability.";
  } else if (
    reasonText.includes("declined") ||
    reasonText.includes("bank declined") ||
    codeText.includes("CARD_DECLINED") ||
    codeText.includes("BANK_DECLINED")
  ) {
    if (isLoyalCustomer) {
      probability = 68;
      action = "PAYMENT_LINK";
      urgency = "HIGH";
      reason = "Bank declined transaction for existing active customer; alternate payment method link recommended.";
    } else {
      probability = 45;
      action = "EMAIL";
      urgency = "MEDIUM";
      reason = "Bank card decline on newer customer account; email notification with retry link advised.";
    }
  } else if (
    reasonText.includes("auth") ||
    reasonText.includes("authentication") ||
    codeText.includes("AUTH_FAILED")
  ) {
    probability = 72;
    action = "PAYMENT_LINK";
    urgency = "HIGH";
    reason = "Customer failed 3D Secure / OTP authentication. Retrying with fresh session yields high success.";
  }

  const message = `Hi ${customer.name}, we noticed your payment of ${context.currency} ${amount.toLocaleString(
    "en-IN"
  )} could not be completed (${
    failureReason || "Authentication or gateway issue"
  }). You can securely complete your transaction with one click.`;

  return {
    recoveryProbability: Math.min(100, Math.max(0, Math.round(probability))),
    recommendedAction: action,
    reason,
    urgency,
    message,
    source: "DETERMINISTIC_FALLBACK",
  };
}

/**
 * Evaluates payment recovery using Google Gemini API.
 * Falls back to deterministic heuristic logic if Gemini is unavailable.
 */
export async function analyzePaymentRecovery(
  context: PaymentRecoveryContext
): Promise<AIRecoveryResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    console.log("ℹ️ No GEMINI_API_KEY found, using deterministic recovery fallback.");
    return getDeterministicRecoveryFallback(context);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an AI Revenue Recovery specialist for Razorpay payment failures.
Analyze the following failed transaction context and recommend the optimal recovery strategy:

[TRANSACTION CONTEXT]
- Customer Name: "${context.customer.name}"
- Customer Total Lifetime Spent: ${context.currency} ${context.customer.totalSpent}
- Customer Successful Lifetime Payments: ${context.customer.successfulPayments}
- Customer Past Payment Attempts: ${context.history.totalPaymentsCount} (Failed: ${context.history.failedPaymentsCount}, Captured: ${context.history.successfulPaymentsCount})
- Past Recoveries: ${context.history.recoveryAttemptsCount} attempted, ${context.history.successfulRecoveriesCount} successful
- Failed Transaction Amount: ${context.currency} ${context.amount}
- Failure Reason: "${context.failureReason || "Unknown"}"
- Failure Code: "${context.failureCode || "UNKNOWN"}"

[DECISION REQUIREMENTS]
1. Determine recovery probability (integer between 0 and 100).
2. Recommend an action: exactly one of ["PAYMENT_LINK", "RETRY_LATER", "EMAIL", "SMS", "WHATSAPP", "NO_ACTION", "MANUAL_REVIEW"].
3. Provide a concise, clear 1-2 sentence explanation for "reason" explaining why this strategy fits this customer's behavior and failure reason.
4. Set urgency: one of ["LOW", "MEDIUM", "HIGH"].
5. Generate a friendly, professional 1-2 sentence recovery notification message for the customer.

Return STRICT JSON only matching this format:
{
  "recoveryProbability": 78,
  "recommendedAction": "PAYMENT_LINK",
  "reason": "The customer has successfully recovered previous failed payments and tends to retry quickly.",
  "urgency": "HIGH",
  "message": "Hi Ananya, your payment of INR 5,999 could not be completed due to a temporary card issue. Please use this secure link to complete it."
}`;

    // Try gemini-2.5-flash with JSON mode
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed = JSON.parse(responseText);

    // Validate structured fields
    const validActions: RecoveryAction[] = [
      "PAYMENT_LINK",
      "RETRY_LATER",
      "EMAIL",
      "SMS",
      "WHATSAPP",
      "NO_ACTION",
      "MANUAL_REVIEW",
    ];

    const validUrgencies: RecoveryUrgency[] = ["LOW", "MEDIUM", "HIGH"];

    const rawProbability = Number(parsed.recoveryProbability);
    const recoveryProbability = isNaN(rawProbability)
      ? 60
      : Math.min(100, Math.max(0, Math.round(rawProbability)));

    const recommendedAction: RecoveryAction = validActions.includes(
      parsed.recommendedAction
    )
      ? parsed.recommendedAction
      : "PAYMENT_LINK";

    const urgency: RecoveryUrgency = validUrgencies.includes(parsed.urgency)
      ? parsed.urgency
      : "MEDIUM";

    const reason =
      typeof parsed.reason === "string" && parsed.reason.trim().length > 0
        ? parsed.reason.trim()
        : "AI analyzed transaction history and recommended an automated retry link.";

    const message =
      typeof parsed.message === "string" && parsed.message.trim().length > 0
        ? parsed.message.trim()
        : `Hi ${context.customer.name}, your payment of ${context.currency} ${context.amount.toLocaleString(
            "en-IN"
          )} could not be completed. You can securely retry using this recovery link.`;

    return {
      recoveryProbability,
      recommendedAction,
      reason,
      urgency,
      message,
      source: "GEMINI_AI",
    };
  } catch (error) {
    console.warn("⚠️ Gemini API call failed or timed out. Engaging deterministic fallback:", error);
    return getDeterministicRecoveryFallback(context);
  }
}
