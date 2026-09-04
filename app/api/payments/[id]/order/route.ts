import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/app/lib/prisma";
import { getOrProvisionPayment } from "@/app/lib/payments";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_TU32vEhZq5dHjP";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "Ld5nkOmhcm98CUrB5VHQkNlO";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay credentials are not configured on the server",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { id } = await params;

    const payment = await getOrProvisionPayment(id);

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