import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { analyzePaymentRecovery } from "@/app/lib/gemini";

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
        customer: {
          include: {
            payments: {
              include: {
                recoveryAttempts: true,
              },
            },
            recoveryAttempts: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    // Historical calculations
    const allCustomerPayments = payment.customer.payments || [];
    const allCustomerRecoveries = payment.customer.recoveryAttempts || [];

    const totalPaymentsCount = allCustomerPayments.length;
    const failedPaymentsCount = allCustomerPayments.filter(
      (p) => p.status === "FAILED"
    ).length;
    const successfulPaymentsCount = allCustomerPayments.filter(
      (p) => p.status === "CAPTURED" || p.status === "AUTHORIZED"
    ).length;
    const recoveryAttemptsCount = allCustomerRecoveries.length;
    const successfulRecoveriesCount = allCustomerRecoveries.filter(
      (r) => r.status === "RECOVERED"
    ).length;

    // AI Recovery Analysis (with automatic deterministic fallback)
    const aiStrategy = await analyzePaymentRecovery({
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      failureReason: payment.failureReason,
      failureCode: payment.failureCode,
      customer: {
        id: payment.customer.id,
        name: payment.customer.name,
        email: payment.customer.email,
        phone: payment.customer.phone,
        totalSpent: payment.customer.totalSpent,
        successfulPayments: payment.customer.successfulPayments,
      },
      history: {
        totalPaymentsCount,
        failedPaymentsCount,
        successfulPaymentsCount,
        recoveryAttemptsCount,
        successfulRecoveriesCount,
      },
    });

    const demoPaymentLink = `http://localhost:3000/recover/${payment.id}`;

    // Map AI recommended action to Prisma RecoveryChannel
    let channel: "PAYMENT_LINK" | "EMAIL" | "SMS" | "WHATSAPP" = "PAYMENT_LINK";
    if (aiStrategy.recommendedAction === "EMAIL") channel = "EMAIL";
    else if (aiStrategy.recommendedAction === "SMS") channel = "SMS";
    else if (aiStrategy.recommendedAction === "WHATSAPP") channel = "WHATSAPP";

    const recoveryAttempt = await prisma.recoveryAttempt.create({
      data: {
        customerId: payment.customerId,
        paymentId: payment.id,
        channel,
        status: "LINK_CREATED",
        aiReasoning: `[${aiStrategy.recoveryProbability}% Probability | ${aiStrategy.urgency} Urgency] ${aiStrategy.reason}`,
        aiRecommendation: aiStrategy.recommendedAction,
        message: aiStrategy.message,
        paymentLink: demoPaymentLink,
        recoveredAmount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Recovery link created",
      recoveryAttempt,
      aiStrategy,
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