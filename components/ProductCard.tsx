"use client";
import React, { useState } from "react";
import Image from "next/image";
import PaymentModal from "./PaymentModal";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
};

type ShopBankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
};

export default function ProductCard({
  shopWhatsapp,
  product,
  shopName = "Shop",
  shopId,
  shopBankDetails,
}: {
  shopWhatsapp?: string;
  product: Product;
  shopName?: string;
  shopId?: string;
  shopBankDetails?: ShopBankDetails;
}) {
  const [showPayment, setShowPayment] = useState(false);

  function handleChat() {
    const message = `Hi! I'm interested in:\n\n📦 Product: ${
      product.name
    }\n💰 Price: ₦${product.price.toLocaleString()}\n\nIs this available?`;
    const digitsOnly = (shopWhatsapp || "").replace(/[^0-9]/g, "");
    if (!digitsOnly) {
      alert("Merchant WhatsApp number not available");
      return;
    }
    const waUrl = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(
      message
    )}`;
    window.open(waUrl, "_blank");
  }

  function handleBuy() {
    setShowPayment(true);
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        {/* Image Container - Taller with proper aspect ratio */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-linear-to-br from-gray-100 to-gray-200">
              <span className="text-5xl">📦</span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col gap-3 flex-grow">
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <p className="text-2xl font-bold text-sky-600 mt-3">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          {product.description && (
            <p className="text-sm text-gray-700 line-clamp-2 flex-shrink-0">
              {product.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 mt-auto">
            <button
              onClick={handleChat}
              className="flex-1 rounded-2xl border-2 border-sky-600 bg-white px-4 py-3 text-sm font-semibold text-sky-600 hover:bg-sky-50 transition-colors"
            >
              💬 Chat
            </button>
            <button
              onClick={handleBuy}
              className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              🛒 Buy
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        product={product}
        shopName={shopName}
        shopId={shopId}
        shopWhatsapp={shopWhatsapp}
        shopBankDetails={shopBankDetails}
      />
    </>
  );
}
