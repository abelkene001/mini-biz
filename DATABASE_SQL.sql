-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id uuid,
  product_id uuid,
  event text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT analytics_pkey PRIMARY KEY (id),
  CONSTRAINT analytics_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  shop_id uuid NOT NULL,
  product_id uuid NOT NULL,
  product_name character varying NOT NULL,
  customer_name character varying NOT NULL,
  customer_phone character varying NOT NULL,
  delivery_address text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  amount numeric NOT NULL,
  payment_method character varying DEFAULT 'bank_transfer'::character varying,
  proof_filename character varying,
  order_status character varying DEFAULT 'pending'::character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
CREATE TABLE public.payment_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subscription_id uuid,
  amount_kobo integer NOT NULL,
  payment_reference text,
  payment_method text,
  status text DEFAULT 'pending'::text,
  paystack_reference text UNIQUE,
  error_message text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_records_pkey PRIMARY KEY (id),
  CONSTRAINT payment_records_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shop_id uuid,
  name text NOT NULL,
  price integer NOT NULL,
  description text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shops(id)
);
CREATE TABLE public.shops (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text,
  slug text UNIQUE,
  whatsapp_number text,
  bank_name text,
  bank_account_number text,
  bank_account_name text,
  created_at timestamp with time zone DEFAULT now(),
  hero_image_url text,
  hero_title text,
  hero_tagline text,
  CONSTRAINT shops_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan_name text DEFAULT 'starter'::text,
  plan_amount_kobo integer DEFAULT 50000,
  status text DEFAULT 'pending'::text,
  payment_reference text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone,
  expires_at timestamp with time zone,
  renewal_date timestamp with time zone,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);