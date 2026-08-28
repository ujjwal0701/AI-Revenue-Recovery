"use client";
import { useEffect, useState } from "react";

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "sparkle") {
    return (
      <svg {...common}>
        <path d="m12 3-1.2 5.8L5 10l5.8 1.2L12 17l1.2-5.8L19 10l-5.8-1.2L12 3Z" />
        <path d="m19 16-.6 2.4L16 19l2.4.6L19 22l.6-2.4L22 19l-2.4-.6L19 16Z" />
      </svg>
    );
  }

  if (name === "alert") {
    return (
      <svg {...common}>
        <path d="M10.3 3.7 2.4 17.4A1.8 1.8 0 0 0 4 20h16a1.8 1.8 0 0 0 1.6-2.6L13.7 3.7a1.9 1.9 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (name === "message") {
    return (
      <svg {...common}>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.4-.7L4 20l1.7-4.1A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.7 2.7L16.5 9" />
      </svg>
    );
  }

  if (name === "trend") {
    return (
      <svg {...common}>
        <path d="M4 16 9 11l3 3 7-8" />
        <path d="M15 6h4v4" />
      </svg>
    );
  }

  if (name === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7.5" r="3.5" />
        <path d="M17 11a3.5 3.5 0 0 0 0-7" />
        <path d="M21 20v-1.5a4 4 0 0 0-3-3.8" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    );
  }

  return null;
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon name={icon} size={19} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        {trend && (
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <Icon name="trend" size={13} />
            {trend}
          </span>
        )}
        <span className="text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [payments, setPayments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "payments" | "customers" | "ai-agent" | "settings"
  >("overview");
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "FAILED" | "CAPTURED">("ALL");
  const [recoveringId, setRecoveringId] = useState<string | null>(null);

  const fetchPayments = () => {
    fetch("/api/payments")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPayments(data.payments);
        }
      })
      .catch((error) => {
        console.error("Failed to load payments:", error);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const revenueRecovered = payments.reduce((total, payment) => {
    const recovered = payment.recoveryAttempts.reduce(
      (sum: number, attempt: any) => sum + (attempt.recoveredAmount || 0),
      0
    );
    return total + recovered;
  }, 0);

  const revenueAtRisk = payments.reduce((total, payment) => {
    const recovered = payment.recoveryAttempts.reduce(
      (sum: number, attempt: any) => sum + (attempt.recoveredAmount || 0),
      0
    );
    return total + Math.max(payment.amount - recovered, 0);
  }, 0);

  const failedPaymentCount = payments.filter(
    (payment) => payment.status === "FAILED"
  ).length;

  const recoveryRate =
    revenueAtRisk + revenueRecovered > 0
      ? (revenueRecovered / (revenueAtRisk + revenueRecovered)) * 100
      : 0;

  const totalRecoveryAttempts = payments.reduce(
    (total, payment) => total + payment.recoveryAttempts.length,
    0
  );

  const successfulRecoveryAttempts = payments.reduce(
    (total, payment) =>
      total +
      payment.recoveryAttempts.filter(
        (attempt: any) => attempt.status === "RECOVERED"
      ).length,
    0
  );

  const agentSuccessRate =
    totalRecoveryAttempts > 0
      ? (successfulRecoveryAttempts / totalRecoveryAttempts) * 100
      : 0;

  const handleRecover = async (paymentId: string) => {
    setRecoveringId(paymentId);
    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = `/recover/${paymentId}`;
      } else {
        alert(data.error || "Recovery failed");
      }
    } catch (error) {
      console.error("Recovery request failed:", error);
      alert("Recovery request failed");
    } finally {
      setRecoveringId(null);
    }
  };

  // Derive unique customers from payments
  const customers = Array.from(
    new Map(
      payments
        .filter((p) => p.customer)
        .map((p) => [
          p.customerId,
          {
            ...p.customer,
            failedCount: payments.filter(
              (x) => x.customerId === p.customerId && x.status === "FAILED"
            ).length,
            recoveredCount: payments.filter(
              (x) =>
                x.customerId === p.customerId &&
                x.recoveryAttempts?.some((r: any) => r.status === "RECOVERED")
            ).length,
            atRisk: payments
              .filter((x) => x.customerId === p.customerId && x.status === "FAILED")
              .reduce((sum, x) => sum + x.amount, 0),
          },
        ])
    ).values()
  );

  const filteredPayments = payments.filter((payment) => {
    if (paymentFilter === "ALL") return true;
    return payment.status === paymentFilter;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-slate-100 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Icon name="sparkle" size={19} />
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">RevenueAI</p>
                <p className="text-[11px] text-slate-400">Recovery Engine</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon name="trend" size={18} />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === "payments"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon name="card" size={18} />
              Payments
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === "customers"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon name="users" size={18} />
              Customers
            </button>

            <button
              onClick={() => setActiveTab("ai-agent")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === "ai-agent"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon name="sparkle" size={18} />
              AI Agent
            </button>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              System
            </p>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === "settings"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon name="settings" size={18} />
              Settings
            </button>
          </nav>

          <div className="m-4 rounded-2xl bg-slate-950 p-4 text-white">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">
                AI Agent Active
              </span>
            </div>
            <p className="text-sm font-semibold">Recovery engine is running</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Monitoring payment events and identifying recoverable revenue.
            </p>
          </div>
        </aside>

        {/* Main Section */}
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Monday, August 24, 2026
              </p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
                {activeTab === "overview" && "Revenue Overview"}
                {activeTab === "payments" && "Payments & Invoices"}
                {activeTab === "customers" && "Customer Directory"}
                {activeTab === "ai-agent" && "AI Agent & Recovery Intelligence"}
                {activeTab === "settings" && "System & Integration Settings"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-600">
                  System operational
                </span>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                UR
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
            {/* ===================== TAB: OVERVIEW ===================== */}
            {activeTab === "overview" && (
              <>
                {/* Hero */}
                <div className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                        <Icon name="sparkle" size={14} />
                        AI-powered revenue recovery
                      </div>

                      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Recover revenue that would otherwise be lost.
                      </h2>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                        Your AI agent monitors failed payments, understands the
                        reason behind each failure, and recommends the next best
                        recovery action.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:min-w-56">
                      <p className="mt-1 text-3xl font-semibold">
                        INR {revenueRecovered.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-xs font-medium text-emerald-400">
                        Revenue recovered this month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    title="Revenue at risk"
                    value={`INR ${revenueAtRisk.toLocaleString("en-IN")}`}
                    subtitle="Across failed payments"
                    icon="alert"
                  />

                  <MetricCard
                    title="Revenue recovered"
                    value={`INR ${revenueRecovered.toLocaleString("en-IN")}`}
                    subtitle="Recovered from failed payments"
                    icon="trend"
                  />

                  <MetricCard
                    title="Recovery rate"
                    value={`${recoveryRate.toFixed(1)}%`}
                    subtitle="Of total recovery opportunity"
                    icon="sparkle"
                  />

                  <MetricCard
                    title="Failed payments"
                    value={failedPaymentCount.toString()}
                    subtitle="Requires attention"
                    icon="card"
                  />
                </div>

                {/* Main grid */}
                <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                  {/* Payments */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                      <div>
                        <h3 className="font-semibold">Failed payments</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          AI is evaluating these transactions for recovery.
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab("payments")}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        View all
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px]">
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
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                                    {payment.customer?.name
                                      ?.split(" ")
                                      .map((name: string) => name[0])
                                      .join("")
                                      .slice(0, 2) || "UR"}
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                      {payment.customer?.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      {payment.customer?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-4 py-4 text-sm font-semibold">
                                INR {payment.amount.toLocaleString("en-IN")}
                              </td>

                              <td className="px-4 py-4 text-sm text-slate-500">
                                {payment.failureReason || "Unknown"}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    payment.status === "CAPTURED"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {payment.status}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                {payment.status === "CAPTURED" ||
                                payment.recoveryAttempts?.some(
                                  (attempt: any) => attempt.status === "RECOVERED"
                                ) ? (
                                  <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                    Recovered
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRecover(payment.id)}
                                    disabled={recoveringId === payment.id}
                                    className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                  >
                                    {recoveringId === payment.id
                                      ? "Analyzing..."
                                      : "Recover"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Activity */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                          <Icon name="sparkle" size={15} />
                        </div>
                        <div>
                          <h3 className="font-semibold">AI recovery activity</h3>
                          <p className="text-xs text-slate-400">
                            Live agent activity
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-5">
                        {payments.slice(0, 4).map((payment, index) => {
                          const latestAttempt = payment.recoveryAttempts?.[0];
                          const isRecovered =
                            payment.status === "CAPTURED" ||
                            payment.recoveryAttempts?.some(
                              (attempt: any) => attempt.status === "RECOVERED"
                            ) ||
                            false;

                          return (
                            <div key={payment.id} className="flex gap-3">
                              <div className="relative">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                  <Icon
                                    name={isRecovered ? "check" : "alert"}
                                    size={16}
                                  />
                                </div>

                                {index < Math.min(payments.length, 4) - 1 && (
                                  <div className="absolute left-1/2 top-9 h-5 w-px -translate-x-1/2 bg-slate-200" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {isRecovered
                                      ? "Revenue recovered"
                                      : latestAttempt
                                      ? "AI recovery strategy selected"
                                      : "Payment failure detected"}
                                  </p>

                                  <span className="shrink-0 text-[10px] text-slate-400">
                                    {new Date(payment.createdAt).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </span>
                                </div>

                                <p className="mt-1 text-xs text-slate-400">
                                  {payment.customer?.name} - INR{" "}
                                  {payment.amount.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {payments.length === 0 && (
                          <p className="text-sm text-slate-400">
                            No payment activity yet.
                          </p>
                        )}
                      </div>

                      <div className="mt-6 rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">
                            Agent success rate
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {agentSuccessRate.toFixed(1)}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{ width: `${agentSuccessRate}%` }}
                          />
                        </div>

                        <p className="mt-2 text-[10px] text-slate-400">
                          Based on successful recovery actions this month.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recovery funnel */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-semibold">Recovery funnel</h3>
                      <p className="mt-1 text-xs text-slate-400">
                        How the AI converts failed payments into recovered revenue.
                      </p>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Last 30 days
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-4">
                    {[
                      [failedPaymentCount.toString(), "Failed payments"],
                      [
                        new Set(
                          payments
                            .filter(
                              (p) =>
                                p.recoveryAttempts &&
                                p.recoveryAttempts.length > 0
                            )
                            .map((p) => p.customerId)
                        ).size.toString(),
                        "Customers contacted",
                      ],
                      [
                        payments
                          .reduce(
                            (total, p) =>
                              total + (p.recoveryAttempts?.length || 0),
                            0
                          )
                          .toString(),
                        "Recovery attempts",
                      ],
                      [
                        payments
                          .reduce(
                            (total, p) =>
                              total +
                              (p.status === "CAPTURED" ||
                              p.recoveryAttempts?.some(
                                (attempt: any) => attempt.status === "RECOVERED"
                              )
                                ? 1
                                : 0),
                            0
                          )
                          .toString(),
                        "Payments recovered",
                      ],
                    ].map(([value, label], index) => (
                      <div key={label} className="relative">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-2xl font-semibold">{value}</p>
                          <p className="mt-1 text-xs text-slate-500">{label}</p>
                        </div>

                        {index < 3 && (
                          <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 font-bold text-slate-300 md:block">
                            -&gt;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===================== TAB: PAYMENTS ===================== */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Payment Transactions</h2>
                    <p className="text-xs text-slate-400">
                      Manage failed, captured, and recovered transactions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPaymentFilter("ALL")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        paymentFilter === "ALL"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      All ({payments.length})
                    </button>
                    <button
                      onClick={() => setPaymentFilter("FAILED")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        paymentFilter === "FAILED"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Failed ({payments.filter((p) => p.status === "FAILED").length})
                    </button>
                    <button
                      onClick={() => setPaymentFilter("CAPTURED")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        paymentFilter === "CAPTURED"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Captured (
                      {payments.filter((p) => p.status === "CAPTURED").length})
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Customer
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Amount
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Failure Reason & Code
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            AI Recovery Link
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment) => {
                          const isCaptured =
                            payment.status === "CAPTURED" ||
                            payment.recoveryAttempts?.some(
                              (a: any) => a.status === "RECOVERED"
                            );

                          return (
                            <tr
                              key={payment.id}
                              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                            >
                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold text-slate-900">
                                  {payment.customer?.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {payment.customer?.email}
                                </p>
                              </td>

                              <td className="px-4 py-4 text-sm font-semibold">
                                INR {payment.amount.toLocaleString("en-IN")}
                              </td>

                              <td className="px-4 py-4 text-xs text-slate-500">
                                <p className="font-medium text-slate-700">
                                  {payment.failureReason || "N/A"}
                                </p>
                                {payment.failureCode && (
                                  <span className="text-[10px] text-slate-400">
                                    {payment.failureCode}
                                  </span>
                                )}
                              </td>

                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    isCaptured
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {payment.status}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                {isCaptured ? (
                                  <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                    Recovered
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRecover(payment.id)}
                                    disabled={recoveringId === payment.id}
                                    className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                  >
                                    {recoveringId === payment.id
                                      ? "Analyzing..."
                                      : "Recover"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB: CUSTOMERS ===================== */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Customer Directory</h2>
                  <p className="text-xs text-slate-400">
                    Lifetime value and failure risk analytics per customer.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-400">
                      Total Customers
                    </p>
                    <p className="mt-2 text-2xl font-bold">{customers.length}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-400">
                      Total Lifetime Value
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      INR{" "}
                      {customers
                        .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
                        .toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-400">
                      Customers with Failed Payments
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {customers.filter((c) => c.failedCount > 0).length}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-left">
                          <th className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Customer
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Phone
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Lifetime Spent
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Successful Orders
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Failed Orders
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer: any) => (
                          <tr
                            key={customer.id}
                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {customer.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {customer.email}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-xs text-slate-600">
                              {customer.phone || "+91 98765 43210"}
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold">
                              INR {customer.totalSpent.toLocaleString("en-IN")}
                            </td>
                            <td className="px-4 py-4 text-xs font-semibold text-emerald-700">
                              {customer.successfulPayments} completed
                            </td>
                            <td className="px-4 py-4 text-xs font-semibold text-red-600">
                              {customer.failedCount} failed
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB: AI AGENT ===================== */}
            {activeTab === "ai-agent" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">AI Recovery Intelligence</h2>
                  <p className="text-xs text-slate-400">
                    Decision engine configuration, strategies, and live reasoning.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                        <Icon name="sparkle" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Gemini 2.5 Flash</h3>
                        <p className="text-xs text-emerald-600 font-medium">
                          Active & Optimized
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      Evaluates customer lifetime value, historical failure frequency,
                      and payment retry timings to produce custom recovery actions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                        <Icon name="check" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Deterministic Fallback</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Zero-Downtime Guarantee
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      If Gemini API is unreachable or rate limited, the deterministic
                      heuristic engine takes over automatically.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                        <Icon name="trend" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">Agent Success Rate</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {agentSuccessRate.toFixed(1)}% recovery
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      Tracking conversion percentage from created AI recovery links
                      into verified captured Razorpay transactions.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold">AI Decision Rules & Heuristics</h3>
                  <div className="mt-4 divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Insufficient Funds (Loyal Customer)
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                        78% Probability &rarr; Send Payment Link
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Gateway / Bank Timeout
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                        85% Probability &rarr; Immediate Retry Link
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Card Declined (New Customer)
                      </span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                        45% Probability &rarr; Email + Alternate Link
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        High Value Transaction (&gt; ₹50,000) with High Failures
                      </span>
                      <span className="rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">
                        35% Probability &rarr; Manual Account Review
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB: SETTINGS ===================== */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">System Settings</h2>
                  <p className="text-xs text-slate-400">
                    Razorpay Gateway, AI Engine, and Environment configurations.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-950">
                      Razorpay Gateway
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Test Mode checkout and webhook integration.
                    </p>

                    <div className="mt-5 space-y-4 text-xs">
                      <div>
                        <label className="font-medium text-slate-500">
                          Environment Mode
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Test Mode Active
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Key ID
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="rzp_test_TU32vEhZq5dHjP"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Signature Verification
                        </label>
                        <p className="mt-1 text-slate-600">
                          HMAC SHA256 verification enabled on{" "}
                          <code>/api/recover/complete</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-950">
                      AI Recovery Model
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Gemini API and fallback orchestration.
                    </p>

                    <div className="mt-5 space-y-4 text-xs">
                      <div>
                        <label className="font-medium text-slate-500">
                          Primary Provider
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="Google Gemini (gemini-2.5-flash)"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Fallback Mechanism
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            Deterministic Heuristics (Zero-Downtime)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Database Storage
                        </label>
                        <p className="mt-1 text-slate-600">
                          SQLite database via Prisma ORM (`dev.db`).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
              <p>RevenueAI - AI Revenue Recovery Engine</p>
              <p>Demo environment - Razorpay Test Mode</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
