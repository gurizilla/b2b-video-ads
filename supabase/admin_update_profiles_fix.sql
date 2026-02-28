-- 1. Create policy to allow admins to update ALL profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());
