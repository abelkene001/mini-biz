import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Environment variable validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

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
  if (!paystackSecretKey) {
    return {
      valid: false,
      error: "Paystack environment variables are not configured",
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
      return NextResponse.json(
        { error: envValidation.error },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { reference, subscriptionId } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    if (!paystackResponse.ok) {
      console.error("Paystack verification failed");
      return NextResponse.json(
        { error: "Failed to verify payment with Paystack" },
        { status: 500 }
      );
    }

    const paystackData = await paystackResponse.json();

    // Check if payment was successful
    if (paystackData.data.status !== "success") {
      // Update payment record with failed status
      if (subscriptionId) {
        await supabase
          .from("subscriptions")
          .update({
            status: "pending",
          })
          .eq("id", subscriptionId);

        await supabase.from("payment_records").insert([
          {
            user_id: paystackData.data.metadata?.userId,
            subscription_id: subscriptionId,
            amount_kobo: paystackData.data.amount,
            paystack_reference: reference,
            status: "failed",
            payment_method: "paystack",
            metadata: paystackData.data,
          },
        ]);
      }

      return NextResponse.json(
        { error: "Payment was not successful", status: "failed" },
        { status: 400 }
      );
    }

    // Payment successful - update subscription and payment records
    const userId = paystackData.data.metadata?.userId;
    const planAmountKobo = paystackData.data.amount;
    const paidAt = new Date(paystackData.data.paid_at);
    const expiresAt = new Date(paidAt.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year validity

    // Update subscription to active
    const { data: updatedSubscription } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        paid_at: paidAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        renewal_date: expiresAt.toISOString(),
      })
      .eq("id", subscriptionId)
      .select()
      .single();

    // Create payment record
    await supabase.from("payment_records").insert([
      {
        user_id: userId,
        subscription_id: subscriptionId,
        amount_kobo: planAmountKobo,
        paystack_reference: reference,
        status: "success",
        payment_method: "paystack",
        metadata: paystackData.data,
      },
    ]);

    return NextResponse.json({
      status: "success",
      message: "Payment verified successfully",
      subscription: updatedSubscription,
      paymentDetails: {
        reference,
        amount: planAmountKobo / 100, // Convert kobo to naira
        paidAt: paidAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
