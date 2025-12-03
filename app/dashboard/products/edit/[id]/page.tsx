"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";

interface Product {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  active: boolean;
}

export default function EditProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading_, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError) throw productError;

      // Verify ownership
      const { data: shopData } = await supabase
        .from("shops")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (productData.shop_id !== shopData?.id) {
        throw new Error("Unauthorized");
      }

      setProduct(productData);
      setFormData({
        name: productData.name,
        price: productData.price.toString(),
        description: productData.description || "",
      });
      if (productData.image_url) {
        setImageUrl(productData.image_url);
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product");
    } finally {
      setProductLoading(false);
    }
  }, [productId, user?.id]);

  // Load product when page loads
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && productId) {
      fetchProduct();
    }
  }, [user, loading, productId, router, fetchProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.name.trim()) {
        setError("Product name is required");
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError("Valid price is required");
        return;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          description: formData.description.trim(),
          image_url: imageUrl,
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      router.push("/dashboard/products");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (loading || productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Product not found</p>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center rounded-lg bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 transition-colors font-semibold"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Edit Product
          </h1>
          <p className="mt-2 text-gray-600">Update your product details</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
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
              {imageUrl && (
                <p className="mt-2 text-sm text-gray-600">
                  Image URL: {imageUrl}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Premium Shoe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={loading_}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={loading_}
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
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={loading_}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading_}
                className="flex-1 rounded-lg bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
              >
                {loading_ ? "Updating..." : "Update Product"}
              </button>
              <Link
                href="/dashboard/products"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-800 font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
