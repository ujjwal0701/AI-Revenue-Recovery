/**
 * Email Sandbox Inspection CLI Script
 * Run with: npx tsx scripts/sandbox-inspect.ts
 */
import { getSandboxEmails } from "../app/lib/notifications";

function main() {
  console.log("📬 Inspecting In-Memory Email Sandbox...");

  const emails = getSandboxEmails();

  console.log(`Found ${emails.length} captured emails in sandbox:`);

  emails.forEach((email, index) => {
    console.log(`\n[${index + 1}] ID: ${email.id} | Event: ${email.eventType}`);
    console.log(`    To: ${email.toName} <${email.to}>`);
    console.log(`    Subject: ${email.subject}`);
    console.log(`    Amount: ${email.currency} ${email.amount}`);
    console.log(`    Status: ${email.status}`);
  });

  console.log("\n✅ Sandbox inspection complete.");
}

if (require.main === module) {
  main();
}
