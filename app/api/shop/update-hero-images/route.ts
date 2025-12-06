import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function validateEnvVars() {
  if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
    return {
      valid: false,
      error: "Missing required environment variables",
    };
  }
  return { valid: true };
}

function createAdminSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration");
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const envValidation = validateEnvVars();
    if (!envValidation.valid) {
      console.error("Environment variable error:", envValidation.error);
      return NextResponse.json(
        { error: envValidation.error },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const shopId = formData.get("shopId") as string;
    const userId = formData.get("userId") as string;
    const imageType = formData.get("imageType") as "landscape" | "portrait"; // landscape or portrait
    const imageFile = formData.get("image") as File | null;
    const deleteOld = formData.get("deleteOld") === "true";

    if (!shopId || !userId || !imageType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify shop belongs to user
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, hero_image_landscape_filename, hero_image_portrait_filename")
      .eq("id", shopId)
      .eq("user_id", userId)
      .single();

    if (shopError || !shop) {
      return NextResponse.json(
        { error: "Shop not found or unauthorized" },
        { status: 404 }
      );
    }

    let newImageUrl: string | null = null;
    let newFilename: string | null = null;

    if (imageFile) {
      // Validate file
      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "File must be an image" },
          { status: 400 }
        );
      }

      if (imageFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        return NextResponse.json(
          { error: "Image must be less than 10MB" },
          { status: 400 }
        );
      }

      // Delete old image if it exists
      const oldFilenameField = `hero_image_${imageType}_filename`;
      const oldFilename = shop[oldFilenameField as keyof typeof shop];

      if (oldFilename) {
        const adminSupabase = createAdminSupabaseClient();
        await adminSupabase.storage
          .from("hero-images")
          .remove([oldFilename]);
      }

      // Upload new image to Supabase storage
      const adminSupabase = createAdminSupabaseClient();
      const filename = `${shopId}-${imageType}-${Date.now()}-${imageFile.name}`;
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error: uploadError } = await adminSupabase.storage
        .from("hero-images")
        .upload(filename, buffer, {
          contentType: imageFile.type,
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      // Get public URL
      const { data } = adminSupabase.storage
        .from("hero-images")
        .getPublicUrl(filename);

      newImageUrl = data.publicUrl;
      newFilename = filename;
    } else if (deleteOld) {
      // Delete image without uploading new one
      const oldFilenameField = `hero_image_${imageType}_filename`;
      const oldFilename = shop[oldFilenameField as keyof typeof shop];

      if (oldFilename) {
        const adminSupabase = createAdminSupabaseClient();
        await adminSupabase.storage
          .from("hero-images")
          .remove([oldFilename]);
      }
    }

    // Update shop in database
    const updateData: Record<string, string | null> = {};
    updateData[`hero_image_${imageType}`] = newImageUrl;
    updateData[`hero_image_${imageType}_filename`] = newFilename;

    const { error: updateError } = await supabase
      .from("shops")
      .update(updateData)
      .eq("id", shopId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update shop" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${imageType} image updated successfully`,
      imageUrl: newImageUrl,
    });
  } catch (err) {
    console.error("Error updating hero images:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMessage || "Failed to update hero images" },
      { status: 500 }
    );
  }
}
