-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all ads" ON public.video_ads;
DROP POLICY IF EXISTS "Admins can update all ads" ON public.video_ads;
DROP POLICY IF EXISTS "Admins can delete all ads" ON public.video_ads;

-- Create a SECURITY DEFINER function to securely check admin status without triggering RLS evaluation.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT is_admin INTO admin_status FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(admin_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies using the new is_admin() function
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can view all ads" ON public.video_ads
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all ads" ON public.video_ads
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete all ads" ON public.video_ads
  FOR DELETE USING (public.is_admin());
