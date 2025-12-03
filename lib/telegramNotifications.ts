/**
 * Telegram Notification Service
 * Sends order notifications to shop admin's Telegram
 * Much simpler than WhatsApp/Twilio - only needs a Telegram Bot Token and Chat ID
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Send order notification via Telegram
 */
export async function sendOrderNotification(
  telegramChatId: string,
  orderData: {
    customerName: string;
    productName: string;
    amount: number;
    customerPhone: string;
    shopSlug: string;
    orderId: string;
  }
) {
  try {
    // If Telegram is not configured, just log and return success
    if (!TELEGRAM_BOT_TOKEN) {
      console.log(
        "Telegram bot token not configured. Skipping notification."
      );
      return {
        success: true,
        skipped: true,
        message: "Telegram not configured",
      };
    }

    // If chat ID is empty, skip notification
    if (!telegramChatId) {
      console.log(
        "Telegram chat ID not configured. Skipping notification."
      );
      return {
        success: true,
        skipped: true,
        message: "Chat ID not configured",
      };
    }

    // Create Telegram API URL
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Prepare message with formatting
    const message = `📦 *NEW ORDER RECEIVED*

*Customer:* ${escapeMarkdown(orderData.customerName)}
*Product:* ${escapeMarkdown(orderData.productName)}
*Amount:* ₦${orderData.amount.toLocaleString()}
*Phone:* ${orderData.customerPhone}

*Order ID:* \`${orderData.orderId}\`

_Click below to manage order_`;

    // Send via Telegram
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram error:", errorData);
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Telegram notification sent:", data.result?.message_id);

    return {
      success: true,
      messageId: data.result?.message_id,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    // Don't fail the order creation if notification fails
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Send test notification to verify Telegram integration
 */
export async function sendTestNotification(telegramChatId: string) {
  return sendOrderNotification(telegramChatId, {
    customerName: "Test Customer",
    productName: "Test Product",
    amount: 5000,
    customerPhone: "+234 800 000 0000",
    shopSlug: "test-shop",
    orderId: "test-order-123",
  });
}

/**
 * Escape special characters for Telegram Markdown
 */
function escapeMarkdown(text: string): string {
  const specialChars = ["_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"];
  let escaped = text;
  specialChars.forEach((char) => {
    escaped = escaped.replace(new RegExp("\\" + char, "g"), "\\" + char);
  });
  return escaped;
}
