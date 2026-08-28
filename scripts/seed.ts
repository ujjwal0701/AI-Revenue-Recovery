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

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan",
  "Krishna", "Ishaan", "Shaurya", "Atharva", "Dhruv", "Kabir", "Rudra", "Om",
  "Aaditya", "Advik", "Devansh", "Parth", "Aryan", "Ananya", "Diya", "Saanvi",
  "Aanya", "Aadhya", "Pari", "Ira", "Myra", "Avani", "Navya", "Riya",
  "Samaira", "Prisha", "Anika", "Kavya", "Vanya", "Sara", "Aditi", "Meera",
  "Pooja", "Neha", "Rahul", "Amit", "Rohan", "Siddharth", "Vikram", "Priya",
  "Tanvi", "Akash", "Karan", "Simran", "Deepak", "Nisha", "Gaurav", "Sneha",
  "Rajat", "Shreya", "Manish", "Divya", "Suresh", "Sunita", "Harsh", "Swati",
  "Ramesh", "Kiran", "Nikhil", "Bhavna", "Kunal", "Archana", "Mohit", "Jyoti",
  "Varun", "Rashmi", "Alok", "Pallavi", "Sachin", "Monika", "Anil", "Geeta",
  "Abhishek", "Payal", "Ritesh", "Preeti", "Tarun", "Komal", "Mayank", "Ritu",
  "Yash", "Garima", "Lokesh", "Sonam", "Chirag", "Alka", "Himanshu", "Priyanka"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Saxena", "Mehta", "Patel",
  "Reddy", "Nair", "Iyer", "Rao", "Joshi", "Kulkarni", "Deshmukh", "Singh",
  "Chauhan", "Yadav", "Pandey", "Mishra", "Dubey", "Tiwari", "Shukla", "Das",
  "Banerjee", "Chatterjee", "Mukherjee", "Ghosh", "Dutta", "Sen", "Bose", "Choudhury",
  "Agarwal", "Bansal", "Mittal", "Goyal", "Jindal", "Singhal", "Garg", "Goel",
  "Kapoor", "Khanna", "Chopra", "Sethi", "Arora", "Bhasin", "Kohli", "Dhawan",
  "Patil", "Pawar", "Kadam", "Shinde", "Jadhav", "More", "Sawant", "Bhosale"
];

const failureProfiles = [
  {
    reason: "Insufficient funds in customer account",
    code: "INSUFFICIENT_FUNDS",
    channel: "PAYMENT_LINK" as const,
    prob: 78,
    urgency: "HIGH" as const,
    aiReason: "Customer has recurring purchase history. Temporary balance deficit; payment link retry recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Card declined by issuing bank",
    code: "CARD_DECLINED",
    channel: "PAYMENT_LINK" as const,
    prob: 65,
    urgency: "HIGH" as const,
    aiReason: "Issuing bank declined debit transaction. Alternate UPI/card payment link recovery recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Payment request timed out",
    code: "TIMEOUT",
    channel: "PAYMENT_LINK" as const,
    prob: 88,
    urgency: "HIGH" as const,
    aiReason: "Network gateway timeout occurred during authorization. Immediate session retry has very high recovery rate.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Payment authentication failed (3DS OTP)",
    code: "AUTH_FAILED",
    channel: "PAYMENT_LINK" as const,
    prob: 72,
    urgency: "HIGH" as const,
    aiReason: "3D Secure OTP verification expired or was entered incorrectly. Fresh retry link recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Bank declined the transaction",
    code: "BANK_DECLINED",
    channel: "EMAIL" as const,
    prob: 54,
    urgency: "MEDIUM" as const,
    aiReason: "Bank fraud protection or velocity limit triggered. Email notification with multi-gateway link advised.",
    aiRec: "EMAIL",
  },
  {
    reason: "UPI handle authentication failed",
    code: "UPI_AUTH_ERROR",
    channel: "WHATSAPP" as const,
    prob: 82,
    urgency: "HIGH" as const,
    aiReason: "UPI MPIN timeout on customer app. WhatsApp notification with 1-click Razorpay payment link suggested.",
    aiRec: "WHATSAPP",
  },
  {
    reason: "International card restriction",
    code: "INTERNATIONAL_NOT_ALLOWED",
    channel: "EMAIL" as const,
    prob: 40,
    urgency: "MEDIUM" as const,
    aiReason: "Card not enabled for domestic e-commerce. Email customer to enable online transactions or use alternate card.",
    aiRec: "EMAIL",
  },
  {
    reason: "Transaction limit exceeded",
    code: "LIMIT_EXCEEDED",
    channel: "SMS" as const,
    prob: 60,
    urgency: "MEDIUM" as const,
    aiReason: "Daily bank limit reached on customer account. SMS reminder with next-day retry option sent.",
    aiRec: "SMS",
  },
];

