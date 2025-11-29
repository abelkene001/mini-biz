# AGENT.md – Project: mini-biz

> **Codename:** `mini-biz`  
> **One-liner:** “Create an app that build mini-shop for other business . Customers see products, click to chat on WhatsApp with product context, and buy via simple order forms.”

This document is your blueprint, Anti Gravity. Follow it step-by-step. Priorities: **speed**, **clarity**, **standard architecture**, and **classic clean mobile-first UI**.

---

## 1. Core Concept

ChatCart is a **mini-shop builder** for small businesses selling via WhatsApp.

- Merchant signs up → creates a mini-shop with products → gets a shareable link.
- Customer opens the mini-shop URL → sees products in a clean grid.
- Customer clicks **Chat** → opens WhatsApp with a prefilled message containing **product name, price, and shop link**.
- Customer can optionally click **Buy Now** → simple order form → merchant gets details (and optionally a WhatsApp notification with order summary).
- Merchant manages products, orders, and basic analytics in a **dashboard**.

No WhatsApp API needed. Use **click-to-chat links** only.

---

## 2. Tech Stack (Fixed)

Use the following stack unless explicitly changed:

- **Frontend & Backend:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS (classic, clean, mobile-first)
- **Database & Auth & Storage:** Supabase (PostgreSQL)
- **Deployment:** Vercel (using free Vercel domain)
- **Payments:** Paystack (for SaaS subscriptions later; phase 1 can stub)
- **WhatsApp:** `https://wa.me/` click-to-chat links

### Implementation Principles

1. **MVP First, Fancy Later**
   - Phase 1: core flows working end-to-end.
   - Avoid premature optimization and complex abstractions.
2. **Clean, Modular Structure**
   - Use app router, feature folders, clear naming.
3. **Mobile-first**
   - Design & test primarily for mobile viewport (375–430px width).
4. **Classic Styling**
   - White / light backgrounds
   - Dark gray text
   - One accent color (e.g. rich blue or subtle green)
   - Generous whitespace, simple typography, subtle shadows.

---

## 3. High-Level Features by Phase

### Phase 1 – MVP (must be delivered fast)

- [ ] Landing page
- [ ] Auth (signup / login via Supabase or magic link)
- [ ] Merchant onboarding:
  - Business Setup (business name, WhatsApp number, bank details)
  - Product creation (name, price, description, image upload)
- [ ] Mini-shop public page with slug:
  - `/{shopSlug}`
  - Product grid with [Chat] and [Buy] buttons
- [ ] WhatsApp click-to-chat with product context
- [ ] Simple “Buy Now” order form
- [ ] Orders table in dashboard
- [ ] Basic tracking: product views, chat clicks, order submits

### Phase 2 – Enhancements (after MVP is stable)

- [ ] More analytics (views, chat clicks, top products)
- [ ] Customer database
- [ ] Order statuses (pending, confirmed, shipped)
- [ ] Email notifications (optional)
- [ ] Custom domains (config only, no need to implement now)

### Phase 3 – Advanced

- [ ] Multiple product images
- [ ] Categories & filters
- [ ] Discount codes
- [ ] Shipping options
- [ ] WhatsApp Business API integration (optional, not required now)

---

## 4. Routes & Screens

### 4.1 Public Marketing Site

**Route:** `/`  
**Purpose:** Explain product, collect signups.

**Sections (mobile-first):**

1. **Hero**
   - Short headline: “Your WhatsApp shop in 5 minutes.”
   - Subtext: “Create a mini-shop, share one link, get orders directly on WhatsApp.”
   - Primary CTA: `Get Started` → `/auth/signup`
   - Secondary CTA: `View Demo Shop` → `/demo-shop` (static or seeded demo)

2. **How It Works (3 steps)**
   - Step 1: “Create your shop” – enter business details, products.
   - Step 2: “Share your link” – on Instagram, WhatsApp, etc.
   - Step 3: “Get chats & orders on WhatsApp”.

