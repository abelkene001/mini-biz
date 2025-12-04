# Paystack Production Fix Guide

## Issues Fixed

1. **Paystack Script Loading Strategy** - Changed from `lazyOnload` to `afterInteractive` for better compatibility
2. **Environment Variable for Callback URL** - Added fallback to `VERCEL_URL` for production deployments
3. **Response Validation** - Added proper null checks and validation for Paystack API responses
4. **Error Logging** - Enhanced error logging to help debug 400 Bad Request issues
5. **Access Code Parameter** - Added `accessCode` parameter to Paystack setup for better compatibility
6. **URL Logic** - Fixed URL determination with proper priority (NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost)
7. **Error Handling** - Added comprehensive error handling for Supabase queries

## Production Environment Variables

To fix the "Failed to initialize Paystack" error in production, you need to set the `NEXT_PUBLIC_APP_URL` environment variable in your Vercel project settings.

### Steps to Configure on Vercel:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your **mini-biz** project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://shopza-link.vercel.app
```

Replace `shopza-link` with your actual Vercel domain name.

### Example Values:

**Development (.env.local):**

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production (Vercel):**

```
NEXT_PUBLIC_APP_URL=https://shopza-link.vercel.app
```

### All Required Environment Variables for Production:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+234901234567

# Admin
ADMIN_EMAIL=your_admin_email@example.com

# App URL (IMPORTANT FOR PRODUCTION)
NEXT_PUBLIC_APP_URL=https://shopza-link.vercel.app
```

## How the Fix Works

### Before:

- Callback URL was hardcoded to `http://localhost:3000` from environment
- Paystack script strategy was `lazyOnload` which could cause timing issues
- No fallback for production environment
- Errors from Supabase were not properly logged

### After:

- Callback URL now uses intelligent logic:
  1. `NEXT_PUBLIC_APP_URL` if explicitly set (priority for Vercel)
  2. Falls back to `https://${VERCEL_URL}` in production
  3. Falls back to `http://localhost:3000` in development
- Script loads with `afterInteractive` for better timing
- Better error logging including environment variable values
- Comprehensive error handling for all Supabase operations

## Debugging 500 Errors

If you're getting a 500 error on the `/api/payment/initialize` endpoint, follow these steps:

### Step 1: Check Vercel Logs
1. Go to your Vercel project dashboard
2. Click **Settings** → **Monitoring** or **Logs**
3. Look for requests to `/api/payment/initialize`
4. Check the error details - they should now include:
   - Which operation failed (Supabase query, Paystack call, etc.)
   - The specific error message
   - Environment variable values for debugging

### Step 2: Verify Environment Variables
1. Check that all required environment variables are set in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `NEXT_PUBLIC_APP_URL` ← **CRITICAL**
   - `ADMIN_EMAIL`

2. Test by accessing the payment page - errors should now show in console:
   - "Failed to check subscription status" - Supabase select error
   - "Failed to create subscription record" - Supabase insert error
   - "Failed to initialize payment with Paystack" - Paystack API error

### Step 3: Common Causes of 500 Error

**❌ Issue: NEXT_PUBLIC_APP_URL not set**
- Solution: Add it to Vercel environment variables
- Test: Should show proper callback URL in Vercel logs

**❌ Issue: SUPABASE_SERVICE_ROLE_KEY is missing or invalid**
- Solution: Get it from Supabase dashboard → Settings → API
- Test: Try creating a subscription in Supabase directly

**❌ Issue: Subscriptions table doesn't exist or schema is wrong**
- Solution: Run migrations in Supabase
- Check Supabase tables to verify `subscriptions` table exists

**❌ Issue: Paystack credentials are invalid**
- Solution: Verify `PAYSTACK_SECRET_KEY` starts with `sk_live_`
- Test: Check if the key works in Paystack dashboard

### Step 4: Manual Testing

If the payment page still fails, test the API directly:

```bash
# From your terminal
curl -X POST https://shopza-link.vercel.app/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "userId": "test-user-123"
  }'
```

This should return either:
- Success: `{ status: "success", authorizationUrl: "...", ... }`
- Error with details about what failed

## Testing

### In Development:

```bash
npm run dev
# Payment should work at http://localhost:3000/payment
```

### After Deploying to Vercel:

1. Set all environment variables in Vercel dashboard
2. Redeploy the project (or wait for auto-redeployment)
3. Check Vercel logs while testing
4. Test the payment flow at https://shopza-link.vercel.app/payment

## Common Errors and Solutions

### Error: "Failed to initialize Paystack"

- Check that `NEXT_PUBLIC_APP_URL` is set in Vercel environment variables
- Verify Paystack keys are correct (pk_live_ and sk_live_)
- Check Vercel logs for detailed error messages
- Verify Supabase credentials are correct

### Error: "Cannot destructure property 'language' of 'object null'"

- This is now fixed with proper response validation
- Paystack response is now checked before being used

### Error: "Please put your Paystack Inline javascript inside of a form element"

- Script loading strategy has been updated
- This should be resolved with the `afterInteractive` strategy

### Error: "Failed to check subscription status"

- Issue with Supabase connection or permissions
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify `subscriptions` table exists and has correct schema

### Error: "Failed to create subscription record"

- Supabase insert is failing
- Check table schema and column names
- Verify user has permission to insert
- Check if user_id column constraint is satisfied

## Deployment Checklist

- [ ] Verify all environment variables are set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` is set to your Vercel domain
- [ ] Paystack public key starts with `pk_live_`
- [ ] Paystack secret key starts with `sk_live_`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is the full service role key
- [ ] Subscriptions table exists in Supabase
- [ ] Redeploy the project after adding variables
- [ ] Test payment flow in production
- [ ] Monitor Vercel logs for any errors
- [ ] Check console logs in browser for error messages
