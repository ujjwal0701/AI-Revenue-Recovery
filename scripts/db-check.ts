/**
 * Database Integrity & Health Check Script
 * Run with: npx tsx scripts/db-check.ts
 */
import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("🔍 Checking SQLite database connectivity and integrity...");

  try {
    const customerCount = await prisma.customer.count();
    const paymentCount = await prisma.payment.count();
    const recoveryCount = await prisma.recoveryAttempt.count();

    console.log("📊 Database Record Summary:");
    console.log(`- Customers: ${customerCount}`);
    console.log(`- Payments: ${paymentCount}`);
    console.log(`- Recovery Attempts: ${recoveryCount}`);

    if (customerCount === 0) {
      console.warn("⚠️ Warning: Database is empty. Ensure seed script has run.");
    } else {
      console.log("✅ Database connectivity and tables verified!");
    }
  } catch (error) {
    console.error("❌ Database integrity check failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
