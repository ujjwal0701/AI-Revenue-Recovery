import { NextResponse } from "next/server";
import {
  getSandboxEmails,
  clearSandboxEmails,
  sendRecoveryNotification,
  NotificationEventType,
} from "@/app/lib/notifications";

export async function GET() {
  try {
    const emails = getSandboxEmails();
    return NextResponse.json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Sandbox GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sandbox emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventType = "PAYMENT_FAILED",
      recipientName = "Aarav Sharma",
      recipientEmail = "aarav.sharma@example.com",
      amount = 7499,
      currency = "INR",
      failureReason = "Card declined by issuing bank",
      paymentLink = "/recover/demo",
      razorpayPaymentId = "pay_test_sbx99",
    } = body;

    const result = await sendRecoveryNotification(
      "EMAIL",
      {
        recipientName,
        recipientEmail,
        amount,
        currency,
        failureReason,
        paymentLink,
        razorpayPaymentId,
        paidAt: new Date(),
      },
      eventType as NotificationEventType
    );

    const emails = getSandboxEmails();

    return NextResponse.json({
      success: true,
      result,
      emails,
    });
  } catch (error) {
    console.error("Sandbox POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch sandbox email" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearSandboxEmails();
    return NextResponse.json({
      success: true,
      message: "Sandbox inbox cleared",
      count: 0,
      emails: [],
    });
  } catch (error) {
    console.error("Sandbox DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear sandbox inbox" },
      { status: 500 }
    );
  }
}
