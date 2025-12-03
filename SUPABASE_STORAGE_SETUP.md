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

If you haven't set up policies, Supabase provides default policies for public buckets. Just ensure:
1. Bucket is marked as **Public**
2. You have authenticated users (JWT tokens in Authorization header)

## Error: 400 Bad Request

If you see a **400 Bad Request** error when uploading:
1. Check that the bucket exists in Supabase Storage
2. Ensure the bucket name matches exactly: `product-images` or `shop-images`
3. Verify the bucket is set to **Public** access
4. Check your Supabase authentication is working (you should be logged into the admin dashboard)

## Testing Upload

After creating the buckets:
1. Go to Dashboard → Settings
2. Scroll to "Shop Customization"
3. Try uploading a hero image
4. The image should upload successfully and appear in your Supabase Storage

---

**Note**: These buckets store user-uploaded content and should remain public to serve images to customers on shop pages.
