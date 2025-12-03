"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }

    setLoading(true);
    try {
      // Get shop ID
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (shopError || !shop) throw new Error("Shop not found");

      // Insert product
      const { error: insertError } = await supabase.from("products").insert({
        shop_id: shop.id,
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        image_url: imageUrl,
        active: true,
      });

      if (insertError) throw insertError;

      router.push("/dashboard/products");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "Failed to add product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">Upload a product and start selling</p>

        <div className="mt-8 rounded-2xl bg-white p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Product Image
              </label>
              <ImageUpload
                bucket="product-images"
                onUploadComplete={(url) => setImageUrl(url)}
                onError={(err) => setError(err)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full rounded-lg border border-gray-300 text-gray-800 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., Leather Sandals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                className="w-full rounded-lg border text-gray-800 border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border text-gray-800 border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Describe your product..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-600 px-4 py-3 font-semibold text-white hover:bg-sky-700 active:bg-sky-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
