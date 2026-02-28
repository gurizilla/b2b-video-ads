-- 1. Add the is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Create policy to allow admins to see ALL profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 3. Create policy to allow admins to see ALL video ads
CREATE POLICY "Admins can view all ads" ON public.video_ads
  FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 4. Create policy to allow admins to update ALL video ads
CREATE POLICY "Admins can update all ads" ON public.video_ads
  FOR UPDATE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 5. Create policy to allow admins to delete ALL video ads
CREATE POLICY "Admins can delete all ads" ON public.video_ads
  FOR DELETE USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );
