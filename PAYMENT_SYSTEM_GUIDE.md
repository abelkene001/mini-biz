# Payment System Architecture & Flow

## Overview

ShopZa uses **Paystack Standard** (redirect-based) payment system for subscription payments. This is the most reliable and secure approach.

## Payment Flow Diagram

```
User at /payment
    ↓
Click "Pay" Button
    ↓
POST /api/payment/initialize (with email & userId)
    ↓
Backend:
- Check if user is admin → skip payment
- Check if user already has active subscription
- Create subscription record (status: pending)
- Initialize Paystack transaction
- Return authorizationUrl
    ↓
Frontend:
- Redirect to Paystack authorization URL
- window.location.href = authorizationUrl
    ↓
User at Paystack
    ↓
User Completes Payment
    ↓
Paystack Redirects to /payment/callback?reference=XXX
    ↓
/payment/callback Page (Client Component + Suspense):
- Extract reference from URL query params
- Call POST /api/payment/verify with reference
- Backend verifies with Paystack
- Update subscription status to "active"
- Show success/failure message
- Redirect to /onboarding on success
```

## Key Files

### 1. **Frontend Pages**

#### `/app/payment/page.tsx`

- **Purpose**: Main payment initialization page
- **Type**: "use client" component
- **Flow**:
  1. Wait for auth to load
  2. User clicks "Pay" button
  3. Call `/api/payment/initialize`
  4. Redirect to Paystack authorization URL
- **Key State**:
  - `initialized`: Auth load status
  - `loading`: Payment processing
  - `error`: Error messages
  - `success`: Payment success flag

#### `/app/payment/callback/page.tsx`

- **Purpose**: Handles Paystack redirect after payment
- **Type**: "use client" component with Suspense wrapper
- **Flow**:
  1. Extract `reference` from URL query params
  2. Call `/api/payment/verify` with reference
  3. Show loading/success/failed state
  4. Redirect to `/onboarding` on success
- **Critical**:
  - Must be wrapped in Suspense boundary
  - `useSearchParams()` requires Suspense in Next.js 16+
  - Has `PaymentCallbackLoading` fallback component

### 2. **Backend API Routes**

#### `POST /api/payment/initialize`

- **Purpose**: Initialize Paystack payment
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "userId": "user-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "authorizationUrl": "https://checkout.paystack.com/...",
    "reference": "sub_uuid_timestamp",
    "subscriptionId": "subscription-uuid"
  }
  ```
- **Logic**:
  1. Validate email and userId
  2. Check if admin email → return "admin" status
  3. Check existing subscription → return "already_paid" status
  4. Create new subscription (status: pending)
  5. Call Paystack API `/transaction/initialize`
  6. Return authorization URL
- **Environment Variables**:
  - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
  - `PAYSTACK_SECRET_KEY`
  - `NEXT_PUBLIC_APP_URL` (critical for callback)
  - `SUPABASE_SERVICE_ROLE_KEY`

#### `POST /api/payment/verify`

- **Purpose**: Verify payment with Paystack
- **Request**:
  ```json
  {
    "reference": "sub_uuid_timestamp"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Payment verified"
  }
  ```
- **Logic**:
  1. Validate reference parameter
  2. Call Paystack `/transaction/verify/{reference}`
  3. Check if payment status is "success"
  4. If successful:
     - Update subscription status to "active"
     - Set expires_at to 1 year from now
     - Create payment_records entry
     - Return success response
  5. If failed:
     - Update subscription status to "pending"
     - Create payment_records entry with failed status
     - Return error response

## Database Schema

### `subscriptions` Table

```
- id: uuid (primary key)
- user_id: uuid (foreign key to auth_users)
- status: enum ('pending', 'active', 'expired')
- plan_amount_kobo: integer (480000 = ₦4800)
- payment_reference: string (Paystack reference)
- paid_at: timestamp (when payment completed)
- expires_at: timestamp (when subscription expires)
- renewal_date: timestamp (when renewal is due)
- created_at: timestamp
- updated_at: timestamp
```

### `payment_records` Table

```
- id: uuid (primary key)
- user_id: uuid
- subscription_id: uuid
- amount_kobo: integer
- paystack_reference: string
- status: enum ('success', 'failed', 'pending')
- payment_method: string ('paystack')
- metadata: jsonb (full Paystack response)
- created_at: timestamp
```

## Error Handling

### Build-Time Errors

- ✅ **"useSearchParams() should be wrapped in a suspense boundary"**
  - Fixed by wrapping callback page with `<Suspense>`
  - Added `PaymentCallbackLoading` fallback component

### Runtime Errors - Payment Initialization

- ✅ **401 Unauthorized - Invalid key**

  - Cause: Wrong Paystack secret key
  - Solution: Update `PAYSTACK_SECRET_KEY` in Vercel environment variables

- ✅ **"Failed to initialize Paystack"**
  - Cause: Missing or incorrect environment variables
  - Check: `NEXT_PUBLIC_APP_URL`, `SUPABASE_SERVICE_ROLE_KEY`, Paystack keys

### Runtime Errors - Payment Verification

- ✅ **"Payment verification failed"**
  - Cause: Paystack API returned non-success status
  - Paystack will send customer back to payment page to retry

## Environment Variables Required

```
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Paystack (Payment)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://shopza-link.vercel.app
ADMIN_EMAIL=mazipips@gmail.com

# Optional - WhatsApp Integration
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxxxx
TWILIO_WHATSAPP_NUMBER=+234901234567
```

## Testing Checklist

- [ ] Update `PAYSTACK_SECRET_KEY` in Vercel with correct live key
- [ ] Verify `NEXT_PUBLIC_APP_URL` is set to your Vercel domain
- [ ] Redeploy to Vercel (push code or manually redeploy)
- [ ] Go to https://shopza-link.vercel.app/payment
- [ ] Click "Pay" button
- [ ] Should redirect to Paystack
- [ ] Complete test payment
- [ ] Should redirect to /payment/callback
- [ ] Verify payment in console
- [ ] Should redirect to /onboarding
- [ ] Check Supabase: subscription should be "active"

## Why Paystack Standard (Not Inline)

### Advantages of Standard (Redirect)

✅ No form wrapper requirements
✅ No Suspense boundary issues
✅ Simpler implementation
✅ Paystack handles entire payment page
✅ More secure (Paystack-hosted payment form)
✅ No cross-origin issues
✅ Works on all devices/browsers

### What We Avoided (Inline)

❌ Requires form element wrapper
❌ Complex setup with PaystackPop library
❌ Prone to errors with CSP headers
❌ Difficult to handle Suspense in Next.js 16
❌ More complex error handling

## Future Improvements

1. Add payment retry logic
2. Add webhook for server-side payment confirmation
3. Add email notifications for payment status
4. Add payment history page
5. Add manual refund capability
6. Add subscription management UI
