import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        customer: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    const demoPaymentLink = `http://localhost:3000/recover/${payment.id}`;

    const recoveryAttempt = await prisma.recoveryAttempt.create({
      data: {
        customerId: payment.customerId,
        paymentId: payment.id,
        channel: "PAYMENT_LINK",
        status: "LINK_CREATED",
        aiReasoning: `Payment failed because of ${
          payment.failureReason || "an unknown reason"
        }.`,
        aiRecommendation:
          "Create a payment link and contact the customer with a personalized recovery message.",
        message: `Hi ${payment.customer.name}, we noticed your recent payment of ₹${payment.amount.toLocaleString(
          "en-IN"
        )} could not be completed. You can retry your payment securely using the recovery link.`,
        paymentLink: demoPaymentLink,
        recoveredAmount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Recovery link created",
      recoveryAttempt,
    });
  } catch (error) {
    console.error("Recovery API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create recovery link",
      },
      { status: 500 }
    );
  }
}