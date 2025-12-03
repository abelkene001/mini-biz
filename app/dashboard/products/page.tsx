"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
}

export default function ProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch products
      const { data: shopIdData } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (shopIdData) {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("shop_id", shopIdData.id)
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, loading, router, fetchData]);

  async function handleDelete(productId: string) {
    if (confirm("Delete this product?")) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) throw error;
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center py-10 justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">
              Products
            </h1>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-primary-700 transition-colors shadow-sm"
            >
              <span>➕</span>
              Add Product
            </Link>
          </div>
          <p className="text-gray-600">Manage your shop products</p>
        </div>

        {/* Loading State */}
        {productsLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading products...</div>
          </div>
        )}

        {/* Empty State */}
        {!productsLoading && products.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first product and start selling
            </p>
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-primary-700 transition-colors"
            >
              <span>➕</span>
              Add Your First Product
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!productsLoading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl border-2 border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-32 sm:h-48 w-full bg-gray-100 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-linear-to-br from-gray-100 to-gray-200">
                      <span className="text-3xl sm:text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-base sm:text-lg font-black text-sky-600 mt-2">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>

                  {product.description && (
                    <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 mt-auto">
                    <Link
                      href={`/dashboard/products/edit/${product.id}`}
                      className="flex-1 rounded-xl border-2 border-sky-600 bg-white px-3 py-2 text-xs sm:text-sm font-bold text-sky-600 hover:bg-sky-50 transition-colors text-center"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-xs sm:text-sm font-bold text-white hover:bg-red-700 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