const amountTiers = [
  499, 999, 1299, 1499, 1999, 2499, 2999, 3499, 3999, 4499,
  4999, 5999, 6999, 7999, 8999, 9999, 12499, 14999, 18999, 24999
];

async function main() {
  console.log("🌱 Cleaning existing demo records...");
  await prisma.recoveryAttempt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.customer.deleteMany();

  const TOTAL_CUSTOMERS = 160;
  console.log(`🚀 Seeding ${TOTAL_CUSTOMERS} realistic enterprise customers & transactions...`);

  const createdCustomers = [];

  for (let i = 0; i < TOTAL_CUSTOMERS; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3 + 7) % lastNames.length];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i > 50 ? i : ""}@example.com`;
    const phone = `+9198${Math.floor(10000000 + Math.random() * 89999999)}`;

    const successfulPayments = Math.floor(Math.random() * 12) + 1;
    const avgTicket = amountTiers[Math.floor(Math.random() * amountTiers.length)];
    const totalSpent = successfulPayments * avgTicket;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        totalSpent,
        successfulPayments,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
      },
    });

    createdCustomers.push(customer);
  }

  console.log(`✅ Created ${createdCustomers.length} customers.`);

  // Generate 80 failed payments and recovery attempts across customers
  const TOTAL_PAYMENTS = 90;
  let totalRecoveredAmount = 0;
  let totalAtRiskAmount = 0;

  for (let i = 0; i < TOTAL_PAYMENTS; i++) {
    const customer = createdCustomers[i % createdCustomers.length];
    const profile = failureProfiles[i % failureProfiles.length];
    const amount = amountTiers[Math.floor(Math.random() * amountTiers.length)];
    const daysAgo = Math.floor(Math.random() * 14);
    const createdAt = new Date(Date.now() - daysAgo * 86400000 - Math.floor(Math.random() * 3600000));

    // Distribution:
    // 35% RECOVERED, 40% LINK_CREATED / active failed, 25% Fresh FAILED
    const isRecovered = i % 3 === 0;
    const hasAttempt = isRecovered || i % 2 === 0;

    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount,
        currency: "INR",
        status: isRecovered ? "CAPTURED" : "FAILED",
        failureReason: profile.reason,
        failureCode: profile.code,
        razorpayPaymentId: isRecovered ? `pay_test_${Math.random().toString(36).substring(2, 12)}` : null,
        createdAt,
        updatedAt: isRecovered ? new Date(createdAt.getTime() + 1800000) : createdAt,
      },
    });

    if (isRecovered) {
      totalRecoveredAmount += amount;
    } else {
      totalAtRiskAmount += amount;
    }

    if (hasAttempt) {
      await prisma.recoveryAttempt.create({
        data: {
          customerId: customer.id,
          paymentId: payment.id,
          channel: profile.channel,
          status: isRecovered ? "RECOVERED" : "LINK_CREATED",
          aiReasoning: `[${profile.prob}% Probability | ${profile.urgency} Urgency] ${profile.aiReason}`,
          aiRecommendation: profile.aiRec,
          message: `Hi ${customer.name}, we noticed your payment of INR ${amount.toLocaleString(
            "en-IN"
          )} could not be completed (${profile.reason}). Complete it securely here.`,
          paymentLink: `http://localhost:3000/recover/${payment.id}`,
          recoveredAmount: isRecovered ? amount : 0,
          attemptedAt: createdAt,
          recoveredAt: isRecovered ? new Date(createdAt.getTime() + 1800000) : null,
        },
      });
    }
  }

  console.log(`✅ Created ${TOTAL_PAYMENTS} transactions.`);
  console.log(`💰 Revenue recovered in demo dataset: ₹${totalRecoveredAmount.toLocaleString("en-IN")}`);
  console.log(`⚠️ Revenue at risk in demo dataset: ₹${totalAtRiskAmount.toLocaleString("en-IN")}`);
  console.log("🌱 Database seeded successfully with 160 customers!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });