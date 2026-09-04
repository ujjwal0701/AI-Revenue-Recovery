/**
 * Database Auto-Seeding & Persona Generation Helper
 * 
 * Automatically populates a pristine SQLite database with 160 realistic customer profiles,
 * diverse historical spending tiers, and authentic payment failure profiles matching
 * real-world Indian e-commerce / SaaS transaction scenarios.
 */
import { prisma } from "@/app/lib/prisma";

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
  "Kapoor", "Khanna", "Chopra", "Sethi", "Arora", "Bhasin", "Kohli", "Dhawan"
];

const failureProfiles = [
  {
    reason: "Insufficient funds in customer account",
    code: "INSUFFICIENT_FUNDS",
    channel: "PAYMENT_LINK" as const,
    prob: 78,
    urgency: "HIGH",
    aiReason: "Customer has recurring purchase history. Temporary balance deficit; payment link retry recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Card declined by issuing bank",
    code: "CARD_DECLINED",
    channel: "PAYMENT_LINK" as const,
    prob: 65,
    urgency: "HIGH",
    aiReason: "Issuing bank declined debit transaction. Alternate UPI/card payment link recovery recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Payment request timed out",
    code: "TIMEOUT",
    channel: "PAYMENT_LINK" as const,
    prob: 88,
    urgency: "HIGH",
    aiReason: "Network gateway timeout occurred during authorization. Immediate session retry has very high recovery rate.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "Payment authentication failed (3DS OTP)",
    code: "AUTH_FAILED",
    channel: "PAYMENT_LINK" as const,
    prob: 72,
    urgency: "HIGH",
    aiReason: "3D Secure OTP verification expired or was entered incorrectly. Fresh retry link recommended.",
    aiRec: "PAYMENT_LINK",
  },
  {
    reason: "UPI handle authentication failed",
    code: "UPI_AUTH_ERROR",
    channel: "WHATSAPP" as const,
    prob: 82,
    urgency: "HIGH",
    aiReason: "UPI MPIN timeout on customer app. WhatsApp notification with 1-click Razorpay payment link suggested.",
    aiRec: "WHATSAPP",
  },
  {
    reason: "Bank declined the transaction",
    code: "BANK_DECLINED",
    channel: "EMAIL" as const,
    prob: 54,
    urgency: "MEDIUM",
    aiReason: "Bank fraud protection or velocity limit triggered. Email notification with multi-gateway link advised.",
    aiRec: "EMAIL",
  },
];

const amountTiers = [
  499, 999, 1299, 1499, 1999, 2499, 2999, 3499, 3999, 4499,
  4999, 5999, 6999, 7999, 8999, 9999, 12499, 14999, 18999, 24999
];

export async function ensureSeededDatabase() {
  try {
    const customerCount = await prisma.customer.count();
    if (customerCount > 0) return;

    console.log("⚡ Auto-seeding 160 customers and transactions for database...");

    const createdCustomers = [];
    for (let i = 0; i < 160; i++) {
      const f = firstNames[i % firstNames.length];
      const l = lastNames[(i * 3 + 7) % lastNames.length];
      const name = `${f} ${l}`;
      const email = `${f.toLowerCase()}.${l.toLowerCase()}${i > 50 ? i : ""}@example.com`;
      const phone = `+9198${Math.floor(10000000 + Math.random() * 89999999)}`;
      const successfulPayments = Math.floor(Math.random() * 12) + 1;
      const avgTicket = amountTiers[Math.floor(Math.random() * amountTiers.length)];
      const totalSpent = successfulPayments * avgTicket;

      const c = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          totalSpent,
          successfulPayments,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 60) * 86400000),
        },
      });
      createdCustomers.push(c);
    }

    const TOTAL_PAYMENTS = 90;

    for (let i = 0; i < TOTAL_PAYMENTS; i++) {
      const cust = createdCustomers[i % createdCustomers.length];
      const profile = failureProfiles[i % failureProfiles.length];
      const amount = amountTiers[Math.floor(Math.random() * amountTiers.length)];
      const daysAgo = Math.floor(Math.random() * 14);
      const createdAt = new Date(Date.now() - daysAgo * 86400000 - Math.floor(Math.random() * 3600000));

      // 25% recovered, 75% failed so there are ~68 active failed payments available
      const isRecovered = i % 4 === 0;

      const payment = await prisma.payment.create({
        data: {
          customerId: cust.id,
          amount,
          currency: "INR",
          status: isRecovered ? "CAPTURED" : "FAILED",
          failureReason: isRecovered ? null : profile.reason,
          failureCode: isRecovered ? null : profile.code,
          razorpayPaymentId: isRecovered ? `pay_live_${Math.random().toString(36).substring(2, 10)}` : null,
          createdAt,
          updatedAt: isRecovered ? new Date(createdAt.getTime() + 1800000) : createdAt,
        },
      });

      if (isRecovered || i % 2 === 0) {
        await prisma.recoveryAttempt.create({
          data: {
            customerId: cust.id,
            paymentId: payment.id,
            channel: profile.channel,
            status: isRecovered ? "RECOVERED" : "LINK_CREATED",
            aiReasoning: `[${profile.prob}% Probability | ${profile.urgency} Urgency] ${profile.aiReason}`,
            aiRecommendation: profile.aiRec,
            message: `Hi ${cust.name}, your payment of INR ${amount.toLocaleString("en-IN")} was declined. Complete it securely here.`,
            paymentLink: `https://ai-revenue-recovery-lac.vercel.app/recover/${payment.id}`,
            recoveredAmount: isRecovered ? amount : 0,
            attemptedAt: createdAt,
            recoveredAt: isRecovered ? new Date(createdAt.getTime() + 1800000) : null,
          },
        });
      }
    }
  } catch (e) {
    console.error("Auto-seed error:", e);
  }
}
