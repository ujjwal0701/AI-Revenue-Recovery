"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: number;
  failureReason: string | null;
  status: string;
  customer: {
    name: string;
    email: string;
  };
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.payments);
        }
      })
      .catch((error) => {
        console.error("Failed to load payments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs font-medium text-slate-400">
              RevenueAI
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Failed Payments
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Review failed payments and identify revenue that can be recovered.
            </p>
          </div>

          <a
            href="/"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-5 sm:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5">
            <h2 className="font-semibold">All failed payments</h2>
            <p className="mt-1 text-xs text-slate-400">
              {loading
                ? "Loading payments..."
                : `${payments.length} failed payments found`}
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No failed payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Failure reason
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {payment.customer.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {payment.customer.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {payment.failureReason || "Unknown"}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
                          {payment.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
  onClick={async () => {
    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: payment.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Recovery attempt created for ${payment.customer.name}`);
      } else {
        alert(data.error || "Recovery failed");
      }
    } catch (error) {
      console.error("Recovery request failed:", error);
      alert("Unable to start recovery");
    }
  }}
  className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
>
  Recover
</button>                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}