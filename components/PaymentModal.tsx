"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import OrderNotificationModal from "./OrderNotificationModal";

interface ShopBankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
  shopName: string;
  shopId?: string;
  shopWhatsapp?: string;
  shopBankDetails?: ShopBankDetails;
}

export default function PaymentModal({
  isOpen,
  onClose,
  product,
  shopName,
  shopId,
  shopWhatsapp,
  shopBankDetails,
}: PaymentModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [orderData, setOrderData] = useState<{
    customerName: string;
    productName: string;
    amount: number;
  } | null>(null);

  const totalPrice = product.price * quantity;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      alert("Please select an image or PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return;
    }

    setProofFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("📄 " + file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proofFile) {
      setError("Please upload proof of payment");
      return;
    }

    setLoading(true);

    try {
      let uploadedFilename = null;

      // Upload proof file to Supabase Storage
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, proofFile);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        throw new Error(`Failed to upload proof: ${uploadError.message}`);
      }

      uploadedFilename = fileName;

      // Save order to database
      if (shopId) {
        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            shop_id: shopId,
            product_id: product.id,
            product_name: product.name,
            customer_name: customerName,
            customer_phone: customerPhone,
            delivery_address: customerAddress,
            quantity: quantity,
            amount: totalPrice,
            payment_method: "bank_transfer",
            proof_filename: uploadedFilename,
            order_status: "pending",
          })
          .select()
          .single();

        if (orderError) {
          console.error("Order save error:", orderError);
          throw new Error(`Failed to save order: ${orderError.message}`);
        }

        // Order created successfully
        setSubmitted(true);

        // Show notification modal after a short delay
        setTimeout(() => {
          if (shopWhatsapp) {
            setOrderData({
              customerName,
              productName: product.name,
              amount: totalPrice,
            });
            setShowNotificationModal(true);
          }
        }, 800);

        // Close main modal after timeout
        setTimeout(() => {
          handleCloseModal();
        }, 2500);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Order failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit order";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    onClose();
    setSubmitted(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setProofFile(null);
    setPreviewUrl("");
    setQuantity(1);
    setError(null);
    setShowNotificationModal(false);
    setOrderData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-sky-600 to-sky-700 rounded-t-3xl border-b border-sky-600 p-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Complete Order</h2>
            <p className="text-sky-100 mt-1">From {shopName}</p>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center">
            <div className="text-7xl mb-4 animate-bounce">✅</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Order Submitted!
            </h3>
            <p className="text-gray-600 text-lg">
              Details sent to merchant via WhatsApp
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 text-lg font-semibold mb-6 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-sky-600 text-white font-bold hover:bg-sky-700 transition-all transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {/* Product Summary */}
            <div className="bg-linear-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border border-sky-200 shadow-sm">
              <div className="flex gap-4">
                {product.image_url && (
                  <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {product.name}
                  </h3>
                  <p className="text-sky-600 font-bold text-xl mt-2">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 rounded-xl border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center font-bold text-xl transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  className="flex-1 text-center border-2 border-gray-300 rounded-xl py-3 px-3 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 rounded-xl border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="bg-linear-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
                <span className="text-gray-700 font-medium">
                  Total Amount to Pay:
                </span>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-gray-900 font-bold text-2xl">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                    {quantity} × ₦{product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Details - MOST PROMINENT */}
            {shopBankDetails ? (
              <div className="bg-linear-to-br from-blue-500 to-sky-600 rounded-3xl p-8 shadow-lg border border-blue-400 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-white/20 rounded-full p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold">Bank Transfer</h3>
                </div>
                <p className="text-blue-100 text-sm mb-6">
                  Transfer the amount above to this account
                </p>

                <div className="space-y-4 bg-white/10 backdrop-blur rounded-2xl p-6">
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">
                      Bank Name
                    </p>
                    <p className="text-white text-lg font-bold">
                      {shopBankDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">
                      Account Name
                    </p>
                    <p className="text-white text-lg font-bold">
                      {shopBankDetails.accountName}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">
                      Account Number
                    </p>
                    <div className="bg-white/20 rounded-xl p-3 mt-1">
                      <p className="text-white text-2xl font-mono font-bold tracking-widest">
                        {shopBankDetails.accountNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-400/30 backdrop-blur rounded-xl p-4 border border-white/20">
                  <p className="text-sm text-blue-50">
                    💡{" "}
                    <span className="font-semibold">
                      Use your name or order ID as the transfer reference
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ Bank details not available. Please contact the merchant.
                </p>
              </div>
            )}

            {/* Customer Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="08012345678"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Delivery Address *
              </label>
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
                rows={3}
                className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
                placeholder="Enter your delivery address"
              />
            </div>

            {/* Proof of Payment */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                📸 Upload Proof of Payment *
              </label>
              <div className="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-sky-400 transition-all">
                <input
                  type="file"
                  name="proof-input"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  required
                  className="hidden"
                  id="proof-input"
                />
                <label htmlFor="proof-input" className="cursor-pointer block">
                  {previewUrl ? (
                    <div className="space-y-3">
                      {previewUrl.startsWith("📄") ? (
                        <div className="text-5xl">📄</div>
                      ) : (
                        <div className="relative h-40 w-40 mx-auto rounded-2xl overflow-hidden bg-gray-100 shadow-md">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm font-semibold text-gray-900">
                        {proofFile?.name}
                      </p>
                      <p className="text-xs text-gray-600">Click to change</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <div className="text-6xl mb-3">📸</div>
                      <p className="text-lg font-semibold text-gray-900">
                        Upload screenshot
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        (Image or PDF, max 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !proofFile}
              className="w-full bg-linear-to-r from-sky-600 to-blue-600 text-white font-bold py-4 rounded-2xl hover:from-sky-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg text-lg"
            >
              {loading ? "Submitting..." : "✓ Submit Order"}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-xs text-blue-800 text-center font-medium">
                ℹ️ After submission, you'll have the option to notify the
                merchant via WhatsApp
              </p>
            </div>
          </form>
        )}
      </div>

      {/* Order Notification Modal */}
      {orderData && (
        <OrderNotificationModal
          isOpen={showNotificationModal}
          onClose={handleCloseModal}
          adminWhatsapp={shopWhatsapp}
          customerName={orderData.customerName}
          productName={orderData.productName}
          amount={orderData.amount}
        />
      )}
    </div>
  );
}
