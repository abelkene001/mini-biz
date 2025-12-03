import ProductCard from "../../components/ProductCard";
import ShopHeroSection from "../../components/ShopHeroSection";
import { supabase } from "../../lib/supabaseClient";

type Shop = {
  id: string;
  name: string;
  slug: string;
  whatsapp_number?: string;
  description?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  hero_image_url?: string;
  hero_title?: string;
  hero_tagline?: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  shop_id: string;
  active: boolean;
};

type Props = {
  params: Promise<{ shopSlug: string }>;
};

export default async function ShopPage({ params }: Props) {
  const { shopSlug } = await params;
  const slug = shopSlug;
  let shop: Shop | null = null;
  let products: Product[] = [];

  try {
    const { data: shopData } = await supabase
      .from("shops")
      .select("*")
      .eq("slug", slug)
      .limit(1)
      .single();

    shop = shopData;

    if (shop) {
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("shop_id", shop.id)
        .eq("active", true)
        .order("created_at", { ascending: false });

      products = productData || [];
    }
  } catch (err) {
    console.warn("Error fetching shop or products", err);
  }

  // Fallback shop name
  const shopName = shop?.name || slug.replace(/-/g, " ");
  const whatsappNumber = shop?.whatsapp_number || "";
  const heroTitle = shop?.hero_title || `Welcome to ${shopName}`;
  const heroTagline =
    shop?.hero_tagline ||
    "Discover our curated collection of premium products. Quality guaranteed with fast delivery.";
  const heroImageUrl = shop?.hero_image_url;
  const shopBankDetails =
    shop?.bank_name && shop?.bank_account_number && shop?.bank_account_name
      ? {
          bankName: shop.bank_name,
          accountNumber: shop.bank_account_number,
          accountName: shop.bank_account_name,
        }
      : undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ShopHeroSection
        heroTitle={heroTitle}
        heroTagline={heroTagline}
        heroImageUrl={heroImageUrl}
        shopName={shopName}
        whatsappNumber={whatsappNumber}
      />

      {/* Products Section */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No products yet
            </h2>
            <p className="text-lg text-gray-600">
              Check back soon for amazing products!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Our Products
              </h2>
              <p className="text-lg text-gray-600">
                {products.length} item{products.length > 1 ? "s" : ""} available
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  shopWhatsapp={whatsappNumber}
                  product={product}
                  shopId={shop?.id}
                  shopBankDetails={shopBankDetails}
                  shopName={shopName}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Support Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-3xl bg-linear-to-br from-blue-50 to-blue-100 p-8 sm:p-12">
          <div className="max-w-2xl">
            <div className="inline-block rounded-full bg-blue-200 px-4 py-2 text-sm font-bold text-blue-700 mb-4">
              💬 Get in Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Have questions? We&apos;re here to help!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Contact us directly for product inquiries, orders, or any support
              you need.
            </p>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-linear-to-r from-green-500 to-green-600 text-white font-bold hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                💬 Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="font-bold text-gray-900">ShopLink</span>
              </div>
              <p className="text-sm text-gray-600">
                Your WhatsApp shop, powered by ShopLink. Browse, chat, and
                purchase with ease.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                Quick Links
              </h3>
              <div className="space-y-2 text-sm">
                <a
                  href="#products"
                  className="text-gray-600 hover:text-sky-600 transition-colors"
                >
                  Shop Products
                </a>
                <br />
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-sky-600 transition-colors"
                  >
                    Contact Support
                  </a>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                About ShopLink
              </h3>
              <p className="text-sm text-gray-600">
                ShopLink makes it easy for businesses to sell on WhatsApp.
                Simple, fast, and secure.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} {shopName}. All rights reserved.
              Powered by{" "}
              <a
                href="/"
                className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
              >
                ShopLink
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
