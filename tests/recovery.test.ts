/**
 * Unit tests for Payment Recovery Recommendation Heuristics
 */
import { getDeterministicRecoveryFallback, PaymentRecoveryContext } from "../app/lib/gemini";

function runRecoveryTests() {
  console.log("🧪 Running Payment Recovery Recommendation Tests...");

  const mockContext: PaymentRecoveryContext = {
    paymentId: "test_pay_001",
    amount: 4999,
    currency: "INR",
    failureReason: "Card declined by issuing bank",
    failureCode: "CARD_DECLINED",
    customer: {
      id: "cust_001",
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+919812345678",
      totalSpent: 45000,
      successfulPayments: 6,
    },
    history: {
      totalPaymentsCount: 8,
      failedPaymentsCount: 2,
      successfulPaymentsCount: 6,
      recoveryAttemptsCount: 2,
      successfulRecoveriesCount: 2,
    },
  };

  const decision = getDeterministicRecoveryFallback(mockContext);

  if (typeof decision.recoveryProbability !== "number") {
    throw new Error("Recovery probability must be a number");
  }

  if (decision.recoveryProbability < 0 || decision.recoveryProbability > 100) {
    throw new Error("Recovery probability must be between 0 and 100");
  }

  if (!decision.recommendedAction) {
    throw new Error("Recommended action must be defined");
  }

  if (!decision.message || decision.message.length === 0) {
    throw new Error("Customer notification message must not be empty");
  }

  console.log("✅ Recovery heuristics tests passed successfully!");
}

if (require.main === module) {
  runRecoveryTests();
}

export { runRecoveryTests };
