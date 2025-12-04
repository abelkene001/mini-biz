# Paystack Production Fix Guide

## Issues Fixed

1. **Paystack Script Loading Strategy** - Changed from `lazyOnload` to `afterInteractive` for better compatibility
2. **Environment Variable for Callback URL** - Added fallback to `VERCEL_URL` for production deployments
3. **Response Validation** - Added proper null checks and validation for Paystack API responses
4. **Error Logging** - Enhanced error logging to help debug 400 Bad Request issues
5. **Access Code Parameter** - Added `accessCode` parameter to Paystack setup for better compatibility

## Production Environment Variables

To fix the "Failed to initialize Paystack" error in production, you need to set the `NEXT_PUBLIC_APP_URL` environment variable in your Vercel project settings.

### Steps to Configure on Vercel:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your **mini-biz** project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

```
Name: NEXT_PUBLIC_APP_URL
Value: https://your-vercel-domain.vercel.app
```

Replace `your-vercel-domain` with your actual Vercel domain (e.g., `mini-biz.vercel.app`)

### Example Values:

**Development (.env.local):**
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Production (Vercel):**
```
NEXT_PUBLIC_APP_URL=https://shopza-prod.vercel.app
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
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## How the Fix Works

### Before:
- Callback URL was hardcoded to `http://localhost:3000` from environment
- Paystack script strategy was `lazyOnload` which could cause timing issues
- No fallback for production environment

### After:
- Callback URL now uses:
  1. `NEXT_PUBLIC_APP_URL` if set
  2. Falls back to `https://${VERCEL_URL}` in production
  3. Falls back to `http://localhost:3000` in development
- Script loads with `afterInteractive` for better timing
- Better error logging to identify exact issues

## Testing

### In Development:
```bash
npm run dev
# Payment should work at http://localhost:3000/payment
```

### After Deploying to Vercel:
1. Set the `NEXT_PUBLIC_APP_URL` environment variable
2. Redeploy the project (or wait for auto-redeployment)
3. Test the payment flow at https://your-vercel-domain.vercel.app/payment

## Common Errors and Solutions

### Error: "Failed to initialize Paystack"
- Check that `NEXT_PUBLIC_APP_URL` is set in Vercel environment variables
- Verify Paystack keys are correct (pk_live_ and sk_live_)
- Check Vercel logs for detailed error messages

### Error: "Cannot destructure property 'language' of 'object null'"
- This is now fixed with proper response validation
- Paystack response is now checked before being used

### Error: "Please put your Paystack Inline javascript inside of a form element"
- Script loading strategy has been updated
- This should be resolved with the `afterInteractive` strategy

## Deployment Checklist

- [ ] Set `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- [ ] Verify Paystack public key starts with `pk_live_`
- [ ] Verify Paystack secret key starts with `sk_live_`
- [ ] Redeploy the project
- [ ] Test payment flow in production
- [ ] Monitor Vercel logs for any errors