3. **Features**
   - WhatsApp integration
   - Mobile-first mini-shop
   - Simple order form
   - Basic analytics

4. **Pricing (MVP static)**
   - Starter, Pro, Business (use the provided pricing copy, but static only for now).

5. **Footer**
   - Links: Terms, Privacy, Contact (can be placeholders).

**UI Style:**

- Background: `#F9FAFB` or white
- Card backgrounds: pure white, slight shadow, `rounded-2xl`
- Typography: system fonts (`font-sans`), `font-semibold` for headings.

---

### 4.2 Auth Pages

**Routes:**

- `/auth/signup`
- `/auth/login`

Use Supabase auth (email/password or magic link). Keep UI minimal:

- Simple card with form
- “Already have an account? Login”
- “Don’t have an account? Sign up”

---

### 4.3 Onboarding Flow (Merchant)

**After signup → redirect to:** `/onboarding`

Form fields:

- Business Name
- WhatsApp Number
- Bank Name
- Bank Account Number
- Account Holder Name

On submit:

1. Generate **slug** from Business Name:
   - Lowercase
   - Remove apostrophes
   - Replace non-alphanumeric with `-`
   - Ensure uniqueness by appending `-2`, `-3` if needed.
2. Create `shops` record in DB linked to `user_id`.
3. Redirect to: `/dashboard/products` (with message: “Your mini-shop link: `https://<vercel-domain>/<shopSlug>`”).

---

### 4.4 Dashboard

**Layout:**

Route prefix: `/dashboard`  
Use a simple shell:

- Top navbar with brand name and user menu.
- Left side: minimal nav (on mobile turn into top tabs or drawer).

**Subpages:**

1. `/dashboard` – Overview
   - Show quick stats:
     - Total product views today
     - Chat clicks today
     - Orders submitted
   - List recent orders and recent inquiries.

2. `/dashboard/products`
   - List of products
   - Button: `+ Add Product`
   - Each product:
     - Name, price, active/inactive toggle, edit button.

   **Add/Edit Product Modal/Page fields:**
   - Name
   - Price (₦)
   - Description
   - Image upload (Supabase storage)
   - Active checkbox

3. `/dashboard/orders`
   - Table:
     - Order ID
     - Customer name
     - Product
     - Amount
     - Status (pending/confirmed/shipped)
     - Created time
   - Action buttons:
     - View
     - Update status (simple select or buttons)

4. `/dashboard/settings`
   - Show/update:
     - Business details
     - WhatsApp number
     - Bank details
   - Show mini-shop URL with copy button.

---

### 4.5 Mini-Shop Public Page

**Route:** `/{shopSlug}`

This page is critical. It must be:

- Very fast
- Mobile-first
- Classic and clean

**Data:**

- Fetch the shop by `slug`
- Fetch active products for that shop
- Add lightweight events for:
  - Page view (per shop)
  - Product clicks

**Layout:**

Header:

- Shop name (e.g., “Amaka’s Footwear”)
- Optional logo placeholder (initials circle)

Body:

- Product grid:
  - Mobile: 1 per row with big image
  - Tablet/desktop: 2–3 per row

Each product card:

- Product image
- Name
- Price (format `₦25,000`)
- Short description (2 lines max)
- Buttons:
  - `Chat` (outlined)
  - `Buy` (filled)

**WhatsApp "Chat" Button Logic:**

On click:

```ts
function handleChatClick(shop, product) {
  const message = `Hi! I'm interested in:

📦 Product: ${product.name}
💰 Price: ₦${product.price.toLocaleString()}
🔗 Link: ${window.location.href}

Is this available?`;

  const digitsOnly = shop.whatsapp_number.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;

  // Track inquiry in DB (best effort; don't block navigation)
  // Call API endpoint asynchronously (fire-and-forget).

  window.open(waUrl, "_blank");
}
