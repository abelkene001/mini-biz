# WhatsApp Notification System Setup Guide

## Overview

ShopLink now sends real-time WhatsApp notifications to shop owners whenever they receive a new order. This uses **Twilio's WhatsApp Business API** integrated with Supabase orders.

## How It Works

1. **Customer Places Order** → Order submitted via demo shop or direct link
2. **Order Created** → Data saved to Supabase `orders` table
3. **Admin Notified** → Twilio sends WhatsApp message to admin's phone
4. **Message Includes** → Customer name, product, amount, and link to sales dashboard

## System Architecture

```
Customer Order
     ↓
/api/orders (POST)
     ↓
Save to Supabase
     ↓
Get Admin WhatsApp #
     ↓
Twilio WhatsApp API
     ↓
Admin Receives Message
```

## Setup Instructions

### Step 1: Create Twilio Account

1. Go to https://www.twilio.com/console
2. Sign up and create an account
3. Add a payment method (WhatsApp requires verified account)

### Step 2: Enable WhatsApp Business

1. In Twilio Console, go to **Messaging → Channels**
2. Click **Connect to WhatsApp Business Account** or **Create New Business Account**
3. Follow setup wizard to verify your business
4. Accept WhatsApp terms

### Step 3: Get WhatsApp Credentials

1. Go to **Messaging → Channels → WhatsApp**
2. Your **WhatsApp Number** (e.g., +1234567890) will be displayed
3. Go to **Account Info → API Keys & Tokens**
4. Copy:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (your API key)

### Step 4: Configure Environment Variables

Add to `.env.local`:

```dotenv
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890
```

### Step 5: Update Shop Admin Phone During Onboarding

When creating a shop, admin must enter their WhatsApp number in the **WhatsApp Number** field during onboarding. The system will use this to send notifications.

## Testing

### Test 1: Send Test Notification

```bash
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -d '{"adminPhone": "+234801234567"}'
```

Response:

```json
{
  "success": true,
  "message": "Test notification sent successfully!",
  "details": {
    "success": true,
    "messageSid": "SM1234567890abcdef",
    "timestamp": "2025-12-02T10:00:00.000Z"
  }
}
```

### Test 2: Create Test Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shopSlug": "your-shop-name",
    "customerName": "John Doe",
    "customerPhone": "+2348012345678",
    "productName": "Premium Shoes",
    "productPrice": 5000,
    "address": "123 Main Street"
  }'
```

The admin should receive a WhatsApp message within seconds.

## API Endpoints

### POST /api/orders

Create a new order and send notification

**Request:**

```json
{
  "shopSlug": "my-shop",
  "productId": "uuid-optional",
  "customerName": "Jane Doe",
  "customerPhone": "+2348012345678",
  "address": "Lagos, Nigeria",
  "productPrice": 25000,
  "productName": "Blue Handbag"
}
```

**Response:**

```json
{
  "success": true,
  "order": {
    "id": "order-uuid",
    "status": "pending",
    "createdAt": "2025-12-02T10:00:00Z"
  },
  "message": "Order created successfully. Admin notified via WhatsApp."
}
```

### GET /api/orders?shopSlug=my-shop&status=pending

Fetch orders for a shop

**Response:**

```json
{
  "success": true,
  "orders": [...],
  "count": 5
}
```

### POST /api/notifications/test (Development Only)

Send test notification to test WhatsApp setup

**Request:**

```json
{
  "adminPhone": "+234801234567"
}
```

## Message Format

Orders send WhatsApp messages in this format:

```
📦 *NEW ORDER RECEIVED* 📦

Customer: John Doe
Product: Premium Shoes
Amount: ₦25,000
Customer Phone: +2348012345678

🔗 View in Sales: http://localhost:3000/dashboard/sales

Order ID: abc123def456
```

## Phone Number Format Support

The system automatically converts phone numbers to E.164 format:

- `08012345678` → `+234801234567`
- `+234 801 234 5678` → `+234801234567`
- `2348012345678` → `+234801234567`
- `+2348012345678` → `+234801234567` (already correct)

## Troubleshooting

### "Failed to send WhatsApp notification"

**Cause**: Twilio credentials incorrect or WhatsApp not connected

**Fix**:

1. Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in `.env.local`
2. Test: `curl https://api.twilio.com/2010-04-01/Accounts` with your credentials
3. Ensure WhatsApp Business Account is verified in Twilio Console

### Admin Never Receives Messages

**Cause**: Admin WhatsApp number not saved or in wrong format

**Fix**:

1. Check shop record in Supabase - verify `whatsapp_number` field
2. Ensure number includes country code: `+234...`
3. Test with `/api/notifications/test` endpoint

### Message Has Formatting Issues

**Cause**: Phone number format or message encoding

**Fix**:

1. Check that phone numbers are in E.164 format (with + and country code)
2. Ensure customer name/product name don't have special characters

### Twilio Authentication Failed

**Cause**: Invalid Account SID or Auth Token

**Fix**:

1. Go to Twilio Console → Account Info
2. Verify **Account SID** starts with `AC`
3. Regenerate Auth Token if needed
4. Copy entire token (don't truncate)

## Costs & Limits

- **Twilio WhatsApp**: ~$0.0675 per message (rates vary by country)
- **Rate Limits**: 60 messages/minute per number (can be increased)
- **Sandbox**: Twilio WhatsApp Sandbox available for free testing

## Production Deployment

Before going live:

1. ✅ Get Twilio production credentials (not sandbox)
2. ✅ Verify WhatsApp Business Account
3. ✅ Test with real phone numbers
4. ✅ Update `TWILIO_WHATSAPP_NUMBER` to your production number
5. ✅ Set proper error handling and logging
6. ✅ Monitor Twilio logs for delivery failures

## Advanced: Custom Message Templates

To add message templates for different order types, edit `lib/whatsappNotifications.ts`:

```typescript
// Add custom templates
const templates = {
  newOrder: (data) => `...`,
  paymentReceived: (data) => `...`,
  orderShipped: (data) => `...`,
};
```

Then use in API routes:

```typescript
const message = templates.newOrder(orderData);
```

## Support

- Twilio Documentation: https://www.twilio.com/docs/whatsapp
- WhatsApp Business Requirements: https://www.twilio.com/docs/whatsapp/get-started
- Issue Tracking: Check your Twilio console logs
