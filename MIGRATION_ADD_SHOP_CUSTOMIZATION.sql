-- Migration: Add shop customization columns
-- Run this in Supabase SQL editor to add hero customization fields to shops table

ALTER TABLE public.shops 
ADD COLUMN hero_image_url text,
ADD COLUMN hero_title text,
ADD COLUMN hero_tagline text;

-- Add comments for documentation
COMMENT ON COLUMN public.shops.hero_image_url IS 'URL of the hero section background image';
COMMENT ON COLUMN public.shops.hero_title IS 'Main title displayed in hero section (100 char limit)';
COMMENT ON COLUMN public.shops.hero_tagline IS 'Tagline displayed under hero title (150 char limit)';
