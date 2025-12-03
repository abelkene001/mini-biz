/**
 * WhatsApp Notification Service using Twilio
 * Sends order notifications to shop admin's WhatsApp
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER!; // Our Twilio WhatsApp number
const ADMIN_SHOP_NOTIFICATION_NUMBER = "+234 707 426 4694"; // Notification hub number

/**
 * Send order notification via WhatsApp
 */
export async function sendOrderNotification(
  adminWhatsappNumber: string,
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
    // Format phone number (ensure it has + and country code)
    const formattedAdminNumber = formatPhoneNumber(adminWhatsappNumber);
    const formattedNotificationNumber = formatPhoneNumber(
      ADMIN_SHOP_NOTIFICATION_NUMBER
    );

    // Create Twilio API URL
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    // Prepare message
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const salesPageLink = `${appUrl}/dashboard/sales`;

    const message = `📦 *NEW ORDER RECEIVED* 📦

Customer: ${orderData.customerName}
Product: ${orderData.productName}
Amount: ₦${orderData.amount.toLocaleString()}
Customer Phone: ${orderData.customerPhone}

🔗 View in Sales: ${salesPageLink}

Order ID: ${orderData.orderId}`;

    // Send via Twilio
    const params = new URLSearchParams();
    params.append("From", `whatsapp:${TWILIO_WHATSAPP_NUMBER}`);
    params.append("To", `whatsapp:${formattedAdminNumber}`);
    params.append("Body", message);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Twilio error:", errorData);
      throw new Error(`Twilio API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("WhatsApp notification sent:", data.sid);

    return {
      success: true,
      messageSid: data.sid,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string {
  // Remove any spaces, dashes, or parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // If it doesn't start with +, add it
  if (!cleaned.startsWith("+")) {
    // If it starts with 0 (Nigerian format), remove it and add country code
    if (cleaned.startsWith("0")) {
      cleaned = "+234" + cleaned.slice(1);
    } else if (!cleaned.startsWith("234")) {
      // Assume it's Nigeria if no country code
      cleaned = "+234" + cleaned;
    } else {
      cleaned = "+" + cleaned;
    }
  }

  return cleaned;
}

/**
 * Test notification (for development)
 */
export async function sendTestNotification(adminWhatsappNumber: string) {
  return sendOrderNotification(adminWhatsappNumber, {
    customerName: "Test Customer",
    productName: "Test Product",
    amount: 5000,
    customerPhone: "+2348012345678",
    shopSlug: "test-shop",
    orderId: "TEST_" + Date.now(),
  });
}
