import Link from "next/link";

export default function Pricing() {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            One powerful plan to grow your business
          </p>
        </div>

        <div className="flex justify-center">
          <div className="rounded-3xl border-2 border-blue-600 bg-white shadow-2xl p-8 sm:p-12 max-w-lg w-full relative overflow-hidden">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-black text-white shadow-lg">
                🚀 RECOMMENDED
              </div>
            </div>

            {/* Plan Name */}
            <div className="text-center pt-4">
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900">
                Starter Plus
              </h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Perfect for entrepreneurs starting their online business
              </p>
            </div>

            {/* Price */}
            <div className="mt-6 text-center">
              <div className="inline-block">
                <span className="text-5xl sm:text-6xl font-black text-blue-600">
                  ₦4,800
                </span>
                <span className="text-gray-600 ml-2 text-base sm:text-lg">
                  /month
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-xs sm:text-sm text-gray-600">
              Billed monthly. No hidden fees. Cancel anytime.
            </p>

            {/* CTA Button */}
            <Link
              href="/signup"
              className="mt-8 block w-full rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 py-4 text-center font-black text-white text-lg hover:shadow-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Today →
            </Link>

            {/* Features List */}
            <div className="mt-10 space-y-4">
              <p className="text-center font-bold text-gray-900 text-lg mb-6">
                Everything You Need:
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: "📦",
                    title: "unlimited Products",
                    desc: "Manage and showcase up to 50 products",
                  },
                  {
                    icon: "💳",
                    title: "Payment Flow",
                    desc: "Secure payment verification system",
                  },
                  {
                    icon: "📊",
                    title: "Order Tracking",
                    desc: "Real-time order status for customers",
                  },
                  {
                    icon: "📱",
                    title: "Mobile Optimized",
                    desc: "Perfect on all devices and screens",
                  },
                  {
                    icon: "💬",
                    title: "WhatsApp Integration",
                    desc: "Automatic order notifications ",
                  },
                  {
                    icon: "✅",
                    title: "Admin Dashboard",
                    desc: "Full control and analytics",
                  },
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-2xl shrink-0">{feature.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{feature.title}</p>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 pt-8 border-t-2 border-gray-200">
              <Link
                href="/auth/signup"
                className="block w-full rounded-2xl bg-blue-100 py-3 text-center font-bold text-blue-600 hover:bg-blue-200 transition-colors"
              >
                Start Your Free Trial (7 days)
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Trusted by sellers across Nigeria
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["🏪 100+ Shops", "⭐ 4.9+ Rating", "🚀 10k+ Orders/month"].map(
              (stat) => (
                <div key={stat} className="text-sm font-bold text-gray-700">
                  {stat}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
