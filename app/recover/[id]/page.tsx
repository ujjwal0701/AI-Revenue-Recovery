"use client";

import { useEffect, useState } from "react";

type RecoveryAttempt = {
  id: string;
  aiReasoning: string | null;
  aiRecommendation: string | null;
  channel: string;
  status: string;
};

type Payment = {
  id: string;
  amount: number;
  currency: string;
  failureReason: string | null;
  customer: {
    name: string;
    email: string;
  };
  recoveryAttempts?: RecoveryAttempt[];
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RecoveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    params.then(function (result) {
      const id = result.id;

      fetch("/api/payments/" + id)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            setPayment(data.payment);
          } else {
            setError(data.error || "Payment not found");
          }
        })
        .catch(function (error) {
          console.error(
            "Failed to load payment:",
            error
          );

          setError("Unable to load payment details");
        })
        .finally(function () {
          setLoading(false);
        });
    });

    return function () {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [params]);

  const handlePayment = async () => {
    if (!payment) {
      return;
    }

    setPaying(true);
    setError("");

    try {
      const orderResponse = await fetch(
        "/api/payments/" + payment.id + "/order",
        {
          method: "POST",
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.error ||
            "Unable to create payment order"
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load"
        );
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "RevenueAI",
        description: "Payment recovery",
        order_id: orderData.order.id,

        prefill: {
          name: payment.customer.name,
          email: payment.customer.email,
        },

        theme: {
          color: "#020617",
        },

        handler: async function (response: any) {
          try {
            const completeResponse = await fetch(
              "/api/recover/complete",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: payment.id,
                  razorpayOrderId:
                    response.razorpay_order_id,
                  razorpayPaymentId:
                    response.razorpay_payment_id,
                  razorpaySignature:
                    response.razorpay_signature,
                }),
              }
            );

            const completeData =
              await completeResponse.json();

            if (
              completeResponse.ok &&
              completeData.success
            ) {
              setPaid(true);
            } else {
              setError(
                completeData.error ||
                  "Payment verification failed"
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError("Unable to verify payment");
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setError(
            "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment initialization error:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to start payment");
      }

      setPaying(false);
    }
  };

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
            {error ||
              "This recovery link may be invalid or expired."}
          </p>
        </div>
      </main>
    );
  }

  if (paid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <button onClick={() => (window.location.href = '/')} className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100'>OK</button>

          <h1 className="mt-5 text-2xl font-semibold text-slate-950">
            Payment successful
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your payment of INR{" "}
            {payment.amount.toLocaleString("en-IN")}{" "}
            has been successfully recovered.
          </p>
        </div>
      </main>
    );
  }

  const latestAttempt = payment.recoveryAttempts?.[0];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-950">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
            AI
          </div>

          <p className="mt-3 text-sm font-semibold">
            RevenueAI
          </p>

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
            Your previous payment could not be completed.
            You can securely retry it using the button below.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Amount
              </span>

              <span className="text-xl font-semibold">
                INR{" "}
                {payment.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {latestAttempt?.aiReasoning && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI Recommended Strategy: {latestAttempt.aiRecommendation || "PAYMENT_LINK"}
                </span>
              </div>
              <p className="mt-1.5 leading-relaxed text-slate-500">
                {latestAttempt.aiReasoning}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={paying}
            className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paying
              ? "Processing..."
              : "Pay INR " +
                payment.amount.toLocaleString("en-IN")}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            Razorpay Test Mode. No real money will be charged.
          </p>
        </div>
      </div>
    </main>
  );
}




