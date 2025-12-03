"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Shop {
  id: string;
  name: string;
  slug: string;
  whatsapp_number?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [copied, setCopied] = useState(false);

  const checkSubscription = useCallback(
    async (userId: string) => {
      try {
        const response = await fetch("/api/subscription/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
          }),
        });

        if (!response.ok) {
          // Redirect to payment if check fails
          router.push("/payment");
          return;
        }

        const data = await response.json();

        if (!data.isActive) {
          // Redirect to payment if no active subscription
          router.push("/payment");
          return;
        }

        setSubscriptionChecked(true);
      } catch (error) {
        console.error("Error checking subscription:", error);
        // On error, redirect to payment to be safe
        router.push("/payment");
      }
    },
    [router]
  );

  const fetchShop = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("shops")
        .select("id, name, slug, whatsapp_number")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setShop(data);

      // Fetch product count
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", data.id);

      setProductCount(count || 0);

      // Fetch orders stats (if orders table exists)
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("amount")
          .eq("shop_id", data.id);

        if (!ordersError && ordersData) {
          setOrderCount(ordersData.length);
          setTotalRevenue(
            ordersData.reduce((sum, order) => sum + (order.amount || 0), 0)
          );
        }
      } catch (err) {
        // Orders table might not exist yet, which is fine
        console.log("Orders table not yet created:", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShopLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && !subscriptionChecked) {
      checkSubscription(user.id);
    }
  }, [user, loading, router, subscriptionChecked, checkSubscription]);

  useEffect(() => {
    if (subscriptionChecked && user) {
      fetchShop();
    }
  }, [subscriptionChecked, user, fetchShop]);

  const shopUrl = shop
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${
        shop.slug
      }`
    : "Your shop URL will appear here";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shopUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || shopLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600 mb-4">
            Shop not found. Please complete onboarding first.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition-colors font-semibold"
          >
            Go to Onboarding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="py-6 sm:pb-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Hello, {shop.name}! 👋
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your products and share your WhatsApp shop
          </p>
        </div>

        {/* Shop Link Card */}
        <div className="mb-8 rounded-xl bg-linear-to-br from-primary-50 to-white border border-primary-200 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Shop Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={shopUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold whitespace-nowrap shadow-sm"
            >
              {copied ? "✓ Copied!" : "📋 Copy Link"}
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            💡 Share this link on WhatsApp, Instagram, or anywhere else. Your
            customers can browse your products and chat with you directly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Products
                </p>
                <p className="mt-3 text-4xl font-bold text-gray-900">
                  {productCount}
                </p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Revenue
                </p>
                <p className="mt-3 text-3xl font-bold text-sky-600">
                  ₦{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Sales
                </p>
                <p className="mt-3 text-4xl font-bold text-green-600">
                  {orderCount}
                </p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/products"
            className="rounded-3xl bg-white border-2 border-gray-200 p-8 hover:border-sky-400 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-bold text-gray-900 text-lg">Manage Products</h3>
            <p className="mt-2 text-sm text-gray-600">
              Add, edit, or delete your products
            </p>
          </Link>

          <Link
            href="/dashboard/products/add"
            className="rounded-3xl bg-linear-to-br from-sky-600 to-sky-700 text-white border-2 border-sky-600 p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="font-bold text-lg">Add New Product</h3>
            <p className="mt-2 text-sm text-sky-100">
              Get started with your first product
            </p>
          </Link>

          <Link
            href="/dashboard/sales"
            className="rounded-3xl bg-linear-to-br from-green-600 to-emerald-600 text-white border-2 border-green-600 p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg">View Sales</h3>
            <p className="mt-2 text-sm text-green-100">
              Track orders and payments
            </p>
          </Link>
        </div>

        {/* Shop Info Card */}
        <div className="rounded-3xl pb-6 bg-linear-to-br from-blue-50 to-sky-50 border-2 border-sky-200 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            🏪 Shop Information
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Business Name
              </p>
              <p className="text-lg font-bold text-gray-900">{shop.name}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Shop URL
              </p>
              <p className="text-lg font-mono font-bold text-sky-600">
                /{shop.slug}
              </p>
            </div>
            {shop.whatsapp_number && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  WhatsApp Number
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {shop.whatsapp_number}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
