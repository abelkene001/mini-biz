"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Shop {
  id: string;
  name: string;
  slug: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user?.id) {
      fetchShop();
    }
  }, [user, loading, router]);

  const fetchShop = async () => {
    if (!user?.id) return;
    try {
      const { data } = await supabase
        .from("shops")
        .select("id, name, slug")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setShop(data);
      }
    } catch (err) {
      console.error("Error fetching shop:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar shopName={shop?.name || "My Shop"} />
      <main className="transition-all duration-300 ease-in-out pt-6 md:pt-0">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
