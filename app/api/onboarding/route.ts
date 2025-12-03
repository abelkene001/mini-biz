import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessName, whatsapp, bankName, accountNumber, holderName } =
      body;
    if (!businessName)
      return NextResponse.json(
        { message: "Business name is required" },
        { status: 400 }
      );

    let slug = generateSlug(businessName);
    if (!slug) slug = "shop";

    // Ensure uniqueness by checking the shops table; append numbers if necessary
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const { data, error } = await supabase
        .from("shops")
        .select("id")
        .eq("slug", uniqueSlug)
        .limit(1);
      if (error) {
        console.warn("Error checking slug uniqueness:", error.message);
        // Don't block on DB errors; break and use current uniqueSlug
        break;
      }
      if (!data || data.length === 0) break; // unique
      counter += 1;
      uniqueSlug = `${slug}-${counter}`;
    }

    const payload = {
      name: businessName,
      slug: uniqueSlug,
      whatsapp_number: whatsapp,
      bank_name: bankName || null,
      bank_account_number: accountNumber || null,
      bank_account_name: holderName || null,
      created_at: new Date().toISOString(),
    } as any;

    // Attempt to insert into DB. If the shops table doesn't exist, return the payload for frontend use.
    const { data: insertData, error: insertError } = await supabase
      .from("shops")
      .insert([payload])
      .select()
      .limit(1);
    if (insertError) {
      console.warn("Insert shops error:", insertError.message);
      // If we can't insert, return the generated slug so the onboarding can proceed locally.
      return NextResponse.json({
        ok: true,
        shop: { ...payload, slug: uniqueSlug },
      });
    }

    return NextResponse.json({
      ok: true,
      shop: insertData?.[0] ?? { ...payload, slug: uniqueSlug },
    });
  } catch (err: any) {
    console.warn("onboarding error", err);
    return NextResponse.json(
      { message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
