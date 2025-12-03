"use client";
import Link from "next/link";

interface DemoShopNavbarProps {
  shopName: string;
  tagline: string;
}

export default function DemoShopNavbar({
  shopName,
  tagline,
}: DemoShopNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Back Link */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-gray-600 hover:text-sky-600 transition-all group px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span className="hidden sm:inline">Back</span>
          </Link>

          {/* Center: Shop Info */}
          <div className="flex-1 text-center min-w-0">
            <h1 className="font-black text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent truncate">
              ✨ {shopName}
            </h1>
            <p className="text-xs text-gray-500 truncate">{tagline}</p>
          </div>

          {/* Right: Demo Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
            <span className="text-sm font-bold text-blue-700 hidden sm:inline">
              Demo Mode
            </span>
            <span className="text-sm font-bold text-blue-700 sm:hidden">
              Demo
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
