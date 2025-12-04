"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get("reference");

        if (!reference) {
          setStatus("failed");
          setMessage("No payment reference found");
          return;
        }

        // Verify payment with backend
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference: reference,
          }),
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          setStatus("success");
          setMessage("Payment verified successfully!");
          // Redirect to onboarding after 2 seconds
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/onboarding");
        } else {
          setStatus("failed");
          setMessage(
            data.error || "Payment verification failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("failed");
        setMessage(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200 text-center">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ShopZa</h1>
        </div>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-sky-600"></div>
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        )}

        {status === "success" && (
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
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to setup...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => router.push("/payment")}
              className="mt-4 rounded-lg bg-sky-600 px-6 py-2 text-white font-semibold hover:bg-sky-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
