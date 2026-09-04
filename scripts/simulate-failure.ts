/**
 * Synthetic Payment Failure Event Simulator
 * Useful for local testing of automated webhooks without a live gateway
 * Run with: npx tsx scripts/simulate-failure.ts
 */
import { prisma } from "../app/lib/prisma";

async function main() {
  console.log("⚡ Simulating incoming payment failure event...");

  try {
    const customer = await prisma.customer.findFirst();

    if (!customer) {
      console.error("❌ No customer records found. Please seed the database first.");
      process.exit(1);
    }

    const failedPayment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount: 3499,
        currency: "INR",
        status: "FAILED",
        failureReason: "Card declined by issuing bank (Simulated)",
        failureCode: "CARD_DECLINED",
      },
    });

    console.log(`✅ Created simulated failed transaction:`);
    console.log(`- Payment ID: ${failedPayment.id}`);
    console.log(`- Customer: ${customer.name} (${customer.email})`);
    console.log(`- Amount: ${failedPayment.currency} ${failedPayment.amount}`);
    console.log(`- Status: ${failedPayment.status}`);
  } catch (error) {
    console.error("❌ Simulation failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
