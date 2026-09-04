import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendMultiChannelNotification } from "@/app/lib/notifications";

export async function POST(request: Request) {
  try {
    const {
      paymentId,
      cashReference = `CASH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      notes = "Settled via cash collection by field agent",
      collectedBy = "Ujjwal Rajput (REV-8492)",
    } = await request.json();

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

    const now = new Date();

    // Create or update recovery attempt record for cash settlement
    const recoveryAttempt = await prisma.recoveryAttempt.create({
      data: {
        customerId: payment.customerId,
        paymentId: payment.id,
        channel: "PAYMENT_LINK",
        status: "RECOVERED",
        recoveredAmount: payment.amount,
        recoveredAt: now,
        aiReasoning: `Cash settlement verified by ${collectedBy}. Receipt Reference: ${cashReference}. Notes: ${notes}`,
        aiRecommendation: "CASH_SETTLEMENT",
        message: `Payment of INR ${payment.amount.toLocaleString(
          "en-IN"
        )} collected in cash (Ref: ${cashReference}).`,
        paymentLink: `/recover/${payment.id}`,
      },
    });

    // Update payment record to CAPTURED
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "CAPTURED",
        razorpayPaymentId: cashReference,
      },
    });

    // Update customer lifetime statistics
    await prisma.customer.update({
      where: { id: payment.customerId },
      data: {
        totalSpent: {
          increment: payment.amount,
        },
        successfulPayments: {
          increment: 1,
        },
      },
    });

    // Dispatch automated Cash Receipt confirmation to customer's Email & SMS
    const notificationResult = await sendMultiChannelNotification(
      {
        recipientName: payment.customer.name,
        recipientEmail: payment.customer.email,
        recipientPhone: payment.customer.phone,
        amount: payment.amount,
        currency: payment.currency,
        paymentId: payment.id,
        razorpayPaymentId: cashReference,
        razorpayOrderId: `cash_order_${Math.random().toString(36).substring(2, 7)}`,
        customMessage: `Your payment of INR ${payment.amount.toLocaleString(
          "en-IN"
        )} has been successfully recorded as settled via cash (Receipt Ref: ${cashReference}).`,
        paidAt: now,
      },
      "PAYMENT_SUCCESS"
    );

    return NextResponse.json({
      success: true,
      message: "Payment successfully marked as recovered via Cash",
      payment: updatedPayment,
      recoveryAttempt,
      notificationResult,
    });
  } catch (error) {
    console.error("Cash recovery error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record cash settlement" },
      { status: 500 }
    );
  }
}
