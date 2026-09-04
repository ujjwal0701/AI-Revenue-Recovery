import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureSeededDatabase } from "@/app/lib/seedHelper";

export async function GET() {
  try {
    await ensureSeededDatabase();

    const payments = await prisma.payment.findMany({
      include: {
        customer: true,
        recoveryAttempts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Failed to fetch payments:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payments",
      },
      { status: 500 }
    );
  }
}