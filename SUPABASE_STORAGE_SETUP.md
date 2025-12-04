# Supabase Storage Bucket Setup

## Required Storage Buckets

You need to create two storage buckets in your Supabase project:

### 1. Product Images Bucket

- **Name**: `product-images`
- **Access**: Public
- **Used for**: Product photos in admin dashboard

### 2. Shop Images Bucket

- **Name**: `shop-images`
- **Access**: Public
- **Used for**: Hero section images for shop customization

## How to Create Buckets

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **Create New Bucket**
5. Fill in the bucket details:
   - **Bucket name**: `product-images` (first bucket)
   - **Privacy**: Select **Public** (allows unauthenticated reads)
   - Click **Create bucket**
6. Repeat for `shop-images` bucket

## Storage Policies

Both buckets need the following policies to allow uploads:

### Public Read Access (Default)

- Allow anyone to read objects in the bucket

### Authenticated Upload Access

- Allow authenticated users to upload files

### Setting Up Policies (If Needed)

If you're getting a **400 Bad Request** error even with the bucket created, you need to set up storage policies:

1. Go to **Storage** → Select the bucket (`shop-images` or `product-images`)
2. Click **Policies** tab
3. Look for existing policies - if none exist, click **Create Policy**
4. Select **For authenticated users** template
5. Choose the operation: **CREATE** (for uploads)
6. Leave the default conditions and click **Review**
7. Click **Create policy**

**Quick checklist:**

- Bucket is marked as **Public** ✓
- Bucket has an authenticated **CREATE** policy ✓
- You are logged in (authenticated) in the admin dashboard ✓

## Error: 400 Bad Request

If you see a **400 Bad Request** error when uploading:

### Checklist:

1. ✓ Check that the bucket exists in Supabase Storage
2. ✓ Ensure the bucket name matches exactly: `product-images` or `shop-images`
3. ✓ Verify the bucket is set to **Public** access
4. ✓ **Check Storage Policies** - This is the most common issue!
   - Go to Storage → Select bucket → Policies tab
   - Ensure there's a policy that allows authenticated users to CREATE (upload) files
   - If no policies exist, add one using the "For authenticated users" template
5. ✓ Check your Supabase authentication is working (you should be logged into the admin dashboard)

### Most Common Fix:

If you created the bucket but forgot to set up policies, storage operations will fail with 400 errors. **Add storage policies** as described above in the "Setting Up Policies" section.

## Testing Upload

After creating the buckets:

1. Go to Dashboard → Settings
2. Scroll to "Shop Customization"
3. Try uploading a hero image
4. The image should upload successfully and appear in your Supabase Storage

---

**Note**: These buckets store user-uploaded content and should remain public to serve images to customers on shop pages.
