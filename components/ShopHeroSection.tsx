"use client";

import Image from "next/image";

type ShopHeroProps = {
  heroTitle: string;
  heroTagline: string;
  heroImageUrl?: string;
  shopName: string;
  whatsappNumber: string;
};

export default function ShopHeroSection({
  heroTitle,
  heroTagline,
  heroImageUrl,
  shopName,
  whatsappNumber,
}: ShopHeroProps) {
  return (
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
              ✨ Shop Collection
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mx-auto lg:mx-0 max-w-2xl">
              {heroTitle.split(" ").length > 3 ? (
                <>
                  {heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {heroTitle.split(" ").pop()}
                  </span>
                </>
              ) : (
                <>
                  {heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {heroTitle.split(" ").pop()}
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-lg mx-auto lg:mx-0">
              {heroTagline}
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
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all"
                >
                  💬 Chat with us
                </a>
              )}
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
          {heroImageUrl ? (
            <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={heroImageUrl}
                alt={shopName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-8xl opacity-30">🛍️</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
