# PRODUCT_SPEC.md - Part 1: Product Vision & Architecture

## Project Name: **ShopLink**

**Tagline:** "Your WhatsApp Mini-Shop in 5 Minutes"

---

## 1. WHAT ARE WE BUILDING?

### The Core Problem

Small businesses in Nigeria sell through WhatsApp but struggle with:

- No professional storefront to showcase products
- Customers jumping between Instagram/website → WhatsApp → back to website
- No way to track inquiries and orders
- Manual bank transfer coordination is messy
- No data on which products customers like

### The Solution

**ShopLink** is a mini-shop builder (like Shopify but simpler) that:

1. Creates a beautiful mobile-first product catalog
2. Integrates seamlessly with WhatsApp using click-to-chat
3. Captures orders with simple forms
4. Tracks all customer interactions
5. Requires ZERO technical knowledge

### What Makes It Different

- **No WhatsApp API complexity** - Uses free click-to-chat links
- **Nigerian-first** - Bank transfer payments, WhatsApp integration
- **5-minute setup** - Business details + products = instant shop
- **One link everywhere** - Share on Instagram, WhatsApp Status, anywhere
- **Stupid simple** - If you can use Instagram, you can use this

---

## 2. USER FLOWS (THE COMPLETE PICTURE)

### Flow 1: Merchant Onboarding (Amaka's Journey)

**Step 1: Signup**

```
Amaka visits: shoplink.vercel.app
Clicks: "Get Started"
Enters:
  - Email: amaka@example.com
  - Password: ********
  - Confirms password
Clicks: "Create Account"
System creates account via Supabase Auth
```

**Step 2: Business Setup (Onboarding)**

```
Redirects to: /onboarding
Amaka fills form:

  Business Information:
  - Business Name: "Amaka's Footwear"
  - WhatsApp Number: "+234 801 234 5678"

  Payment Details:
  - Bank Name: "GTBank"
  - Account Number: "1234567890"
  - Account Name: "Amaka Obi"

Clicks: "Continue"

System:
  - Generates slug: "amakas-footwear"
  - Creates shop record in database
  - Links to user account
  - Redirects to: /dashboard
```

**Step 3: Add First Product**

```
Dashboard shows: "Add your first product"
Amaka clicks: "+ Add Product"

Modal/Page opens with form:
  - Product Name: "Red Nike Air Max"
  - Price: "25000" (₦ symbol auto-added)
  - Description: "Premium quality Nike Air Max in vibrant red..."
  - Image: [Upload button] → Selects photo from phone
  - Active: [x] (checkbox checked by default)

Clicks: "Save Product"

System:
  - Uploads image to Supabase Storage
  - Creates product record
  - Links to shop
  - Shows in product list
```

**Step 4: Share Shop Link**

```
Dashboard shows success message:
  "✅ Product added! Your shop is ready."

  Your Shop Link:
  shoplink.vercel.app/amakas-footwear
  [Copy Link] button

Amaka copies link and shares on:
  - Instagram bio
  - WhatsApp Status
  - Facebook
```

---

### Flow 2: Customer Purchase Journey (Emma's Journey)

**Scenario A: Browse → Chat → Buy**

**Step 1: Customer Opens Shop**

```
Emma clicks link from Instagram: shoplink.vercel.app/amakas-footwear
Sees clean mobile shop with:
  - Header: "Amaka's Footwear"
  - Product grid showing all shoes
```

**Step 2: Views Product**

```
Emma sees product card:
  ┌─────────────────────┐
  │   [Product Image]   │
  │                     │
  │ Red Nike Air Max    │
  │ ₦25,000            │
  │                     │
  │ Premium quality...  │
  │                     │
  │ [💬 Chat] [💳 Buy] │
  └─────────────────────┘
```

**Step 3: Clicks Chat Button**

```
Emma clicks: "💬 Chat"

System:
  1. Logs event to database:
     - shop_id: amaka's shop
     - product_id: red nike
     - event: 'chat_click'
     - timestamp: now

  2. Opens WhatsApp with pre-filled message:
     "Hi! I'm interested in:

     📦 Product: Red Nike Air Max
     💰 Price: ₦25,000
     🔗 Link: shoplink.vercel.app/amakas-footwear

     Is this available?"

WhatsApp opens (new tab on desktop, app on mobile)
```

**Step 4: WhatsApp Conversation**

