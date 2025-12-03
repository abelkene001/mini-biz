# Telegram Setup Guide for Order Notifications

This guide will help you set up Telegram notifications for receiving order alerts in your Mini-Biz shop.

## Why Telegram Instead of WhatsApp?

- ✅ **Simpler Setup**: No need for external services like Twilio
- ✅ **More Reliable**: Direct API access to Telegram Bot API
- ✅ **Free**: No subscription costs
- ✅ **Better for Business**: Dedicated bot for notifications, not personal WhatsApp

## Step-by-Step Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Start a chat with BotFather
3. Send the command: `/newbot`
4. Follow the prompts to create your bot:
   - **Bot Name**: e.g., "Mini-Biz Orders" (this is what users will see)
   - **Bot Username**: e.g., "mini_biz_orders_bot" (must be unique and end with `_bot`)
5. BotFather will send you a **Bot Token** like: `123456789:ABCDefGHiJKlmnoPQRstUVwxYZ`

### 2. Get Your Telegram Chat ID

1. Start a chat with your newly created bot (search for its username)
2. Send any message to the bot
3. Go to this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. You should see a JSON response like:
   ```json
   {
     "ok": true,
     "result": [
       {
         "message": {
           "chat": {
             "id": 123456789
           }
         }
       }
     ]
   }
   ```
5. Copy the `id` value from `chat.id` - this is your **Chat ID** (e.g., `123456789`)

### 3. Configure Mini-Biz

#### In Development (.env.local):
```
TELEGRAM_BOT_TOKEN=123456789:ABCDefGHiJKlmnoPQRstUVwxYZ
```

#### In Production (Vercel):
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add: `TELEGRAM_BOT_TOKEN` with your bot token value

### 4. Add Chat ID to Your Shop Settings

1. Go to Dashboard → Settings
2. In the "Notification Preferences" section, paste your **Telegram Chat ID**
3. Click "Save Changes"

## Testing

To test if notifications work:

1. Go to your demo shop (e.g., `yourdomain.com/demo-shop/your-shop-slug`)
2. Create a test order
3. You should receive a Telegram message with the order details

## Example Notification Message

```
📦 NEW ORDER RECEIVED

Customer: John Doe
Product: Premium Sneakers
Amount: ₦5,000
Phone: +234 800 123 4567

Order ID: abc123def456
```

## Troubleshooting

### Not receiving notifications?

1. **Check Bot Token**: Make sure your Bot Token is correct in environment variables
2. **Check Chat ID**: Verify you entered the correct Chat ID in settings
3. **Bot Access**: Make sure the bot has permission to send you messages:
   - Go to Telegram settings → Privacy and security
   - Find your bot in "Blocked users" and unblock it if necessary
4. **Environment Variables**: Restart your application after adding environment variables

### How to get a new Bot Token?

If you need to regenerate your token:
1. Search for @BotFather
2. Send `/token`
3. Select your bot
4. Choose "Regenerate token"

## Need Help?

For more information about Telegram Bots, visit:
- https://core.telegram.org/bots
- https://core.telegram.org/bots/api

---

**Pro Tip**: You can manage multiple bots for different purposes (test bot, production bot, etc.)
