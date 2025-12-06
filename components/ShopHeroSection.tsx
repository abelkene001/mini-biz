"use client";

import Image from "next/image";

type ShopHeroProps = {
  heroTitle: string;
  heroTagline: string;
  heroImageUrl?: string;
  heroImageLandscape?: string;
  heroImagePortrait?: string;
  whatsappNumber: string;
};

export default function ShopHeroSection({
  heroTitle,
  heroTagline,
  heroImageUrl,
  heroImageLandscape,
  heroImagePortrait,
  whatsappNumber,
}: ShopHeroProps) {
  // Use landscape/portrait if available, fallback to old hero_image_url
  const landscapeImage = heroImageLandscape || heroImageUrl;
  const portraitImage = heroImagePortrait || heroImageUrl;

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Desktop: Landscape Image with Text Overlay */}
      {landscapeImage && (
        <div className="hidden lg:block relative h-[500px] w-full">
          <Image
            src={landscapeImage}
            alt={heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl space-y-6">
                <div className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold text-white animate-pulse">
                  ✨ Premium Collection
                </div>

                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                  {heroTitle}
                </h1>

                <p className="text-lg text-white/90 max-w-lg">
                  {heroTagline}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      document
                        .getElementById("products")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 w-fit"
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
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white text-white font-bold hover:bg-white/10 transition-all"
                    >
                      💬 Chat with us
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!landscapeImage && (
        <div className="hidden lg:block relative bg-linear-to-br from-blue-50 via-blue-50 to-blue-100 overflow-hidden py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6">
              <div className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 animate-pulse">
                ✨ Shop Collection
              </div>

              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                {heroTitle}
              </h1>

              <p className="text-lg text-gray-700 max-w-lg">
                {heroTagline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 w-fit"
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
            </div>
          </div>
        </div>
      )}

      {/* Mobile: Portrait Image with Text Overlay */}
      {portraitImage && (
        <div className="lg:hidden relative h-[600px] w-full">
          <Image
            src={portraitImage}
            alt={heroTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-4 sm:px-6 pb-8 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  {heroTitle}
                </h1>

                <p className="text-base text-white/90">
                  {heroTagline}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full px-6 py-3 rounded-xl bg-white text-gray-900 font-bold hover:shadow-lg transition-all"
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
                    className="w-full px-6 py-3 rounded-xl border-2 border-white text-white font-bold text-center hover:bg-white/10 transition-all"
                  >
                    💬 Chat with us
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!portraitImage && (
        <div className="lg:hidden relative bg-linear-to-br from-blue-50 via-blue-50 to-blue-100 overflow-hidden py-12">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 text-center">
            <div className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700 mx-auto animate-pulse">
              ✨ Shop Collection
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">
              {heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-gray-700 max-w-lg mx-auto">
              {heroTagline}
            </p>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg transition-all"
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
                  className="w-full px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-center hover:bg-blue-50 transition-all"
                >
                  💬 Chat with us
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