```
Emma's WhatsApp shows pre-filled message
She can:
  - Send as-is
  - Edit to add: "Do you have size 43?"
  - Add her own questions

She taps Send

Amaka receives message on HER WhatsApp with:
  ✅ Product name
  ✅ Price
  ✅ Link back to shop
  ✅ Emma's question

Amaka replies:
  "Yes! Available in size 43. ₦25,000.
  Ready to order?"

Emma: "Yes please!"

Amaka: "Perfect! Transfer ₦25,000 to:
        GTBank - 1234567890 - Amaka Obi
        Then send proof + your address"

[Rest of conversation happens naturally in WhatsApp]

NOTE: This entire conversation is FREE - no API costs!
```

---

**Scenario B: Browse → Direct Buy**

**Step 1-2: Same as Scenario A**

**Step 3: Clicks Buy Button**

```
Emma clicks: "💳 Buy"

System shows order form (modal or new page):

┌─────────────────────────────────┐
│ Complete Your Purchase          │
├─────────────────────────────────┤
│                                 │
│ Product: Red Nike Air Max       │
│ Price: ₦25,000                 │
│                                 │
│ Your Details                    │
│ Name*                           │
│ [___________________________]   │
│                                 │
│ Phone Number*                   │
│ [___________________________]   │
│                                 │
│ Delivery Address*               │
│ [___________________________]   │
│ [___________________________]   │
│                                 │
│ ─────────────────────────────   │
│                                 │
│ Payment Information             │
│                                 │
│ Transfer ₦25,000 to:           │
│ Bank: GTBank                    │
│ Account: 1234567890            │
│ Name: Amaka Obi                │
│                                 │
│ Upload Payment Proof*           │
│ [📎 Choose file]               │
│ or                              │
│ [📷 Take photo]                │
│                                 │
│ ─────────────────────────────   │
│                                 │
│ [Submit Order]                  │
│                                 │
└─────────────────────────────────┘
```

**Step 4: Submits Order**

```
Emma fills:
  - Name: "Emma Johnson"
  - Phone: "+234 900 123 4567"
  - Address: "15 Allen Avenue, Ikeja, Lagos"
  - Uploads screenshot of bank transfer

Clicks: "Submit Order"

System:
  1. Validates all fields
  2. Uploads payment proof to Supabase Storage
  3. Creates order record in database:
     - shop_id: amaka's shop
     - product_id: red nike
     - customer_name: Emma Johnson
     - customer_phone: +234 900 123 4567
     - delivery_address: 15 Allen Avenue...
     - payment_proof_url: [storage URL]
     - amount: 25000
     - status: 'pending'
     - created_at: now

  4. Shows success screen:
     "✅ Order Submitted!

     Order #001

     Amaka will confirm your payment within 1 hour.
     You'll receive a WhatsApp message when confirmed.

     [View Order Status] [Back to Shop]"
```

**Step 5: Merchant Notification**

```
In Amaka's dashboard:
  - Red notification badge appears
  - Order shows in "Recent Orders" section

Amaka sees:
  Order #001
  Emma Johnson
  Red Nike Air Max - ₦25,000
  Status: Pending
  [View Details] [Confirm Payment]

She clicks "View Details":
  Customer: Emma Johnson
  Phone: +234 900 123 4567
  Address: 15 Allen Avenue, Ikeja, Lagos
  Payment Proof: [View Image]

  Actions:
  [✅ Confirm Payment]
  [💬 Contact Customer] ← Opens WhatsApp
  [❌ Cancel Order]
```

---

## 3. TECH STACK & ARCHITECTURE

### Technology Choices

**Frontend & Backend**

- **Framework:** Next.js 14+ (App Router)
- **Why:** Server components, API routes, optimal performance, easy deployment
- **Language:** TypeScript (for type safety)

**Styling**

- **Framework:** Tailwind CSS
- **Why:** Rapid development, mobile-first utilities, small bundle size
- **Design System:** Custom using Tailwind + shadcn/ui components

**Database & Backend Services**

- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Why:** All-in-one solution, real-time capabilities, generous free tier

**Hosting & Deployment**

- **Platform:** Vercel
- **Why:** Built for Next.js, automatic deployments, edge functions, free SSL

**Payment Processing**

- **Gateway:** Paystack (for SaaS subscriptions)
- **Why:** Nigerian market leader, easy integration, competitive rates

**WhatsApp Integration**

- **Method:** Click-to-chat links (`https://wa.me/`)
- **Why:** FREE, no API setup, works everywhere, no Meta approval needed

---

### Domain & URL Structure

**Single Domain Deployment**

