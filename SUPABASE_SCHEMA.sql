-- Run this script in the Supabase SQL editor to create the minimal schema for the MVP

-- Shops table
create table if not exists public.shops (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  name text,
  slug text unique,
  whatsapp_number text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  created_at timestamptz default now()
);

-- Products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  name text not null,
  price int not null,
  description text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Analytics table
create table if not exists public.analytics (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  product_id uuid,
  event text not null,
  created_at timestamptz default now()
);

-- Orders table (basic)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references public.shops(id) on delete cascade,
  product_id uuid references public.products(id),
  customer_name text,
  customer_phone text,
  address text,
  amount int,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Subscriptions table (tracks payment status and subscription info)
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  plan_name text default 'starter',
  plan_amount_kobo int default 480000, -- Amount in kobo (4800 naira)
  status text default 'pending', -- pending, active, expired, cancelled
  payment_reference text unique,
  created_at timestamptz default now(),
  paid_at timestamptz,
  expires_at timestamptz,
  renewal_date timestamptz
);

-- Payment records table (audit trail of all payments)
create table if not exists public.payment_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  subscription_id uuid references public.subscriptions(id),
  amount_kobo int not null, -- Amount in kobo
  payment_reference text,
  payment_method text, -- 'paystack', etc
  status text default 'pending', -- pending, success, failed
  paystack_reference text unique,
  error_message text,
  metadata jsonb, -- Store additional Paystack response data
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
