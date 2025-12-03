import ProductCard from "../../components/ProductCard";
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
      <section className="border-b border-gray-200 bg-linear-to-b from-sky-50 to-white px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
            ✏️ Shop on WhatsApp
          </div>
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl leading-tight">
            {shopName}
          </h1>
          {shop?.description && (
            <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
              {shop.description}
            </p>
          )}
          <p className="mt-8 text-lg text-gray-600">
            Browse products below or chat with us on WhatsApp to learn more
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
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
              <h2 className="text-3xl font-bold text-gray-900">Products</h2>
              <p className="mt-2 text-lg text-gray-600">
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
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="font-bold text-gray-900">ShopLink</span>
              </div>
              <p className="text-sm text-gray-600">
                Your WhatsApp shop, powered by ShopLink
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600">
                Shop with a single link. Browse, chat, and purchase directly on
                WhatsApp.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Chat with us on WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>
              © {new Date().getFullYear()} {shopName}. Powered by{" "}
              <span className="font-semibold text-sky-600">ShopLink</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