```
Primary domain: shoplink.vercel.app

All shops under same domain:
  shoplink.vercel.app/amakas-footwear
  shoplink.vercel.app/emma-wigs
  shoplink.vercel.app/kings-electronics
  shoplink.vercel.app/tunde-phones

Marketing/Auth pages:
  shoplink.vercel.app          → Landing page
  shoplink.vercel.app/pricing  → Pricing page
  shoplink.vercel.app/login    → Login
  shoplink.vercel.app/signup   → Signup

Dashboard (protected):
  shoplink.vercel.app/dashboard
  shoplink.vercel.app/dashboard/products
  shoplink.vercel.app/dashboard/orders
  shoplink.vercel.app/dashboard/settings
```

**How Slug Routing Works**

```typescript
// app/[slug]/page.tsx
// Catches ALL routes except defined pages

export default async function ShopPage({ params }) {
  const { slug } = params;

  // Fetch shop data
  const shop = await getShopBySlug(slug);

  if (!shop) {
    return <NotFoundPage />;
  }

  // Fetch products
  const products = await getProductsByShopId(shop.id);

  return <MiniShop shop={shop} products={products} />;
}
```

**Benefits:**

- ✅ One deployment handles unlimited shops
- ✅ No subdomain configuration
- ✅ No DNS management
- ✅ Easy to share links
- ✅ Professional looking URLs

---

### Database Schema

**Core Tables**

```sql
-- Users (Supabase Auth handles this)
-- We just reference auth.users(id)

-- Shops (Business/Merchant data)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Business details
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  whatsapp_number TEXT NOT NULL,

  -- Payment details
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_user_id ON shops(user_id);


-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,

  -- Product details
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_active ON products(is_active);


-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Customer details
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,

  -- Order details
  amount DECIMAL(10, 2) NOT NULL,
  payment_proof_url TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  -- pending | confirmed | shipped | delivered | cancelled

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_shop_id ON orders(shop_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);


-- Events (Analytics tracking)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Event details
  event_type TEXT NOT NULL,
  -- page_view | product_view | chat_click | buy_click | order_submit

  -- Additional context (flexible JSON)
  metadata JSONB,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_shop_id ON events(shop_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
```

**Row Level Security (RLS) Policies**

```sql
-- Shops: Users can only access their own shop
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shop"
  ON shops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own shop"
  ON shops FOR UPDATE
  USING (auth.uid() = user_id);


-- Products: Users can only manage their shop's products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own products"
  ON products FOR ALL
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );


-- Orders: Users can only see their shop's orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );


-- Events: Users can view their shop's events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (
    shop_id IN (
      SELECT id FROM shops WHERE user_id = auth.uid()
    )
  );
```

---

## 4. DESIGN SYSTEM & UI GUIDELINES

### Design Philosophy

- **Mobile-first:** Design for 375px width, scale up
- **Clean & Minimal:** Generous whitespace, clear hierarchy
- **Fast:** Optimized images, lazy loading, minimal JS
- **Accessible:** Proper contrast, semantic HTML, keyboard navigation
- **Professional:** Look like a real business, not a toy

### Color Palette

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6; /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Neutral Colors */
--gray-50: #f9fafb; /* Backgrounds */
--gray-100: #f3f4f6; /* Borders, dividers */
--gray-500: #6b7280; /* Secondary text */
--gray-700: #374151; /* Body text */
--gray-900: #111827; /* Headings */

/* Semantic Colors */
--success: #10b981; /* Green for confirmed */
--warning: #f59e0b; /* Orange for pending */
--error: #ef4444; /* Red for cancelled */
```

### Typography

```css
/* Font Family */
font-family: system-ui, -apple-system, sans-serif;

/* Scale */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
/* Tailwind default scale */
--spacing-1: 0.25rem; /* 4px */
--spacing-2: 0.5rem; /* 8px */
--spacing-3: 0.75rem; /* 12px */
--spacing-4: 1rem; /* 16px */
--spacing-6: 1.5rem; /* 24px */
--spacing-8: 2rem; /* 32px */
--spacing-12: 3rem; /* 48px */
--spacing-16: 4rem; /* 64px */
```

### Component Examples

**Button Styles**

```tsx
// Primary Button
className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium
           hover:bg-primary-600 active:bg-primary-700
           transition-colors duration-200"

// Secondary Button (Outlined)
className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg
           font-medium hover:border-gray-400 hover:bg-gray-50
           transition-colors duration-200"

// Ghost Button
className="text-primary-600 px-6 py-3 rounded-lg font-medium
           hover:bg-primary-50 transition-colors duration-200"
```

**Card Styles**

```tsx
className="bg-white rounded-2xl shadow-sm border border-gray-100
           p-6 hover:shadow-md transition-shadow duration-200"
```

**Input Styles**

```tsx
className="w-full px-4 py-3 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-primary-500
           focus:border-transparent"
```

---

_Continue to PRODUCT_SPEC.md Part 2 for detailed page implementations, API routes, and deployment instructions._

# PRODUCT_SPEC.md - Part 2: Detailed Implementation Guide

## 5. PAGE-BY-PAGE IMPLEMENTATION

### 5.1 Landing Page (`/`)

**Purpose:** Convert visitors into signups

**Layout Structure:**

```
┌─────────────────────────────────┐
│ NAVBAR                          │
│ [Logo] ShopLink    [Get Started]│
├─────────────────────────────────┤
│                                 │
│ HERO SECTION (full viewport)   │
│                                 │
│ Your WhatsApp Shop              │
│ in 5 Minutes                    │
│                                 │
│ Create a mini-shop, share one   │
│ link, get orders on WhatsApp    │
│                                 │
│ [Get Started Free →]            │
│ [View Demo Shop]                │
│                                 │
│ [Hero Image/Mockup]             │
│                                 │
├─────────────────────────────────┤
│                                 │
│ HOW IT WORKS (3 cards)          │
│                                 │
│ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │  1  │ │  2  │ │  3  │        │
│ │Setup│ │Share│ │ Sell│        │
│ └─────┘ └─────┘ └─────┘        │
│                                 │
├─────────────────────────────────┤
│                                 │
│ FEATURES (4-6 cards)            │
│                                 │
│ ✓ WhatsApp Integration          │
│ ✓ Mobile-First Design           │
│ ✓ Order Management              │
│ ✓ Simple Analytics              │
│                                 │
├─────────────────────────────────┤
│                                 │
│ PRICING (3 tiers)               │
│                                 │
│ ┌─────────────────────┐        │
│ │ Starter             │        │
│ │ ₦5,000/mo          │        │
│ │                     │        │
│ │ ✓ Unlimited products│        │
│ │ ✓ WhatsApp link     │        │
│ │ ✓ Order tracking    │        │
│ │                     │        │
│ │ [Get Started]       │        │
│ └─────────────────────┘        │
│                                 │
│ [Pro and Business tiers]        │
│                                 │
├─────────────────────────────────┤
│                                 │
│ CTA SECTION                     │
│                                 │
│ Ready to start selling?         │
│ [Get Started Free →]            │
│                                 │
├─────────────────────────────────┤
│ FOOTER                          │
│ © 2024 ShopLink                 │
│ Terms • Privacy • Contact       │
└─────────────────────────────────┘
```

**Component Breakdown:**

```tsx
// app/page.tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
```

**Hero Section Code Example:**

```tsx
function HeroSection() {
  return (
    <section className="relative bg-linear-to-b from-primary-50 to-white px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your WhatsApp Shop in{" "}
          <span className="text-primary-500">5 Minutes</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Create a mini-shop, share one link, get orders directly on WhatsApp.
          No website needed. No coding required.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
          >
            Get Started Free →
          </Link>

          <Link
            href="/demo-shop"
            className="rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Demo Shop
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-16">
          <img
            src="/hero-mockup.png"
            alt="ShopLink mini-shop preview"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
```

**How It Works Section:**

```tsx
function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Create Your Shop",
      description:
        "Enter business details and add your products. Takes 5 minutes.",
      icon: "🏪",
    },
    {
      number: "2",
      title: "Share Your Link",
      description: "One link for Instagram, WhatsApp, everywhere.",
      icon: "🔗",
    },
    {
      number: "3",
      title: "Get Orders",
      description: "Customers chat on WhatsApp or submit orders directly.",
      icon: "💬",
    },
  ];

  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          How It Works
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-3xl">
                {step.icon}
              </div>

              {/* Step Number */}
              <div className="mt-4 text-sm font-semibold text-primary-500">
                Step {step.number}
              </div>

              {/* Title */}
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Pricing Section:**

```tsx
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "5,000",
      description: "Perfect for getting started",
      features: [
        "Unlimited products",
        "WhatsApp integration",
        "Order tracking",
        "Basic analytics",
        "Mobile-optimized shop",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "15,000",
      description: "For growing businesses",
      features: [
        "Everything in Starter",
        "Custom domain",
        "Advanced analytics",
        "Priority support",
        "Remove branding",
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Business",
      price: "30,000",
      description: "For established businesses",
      features: [
        "Everything in Pro",
        "Multiple staff accounts",
        "API access",
        "White-label option",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section className="bg-gray-50 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that fits your business
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl bg-white p-8 shadow-sm ${
                plan.highlighted ? "ring-2 ring-primary-500" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₦{plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              {/* Description */}
              <p className="mt-2 text-gray-600">{plan.description}</p>

              {/* CTA Button */}
              <Link
                href="/signup"
                className={`mt-8 block w-full rounded-lg py-3 text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="h-6 w-6 shrink-0 text-primary-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 5.2 Authentication Pages

**Login Page (`/login`)**

```tsx
// app/login/page.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ShopLink</h1>
          <p className="mt-2 text-gray-600">Welcome back</p>
        </div>

        {/* Login Form */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-500 py-3 font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary-500 hover:text-primary-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Signup Page (`/signup`)** - Similar structure, different fields

---

### 5.3 Onboarding Page (`/onboarding`)

```tsx
// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    businessName: "",
    whatsappNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate slug
      let slug = generateSlug(formData.businessName);

      // Check if slug exists
      const { data: existing } = await supabase
        .from("shops")
        .select("slug")
        .eq("slug", slug)
        .single();

      // If exists, append number
      if (existing) {
        let counter = 2;
        let newSlug = `${slug}-${counter}`;
        while (true) {
          const { data: check } = await supabase
            .from("shops")
            .select("slug")
            .eq("slug", newSlug)
            .single();
          if (!check) {
            slug = newSlug;
            break;
          }
          counter++;
          newSlug = `${slug}-${counter}`;
        }
      }

      // Create shop
      const { data: shop, error: shopError } = await supabase
        .from("shops")
        .insert({
          user_id: user.id,
          business_name: formData.businessName,
          slug: slug,
          whatsapp_number: formData.whatsappNumber,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_name: formData.accountName,
        })
        .select()
        .single();

      if (shopError) throw shopError;

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Set Up Your Shop</h1>
          <p className="mt-2 text-gray-600">Tell us about your business</p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Business Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Business Information
              </h2>

              <div className="mt-4 space-y-4">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="Amaka's Footwear"
                  />
                  {formData.businessName && (
                    <p className="mt-1 text-sm text-gray-500">
                      Your shop URL: shoplink.vercel.app/
                      {generateSlug(formData.businessName)}
                    </p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        whatsappNumber: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="+234 801 234 5678"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Details
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Your customers will see these details when making payment
              </p>

              <div className="mt-4 space-y-4">
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="GTBank"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="1234567890"
                  />
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
                    placeholder="Amaka Obi"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-500 py-3 font-semibold text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? "Creating shop..." : "Continue to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

### 5.4 Mini-Shop Public Page (`/[slug]`)

**This is the MOST IMPORTANT page - where customers see products**

```tsx
// app/[slug]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function MiniShopPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch shop data
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  // Fetch active products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Track page view
  await supabase.from("events").insert({
    shop_id: shop.id,
    event_type: "page_view",
    metadata: { slug: params.slug },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center">
            {/* Logo/Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
              {shop.business_name.charAt(0).toUpperCase()}
            </div>

            {/* Business Name */}
            <h1 className="ml-3 text-xl font-bold text-gray-900">
              {shop.business_name}
            </h1>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-600">No products available yet</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600">
          <p>Powered by ShopLink</p>
        </div>
      </footer>
    </div>
  );
}
```

**Product Card Component:**

```tsx
// components/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import OrderModal from './OrderModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface Shop {
  id: string;
  business_name: string;
  whatsapp_number: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export default function ProductCard({ product, shop }: { product: Product; shop: Shop }) {
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleChatClick = async () => {
    // Track event
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: shop.id,
        product_id: product.id,
        event_type: 'chat_click',
      }),
    });

    // Format price
    const formattedPrice = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(product.price);

    // Build WhatsApp message
    const message = `Hi! I'm interested in:

📦 Product: ${product.name}
💰 Price: ${formattedPrice}
🔗 Link: ${window.location.href}

Is this available?`;

    // Clean WhatsApp number
    const cleanNumber = shop.whatsapp_number.replace(/[^0-9]/g, '');

    // Open WhatsApp
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleBuyClick = async () => {
    // Track event
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shop_id: shop.id,
        product_id: product.id,
        event_type: 'buy_click',
      }),
    });

    setShowOrderModal(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Product Image */}
        <d
```
