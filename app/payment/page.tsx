"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Script from "next/script";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const planAmount = 4800; // 4800 naira
  const planAmountKobo = planAmount * 100; // Convert to kobo

  useEffect(() => {
    // Wait for auth to load
    if (!authLoading) {
      setInitialized(true);
      // If no user after auth loads, redirect to signup
      if (!user) {
        router.push("/auth/signup");
      }
    }
  }, [authLoading, user, router]);

  const initiatePayment = async () => {
    if (!user?.email || !user?.id) {
      setError("User information not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Initialize payment with backend
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Check if user is admin or already paid
      if (data.status === "admin") {
        // Admin user - skip payment and redirect to onboarding
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/onboarding");
        return;
      }

      if (data.status === "already_paid") {
        setSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/onboarding");
        return;
      }

      setPaymentData(data);

      // Step 2: Open Paystack payment modal
      if (!window.PaystackPop) {
        setError("Payment system loading. Please try again in a moment.");
        setLoading(false);
        return;
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: planAmountKobo,
        ref: data.reference,
        currency: "NGN",
        onClose: () => {
          setLoading(false);
          setError("Payment window closed");
        },
        onSuccess: async (response: any) => {
          // Step 3: Verify payment
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference: response.reference,
              subscriptionId:
                paymentData?.subscriptionId || data.subscriptionId,
            }),
          });

          if (!verifyResponse.ok) {
            const errorData = await verifyResponse.json();
            setError(errorData.error || "Payment verification failed");
            setLoading(false);
            return;
          }

          const verifyData = await verifyResponse.json();

          if (verifyData.status === "success") {
            setSuccess(true);
            // Redirect to onboarding after successful payment
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push("/onboarding");
          } else {
            setError(verifyData.error || "Payment verification failed");
            setLoading(false);
          }
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during payment"
      );
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-sky-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onError={(e) => {
          // Suppress Paystack library warnings
          console.debug("Paystack script loaded with non-blocking warnings");
        }}
      />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ShopZa</h1>
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Successful!
              </h2>
              <p className="text-center text-sm text-gray-600">
                Your subscription is now active. Redirecting to setup...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                Activate Your Shop
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                One-time payment to get started
              </p>

              <div className="mt-8 flex flex-col gap-6">
                {/* Plan Card */}
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Starter Plan
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get full access to ShopZa
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-sky-600">
                      ₦{planAmount}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create your shop
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add products
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Share one link everywhere
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-700">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Track all your orders
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                <button
                  onClick={initiatePayment}
                  disabled={loading}
                  className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₦${planAmount} to Get Started`}
                </button>

                <p className="text-center text-xs text-gray-500">
                  You'll be redirected to Paystack to complete your payment
                  securely
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
