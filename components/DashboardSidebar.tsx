"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface DashboardSidebarProps {
  shopName?: string;
}

const menuItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: "📊",
    exact: true,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: "📦",
  },
  {
    href: "/dashboard/products/add",
    label: "Add Product",
    icon: "➕",
  },
  {
    href: "/dashboard/sales",
    label: "Sales",
    icon: "📈",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "⚙️",
  },
];

export default function DashboardSidebar({
  shopName = "My Shop",
}: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      // Close sidebar on mobile by default, keep open on desktop
      if (isMobileView) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  async function handleSignOut() {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-sky-900 to-sky-800 text-white shadow-2xl transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-sky-700/50">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group flex-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                <span className="text-lg font-bold">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sky-200">Dashboard</p>
                <p className="text-sm font-bold truncate">{shopName}</p>
              </div>
            </Link>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 hover:bg-sky-700 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.href, item.exact)
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-sky-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Section & Sign Out */}
          <div className="border-t border-sky-700/50 p-4 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sky-200">Logged in as</p>
                <p className="text-sm font-semibold truncate">
                  {user?.email || "User"}
                </p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-100 hover:text-red-50 font-medium text-sm py-2.5 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content wrapper - Add padding/margin for sidebar */}
      <style jsx>{`
        /* This creates a container that respects the sidebar */
        main {
          margin-left: 0;
        }

        @media (min-width: 768px) {
          main {
            margin-left: 16rem; /* 256px - w-64 */
          }
        }
      `}</style>
    </>
  );
}
