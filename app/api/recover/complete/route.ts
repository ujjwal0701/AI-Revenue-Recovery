import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    if (
      !paymentId ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay payment details are required",
        },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    const recoveryAttempt = await prisma.recoveryAttempt.findFirst({
      where: {
        paymentId: payment.id,
        status: "LINK_CREATED",
      },
      orderBy: {
        attemptedAt: "desc",
      },
    });

    if (!recoveryAttempt) {
      return NextResponse.json(
        { success: false, error: "Recovery attempt not found" },
        { status: 404 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is not configured");

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay is not configured",
        },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpaySignature)
    );

    if (!signaturesMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Razorpay payment signature",
        },
        { status: 400 }
      );
    }

    const updatedAttempt = await prisma.recoveryAttempt.update({
      where: {
        id: recoveryAttempt.id,
      },
      data: {
        status: "RECOVERED",
        recoveredAmount: payment.amount,
        recoveredAt: new Date(),
      },
    });

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "CAPTURED",
        razorpayPaymentId,
      },
    });

    await prisma.customer.update({
      where: {
        id: payment.customerId,
      },
      data: {
        totalSpent: {
          increment: payment.amount,
        },
        successfulPayments: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment recovered successfully",
      recoveryAttempt: updatedAttempt,
    });
  } catch (error) {
    console.error("Recovery completion error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to complete recovery",
      },
      { status: 500 }
    );
  }
}