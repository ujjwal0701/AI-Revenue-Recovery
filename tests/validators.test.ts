/**
 * Unit tests for API Request Payload Validators
 */
import { isValidEmail, isValidPhone, isValidAmount, validateRecoveryRequest } from "../app/lib/validators";

function runValidatorTests() {
  console.log("🧪 Running Payload Validator Tests...");

  // Email validation
  if (!isValidEmail("customer@example.com")) {
    throw new Error("Valid email was rejected");
  }
  if (isValidEmail("invalid-email-string")) {
    throw new Error("Invalid email was accepted");
  }

  // Phone validation
  if (!isValidPhone("+919812345678")) {
    throw new Error("Valid phone was rejected");
  }
  if (isValidPhone("123")) {
    throw new Error("Too short phone was accepted");
  }

  // Amount validation
  if (!isValidAmount(4999)) {
    throw new Error("Valid amount was rejected");
  }
  if (isValidAmount(-50) || isValidAmount("5000")) {
    throw new Error("Invalid amount was accepted");
  }

  // Recovery payload validation
  const validCheck = validateRecoveryRequest({ paymentId: "pay_12345" });
  if (!validCheck.valid) {
    throw new Error("Valid recovery payload was rejected");
  }

  const invalidCheck = validateRecoveryRequest({});
  if (invalidCheck.valid) {
    throw new Error("Empty recovery payload was accepted");
  }

  console.log("✅ Validator tests passed successfully!");
}

if (require.main === module) {
  runValidatorTests();
}

export { runValidatorTests };
