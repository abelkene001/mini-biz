import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOrderNotification } from "@/lib/whatsappNotifications";

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create supabase client with safe fallback
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key"
);

// Helper function to validate required env vars
function validateEnvVars(): { valid: boolean; error?: string } {
  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      valid: false,
      error: "Supabase environment variables are not configured",
    };
  }
  return { valid: true };
}

export async function POST(req: Request) {
  try {
    // Validate environment variables
    const envValidation = validateEnvVars();
    if (!envValidation.valid) {
      console.error("Environment variable error:", envValidation.error);
      return NextResponse.json({ error: envValidation.error }, { status: 500 });
    }

    const body = await req.json();
    const {
      shopSlug,
      productId,
      customerName,
      customerPhone,
      address,
      productPrice,
      productName,
    } = body;

    if (!shopSlug || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get shop by slug to find owner's WhatsApp number
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, user_id, name, whatsapp_number")
      .eq("slug", shopSlug)
      .single();

    if (shopError || !shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          shop_id: shop.id,
          product_id: productId || null,
          customer_name: customerName,
          customer_phone: customerPhone,
          address: address || null,
          amount: productPrice || 0,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Send WhatsApp notification to shop owner
    if (shop.whatsapp_number) {
      const notificationResult = await sendOrderNotification(
        shop.whatsapp_number,
        {
          customerName,
          productName: productName || "Unknown Product",
          amount: productPrice || 0,
          customerPhone,
          shopSlug,
          orderId: order.id,
        }
      );

      // Log notification result but don't fail the order creation
      console.log("Notification result:", notificationResult);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.created_at,
      },
      message: "Order created successfully. Admin notified via WhatsApp.",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch orders for a shop
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shopSlug = searchParams.get("shopSlug");
    const status = searchParams.get("status");

    if (!shopSlug) {
      return NextResponse.json(
        { error: "shopSlug is required" },
        { status: 400 }
      );
    }

    // Get shop
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id")
      .eq("slug", shopSlug)
      .single();

    if (shopError || !shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Get orders
    let query = supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      count: orders?.length || 0,
    });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
