"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface DashboardNavbarProps {
  shopName?: string;
}

export default function DashboardNavbar({
  shopName = "My Shop",
}: DashboardNavbarProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const navLinkClass = (path: string) => {
    const baseClass =
      "text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg";
    if (isActive(path)) {
      return `${baseClass} bg-sky-100 text-sky-700 shadow-sm`;
    }
    return `${baseClass} text-gray-600 hover:text-sky-600 hover:bg-gray-50`;
  };

  return (
    <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Shop Name */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-500">Dashboard</p>
              <p className="text-sm font-bold text-gray-900">{shopName}</p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className={navLinkClass("/dashboard")}>
            📊 Overview
          </Link>
          <Link
            href="/dashboard/products"
            className={navLinkClass("/dashboard/products")}
          >
            📦 Products
          </Link>
          <Link
            href="/dashboard/sales"
            className={navLinkClass("/dashboard/sales")}
          >
            📈 Sales
          </Link>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden xs:flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
