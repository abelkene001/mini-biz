# Shopza Ads System – Implementation Guide (SAFE UPGRADE)

> **Goal:** Add a **non-breaking** “AI-powered Ad Creator” to Shopza so that a user can:
>
> 1. Select an existing product
> 2. Generate target audience + ad copy using a free AI provider
> 3. Auto-fill a Canva template with that content
> 4. Launch a Meta (Facebook/Instagram) ad from their own ad account  
>    **without** breaking or altering existing Shopza core functionality.

---

## 1. High-Level Overview

We are extending the existing **Shopza** platform, which already supports:

- User accounts
- Product listing (title, description, images, price, etc.)
- Product pages hosted on Shopza (mini-shop style)

We want to add a new **Ads module** with these capabilities:

1. **“Promote Product” Action**  
   From the product list or product detail, the user can click **“Promote / Run Ad”**.

2. **AI Audience & Copy Generation**

   - Infer a target audience for the product using a **free text AI provider** (e.g. Google Gemini).
   - Generate ad copy (headline + primary text + optional short description + CTA).

3. **Canva Template Workflow (Embed API)**

   - Open Canva **inside Shopza** using the Embed API.
   - Pre-fill a chosen template with:
     - Product image
     - Product title
     - Price
     - AI-generated ad copy / CTA

4. **Meta Ads Launch (Meta Marketing API)**

   - Connect the seller’s own Meta ad account (OAuth flow).
   - Create campaign + ad set + ad creative using:
     - Canva-exported image
     - AI-generated ad copy
     - Inferred audience
   - Start the ad **under the user’s ad account**, not Shopza’s.

5. **Safety & Stability**
   - This module must be **additive**, not destructive.
   - No breaking changes to existing product workflows.
   - No downtime for Shopza.
   - All new code must be behind **feature flags / dedicated routes / new UI elements**.

---

## 2. Assumptions About Existing Project

> If any assumption is wrong, **do not modify existing critical logic**. Prefer creating new modules and keeping the code isolated.

Assume:

- There is an authenticated user system (Seller accounts).
- There is a `Product` entity with at least:
  - `id`
  - `ownerId` (or equivalent)
  - `title`
  - `description`
  - `price`
  - `images[]` (at least one image URL)
- Product pages are already working in production.
- The project is already deployed on Vercel (or similar) and live traffic exists.

---

## 3. Non-Goals (DO NOT DO)

The agent **must NOT**:

1. **Modify or delete** any existing product CRUD behavior.
2. **Change database schema in a way that breaks existing queries.**
   - If migrations are needed, they must be strictly _additive_ (e.g. adding new optional columns or new tables).
3. **Rename or remove existing API endpoints or frontend routes.**
4. **Change authentication logic** or login/signup flows.
5. **Break existing environment variable usage** or overwrite current values.
6. **Introduce blocking dependencies** that prevent the app from building without all new env vars set.
   - Use safe fallbacks and feature flags.
7. **Auto-launch ads without explicit user confirmation.**

---

## 4. New Modules / Components

### 4.1 Ads Domain Overview

New features will be organized into these modules:

1. **AI Service Layer**

   - A wrapper around an AI text provider (initially using a **free or low-cost provider** such as Google Gemini).
   - Capabilities:
     - Audience inference
     - Ad copy generation

2. **Meta Integration Layer**

   - Handles OAuth / permissions for the user to connect their Meta ad account.
   - Handles calls to the Meta Marketing API:
     - Create campaign
     - Create ad set
     - Create ad creative
     - Start/pause ads

3. **Canva Integration Layer**

   - Uses **Canva Embed API** to load pre-defined ad templates inside Shopza.
   - Receives:
     - Product image URL
     - Title
     - Price
     - Generated ad copy + CTA

4. **Ads UI Flow**

   - New UI entry point: “Promote Product”.
   - Steps:
     1. Select product
     2. Audience + ad copy preview (AI-assisted)
     3. Template selection + Canva preview
     4. Confirm & launch Meta ad

5. **Ads Data Model**
   - New tables / collections for storing:
     - AI-generated audience suggestions
     - AI-generated ad copies
     - Ad campaigns metadata (Shopza-side reference to Meta campaign / ad set / ad ID)
   - This MUST be **additive**, not modifying existing tables in a breaking way.

---

## 5. Data Model (Additive Only)

> **Important:** add new tables or optional columns only. Do not remove or change types of existing fields.

### 5.1 Suggested New Table: `ShopzaAdDraft`

