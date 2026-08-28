"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  failureReason: string | null;
  customer: {
    name: string;
    email: string;
  };
};

export default function RecoveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/payments/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setPayment(data.payment);
          }
        })
        .catch((error) => {
          console.error("Failed to load payment:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading recovery details...
        </p>
      </main>
    );
  }

  if (!payment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-950">
            Payment not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This recovery link may be invalid or expired.
          </p>
        </div>
      </main>
    );
  }

  if (paid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-slate-950">
            Payment successful
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your payment of ₹
            {payment.amount.toLocaleString("en-IN")} has been successfully
            processed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-950">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
            ✦
          </div>

          <p className="mt-3 text-sm font-semibold">RevenueAI</p>
          <p className="text-xs text-slate-400">
            Secure payment recovery
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm text-slate-500">
            Hi {payment.customer.name},
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Complete your payment
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your previous payment could not be completed. You can securely
            retry it using the button below.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Amount</span>

              <span className="text-xl font-semibold">
                ₹{payment.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            onClick={() => setPaid(true)}
            className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Pay ₹{payment.amount.toLocaleString("en-IN")}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            Demo payment environment. Razorpay integration will be connected
            next.
          </p>
        </div>
      </div>
    </main>
  );
}