/**
 * Unit tests for Multi-Channel Notification Formatting and Template Generators
 */
import {
  generatePaymentFailedEmailHtml,
  generatePaymentSuccessEmailHtml,
  generatePaymentSuccessSmsText,
  generatePaymentSuccessWhatsAppText,
} from "../app/lib/notifications";

function runNotificationTests() {
  console.log("🧪 Running Multi-Channel Notification Formatting Tests...");

  const mockPayload = {
    recipientName: "Aditya Verma",
    recipientEmail: "aditya@example.com",
    recipientPhone: "+919876543210",
    amount: 7499,
    currency: "INR",
    failureReason: "Payment authentication failed (3DS OTP)",
    paymentLink: "http://localhost:3000/recover/test-id",
    razorpayPaymentId: "pay_test_001",
    razorpayOrderId: "order_test_001",
  };

  // Test Failure Email
  const failedHtml = generatePaymentFailedEmailHtml(mockPayload);
  if (!failedHtml.includes("Aditya Verma") || !failedHtml.includes("INR 7,499")) {
    throw new Error("Failed email HTML missing required customer parameters");
  }

  // Test Success Email
  const successHtml = generatePaymentSuccessEmailHtml(mockPayload);
  if (!successHtml.includes("Payment Successfully Recovered") || !successHtml.includes("pay_test_001")) {
    throw new Error("Success email HTML missing confirmation details");
  }

  // Test SMS
  const sms = generatePaymentSuccessSmsText(mockPayload);
  if (!sms.includes("Success!") || !sms.includes("7,499")) {
    throw new Error("SMS text formatting failed");
  }

  // Test WhatsApp
  const wa = generatePaymentSuccessWhatsAppText(mockPayload);
  if (!wa.includes("*Payment Confirmed - RevenueAI Receipt*")) {
    throw new Error("WhatsApp message formatting failed");
  }

  console.log("✅ Multi-channel notification tests passed successfully!");
}

if (require.main === module) {
  runNotificationTests();
}

export { runNotificationTests };
