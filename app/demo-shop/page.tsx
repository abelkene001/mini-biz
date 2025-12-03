"use client";

import Link from "next/link";
import { useState } from "react";
import DemoShopNavbar from "@/components/DemoShopNavbar";

const demoProducts = [
  {
    id: "demo-1",
    name: "Hydrating Face Serum",
    price: 8500,
    description: "Deep hydration with hyaluronic acid",
    image_url:
      "https://images.unsplash.com/photo-1629732047847-50219e9c5aef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "demo-2",
    name: "Vitamin C Brightening Cream",
    price: 12000,
    description: "Radiant skin in 2 weeks",
    image_url:
      "https://images.unsplash.com/photo-1606755612769-5655c261e8ce?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "demo-3",
    name: "Charcoal Face Mask",
    price: 5500,
    description: "Deep cleansing detox",
    image_url:
      "https://images.unsplash.com/photo-1703174323653-0455deaf7f11?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "demo-4",
    name: "Rose Hip Oil",
    price: 6800,
    description: "Natural anti-aging oil",
    image_url:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "demo-5",
    name: "Retinol Night Serum",
    price: 14000,
    description: "Age-defying wrinkle reducer",
    image_url:
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "demo-6",
    name: "Moisturizing Body Lotion",
    price: 4200,
    description: "Silky smooth skin",
    image_url:
      "https://images.unsplash.com/photo-1597931752949-98c74b5b159f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function DemoShopPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof demoProducts)[0] | null
  >(null);
  const [customerData] = useState({
    name: "Chukwu Eze",
    phone: "08012345678",
    address: "123 Lekki Phase 1, Lagos",
    proofFile: "payment_proof.jpg",
  });

  const shop = {
    name: "Glow Skincare",
    tagline: "Professional skincare for all skin types",
    whatsapp_number: "+23400000000",
  };

  function handleBuyClick(product: (typeof demoProducts)[0]) {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <DemoShopNavbar shopName={shop.name} tagline={shop.tagline} />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-50 via-blue-50 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content - Centered on mobile */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 mx-auto lg:mx-0 animate-pulse">
                ✨ Premium Product Collection
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mx-auto lg:mx-0 max-w-2xl">
                Shop with{" "}
                <span className="bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-lg mx-auto lg:mx-0">
                Discover our curated collection of premium products designed to
                enhance your lifestyle. Quality guaranteed with fast delivery.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  👇 Shop Now
                </button>
                <button
                  disabled
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-blue-600 text-blue-600 font-bold opacity-50 cursor-not-allowed"
                >
                  💬 Chat (Demo)
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-sm font-bold text-gray-700 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚚</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://plus.unsplash.com/premium_photo-1674739375749-7efe56fc8bbb?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Products"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Our Collection
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600">
              Carefully selected premium products for everyone
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {demoProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-3xl bg-white border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col h-full"
              >
                {/* Product Image - Perfect square fit */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                    {product.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-xl sm:text-2xl font-black text-blue-600">
                      ₦{product.price.toLocaleString()}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleBuyClick(product)}
                        className="flex-1 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-3 py-2 text-xs sm:text-sm font-bold text-white hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                      >
                        💳 Buy
                      </button>
                      <button
                        disabled
                        className="flex-1 rounded-xl border-2 border-green-600 px-3 py-2 text-xs sm:text-sm font-bold text-green-600 opacity-50 cursor-not-allowed"
                      >
                        💬 Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
            Why Choose {shop.name}?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                tag: "Quality",
                title: "Premium Quality",
                desc: "Dermatologist tested and proven effective",
              },
              {
                icon: "🌿",
                tag: "Natural",
                title: "Natural Ingredients",
                desc: "Pure, natural, and organic ingredients",
              },
              {
                icon: "🚚",
                tag: "Shipping",
                title: "Fast Delivery",
                desc: "Quick delivery to your doorstep",
              },
              {
                icon: "💰",
                tag: "Pricing",
                title: "Affordable Prices",
                desc: "Premium quality at competitive prices",
              },
              {
                icon: "✅",
                tag: "Guarantee",
                title: "Satisfaction Guaranteed",
                desc: "30-day money-back guarantee",
              },
              {
                icon: "💬",
                tag: "Support",
                title: "24/7 Support",
                desc: "Team available via WhatsApp",
              },
            ].map((feature, idx) => (
              <div
                key={feature.title}
                className={`rounded-3xl bg-linear-to-br from-blue-50 to-blue-100 p-6 border-2 border-blue-200 hover:shadow-xl transition-all transform hover:scale-105 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4 `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-4xl">{feature.icon}</p>
                  <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-linear-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-8">
            Explore our collection and find what you love today
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold opacity-50 cursor-not-allowed"
          >
            💬 Chat with us (Demo Mode)
          </button>
        </div>
      </section>

      {/* Payment Modal - Full Demo Order Details */}
      {showPaymentModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-4 shadow-2xl border-2 border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-sky-600 to-sky-700 rounded-t-3xl border-b-2 border-sky-600 p-4 sm:p-6 flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-black text-white">
                Order Details
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left: Order Details */}
                <div className="space-y-4 sm:space-y-5">
                  {/* Customer Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-4 border-2 border-sky-200">
                    <h3 className="text-base font-black text-gray-900 mb-3">
                      👤 Customer
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-xl p-3 border border-sky-200">
                        <p className="text-xs font-bold text-sky-700 uppercase mb-1">
                          Name
                        </p>
                        <p className="font-bold text-gray-900">
                          {customerData.name}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-sky-200">
                        <p className="text-xs font-bold text-sky-700 uppercase mb-1">
                          Phone
                        </p>
                        <p className="font-bold text-gray-900">
                          {customerData.phone}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-sky-200">
                        <p className="text-xs font-bold text-sky-700 uppercase mb-1">
                          Address
                        </p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {customerData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200">
                    <h3 className="text-base font-black text-gray-900 mb-3">
                      📦 Product
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-xl p-3 border border-green-200">
                        <p className="text-xs font-bold text-green-700 uppercase mb-1">
                          Product Name
                        </p>
                        <p className="font-bold text-gray-900">
                          {selectedProduct.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs font-bold text-green-700 uppercase mb-1">
                            Qty
                          </p>
                          <p className="font-black text-2xl text-green-600">
                            1
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-green-200">
                          <p className="text-xs font-bold text-green-700 uppercase mb-1">
                            Amount
                          </p>
                          <p className="font-black text-lg text-green-600">
                            ₦{selectedProduct.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border-2 border-purple-200">
                    <h3 className="text-base font-black text-gray-900 mb-3">
                      🎯 Status
                    </h3>
                    <div className="bg-white rounded-xl p-3 border border-purple-200">
                      <p className="text-xs font-bold text-purple-700 uppercase mb-2">
                        Current Status
                      </p>
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
                        ⏳ PENDING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Payment Proof */}
                <div className="flex flex-col">
                  <div className="bg-gray-900 rounded-2xl border-2 border-gray-300 flex-1 flex flex-col overflow-hidden min-h-64 sm:min-h-72">
                    <div className="bg-gray-800 p-3 border-b border-gray-700">
                      <p className="text-white font-bold text-xs sm:text-sm truncate">
                        📸 Payment: {customerData.proofFile}
                      </p>
                    </div>
                    <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0sdhGmzlmQR9OCult07TwrN9PomffPos3UQ&s"
                        alt="Payment Proof"
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Demo Notice */}
                  <div className="mt-3 sm:mt-4 rounded-xl bg-yellow-50 border-2 border-yellow-200 p-3 sm:p-4 text-center">
                    <p className="text-xs sm:text-sm font-bold text-yellow-800">
                      ⚠️ Demo Mode
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      This form is not submittable - Demo only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-gray-200 p-3 sm:p-4 bg-gray-50 rounded-b-3xl">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full rounded-2xl border-2 border-gray-300 px-4 sm:px-6 py-3 font-bold text-gray-700 hover:bg-gray-100 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
