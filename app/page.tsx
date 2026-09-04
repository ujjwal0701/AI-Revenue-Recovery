"use client";
import { useEffect, useState } from "react";
import {
  generatePaymentFailedEmailHtml,
  generatePaymentSuccessEmailHtml,
  generatePaymentFailedSmsText,
  generatePaymentSuccessSmsText,
  generatePaymentFailedWhatsAppText,
  generatePaymentSuccessWhatsAppText,
} from "@/app/lib/notifications";


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

  if (name === "inbox") {
    return (
      <svg {...common}>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
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

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  if (name === "smartphone") {
    return (
      <svg {...common}>
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
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

  if (name === "cash") {
    return (
      <svg {...common}>
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
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
    "overview" | "payments" | "customers" | "ai-agent" | "sandbox" | "settings"
  >("overview");
  const [paymentFilter, setPaymentFilter] = useState<"ALL" | "FAILED" | "CAPTURED">("ALL");

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Employee Recovery Action Modal State
  const [recoveryModalPayment, setRecoveryModalPayment] = useState<any | null>(null);
  const [recoveryActionProcessing, setRecoveryActionProcessing] = useState(false);
  const [recoveryActionMessage, setRecoveryActionMessage] = useState<string | null>(null);
  const [cashReference, setCashReference] = useState("");
  const [cashNotes, setCashNotes] = useState("");
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);

  // Email Sandbox state
  const [sandboxEmails, setSandboxEmails] = useState<any[]>([]);
  const [selectedSandboxEmail, setSelectedSandboxEmail] = useState<any | null>(null);
  const [sandboxFilter, setSandboxFilter] = useState<"ALL" | "PAYMENT_FAILED" | "PAYMENT_SUCCESS">("ALL");
  const [sandboxSearch, setSandboxSearch] = useState("");
  const [sandboxViewMode, setSandboxViewMode] = useState<"VISUAL" | "RAW_HTML" | "PLAIN_TEXT">("VISUAL");
  const [sandboxActionStatus, setSandboxActionStatus] = useState<string | null>(null);

  // Notification preview modal state
  const [previewNotification, setPreviewNotification] = useState<{
    payment: any;
    attempt: any;
    format: "EMAIL" | "SMS" | "WHATSAPP";
  } | null>(null);

  // Manual test dispatch state
  const [testEventType, setTestEventType] = useState<"PAYMENT_FAILED" | "PAYMENT_SUCCESS">("PAYMENT_FAILED");
  const [testChannel, setTestChannel] = useState<"EMAIL" | "SMS" | "WHATSAPP">("EMAIL");
  const [testEmail, setTestEmail] = useState("aarav.sharma@example.com");
  const [testPhone, setTestPhone] = useState("+919876543210");
  const [testStatus, setTestStatus] = useState<string | null>(null);

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

  const fetchSandboxEmails = () => {
    fetch("/api/notifications/sandbox")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.emails) {
          setSandboxEmails(data.emails);
          if (data.emails.length > 0 && !selectedSandboxEmail) {
            setSelectedSandboxEmail(data.emails[0]);
          }
        }
      })
      .catch((e) => console.error("Failed to load sandbox emails:", e));
  };

  useEffect(() => {
    fetchPayments();
    fetchSandboxEmails();
  }, []);

  const revenueRecovered = payments.reduce((total, payment) => {
    const recovered = payment.recoveryAttempts?.reduce(
      (sum: number, attempt: any) => sum + (attempt.recoveredAmount || 0),
      0
    ) || 0;
    return total + recovered;
  }, 0);

  const revenueAtRisk = payments.reduce((total, payment) => {
    const recovered = payment.recoveryAttempts?.reduce(
      (sum: number, attempt: any) => sum + (attempt.recoveredAmount || 0),
      0
    ) || 0;
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
    (total, payment) => total + (payment.recoveryAttempts?.length || 0),
    0
  );

  const successfulRecoveryAttempts = payments.reduce(
    (total, payment) =>
      total +
      (payment.recoveryAttempts?.filter(
        (attempt: any) => attempt.status === "RECOVERED"
      ).length || 0),
    0
  );

  const agentSuccessRate =
    totalRecoveryAttempts > 0
      ? (successfulRecoveryAttempts / totalRecoveryAttempts) * 100
      : 0;

  // Split payments into captured/recovered vs active failed
  const isPaymentRecovered = (payment: any) =>
    payment.status === "CAPTURED" ||
    payment.recoveryAttempts?.some(
      (attempt: any) => attempt.status === "RECOVERED"
    );

  const recoveredPayments = payments.filter((payment) => isPaymentRecovered(payment));
  const activeFailedPayments = payments.filter((payment) => !isPaymentRecovered(payment));

  // Overview Table: At most 4 recent recovered payments + remaining slots filled with active failed payments (up to 12 total)
  const recentRecovered = recoveredPayments.slice(0, 4);
  const neededFailedCount = Math.max(6, 12 - recentRecovered.length);
  const activeFailedForOverview = activeFailedPayments.slice(0, neededFailedCount);
  const overviewPayments = [...recentRecovered, ...activeFailedForOverview];

  // Open Recovery Action Modal for Employee
  const handleOpenRecoveryModal = (payment: any) => {
    setRecoveryModalPayment(payment);
    setRecoveryActionMessage(null);
  };

  // Option 1: Send Email / SMS Notification to Customer
  const handleSendCustomerRecoveryNotification = async () => {
    if (!recoveryModalPayment) return;
    setRecoveryActionProcessing(true);

    try {
      const customerName = recoveryModalPayment.customer?.name || "Customer";
      const customerEmail = recoveryModalPayment.customer?.email || "";
      const paymentId = recoveryModalPayment.id;

      const response = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Return directly to dashboard immediately
        setRecoveryModalPayment(null);
        setDashboardToast(
          `✅ Recovery link successfully dispatched to ${customerName} (${customerEmail}) & SMS! Captured in Email Sandbox.`
        );
        fetchPayments();
        fetchSandboxEmails();
        setTimeout(() => setDashboardToast(null), 5000);
      } else {
        alert(data.error || "Failed to dispatch recovery link");
      }
    } catch (e) {
      alert("Network error while dispatching recovery notification");
    } finally {
      setRecoveryActionProcessing(false);
    }
  };

  // Option 2: Record Payment Done by Cash (Offline Settlement)
  const handleRecordCashSettlement = async (cashRef?: string, notes?: string) => {
    if (!recoveryModalPayment) return;
    setRecoveryActionProcessing(true);

    try {
      const amountStr = recoveryModalPayment.amount?.toLocaleString("en-IN");
      const customerName = recoveryModalPayment.customer?.name || "Customer";

      const response = await fetch("/api/recover/cash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: recoveryModalPayment.id,
          cashReference: cashRef || `CASH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          notes: notes || "Settled via cash collection by operations desk",
          collectedBy: "Ujjwal Rajput (REV-8492)",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Return directly to dashboard immediately
        setRecoveryModalPayment(null);
        setDashboardToast(
          `✅ Payment of INR ${amountStr} for ${customerName} successfully marked as Recovered via Cash Settlement!`
        );
        fetchPayments();
        fetchSandboxEmails();
        setTimeout(() => setDashboardToast(null), 5000);
      } else {
        alert(data.error || "Failed to record cash payment");
      }
    } catch (e) {
      alert("Network error while recording cash settlement");
    } finally {
      setRecoveryActionProcessing(false);
    }
  };

  const handleSendTestNotification = async () => {
    setTestStatus("Dispatching...");
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: testEventType,
          channel: testChannel,
          recipientName: "Demo Customer",
          recipientEmail: testEmail,
          recipientPhone: testPhone,
          amount: 4999,
          currency: "INR",
          failureReason: "Card declined by issuing bank",
          paymentLink: "http://localhost:3000/recover/demo",
          razorpayPaymentId: "pay_test_verified99",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTestStatus(`✅ Dispatched ${testEventType === "PAYMENT_SUCCESS" ? "Receipt" : "Alert"} via ${testChannel}`);
        fetchSandboxEmails();
        setTimeout(() => setTestStatus(null), 4000);
      } else {
        setTestStatus("❌ Dispatch failed");
      }
    } catch (e) {
      setTestStatus("❌ Dispatch error");
    }
  };

  const handleSendSandboxSample = async (type: "PAYMENT_FAILED" | "PAYMENT_SUCCESS") => {
    setSandboxActionStatus("Generating sample email in Sandbox...");
    try {
      const response = await fetch("/api/notifications/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: type,
          recipientName: type === "PAYMENT_FAILED" ? "Aditya Verma" : "Sneha Kapoor",
          recipientEmail: type === "PAYMENT_FAILED" ? "aditya.v@company.in" : "sneha.k@enterprise.in",
          amount: type === "PAYMENT_FAILED" ? 8999 : 5499,
          currency: "INR",
          failureReason: "Card declined by issuing bank (3DS timeout)",
          paymentLink: "http://localhost:3000/recover/demo-sample",
          razorpayPaymentId: "pay_test_sample_" + Math.random().toString(36).substring(2, 7),
        }),
      });

      const data = await response.json();
      if (data.success && data.emails) {
        setSandboxEmails(data.emails);
        setSelectedSandboxEmail(data.emails[0]);
        setSandboxActionStatus("✅ New email delivered to Sandbox inbox");
        setTimeout(() => setSandboxActionStatus(null), 3000);
      }
    } catch (e) {
      setSandboxActionStatus("❌ Failed to generate sandbox email");
    }
  };

  const handleClearSandbox = async () => {
    if (!confirm("Are you sure you want to clear the Email Sandbox inbox?")) return;
    try {
      const res = await fetch("/api/notifications/sandbox", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSandboxEmails([]);
        setSelectedSandboxEmail(null);
      }
    } catch (e) {
      console.error("Clear sandbox failed:", e);
    }
  };

  // Filter sandbox emails
  const filteredSandboxEmails = sandboxEmails.filter((email) => {
    if (sandboxFilter !== "ALL" && email.eventType !== sandboxFilter) return false;
    if (sandboxSearch.trim().length > 0) {
      const q = sandboxSearch.toLowerCase();
      return (
        email.subject?.toLowerCase().includes(q) ||
        email.to?.toLowerCase().includes(q) ||
        email.toName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "overview"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <Icon name="trend" size={18} />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "payments"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <Icon name="card" size={18} />
              Payments
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "customers"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <Icon name="users" size={18} />
              Customers
            </button>

            <button
              onClick={() => setActiveTab("ai-agent")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "ai-agent"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <Icon name="sparkle" size={18} />
              AI Agent &amp; Notifications
            </button>

            <button
              onClick={() => {
                setActiveTab("sandbox");
                fetchSandboxEmails();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "sandbox"
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon name="inbox" size={18} />
                <span>Email Sandbox</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${activeTab === "sandbox"
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                  }`}
              >
                {sandboxEmails.length}
              </span>
            </button>

            <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              System
            </p>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${activeTab === "settings"
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
            <p className="text-sm font-semibold">Multi-channel recovery online</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Employee Action Hub, Email Sandbox &amp; Cash Settlement ready.
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
                {activeTab === "ai-agent" && "AI Agent & Multi-Channel Recovery"}
                {activeTab === "sandbox" && "Email Sandbox Hub"}
                {activeTab === "settings" && "System & Integration Settings"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab("sandbox");
                  fetchSandboxEmails();
                }}
                className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:flex"
              >
                <span>📧 Sandbox Inbox</span>
                <span className="rounded-full bg-slate-950 px-1.5 py-0.2 text-[10px] text-white">
                  {sandboxEmails.length}
                </span>
              </button>

              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-600">
                  System operational
                </span>
              </div>

              {/* Functional User Profile Button */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white hover:ring-2 hover:ring-slate-400 hover:ring-offset-2 transition-all shadow-sm"
                title="View Employee Profile (Ujjwal Rajput)"
              >
                UR
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
            {/* Dashboard Toast Alert */}
            {dashboardToast && (
              <div className="flex items-center justify-between rounded-xl bg-slate-950 px-5 py-3.5 text-xs font-semibold text-white shadow-lg border border-slate-800 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{dashboardToast}</span>
                </div>
                <button
                  onClick={() => setDashboardToast(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ===================== TAB: OVERVIEW ===================== */}
            {activeTab === "overview" && (
              <>
                {/* Hero */}
                <div className="overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                        <Icon name="sparkle" size={14} />
                        AI-powered multi-channel recovery
                      </div>

                      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Recover revenue that would otherwise be lost.
                      </h2>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                        Your AI agent monitors failed payments, generates targeted
                        Email &amp; SMS recovery links, and supports instant cash settlement.
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Failed &amp; Actionable payments</h3>
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                            {activeFailedPayments.length} failed
                          </span>
                          {recentRecovered.length > 0 && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              {recentRecovered.length} recently recovered
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Showing active failed payments alongside recent recoveries. Older recovered records are stored in Payments.
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveTab("payments")}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 shrink-0"
                      >
                        View all ({payments.length}) &rarr;
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
                          {overviewPayments.map((payment) => {
                            const latestAttempt = payment.recoveryAttempts?.[0];
                            const isCaptured =
                              payment.status === "CAPTURED" ||
                              payment.recoveryAttempts?.some(
                                (attempt: any) => attempt.status === "RECOVERED"
                              );

                            return (
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
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${isCaptured
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                      }`}
                                  >
                                    {payment.status}
                                  </span>
                                </td>

                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {isCaptured ? (
                                      <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                        Recovered
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleOpenRecoveryModal(payment)}
                                        className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                      >
                                        Recover &rarr;
                                      </button>
                                    )}

                                    {latestAttempt && (
                                      <button
                                        onClick={() =>
                                          setPreviewNotification({
                                            payment,
                                            attempt: latestAttempt,
                                            format:
                                              latestAttempt.channel === "SMS"
                                                ? "SMS"
                                                : latestAttempt.channel === "WHATSAPP"
                                                  ? "WHATSAPP"
                                                  : "EMAIL",
                                          })
                                        }
                                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                        title="Preview dispatched message"
                                      >
                                        📩
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                            Live multi-channel dispatches
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
                                        ? `Notification dispatched (${latestAttempt.channel})`
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
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${paymentFilter === "ALL"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      All ({payments.length})
                    </button>
                    <button
                      onClick={() => setPaymentFilter("FAILED")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${paymentFilter === "FAILED"
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      Failed ({payments.filter((p) => p.status === "FAILED").length})
                    </button>
                    <button
                      onClick={() => setPaymentFilter("CAPTURED")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${paymentFilter === "CAPTURED"
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
                            Failure Reason &amp; Code
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </th>
                          <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Action &amp; Message
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment) => {
                          const latestAttempt = payment.recoveryAttempts?.[0];
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
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${isCaptured
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                    }`}
                                >
                                  {payment.status}
                                </span>
                              </td>

                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  {isCaptured ? (
                                    <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                      Recovered
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenRecoveryModal(payment)}
                                      className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                                    >
                                      Recover &rarr;
                                    </button>
                                  )}

                                  {latestAttempt && (
                                    <button
                                      onClick={() =>
                                        setPreviewNotification({
                                          payment,
                                          attempt: latestAttempt,
                                          format:
                                            latestAttempt.channel === "SMS"
                                              ? "SMS"
                                              : latestAttempt.channel === "WHATSAPP"
                                                ? "WHATSAPP"
                                                : "EMAIL",
                                        })
                                      }
                                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                      title="Preview sent message"
                                    >
                                      View {latestAttempt.channel}
                                    </button>
                                  )}
                                </div>
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

            {/* ===================== TAB: AI AGENT & NOTIFICATIONS ===================== */}
            {activeTab === "ai-agent" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    AI Agent &amp; Notification Engine
                  </h2>
                  <p className="text-xs text-slate-400">
                    Decision engine configuration, multi-channel templates, and manual test dispatcher.
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
                          Active Decision Layer
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      Evaluates customer lifetime value, historical failure frequency,
                      and selects between Email, SMS, WhatsApp, and Payment Link retry.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                        <Icon name="mail" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">HTML Email Sandbox</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Responsive 1-Click Retry
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      Renders inline-styled HTML templates with order summary, failure
                      reasons, and direct Razorpay checkout deep links.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                        <Icon name="smartphone" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">SMS &amp; WhatsApp</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Instant Mobile Delivery
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      160-char SMS copy and rich WhatsApp message formats with 1-click
                      recovery links for high urgency transactions.
                    </p>
                  </div>
                </div>

                {/* Manual Test Dispatcher Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-950">
                    Live Notification Test Dispatcher
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Send a test notification payload across Email Sandbox, SMS, or WhatsApp.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-4">
                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Event Type
                      </label>
                      <select
                        value={testEventType}
                        onChange={(e: any) => setTestEventType(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
                      >
                        <option value="PAYMENT_FAILED">⚠️ Payment Failure Alert</option>
                        <option value="PAYMENT_SUCCESS">✅ Payment Success Receipt</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Channel
                      </label>
                      <select
                        value={testChannel}
                        onChange={(e: any) => setTestChannel(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800"
                      >
                        <option value="EMAIL">Email (Sandbox &amp; HTML)</option>
                        <option value="SMS">SMS (160-char Text)</option>
                        <option value="WHATSAPP">WhatsApp (Rich Message)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-500">
                        Recipient Phone
                      </label>
                      <input
                        type="text"
                        value={testPhone}
                        onChange={(e) => setTestPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <button
                      onClick={handleSendTestNotification}
                      className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      Dispatch Test Notification
                    </button>
                    {testStatus && (
                      <span className="text-xs font-medium text-slate-600">
                        {testStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold">AI Decision Rules &amp; Channel Routing</h3>
                  <div className="mt-4 divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Insufficient Funds (Loyal Customer)
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                        78% Probability &rarr; WhatsApp + Payment Link
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Gateway / Bank Timeout
                      </span>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                        85% Probability &rarr; SMS + Instant Session Link
                      </span>
                    </div>
                    <div className="py-3 flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        Card Declined (New Customer)
                      </span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
                        45% Probability &rarr; HTML Email + Multi-Gateway Link
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB: EMAIL SANDBOX ===================== */}
            {activeTab === "sandbox" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Icon name="inbox" size={22} />
                      Email Sandbox Hub
                    </h2>
                    <p className="text-xs text-slate-400">
                      Inspect all captured outgoing recovery &amp; receipt emails in real time.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleSendSandboxSample("PAYMENT_FAILED")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      ⚡ Sample Failure Alert
                    </button>
                    <button
                      onClick={() => handleSendSandboxSample("PAYMENT_SUCCESS")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      ⚡ Sample Receipt
                    </button>
                    <button
                      onClick={handleClearSandbox}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Clear Inbox
                    </button>
                  </div>
                </div>

                {sandboxActionStatus && (
                  <div className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-medium text-white shadow-sm">
                    {sandboxActionStatus}
                  </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                  {/* Left: Sandbox Email List */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[650px] overflow-hidden">
                    <div className="p-4 border-b border-slate-100 space-y-3">
                      <input
                        type="text"
                        placeholder="Search emails or recipients..."
                        value={sandboxSearch}
                        onChange={(e) => setSandboxSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400"
                      />

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSandboxFilter("ALL")}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${sandboxFilter === "ALL"
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          All ({sandboxEmails.length})
                        </button>
                        <button
                          onClick={() => setSandboxFilter("PAYMENT_FAILED")}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${sandboxFilter === "PAYMENT_FAILED"
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          Alerts
                        </button>
                        <button
                          onClick={() => setSandboxFilter("PAYMENT_SUCCESS")}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${sandboxFilter === "PAYMENT_SUCCESS"
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                          Receipts
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {filteredSandboxEmails.map((email) => {
                        const isSelected = selectedSandboxEmail?.id === email.id;
                        const isSuccess = email.eventType === "PAYMENT_SUCCESS";

                        return (
                          <div
                            key={email.id}
                            onClick={() => setSelectedSandboxEmail(email)}
                            className={`p-4 cursor-pointer transition-colors ${isSelected ? "bg-slate-100/90 border-l-4 border-slate-950" : "hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isSuccess
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                  }`}
                              >
                                {isSuccess ? "✓ Receipt" : "⚠️ Failure Alert"}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(email.sentAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <p className="mt-2 text-xs font-semibold text-slate-900 truncate">
                              {email.toName} ({email.to})
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 font-medium truncate">
                              {email.subject}
                            </p>
                            <p className="mt-1.5 text-[11px] font-bold text-slate-800">
                              INR {email.amount?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        );
                      })}

                      {filteredSandboxEmails.length === 0 && (
                        <div className="p-8 text-center text-xs text-slate-400">
                          No captured emails found in Sandbox.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Sandbox Email Inspector */}
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-[650px] overflow-hidden">
                    {selectedSandboxEmail ? (
                      <>
                        {/* Delivery Metadata Bar */}
                        <div className="bg-slate-950 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md px-2.5 py-0.5 font-mono text-[11px]">
                              ● {selectedSandboxEmail.status}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              Latency: {selectedSandboxEmail.latencyMs}ms
                            </span>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
                            <span>SPF: PASS</span>
                            <span>DKIM: PASS</span>
                            <span className="text-slate-500">Gateway: Sandbox</span>
                          </div>
                        </div>

                        {/* Email Headers Section */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
                          <h3 className="text-base font-bold text-slate-950">
                            {selectedSandboxEmail.subject}
                          </h3>

                          <div className="mt-3 grid gap-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-400 w-12">From:</span>
                              <span className="font-medium text-slate-800">{selectedSandboxEmail.from}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-400 w-12">To:</span>
                              <span className="font-medium text-slate-800">
                                {selectedSandboxEmail.toName} &lt;{selectedSandboxEmail.to}&gt;
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-400 w-12">Date:</span>
                              <span className="text-slate-500">
                                {new Date(selectedSandboxEmail.sentAt).toLocaleString("en-IN", {
                                  dateStyle: "full",
                                  timeStyle: "medium",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-2 bg-white text-xs">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSandboxViewMode("VISUAL")}
                              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${sandboxViewMode === "VISUAL"
                                  ? "bg-slate-950 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                              Visual Preview
                            </button>
                            <button
                              onClick={() => setSandboxViewMode("RAW_HTML")}
                              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${sandboxViewMode === "RAW_HTML"
                                  ? "bg-slate-950 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                              Raw HTML Source
                            </button>
                            <button
                              onClick={() => setSandboxViewMode("PLAIN_TEXT")}
                              className={`rounded-lg px-3 py-1 font-semibold transition-colors ${sandboxViewMode === "PLAIN_TEXT"
                                  ? "bg-slate-950 text-white"
                                  : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                              Plain Text
                            </button>
                          </div>

                          {selectedSandboxEmail.paymentLink && (
                            <a
                              href={selectedSandboxEmail.paymentLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-slate-950 px-3 py-1 font-semibold text-white hover:bg-slate-800 text-xs inline-flex items-center gap-1.5"
                            >
                              Customer Razorpay Link &rarr;
                            </a>
                          )}
                        </div>

                        {/* Email Body Inspector */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
                          {sandboxViewMode === "VISUAL" && (
                            <div className="rounded-xl border border-slate-200 bg-white shadow-inner h-full">
                              <iframe
                                title="Visual Sandbox Email"
                                srcDoc={selectedSandboxEmail.html}
                                className="w-full h-full min-h-[360px] border-0 rounded-xl"
                              />
                            </div>
                          )}

                          {sandboxViewMode === "RAW_HTML" && (
                            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed h-full">
                              {selectedSandboxEmail.html}
                            </pre>
                          )}

                          {sandboxViewMode === "PLAIN_TEXT" && (
                            <div className="p-5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap h-full">
                              {selectedSandboxEmail.text}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                        Select an email from the left pane to inspect.
                      </div>
                    )}
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
                    Razorpay Gateway, Notification Dispatcher, and Environment configurations.
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
                      Notification Delivery Engine
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Email, SMS, and WhatsApp dispatch configurations.
                    </p>

                    <div className="mt-5 space-y-4 text-xs">
                      <div>
                        <label className="font-medium text-slate-500">
                          Email Dispatch Provider
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="RevenueAI Email Sandbox Hub (Active)"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Mobile SMS &amp; WhatsApp Gateway
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            Zero-Downtime Multi-Channel Gateway
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium text-slate-500">
                          Primary AI Model
                        </label>
                        <p className="mt-1 text-slate-600">
                          Google Gemini 2.5 Flash + Deterministic Heuristics.
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

      {/* ===================== EMPLOYEE PROFILE MODAL ===================== */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="relative bg-slate-950 p-6 text-white">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-xl font-bold text-white shadow-lg">
                  UR
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">Ujjwal Rajput</h3>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      Verified Operations Lead
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Lead Revenue Recovery Engineer</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ujjwal.rajput@revenueai.dev</p>
                </div>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6 space-y-5 bg-white">
              {/* Employee Key Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Recoveries</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">38</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cash Settled</p>
                  <p className="mt-1 text-lg font-bold text-slate-950">14</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Vol</p>
                  <p className="mt-1 text-lg font-bold text-emerald-600 font-mono">₹3.42L</p>
                </div>
              </div>

              {/* Detail list */}
              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="font-medium text-slate-500">Employee ID:</span>
                  <span className="font-mono font-semibold text-slate-900">REV-8492</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-medium text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-900">Fintech &amp; Payment Operations</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-medium text-slate-500">Clearance Level:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Level 3 - Settlement &amp; Dispatch Admin
                  </span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-medium text-slate-500">Workstation IP / Session:</span>
                  <span className="font-mono text-slate-600">192.168.1.42 (Active APAC-1)</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
                  Operational Permissions:
                </p>
                <p className="text-emerald-700 flex items-center gap-1.5">
                  ✓ AI Recovery Strategy Analysis &amp; Channel Selection
                </p>
                <p className="text-emerald-700 flex items-center gap-1.5">
                  ✓ Multi-Channel Customer Email &amp; SMS Dispatch
                </p>
                <p className="text-emerald-700 flex items-center gap-1.5">
                  ✓ Offline Cash Settlement Authorization
                </p>
                <p className="text-emerald-700 flex items-center gap-1.5">
                  ✓ Real-time Email Sandbox Hub Telemetry Access
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">Signed in as Lead Admin</span>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EMPLOYEE RECOVERY ACTION MODAL ===================== */}
      {recoveryModalPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Icon name="sparkle" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Payment Recovery Operations
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select recovery option for {recoveryModalPayment.customer?.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setRecoveryModalPayment(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Target Payment Summary */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Amount Due:</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  INR {recoveryModalPayment.amount?.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Customer: <span className="font-semibold">{recoveryModalPayment.customer?.name}</span> ({recoveryModalPayment.customer?.email})
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 text-[11px] font-semibold">
                  Failed: {recoveryModalPayment.failureReason || "Declined"}
                </span>
              </div>
            </div>

            {/* Action Feedback Banner */}
            {recoveryActionMessage && (
              <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 text-xs font-medium text-slate-800">
                {recoveryActionMessage}
              </div>
            )}

            {/* 2 Recovery Options */}
            <div className="p-6 space-y-6 bg-slate-50/50">
              {/* Option 1: Send Notification with Recovery Link */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                      <Icon name="mail" size={17} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Option 1: Send Recovery Link via Email &amp; SMS
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Automated AI delivery with Razorpay 1-click retry link.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Sends an instant recovery email &amp; SMS containing the secure customer checkout link.
                  The dispatched email will also be captured in our <strong>Email Sandbox Hub</strong>.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Recipient: {recoveryModalPayment.customer?.email}
                  </span>

                  <button
                    onClick={handleSendCustomerRecoveryNotification}
                    disabled={recoveryActionProcessing}
                    className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    <span>🚀 Send Notification Link</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Payment Done by Cash (Offline Settlement) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Icon name="cash" size={17} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Option 2: Payment Done by Cash (Offline Settlement)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Record cash collection &amp; immediately capture payment.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Instant Capture
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Mark this transaction as settled in cash. This updates the status to <strong>CAPTURED</strong> in SQLite,
                  updates customer lifetime spend, and sends a cash receipt to the customer.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Cash Receipt Reference No.
                    </label>
                    <input
                      type="text"
                      value={cashReference}
                      onChange={(e) => setCashReference(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Collector Notes
                    </label>
                    <input
                      type="text"
                      value={cashNotes}
                      onChange={(e) => setCashNotes(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleRecordCashSettlement(cashReference, cashNotes)}
                    disabled={recoveryActionProcessing}
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 flex items-center gap-1.5"
                  >
                    <span>💵 Confirm Cash Settlement</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Authorized by Ujjwal Rajput (REV-8492)
              </span>
              <button
                onClick={() => setRecoveryModalPayment(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== NOTIFICATION PREVIEW MODAL ===================== */}
      {previewNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Icon name="mail" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Dispatched Recovery Notification
                  </h3>
                  <p className="text-xs text-slate-400">
                    To: {previewNotification.payment.customer?.name} ({previewNotification.payment.customer?.email})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewNotification(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Template & Channel Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 px-6 py-2.5 gap-2 bg-white text-xs">
              <div className="flex gap-1.5">
                <button
                  onClick={() =>
                    setPreviewNotification({
                      ...previewNotification,
                      payment: {
                        ...previewNotification.payment,
                        status: "FAILED",
                      },
                    })
                  }
                  className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${previewNotification.payment.status === "FAILED"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  ⚠️ Failure Alert
                </button>
                <button
                  onClick={() =>
                    setPreviewNotification({
                      ...previewNotification,
                      payment: {
                        ...previewNotification.payment,
                        status: "CAPTURED",
                      },
                    })
                  }
                  className={`rounded-lg px-2.5 py-1.5 font-semibold transition-colors ${previewNotification.payment.status === "CAPTURED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  ✅ Success Receipt
                </button>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() =>
                    setPreviewNotification({
                      ...previewNotification,
                      format: "EMAIL",
                    })
                  }
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${previewNotification.format === "EMAIL"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  📧 HTML Email
                </button>
                <button
                  onClick={() =>
                    setPreviewNotification({
                      ...previewNotification,
                      format: "SMS",
                    })
                  }
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${previewNotification.format === "SMS"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  📱 SMS Text
                </button>
                <button
                  onClick={() =>
                    setPreviewNotification({
                      ...previewNotification,
                      format: "WHATSAPP",
                    })
                  }
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${previewNotification.format === "WHATSAPP"
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {previewNotification.format === "EMAIL" && (
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-inner">
                  <iframe
                    title="Email Preview"
                    srcDoc={
                      previewNotification.payment.status === "CAPTURED"
                        ? generatePaymentSuccessEmailHtml({
                          recipientName:
                            previewNotification.payment.customer?.name ||
                            "Customer",
                          recipientEmail:
                            previewNotification.payment.customer?.email ||
                            "customer@example.com",
                          amount: previewNotification.payment.amount,
                          currency:
                            previewNotification.payment.currency || "INR",
                          paymentId: previewNotification.payment.id,
                          razorpayPaymentId:
                            previewNotification.payment.razorpayPaymentId ||
                            "pay_test_verified88",
                          paidAt: new Date(),
                        })
                        : generatePaymentFailedEmailHtml({
                          recipientName:
                            previewNotification.payment.customer?.name ||
                            "Customer",
                          recipientEmail:
                            previewNotification.payment.customer?.email ||
                            "customer@example.com",
                          amount: previewNotification.payment.amount,
                          currency:
                            previewNotification.payment.currency || "INR",
                          failureReason:
                            previewNotification.payment.failureReason,
                          paymentLink: `http://localhost:3000/recover/${previewNotification.payment.id}`,
                          customMessage: previewNotification.attempt?.message,
                        })
                    }
                    className="w-full h-[380px] border-0 rounded-lg"
                  />
                </div>
              )}

              {previewNotification.format === "SMS" && (
                <div className="mx-auto max-w-sm rounded-3xl border-4 border-slate-300 bg-slate-100 p-4 shadow-md">
                  <div className="mb-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Messages · RevenueAI
                  </div>
                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed text-white shadow-sm ${previewNotification.payment.status === "CAPTURED"
                        ? "bg-slate-900"
                        : "bg-emerald-600"
                      }`}
                  >
                    {previewNotification.payment.status === "CAPTURED"
                      ? generatePaymentSuccessSmsText({
                        recipientName:
                          previewNotification.payment.customer?.name ||
                          "Customer",
                        recipientEmail:
                          previewNotification.payment.customer?.email ||
                          "customer@example.com",
                        amount: previewNotification.payment.amount,
                        currency:
                          previewNotification.payment.currency || "INR",
                        razorpayPaymentId:
                          previewNotification.payment.razorpayPaymentId ||
                          "pay_test_verified88",
                      })
                      : generatePaymentFailedSmsText({
                        recipientName:
                          previewNotification.payment.customer?.name ||
                          "Customer",
                        recipientEmail:
                          previewNotification.payment.customer?.email ||
                          "customer@example.com",
                        amount: previewNotification.payment.amount,
                        currency:
                          previewNotification.payment.currency || "INR",
                        failureReason:
                          previewNotification.payment.failureReason,
                        paymentLink: `http://localhost:3000/recover/${previewNotification.payment.id}`,
                      })}
                  </div>
                  <div className="mt-2 text-right text-[10px] text-slate-400">
                    Delivered · Just now
                  </div>
                </div>
              )}

              {previewNotification.format === "WHATSAPP" && (
                <div className="mx-auto max-w-sm rounded-3xl border-4 border-slate-300 bg-[#e5ddd5] p-4 shadow-md">
                  <div className="mb-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    WhatsApp · RevenueAI Agent
                  </div>
                  <div className="rounded-2xl bg-white p-4 text-xs leading-relaxed text-slate-900 shadow-sm whitespace-pre-line border-l-4 border-emerald-500">
                    {previewNotification.payment.status === "CAPTURED"
                      ? generatePaymentSuccessWhatsAppText({
                        recipientName:
                          previewNotification.payment.customer?.name ||
                          "Customer",
                        recipientEmail:
                          previewNotification.payment.customer?.email ||
                          "customer@example.com",
                        amount: previewNotification.payment.amount,
                        currency:
                          previewNotification.payment.currency || "INR",
                        razorpayPaymentId:
                          previewNotification.payment.razorpayPaymentId ||
                          "pay_test_verified88",
                        paidAt: new Date(),
                      })
                      : generatePaymentFailedWhatsAppText({
                        recipientName:
                          previewNotification.payment.customer?.name ||
                          "Customer",
                        recipientEmail:
                          previewNotification.payment.customer?.email ||
                          "customer@example.com",
                        amount: previewNotification.payment.amount,
                        currency:
                          previewNotification.payment.currency || "INR",
                        failureReason:
                          previewNotification.payment.failureReason,
                        paymentLink: `http://localhost:3000/recover/${previewNotification.payment.id}`,
                      })}
                  </div>
                  <div className="mt-2 text-right text-[10px] text-slate-500 font-medium">
                    ✓✓ Read · Just now
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-white">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Status: DELIVERED
              </span>

              <div className="flex items-center gap-3">
                <a
                  href={`/recover/${previewNotification.payment.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Open Recovery Checkout &rarr;
                </a>
                <button
                  onClick={() => setPreviewNotification(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
