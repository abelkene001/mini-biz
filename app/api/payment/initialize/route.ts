import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY!;
const adminEmail = process.env.ADMIN_EMAIL!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userId } = body;

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email and userId are required" },
        { status: 400 }
      );
    }

    // Check if user is admin (skip payment)
    if (email === adminEmail) {
      // Create a subscription record for admin with active status
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!subscription) {
        await supabase.from("subscriptions").insert([
          {
            user_id: userId,
            status: "active",
            paid_at: new Date().toISOString(),
            expires_at: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ]);
      }

      return NextResponse.json({
        status: "admin",
        message: "Admin user - payment skipped",
      });
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingSubscription && existingSubscription.status === "active") {
      return NextResponse.json({
        status: "already_paid",
        message: "User already has an active subscription",
      });
    }

    // Create or update subscription record with pending status
    const planAmountKobo = 480000; // 4800 naira in kobo

    let subscriptionId = existingSubscription?.id;

    if (!existingSubscription) {
      const { data: newSubscription } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id: userId,
            plan_amount_kobo: planAmountKobo,
            status: "pending",
          },
        ])
        .select("id")
        .single();

      subscriptionId = newSubscription?.id;
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: planAmountKobo,
          reference: `sub_${subscriptionId}_${Date.now()}`,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
          metadata: {
            userId: userId,
            subscriptionId: subscriptionId,
            planName: "starter",
          },
        }),
      }
    );

    if (!paystackResponse.ok) {
      const error = await paystackResponse.json();
      console.error("Paystack error:", error);
      return NextResponse.json(
        { error: "Failed to initialize payment with Paystack" },
        { status: 500 }
      );
    }

    const paystackData = await paystackResponse.json();

    // Store the Paystack reference in subscription
    if (subscriptionId) {
      await supabase
        .from("subscriptions")
        .update({
          payment_reference: paystackData.data.reference,
        })
        .eq("id", subscriptionId);
    }

    return NextResponse.json({
      status: "success",
      authorizationUrl: paystackData.data.authorization_url,
      accessCode: paystackData.data.access_code,
      reference: paystackData.data.reference,
      subscriptionId: subscriptionId,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
