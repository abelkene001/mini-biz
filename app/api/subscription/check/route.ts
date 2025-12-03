import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminEmail = process.env.ADMIN_EMAIL!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required", isActive: false },
        { status: 400 }
      );
    }

    // Get user from auth to check if admin
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found", isActive: false },
        { status: 404 }
      );
    }

    // Check if user is admin
    if (user.email === adminEmail) {
      return NextResponse.json({
        isActive: true,
        isAdmin: true,
        message: "Admin user - no payment required",
      });
    }

    // Check subscription status
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !subscription) {
      return NextResponse.json({
        isActive: false,
        message: "No subscription found",
      });
    }

    // Check if subscription is active and not expired
    const now = new Date();
    const expiresAt = subscription.expires_at
      ? new Date(subscription.expires_at)
      : null;
    const isActive =
      subscription.status === "active" && (!expiresAt || expiresAt > now);

    return NextResponse.json({
      isActive,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        expiresAt: subscription.expires_at,
      },
      message: isActive
        ? "Subscription is active"
        : "Subscription is inactive or expired",
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: "Internal server error", isActive: false },
      { status: 500 }
    );
  }
}
