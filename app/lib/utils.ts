/**
 * Formats a monetary value into Indian Rupee (INR) notation
 */
export function formatCurrency(amount: number, currency: string = "INR"): string {
  if (isNaN(amount)) return `${currency} 0`;
  return `${currency} ${amount.toLocaleString("en-IN")}`;
}

/**
 * Formats an ISO date into a localized human-readable date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats an ISO date into a localized date and time string
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncates an ID or string to a given length with ellipsis
 */
export function truncateString(str: string, maxLength: number = 16): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Sanitizes and normalizes phone numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  return phone.replace(/[^\d+]/g, "");
}
