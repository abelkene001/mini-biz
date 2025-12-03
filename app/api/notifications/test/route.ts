import { NextResponse } from "next/server";
import { sendTestNotification } from "@/lib/whatsappNotifications";

/**
 * Test endpoint to send a test WhatsApp notification
 * Only available in development - requires adminPhone in request
 */
export async function POST(req: Request) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Test endpoint not available in production" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { adminPhone } = body;

    if (!adminPhone) {
      return NextResponse.json(
        { error: "adminPhone is required" },
        { status: 400 }
      );
    }

    const result = await sendTestNotification(adminPhone);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Test notification sent successfully!"
        : "Failed to send test notification",
      details: result,
    });
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      {
        error: "Failed to send test notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
