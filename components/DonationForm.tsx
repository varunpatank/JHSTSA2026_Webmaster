"use client";

import { useState } from "react";
import Link from "next/link";
import { chapters } from "@/lib/data";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Heart,
  Lock,
  Receipt,
  Shield,
  Tag,
  Users,
} from "lucide-react";

const presetAmounts = [5, 10, 25, 50, 100];

export default function DonationForm({
  selectedClub,
  initialSuccess,
  compact,
  returnPath,
}: {
  selectedClub?: { id: string; name: string };
  initialSuccess?: boolean;
  compact?: boolean;
  returnPath?: string;
}) {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [clubId, setClubId] = useState(selectedClub?.id || "");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(initialSuccess || false);
  const [error, setError] = useState("");

  const effectiveAmount = promoApplied ? 0 : amount;
  const selectedClubData = chapters.find((c) => c.id === clubId);

  const VALID_PROMO_CODES = ["test", "judge2026"];

  const applyPromo = () => {
    setPromoError("");
    if (VALID_PROMO_CODES.includes(promoCode.toLowerCase().trim())) {
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promo code. Try again.");
      setPromoApplied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          clubName: selectedClubData?.name || "",
          donorEmail,
          donorName: isAnonymous ? "Anonymous" : donorName,
          message,
          isRecurring,
          promoApplied,
          returnPath: returnPath || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Unexpected response. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="card p-8 text-center bg-white max-w-lg mx-auto animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-heading font-bold text-primary-800">
          Thank You!
        </h2>
        <p className="mt-2 text-neutral-600">
          {`Your donation${selectedClubData ? ` to ${selectedClubData.name}` : ""} has been processed. Thank you for your generosity!`}
        </p>
        <div className="mt-4 p-4 bg-neutral-50 text-sm text-neutral-600 text-left space-y-1">
          <p>
            <strong>Amount:</strong> ${effectiveAmount.toFixed(2)}
          </p>
          {selectedClubData && (
            <p>
              <strong>Recipient:</strong> {selectedClubData.name}
            </p>
          )}
          <p>
            <strong>Receipt sent to:</strong> {donorEmail || "N/A"}
          </p>
          <p>
            <strong>Processor:</strong> Stripe
          </p>
        </div>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => {
              setSuccess(false);
              setAmount(25);
              setPromoCode("");
              setPromoApplied(false);
            }}
            className="btn-primary"
          >
            Make Another Donation
          </button>
          <Link href="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ── COMPACT MODE (sidebar) ────────────────────────────────────────
  if (compact) {
    if (success) {
      return (
        <div className="text-center py-3">
          <CheckCircle size={24} className="mx-auto text-green-500 mb-2" />
          <p className="text-xs font-bold text-primary-800">Thank you!</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Donation processed via Stripe.</p>
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {error && <div className="p-2 bg-red-50 border border-red-200 text-[10px] text-red-700">{error}</div>}
        <div className="grid grid-cols-5 gap-1">
          {presetAmounts.map(a => (
            <button key={a} type="button"
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className={`py-1.5 rounded-lg font-bold text-[10px] transition-all border ${amount === a && !customAmount ? "bg-primary-900 text-white border-primary-900" : "bg-cream-50 text-primary-800 hover:bg-primary-50 border-cream-300"}`}>
              ${a}
            </button>
          ))}
        </div>
        <div className="relative">
          <DollarSign size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="number" min="1" placeholder="Custom amount"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); if (e.target.value) setAmount(Math.max(1, parseInt(e.target.value) || 0)); }}
            className="w-full border border-cream-300 rounded-lg pl-7 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary-400"
          />
        </div>
        <input type="email" placeholder="Email (for receipt)"
          value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
          className="w-full border border-cream-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary-400"
        />
        <input type="text" placeholder="Promo code (optional)"
          value={promoCode}
          onChange={e => { setPromoCode(e.target.value); setPromoApplied(false); setPromoError(""); }}
          onBlur={() => { const v = promoCode.toLowerCase().trim(); if (["test","judge2026"].includes(v)) { setPromoApplied(true); setPromoError(""); } else if (promoCode) setPromoError("Invalid code"); }}
          className="w-full border border-cream-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary-400"
        />
        {promoApplied && <p className="text-[10px] text-green-600 font-medium flex items-center gap-1"><CheckCircle size={10} /> Code applied — $0 charge</p>}
        {promoError && <p className="text-[10px] text-red-600">{promoError}</p>}
        <button type="submit" disabled={processing}
          className="w-full py-2 rounded-xl bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60">
          {processing ? "Processing…" : `Donate $${effectiveAmount.toFixed(2)}`}
        </button>
        <p className="text-[9px] text-neutral-400 flex items-center justify-center gap-1"><Lock size={8} /> Secured by Stripe</p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200  text-sm text-red-700">
          {error}
        </div>
      )}

      {}
      <div className="card p-6 bg-white">
        <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
          <Heart size={18} /> Donation Recipient
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Choose which club or fund will receive your donation.
        </p>
        <select
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="select-field mt-3"
        >
          <option value="">General School Club Fund</option>
          {chapters.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="card p-6 bg-white">
        <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
          <DollarSign size={18} /> Donation Amount
        </h2>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {presetAmounts.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAmount(a);
                setCustomAmount("");
              }}
              className={`py-3  font-bold text-sm transition-all ${
                amount === a && !customAmount
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary-700 border border-neutral-200"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label className="block text-sm font-semibold text-neutral-700 mb-1">
            Custom amount
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value)
                  setAmount(Math.max(1, parseInt(e.target.value) || 0));
              }}
              className="input-field pl-8"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-neutral-600 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="rounded border-neutral-300 text-primary-600"
          />
          Make this a monthly recurring donation
        </label>
      </div>

      {}
      <div className="card p-6 bg-gradient-to-br from-secondary-50/60 to-white border-secondary-100">
        <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
          <Tag size={16} /> Promo Code
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Judges: use code <strong>&quot;test&quot;</strong> to complete a $0
          demo transaction and see the full Stripe payment flow.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoApplied(false);
              setPromoError("");
            }}
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="btn-outline text-sm px-4"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
            <CheckCircle size={14} /> Demo code applied — $0 charge
          </p>
        )}
        {promoError && (
          <p className="mt-2 text-sm text-red-600">{promoError}</p>
        )}
      </div>

      {}
      <div className="card p-6 bg-white">
        <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
          <Users size={18} /> Your Information
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Your name"
              className="input-field"
              required={!isAnonymous}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="you@school.edu"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to the club..."
              className="input-field min-h-[60px] resize-none"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600"
            />
            Donate anonymously
          </label>
        </div>
      </div>

      {}
      <div className="card p-6 bg-white">
        <h2 className="text-xl font-heading font-bold text-primary-600 flex items-center gap-2">
          <CreditCard size={18} /> Payment
        </h2>
        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
          <Lock size={12} />
          <span>Secured by Stripe · 256-bit SSL encryption</span>
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          {promoApplied
            ? "Demo mode — no card needed. Click below to complete the $0 demo transaction."
            : "You'll be securely redirected to Stripe Checkout to enter your card details."}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex gap-1">
            {["Visa", "Mastercard", "Amex", "Discover"].map((brand) => (
              <span
                key={brand}
                className="text-[10px] px-2 py-1 bg-neutral-100 rounded border border-neutral-200 text-neutral-600"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="card p-6 bg-gradient-to-br from-primary-50/60 to-white border-primary-100">
        <h2 className="text-lg font-heading font-bold text-primary-600 flex items-center gap-2">
          <Receipt size={16} /> Summary
        </h2>
        <div className="mt-3 space-y-2 text-sm text-neutral-700">
          <div className="flex justify-between">
            <span>Donation amount</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          {selectedClubData && (
            <div className="flex justify-between">
              <span>Recipient</span>
              <span className="font-semibold">{selectedClubData.name}</span>
            </div>
          )}
          {promoApplied && (
            <div className="flex justify-between text-green-600">
              <span>Promo: TEST</span>
              <span className="font-semibold">-${amount.toFixed(2)}</span>
            </div>
          )}
          {isRecurring && (
            <div className="flex justify-between text-primary-600">
              <span>Recurring</span>
              <span>Monthly</span>
            </div>
          )}
          <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-primary-800">
            <span>Total</span>
            <span>${effectiveAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {}
      <button
        type="submit"
        disabled={processing}
        className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {processing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing with Stripe...
          </>
        ) : (
          <>
            <Shield size={18} />
            {promoApplied
              ? "Complete Demo Transaction ($0)"
              : `Donate $${effectiveAmount.toFixed(2)} via Stripe`}
          </>
        )}
      </button>

      <p className="text-center text-xs text-neutral-400">
        Payments are processed securely through Stripe. ClubConnect does not
        store your card details.
      </p>
    </form>
  );
}
