-- Migration: Add responsive hero images (landscape and portrait) to shops table
-- Purpose: Enable shops to have separate images for desktop and mobile displays

ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS hero_image_landscape text COMMENT 'Landscape format image for desktop displays (16:9 or similar)',
ADD COLUMN IF NOT EXISTS hero_image_portrait text COMMENT 'Portrait format image for mobile displays (9:16 or similar)',
ADD COLUMN IF NOT EXISTS hero_image_landscape_filename text,
ADD COLUMN IF NOT EXISTS hero_image_portrait_filename text;

-- Keep the old hero_image_url for backward compatibility (will show on both desktop and mobile if no landscape/portrait set)
