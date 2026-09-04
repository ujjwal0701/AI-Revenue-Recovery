import { NextResponse } from "next/server";
import { getOrProvisionPayment } from "@/app/lib/payments";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payment = await getOrProvisionPayment(id);

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Payment lookup error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load payment",
      },
      { status: 500 }
    );
  }
}