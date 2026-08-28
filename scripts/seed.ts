import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL ||
  "file:C:/Users/Ujjwal/Documents/ai-revenue-recovery/dev.db";

const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing demo data
  await prisma.recoveryAttempt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.customer.deleteMany();

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "+919876543210",
        totalSpent: 24500,
        successfulPayments: 8,
      },
    }),

    prisma.customer.create({
      data: {
        name: "Priya Mehta",
        email: "priya@example.com",
        phone: "+919876543211",
        totalSpent: 12800,
        successfulPayments: 5,
      },
    }),

    prisma.customer.create({
      data: {
        name: "Rohan Gupta",
        email: "rohan@example.com",
        phone: "+919876543212",
        totalSpent: 8400,
        successfulPayments: 3,
      },
    }),

    prisma.customer.create({
      data: {
        name: "Ananya Singh",
        email: "ananya@example.com",
        phone: "+919876543213",
        totalSpent: 31200,
        successfulPayments: 12,
      },
    }),

    prisma.customer.create({
      data: {
        name: "Vikram Patel",
        email: "vikram@example.com",
        phone: "+919876543214",
        totalSpent: 6700,
        successfulPayments: 2,
      },
    }),
  ]);

  // Create failed payments
  const payments = [
    {
      customerId: customers[0].id,
      amount: 4999,
      failureReason: "Insufficient funds",
      failureCode: "INSUFFICIENT_FUNDS",
    },
    {
      customerId: customers[1].id,
      amount: 2499,
      failureReason: "Card declined by bank",
      failureCode: "CARD_DECLINED",
    },
    {
      customerId: customers[2].id,
      amount: 1299,
      failureReason: "Payment authentication failed",
      failureCode: "AUTH_FAILED",
    },
    {
      customerId: customers[3].id,
      amount: 7999,
      failureReason: "Bank declined the transaction",
      failureCode: "BANK_DECLINED",
    },
    {
      customerId: customers[4].id,
      amount: 3499,
      failureReason: "Payment request timed out",
      failureCode: "TIMEOUT",
    },
    {
      customerId: customers[0].id,
      amount: 1999,
      failureReason: "Insufficient funds",
      failureCode: "INSUFFICIENT_FUNDS",
    },
    {
      customerId: customers[3].id,
      amount: 5999,
      failureReason: "Card declined by bank",
      failureCode: "CARD_DECLINED",
    },
  ];

  for (const payment of payments) {
    await prisma.payment.create({
      data: {
        ...payment,
        currency: "INR",
        status: "FAILED",
      },
    });
  }

  console.log(`✅ Created ${customers.length} customers`);
  console.log(`✅ Created ${payments.length} failed payments`);

  const totalFailed = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  console.log(`💰 Total failed payment value: ₹${totalFailed}`);

  console.log("🌱 Database seed completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });