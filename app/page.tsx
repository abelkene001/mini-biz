import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link";

function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-sky-600 via-sky-600 to-blue-700 px-4 py-20 sm:py-32 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
          Ready to Start Selling Today?
        </h2>
        <p className="mt-6 text-lg sm:text-xl lg:text-2xl opacity-90">
          Launch your online shop for just ₦4,800. Get orders on WhatsApp
          instantly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/signup"
            className="inline-flex rounded-xl bg-white px-8 py-4 text-base sm:text-lg font-bold text-sky-600 hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Get Started →
          </Link>
          <Link
            href="/demo-shop"
            className="inline-flex rounded-xl border-2 border-white px-8 py-4 text-base sm:text-lg font-bold hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95"
          >
            View Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}
