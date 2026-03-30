-- Drop overly permissive policies
DROP POLICY "Allow service role full access on orders" ON public.orders;
DROP POLICY "Allow service role full access on order_items" ON public.order_items;

-- No public policies - only service role (bypasses RLS) can access these tables