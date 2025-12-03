"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Order {
  id: string;
  product_name: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  quantity: number;
  amount: number;
  payment_method: string;
  order_status: "pending" | "completed" | "failed";
  created_at: string;
  proof_filename?: string;
}

// Format large numbers with M suffix for millions
function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1) + "M";
  }
  return price.toLocaleString();
}

export default function SalesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "failed"
  >("all");
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setSalesLoading(true);

      // Get shop ID
      const { data: shopData } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!shopData) return;

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("shop_id", shopData.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.warn("Orders table might not exist yet:", ordersError);
        setOrders([]);
        setTotalRevenue(0);
        setCompletedOrders(0);
        return;
      }

      setOrders(ordersData || []);
      setTotalRevenue(
        ordersData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0
      );
      setCompletedOrders(
        ordersData?.filter((o) => o.order_status === "completed").length || 0
      );
    } catch (err) {
      console.error("Error fetching sales data:", err);
    } finally {
      setSalesLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, loading, router, fetchData]);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.order_status === filterStatus);

  const handleApprovePayment = async (orderId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: "completed" })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, order_status: "completed" } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: "completed" });
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to approve payment");
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectPayment = async (orderId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: "failed" })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, order_status: "failed" } : o
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: "failed" });
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to reject payment");
    } finally {
      setUpdating(false);
    }
  };

  const getProofFileUrl = (filename: string | undefined | null) => {
    if (!filename) return null;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${filename}`;
  };

  if (loading || salesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className=" text-center">
          <h1 className="text-4xl py-10 font-bold text-gray-900">
            📊 Sales Dashboard
          </h1>
          <p className="  mb-3 text-lg text-gray-600">
            Track your orders, revenue, and customer payments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
          {/* Total Revenue */}
          <div className="rounded-3xl bg-linear-to-br from-blue-50 to-sky-50 border-2 border-sky-200 p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-sky-700 uppercase tracking-widest truncate">
                  Total Revenue
                </p>
                <p className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-black text-sky-600 truncate">
                  ₦{formatPrice(totalRevenue)}
                </p>
                <p className="mt-1 sm:mt-2 text-xs text-gray-600 font-medium">
                  All orders combined
                </p>
              </div>
              <div className="text-4xl sm:text-6xl shrink-0">💰</div>
            </div>
          </div>

          {/* Orders Completed */}
          <div className="rounded-3xl bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-green-700 uppercase tracking-widest truncate">
                  Orders Completed
                </p>
                <p className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-black text-green-600 truncate">
                  {completedOrders}
                </p>
                <p className="mt-1 sm:mt-2 text-xs text-gray-600 font-medium">
                  Successfully delivered
                </p>
              </div>
              <div className="text-4xl sm:text-6xl shrink-0">✅</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="rounded-3xl bg-linear-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-widest truncate">
                  Total Orders
                </p>
                <p className="mt-2 sm:mt-4 text-2xl sm:text-5xl font-black text-purple-600 truncate">
                  {orders.length}
                </p>
                <p className="mt-1 sm:mt-2 text-xs text-gray-600 font-medium">
                  Including pending
                </p>
              </div>
              <div className="text-4xl sm:text-6xl shrink-0">📦</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-wrap gap-3">
          {["all", "pending", "completed", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as typeof filterStatus)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-sm ${
                filterStatus === status
                  ? "bg-linear-to-r from-sky-600 to-sky-700 text-white shadow-lg"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-sky-400"
              }`}
            >
              {status === "all" && "📋 All Orders"}
              {status === "pending" && "⏳ Pending"}
              {status === "completed" && "✅ Completed"}
              {status === "failed" && "❌ Failed"}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl bg-white border-2 border-gray-200 shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-7xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 text-lg">
                Share your shop link and start receiving orders!
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center px-6 py-3 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all transform hover:scale-105"
              >
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Customer
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Product
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Qty
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {order.customer_phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold text-sm">
                        {order.product_name}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-bold text-center text-lg">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 font-black text-sky-600 text-lg">
                        ₦{order.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
                            order.order_status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.order_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.order_status === "completed" && "✓ COMPLETED"}
                          {order.order_status === "pending" && "⏳ PENDING"}
                          {order.order_status === "failed" && "✗ FAILED"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sky-600 hover:text-sky-700 font-bold text-sm transition-colors hover:underline"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full my-4 shadow-2xl border-2 border-gray-200 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-sky-600 to-sky-700 rounded-t-3xl border-b-2 border-sky-600 p-4 sm:p-8 flex items-start sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-3xl font-black text-white wrap-break-word">
                    Order Details
                  </h2>
                  <p className="text-sky-100 mt-1 sm:mt-2 text-xs sm:text-sm font-semibold truncate">
                    Order #{selectedOrder.id.substring(0, 8)}...
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors shrink-0"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-3 sm:p-8 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                  {/* Left Column - Order Details */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Customer Section */}
                    <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-3xl p-4 sm:p-6 border-2 border-sky-200">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                        👤 Customer
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-sky-200">
                          <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">
                            Name
                          </p>
                          <p className="font-bold text-gray-900 text-sm sm:text-lg wrap-break-word">
                            {selectedOrder.customer_name}
                          </p>
                        </div>
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-sky-200">
                          <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">
                            Phone
                          </p>
                          <p className="font-bold text-gray-900 text-sm sm:text-lg break-all">
                            {selectedOrder.customer_phone}
                          </p>
                        </div>
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-sky-200">
                          <p className="text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">
                            Address
                          </p>
                          <p className="font-semibold text-gray-900 text-sm wrap-break-word">
                            {selectedOrder.delivery_address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Product Section */}
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-3xl p-4 sm:p-6 border-2 border-green-200">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                        📦 Product
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-green-200">
                          <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">
                            Product Name
                          </p>
                          <p className="font-bold text-gray-900 text-sm sm:text-lg wrap-break-word">
                            {selectedOrder.product_name}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-green-200">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                              Qty
                            </p>
                            <p className="font-black text-2xl sm:text-3xl text-green-600">
                              {selectedOrder.quantity}
                            </p>
                          </div>
                          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-green-200">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">
                              Amount
                            </p>
                            <p className="font-black text-lg sm:text-2xl text-green-600 wrap-break-word">
                              ₦{selectedOrder.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-3xl p-4 sm:p-6 border-2 border-purple-200">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4">
                        🎯 Status
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-purple-200">
                          <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">
                            Current Status
                          </p>
                          <span
                            className={`inline-flex px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold ${
                              selectedOrder.order_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : selectedOrder.order_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedOrder.order_status === "completed" &&
                              "✓ COMPLETED"}
                            {selectedOrder.order_status === "pending" &&
                              "⏳ PENDING"}
                            {selectedOrder.order_status === "failed" &&
                              "✗ FAILED"}
                          </span>
                        </div>
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-purple-200">
                          <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-1">
                            Date
                          </p>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm wrap-break-word">
                            {new Date(
                              selectedOrder.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Payment Proof */}
                  <div className="flex flex-col">
                    {selectedOrder.proof_filename ? (
                      <div className="bg-gray-900 rounded-3xl border-2 border-gray-300 flex-1 flex flex-col overflow-hidden min-h-64 sm:min-h-96">
                        <div className="bg-gray-800 p-3 sm:p-4 border-b border-gray-700">
                          <p className="text-white font-bold text-xs sm:text-sm truncate">
                            📸 Payment:{" "}
                            {selectedOrder.proof_filename.substring(0, 20)}...
                          </p>
                        </div>
                        <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-2 sm:p-4">
                          {selectedOrder.proof_filename
                            .toLowerCase()
                            .endsWith(".pdf") ? (
                            <div className="text-center text-gray-400">
                              <p className="text-4xl sm:text-6xl mb-3 sm:mb-4">
                                📄
                              </p>
                              <p className="font-semibold mb-3 sm:mb-4 text-xs sm:text-base">
                                PDF File
                              </p>
                              <a
                                href={
                                  getProofFileUrl(
                                    selectedOrder.proof_filename
                                  ) || "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all text-xs sm:text-base"
                              >
                                View PDF →
                              </a>
                            </div>
                          ) : (
                            <img
                              src={
                                getProofFileUrl(selectedOrder.proof_filename) ||
                                ""
                              }
                              alt="Payment Proof"
                              className="max-w-full max-h-full object-contain p-2 sm:p-4"
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-6 sm:p-8 flex items-center justify-center h-64 sm:h-96">
                        <div className="text-center">
                          <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">
                            📭
                          </p>
                          <p className="font-bold text-gray-600 text-sm sm:text-base">
                            No proof file
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Not submitted yet
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Approval Buttons */}
                    {selectedOrder.order_status === "pending" && (
                      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4">
                        <button
                          onClick={() => handleRejectPayment(selectedOrder.id)}
                          disabled={updating}
                          className="rounded-2xl bg-red-600 px-3 sm:px-6 py-3 sm:py-4 font-bold text-white hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                        >
                          {updating ? "..." : "✗ Reject"}
                        </button>
                        <button
                          onClick={() => handleApprovePayment(selectedOrder.id)}
                          disabled={updating}
                          className="rounded-2xl bg-green-600 px-3 sm:px-6 py-3 sm:py-4 font-bold text-white hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                        >
                          {updating ? "..." : "✓ Approve"}
                        </button>
                      </div>
                    )}

                    {selectedOrder.order_status !== "pending" && (
                      <div className="mt-4 sm:mt-6 rounded-2xl bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-center">
                        <p className="font-bold text-gray-700 text-xs sm:text-base">
                          {selectedOrder.order_status === "completed"
                            ? "✓ Approved"
                            : "✗ Rejected"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t-2 border-gray-200 p-3 sm:p-6 bg-gray-50 rounded-b-3xl">
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                  }}
                  className="w-full rounded-2xl border-2 border-gray-300 px-4 sm:px-6 py-3 font-bold text-gray-700 hover:bg-gray-100 transition-all transform hover:scale-105 text-xs sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
