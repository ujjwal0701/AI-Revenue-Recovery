import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/app/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency,
      receipt: payment.id,
      notes: {
        paymentId: payment.id,
        customerId: payment.customerId,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}