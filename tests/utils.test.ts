/**
 * Unit tests for Pure Formatting and Utility Helpers
 */
import { formatCurrency, truncateString, sanitizePhoneNumber } from "../app/lib/utils";

function runUtilsTests() {
  console.log("🧪 Running Utility Helper Tests...");

  // Currency formatting
  const formatted = formatCurrency(12499, "INR");
  if (!formatted.includes("12,499")) {
    throw new Error(`Currency formatting failed: ${formatted}`);
  }

  // Zero currency handling
  const zeroFormatted = formatCurrency(0, "INR");
  if (!zeroFormatted.includes("0")) {
    throw new Error("Zero currency formatting failed");
  }

  // Truncate string
  const longId = "cmtdftt7l004gp8txryivfzfs";
  const truncated = truncateString(longId, 8);
  if (truncated !== "cmtdftt7...") {
    throw new Error(`Truncate failed: expected cmtdftt7... got ${truncated}`);
  }

  // Sanitize phone
  const rawPhone = "+91 (981) 234-5678";
  const cleaned = sanitizePhoneNumber(rawPhone);
  if (cleaned !== "+919812345678") {
    throw new Error(`Sanitize phone failed: ${cleaned}`);
  }

  console.log("✅ Utility helper tests passed successfully!");
}

if (require.main === module) {
  runUtilsTests();
}

export { runUtilsTests };
