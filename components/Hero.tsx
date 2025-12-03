import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-blue-50 to-indigo-50"></div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* Feature pills */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-sky-200 shadow-sm animate-fadeIn">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              No setup required
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-sky-200 shadow-sm animate-fadeIn animation-delay-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              whatapp notification
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-700 border border-sky-200 shadow-sm animate-fadeIn animation-delay-200">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              instant payment
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 animate-slideUp">
            Your online-Shop{" "}
            <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              in 5 Minutes
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto animate-slideUp animation-delay-100">
            Create a mini-shop. Share one link. Get orders on WhatsApp.
            <br />
            <span className="text-gray-700 font-medium">
              No website needed. No coding required.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp animation-delay-200">
            <Link
              href="/auth/signup"
              className="inline-flex rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-sky-700 hover:to-indigo-700 active:scale-95 transition-all duration-200 group"
            >
              Get Started
              <svg
                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/demo-shop"
              className="inline-flex rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700 active:scale-95 transition-all duration-200"
            >
              View Demo
            </Link>
          </div>

          {/* Stats/Proof points */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slideUp animation-delay-300">
            <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-sky-200/50 shadow-sm">
              <div className="text-3xl font-bold text-sky-600">1000+</div>
              <p className="text-sm text-gray-600 mt-1">Shops Created</p>
            </div>
            <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-sky-200/50 shadow-sm">
              <div className="text-3xl font-bold text-sky-600">50K+</div>
              <p className="text-sm text-gray-600 mt-1">Orders Processed</p>
            </div>
            <div className="rounded-lg bg-white/60 backdrop-blur-sm p-4 border border-sky-200/50 shadow-sm">
              <div className="text-3xl font-bold text-sky-600">5 mins</div>
              <p className="text-sm text-gray-600 mt-1">Setup Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