Purpose: store intermediate state between AI generation, design, and Meta launch.

Fields (adjust naming/ORM as needed):

- `id` – primary key
- `ownerId` – foreign key to User/Seller
- `productId` – foreign key to Product
- `status` – enum/string: `"draft" | "ready_for_design" | "design_complete" | "ready_for_launch" | "launched" | "failed"`
- `aiAudienceJson` – JSON (inferred audience object)
- `aiCopyJson` – JSON (headline, primary text, CTA, optional variations)
- `selectedTemplateId` – string (ID of Canva template used)
- `finalCreativeUrl` – string (exported image URL from Canva)
- `metaCampaignId` – string (Meta campaign ID)
- `metaAdSetId` – string
- `metaAdId` – string
- `createdAt`, `updatedAt` – timestamps

All fields except `id`, `ownerId`, `productId`, timestamps can be **nullable** to avoid strict coupling.

---

## 6. AI Service Layer

Create an internal abstraction so we can easily swap providers later.

### 6.1 Interface (Conceptual)

```ts
interface AdAudience {
  ageMin: number;
  ageMax: number;
  gender: "male" | "female" | "all";
  locations: string[];         // e.g. ["Lagos", "Abuja"] or ["Nigeria"]
  interests: string[];         // e.g. ["wigs", "beauty", "online shopping"]
  painPoint: string;           // main problem solved
  angle: string;               // marketing angle
}

interface AdCopy {
  headline: string;
  primaryText: string;
  callToAction: string;        // e.g. "Shop Now", "Send Message"
  shortDescription?: string;
}

interface AiProvider {
  inferAudienceFromProduct(product: Product, userHints?: UserHint): Promise<AdAudience>;
  generateAdCopy(product: Product, audience: AdAudience): Promise<AdCopy>;
}
6.2 Implementation Requirements
Provide a concrete implementation that uses a free or cheap text AI provider (e.g. Google Gemini).

The implementation must:

Read API keys from environment variables.

Fail gracefully if env vars are missing (e.g. log and return a basic non-AI fallback copy instead of crashing).

All prompts must be idempotent and safe. No user data beyond what’s needed.

6.3 Safety Rules
If the AI API fails:

Do NOT crash the entire app.

Return a human-readable error and a safe default ad copy (e.g. simple template).

Do NOT send sensitive user data beyond product info and basic audience hints.

7. Meta Integration Layer
7.1 OAuth & Account Linking
Implement a standard Meta OAuth flow with:

A “Connect Facebook/Instagram Ads” button in user settings or in the ad creation flow.

Redirect user to Meta to grant:

Ads management permissions

Page management (if needed)

Store:

Meta user_access_token (short-lived)

A long-lived token or a refresh mechanism if available

Linked ad account ID(s)

Do NOT overwrite any existing OAuth implementation for other services. Keep Meta-specific logic in its own module.

7.2 Ad Creation Flow
Given:

ShopzaAdDraft with:

productId

aiAudienceJson

aiCopyJson

finalCreativeUrl

Linked Meta ad account information

Steps:

Create a Campaign (if none exists for this product):

Objective: e.g. traffic or messages (depending on CTA).

Create an Ad Set:

Targeting:

Age range from aiAudience

Gender

Locations

Interests (if supported)

Daily budget (can be user-provided).

Placements: use defaults or safe presets.

Create an Ad:

Use the creative from Canva (finalCreativeUrl).

Use AdCopy headline + primary text + CTA.

Store returned IDs back into ShopzaAdDraft.

7.3 Safety Rules
Do NOT attempt to bypass Meta policies or review flow.

Do NOT use Shopza’s own ad account for users; always use the user’s linked account.

If Meta API calls fail:

Mark draft status as "failed".

Store error message.

Show non-technical error to user.

8. Canva Integration Layer
8.1 Usage
We will use Canva Embed API:

Open Canva editor inside Shopza (iframe-like behavior).

Pre-configure it with:

A chosen template ID from a list of Shopza-managed templates.

Product image URL.

Text placeholders (title, price, AI copy).

8.2 Flow
User picks a template in Shopza.

We open Canva embed with:

Template reference

Pre-filled data (if supported by the embed mode).

User edits or approves design.

On “Export”/”Done”, Canva returns:

Exported image URL (or we download and host ourselves).

Save this URL into ShopzaAdDraft.finalCreativeUrl.

8.3 Safety Rules
Ensure Canva embed only appears for authenticated and authorized users.

Do NOT break existing UI layouts.

If Canva fails to load:

Show a helpful message and avoid crashing the page.

9. UI / UX Flows
9.1 New Entry Point: “Promote Product”
Add a non-intrusive button to existing product UI:

On product list row: Promote

On product detail page: Promote this product

Clicking this should:

Create or fetch a ShopzaAdDraft for that product.

Start the Ad Creation Wizard.

9.2 Ad Creation Wizard – Steps
Step 1: Audience & Objective

Show basic product info.

Ask a few simple optional questions (with defaults):

“Who is this mainly for?” → Men / Women / Both

“Age range?” → pre-defined ranges or “Let Shopza decide”

“Where are your buyers?” → My city / My state / All Nigeria

Call inferAudienceFromProduct with these hints.

Show AI-suggested audience summary:

e.g. “Women, 22–35, living in Lagos, Abuja, and Port Harcourt, interested in wigs and beauty.”

Allow user to:

Approve

Make small edits (optional)

Step 2: Ad Copy

Call generateAdCopy with product + audience.

Show:

Headline

Primary text

CTA

Allow user to:

Approve

Edit text manually

Save into ShopzaAdDraft.aiCopyJson.

Step 3: Design (Canva)

Show list of Shopza-branded templates.

User picks one.

Open Canva embed with:

Product image

Title

Price

AI copy text

After the user confirms & exports, store final image URL in ShopzaAdDraft.finalCreativeUrl.

Step 4: Launch Ad

If user’s Meta account is not connected:

Ask them to connect via OAuth.

Ask for:

Daily budget

Campaign duration (or use a default end date)

Call Meta API to create campaign + ad set + ad.

On success:

Mark ShopzaAdDraft.status = "launched".

Show confirmation with basic details.

10. Environment Variables (New)
Add new env vars in a non-breaking way:

AI_PROVIDER (e.g. "google")

AI_GOOGLE_API_KEY (or similar, depending on the provider)

META_APP_ID

META_APP_SECRET

META_REDIRECT_URI

CANVA_EMBED_API_KEY (if required)

Any other keys required by the providers

Requirements:

If these env vars are missing, the app must still build and run.

Ads features should be hidden or disabled gracefully when config is incomplete.

11. Safety & Testing Requirements
Feature Flag

Wrap all new Ads UI in a configuration flag (e.g. ENABLE_ADS_MODULE).

When false or unset:

Hide all “Promote product” buttons.

Skip initializing Ads-related services.

Migration Safety

If adding DB tables or columns, use additive migrations.

Test both:

With no Ads usage

With Ads usage

Build & Runtime Safety

Ensure the app builds successfully even if:

AI API keys are missing

Meta keys are missing

Canva keys are missing

In such cases, disable related features instead of throwing.

No Changes to Existing Routes

Create new routes for Ads (e.g. /ads/* or /api/ads/*).

Do NOT change existing route handlers for products, auth, or checkout.

Logging

Log AI failures, Meta API errors, and Canva issues.

Avoid logging sensitive tokens.

12. Implementation Order (For the Agent)
Scaffold Ads Data Model

Add ShopzaAdDraft table/collection and related ORM models.

Add AI Provider Abstraction

Define interfaces.

Add initial Google/free LLM implementation.

Add safe fallbacks.

Add Meta Integration (Backend)

OAuth connect endpoint.

Basic API call wrapper.

Functions to create campaign, ad set, ad.

Add Canva Integration

Embed setup.

Template selection UI.

Export/finish callback that saves creative URL.

Build Ad Creation Wizard Frontend

Step 1: Audience

Step 2: Copy

Step 3: Design

Step 4: Launch

Integrate “Promote Product” Button

Add in product list + detail pages.

Respect feature flag.

Testing

Manual tests:

Existing core flows still work (view, create, edit product).

Ads flow works with correct env vars.

Site still builds and works when Ads env vars are missing → Ads UI hidden.

13. Summary
This document describes an additive Ads module for Shopza that:

Reuses existing products.

Uses a free or low-cost AI provider only for text (audience + ad copy).

Integrates Canva Embed API for visuals.

Uses Meta Marketing API to launch ads under the user’s ad account.

Is designed to NOT break existing Shopza functionality:

New DB table

New routes

Feature flags

Safe fallbacks when env vars are missing

All changes must respect these principles:

Add, don’t break.

Fail gracefully.

Keep existing Shopza live and stable.
```
