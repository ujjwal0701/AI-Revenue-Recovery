import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import {
  sendRecoveryNotification,
  NotificationChannel,
  NotificationEventType,
  generatePaymentFailedEmailHtml,
  generatePaymentSuccessEmailHtml,
  generatePaymentFailedSmsText,
  generatePaymentSuccessSmsText,
  generatePaymentFailedWhatsAppText,
  generatePaymentSuccessWhatsAppText,
} from "@/app/lib/notifications";

export async function GET() {
  try {
    const attempts = await prisma.recoveryAttempt.findMany({
      include: {
        customer: true,
        payment: true,
      },
      orderBy: {
        attemptedAt: "desc",
      },
      take: 20,
    });

    const notifications = attempts.map((attempt) => {
      const isRecovered = attempt.status === "RECOVERED";
      const payload = {
        recipientName: attempt.customer.name,
        recipientEmail: attempt.customer.email,
        recipientPhone: attempt.customer.phone,
        amount: attempt.payment.amount,
        currency: attempt.payment.currency,
        failureReason: attempt.payment.failureReason,
        paymentLink:
          attempt.paymentLink ||
          `http://localhost:3000/recover/${attempt.paymentId}`,
        paymentId: attempt.paymentId,
        razorpayPaymentId: attempt.payment.razorpayPaymentId,
        customMessage: attempt.message || undefined,
        paidAt: attempt.recoveredAt || undefined,
      };

      return {
        id: attempt.id,
        paymentId: attempt.paymentId,
        customerName: attempt.customer.name,
        customerEmail: attempt.customer.email,
        customerPhone: attempt.customer.phone,
        amount: attempt.payment.amount,
        channel: attempt.channel,
        status: attempt.status,
        eventType: isRecovered ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED",
        message: attempt.message,
        aiReasoning: attempt.aiReasoning,
        attemptedAt: attempt.attemptedAt,
        recoveredAt: attempt.recoveredAt,
        paymentLink: payload.paymentLink,
        emailHtml: isRecovered
          ? generatePaymentSuccessEmailHtml(payload)
          : generatePaymentFailedEmailHtml(payload),
        smsText: isRecovered
          ? generatePaymentSuccessSmsText(payload)
          : generatePaymentFailedSmsText(payload),
        whatsappText: isRecovered
          ? generatePaymentSuccessWhatsAppText(payload)
          : generatePaymentFailedWhatsAppText(payload),
      };
    });

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      channel = "EMAIL",
      eventType = "PAYMENT_FAILED",
      recipientName = "Customer",
      recipientEmail = "customer@example.com",
      recipientPhone = "+919876543210",
      amount = 4999,
      currency = "INR",
      failureReason = "Card declined by issuing bank",
      paymentLink = "http://localhost:3000/recover/demo",
      razorpayPaymentId = "pay_test_verified99",
      customMessage,
    } = body;

    const result = await sendRecoveryNotification(
      channel as NotificationChannel,
      {
        recipientName,
        recipientEmail,
        recipientPhone,
        amount,
        currency,
        failureReason,
        paymentLink,
        razorpayPaymentId,
        customMessage,
      },
      eventType as NotificationEventType
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Notification send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

