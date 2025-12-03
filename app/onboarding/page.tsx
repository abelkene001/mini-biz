"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to load
    if (!authLoading) {
      if (!user) {
        router.push("/auth/signup");
        return;
      }

      // Check if user has active subscription
      checkSubscription();
    }
  }, [authLoading, user, router]);

  const checkSubscription = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/subscription/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        // If check fails, redirect to payment
        router.push("/payment");
        return;
      }

      const data = await response.json();

      if (!data.isActive) {
        // User doesn't have active subscription, redirect to payment
        router.push("/payment");
        return;
      }

      setInitialized(true);
      setSubscriptionLoading(false);
    } catch (error) {
      console.error("Error checking subscription:", error);
      // On error, redirect to payment to be safe
      router.push("/payment");
    }
  };

  const [formData, setFormData] = useState({
    businessName: "",
    whatsappNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewSlug, setPreviewSlug] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleBusinessNameChange = (value: string) => {
    setFormData({ ...formData, businessName: value });
    if (value) {
      setPreviewSlug(generateSlug(value));
    } else {
      setPreviewSlug("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    if (!formData.businessName.trim()) {
      setError("Business name is required");
      setLoading(false);
      return;
    }

    try {
      let slug = generateSlug(formData.businessName);
      if (!slug) slug = "shop";

      // Check for slug uniqueness
      let counter = 0;
      let uniqueSlug = slug;
      while (true) {
        const { data } = await supabase
          .from("shops")
          .select("id")
          .eq("slug", uniqueSlug)
          .limit(1)
          .maybeSingle();

        if (!data) break;
        counter++;
        uniqueSlug = `${slug}-${counter}`;
      }

      // Create shop
      const { error: shopError } = await supabase.from("shops").insert({
        user_id: user.id,
        name: formData.businessName,
        slug: uniqueSlug,
        whatsapp_number: formData.whatsappNumber,
        bank_name: formData.bankName,
        bank_account_number: formData.accountNumber,
        bank_account_name: formData.accountName,
      });

      if (shopError) throw shopError;

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message || "Failed to create shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Loading state while checking auth */}
        {!initialized && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-300 border-t-sky-600 mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}

        {initialized && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Set Up Your Shop
              </h1>
              <p className="mt-2 text-gray-600">Tell us about your business</p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                    {error}
                  </div>
                )}

                {/* Business Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Business Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          handleBusinessNameChange(e.target.value)
                        }
                        required
                        className="w-full rounded-lg border text-gray-900 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Amaka's Footwear"
                      />
                      {previewSlug && (
                        <p className="mt-2 text-sm text-gray-600">
                          Your shop URL:{" "}
                          <span className="font-medium text-gray-900">
                            shoplink.vercel.app/{previewSlug}
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whatsappNumber: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border border-gray-300 text-gray-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+234 801 234 5678"
                      />
                      <p className="mt-1 text-xs text-gray-900">
                        Customers will chat you here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Payment Details
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Customers will see these when paying for orders
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) =>
                          setFormData({ ...formData, bankName: e.target.value })
                        }
                        required
                        className="w-full rounded-lg border text-gray-900 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., GTBank, Access Bank"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accountNumber: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border text-gray-900 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1234567890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={formData.accountName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accountName: e.target.value,
                          })
                        }
                        required
                        className="w-full rounded-lg border text-gray-900 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 active:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating shop..." : "Continue to Dashboard"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
