"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
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

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

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
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
            ShopLink
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <>
              <Link href="/auth/login" className={navLinkClass("/auth/login")}>
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 active:bg-sky-800 transition-all shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
