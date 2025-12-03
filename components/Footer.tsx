import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <div className="font-bold text-gray-900 text-lg">ShopLink</div>
            <p className="mt-2 text-sm text-gray-600">
              Your WhatsApp shop in minutes
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/#features" className="hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/demo-shop" className="hover:text-gray-900">
                  Demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} ShopLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
