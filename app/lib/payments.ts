import { prisma } from "@/app/lib/prisma";

/**
 * Retrieves a payment by ID. If the payment is a simulated demo identifier
 * (e.g., demo-1, demo, demo-sample) and does not exist in SQLite, it automatically
 * provisions a realistic test customer, failed payment, and recovery attempt.
 */
export async function getOrProvisionPayment(id: string) {
  let payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      customer: true,
      recoveryAttempts: {
        orderBy: {
          attemptedAt: "desc",
        },
      },
    },
  });

  if (
    !payment &&
    (id.startsWith("demo") ||
      id.startsWith("sbx_") ||
      id.includes("sample") ||
      id === "test-id")
  ) {
    try {
      // Find or create demo customer
      const customerEmail =
        id === "demo-2" ? "priya.sharma@techcorp.in" : "aarav.patel@enterprise.co.in";
      const customerName = id === "demo-2" ? "Priya Sharma" : "Aarav Patel";

      let customer = await prisma.customer.findFirst({
        where: { email: customerEmail },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: customerEmail,
            phone: "+919876543210",
            totalSpent: 45000,
            successfulPayments: 6,
          },
        });
      }

      const amount = id === "demo-2" ? 4999 : 9999;
      const failureReason = "Card declined by issuing bank (3DS timeout)";

      payment = await prisma.payment.create({
        data: {
          id,
          customerId: customer.id,
          amount,
          currency: "INR",
          status: "FAILED",
          failureReason,
          failureCode: "CARD_DECLINED",
          createdAt: new Date(),
          updatedAt: new Date(),
          recoveryAttempts: {
            create: {
              customerId: customer.id,
              channel: "PAYMENT_LINK",
              status: "LINK_CREATED",
              aiReasoning:
                "[88% Probability | HIGH Urgency] Customer has high lifetime value. 1-click Razorpay payment link recovery recommended.",
              aiRecommendation: "PAYMENT_LINK",
              message: `Hi ${customer.name}, your payment of INR ${amount.toLocaleString(
                "en-IN"
              )} was declined (${failureReason}). Retry securely here.`,
              paymentLink: `/recover/${id}`,
              recoveredAmount: 0,
              attemptedAt: new Date(),
            },
          },
        },
        include: {
          customer: true,
          recoveryAttempts: {
            orderBy: {
              attemptedAt: "desc",
            },
          },
        },
      });
    } catch (provisionError) {
      console.error("Error auto-provisioning demo payment:", provisionError);
    }
  }

  return payment;
}
