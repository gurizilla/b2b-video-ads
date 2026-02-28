-- 1. Create the companies table
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add company_id to profiles and video_ads
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
ALTER TABLE public.video_ads ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Enable RLS on companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Companies Policies
CREATE POLICY "Admins can manage companies" ON public.companies
  USING (public.is_admin());

CREATE POLICY "Users can view their own company" ON public.companies
  FOR SELECT USING (id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid()));

-- Optional: Create a default Company to ensure existing users and ads don't break
INSERT INTO public.companies (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Default Startup') ON CONFLICT DO NOTHING;
UPDATE public.profiles SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;
UPDATE public.video_ads SET company_id = '00000000-0000-0000-0000-000000000000' WHERE company_id IS NULL;

-- 3. Update Video Ads RLS to use company_id instead of user_id for shared workspace
DROP POLICY IF EXISTS "Users can view their own ads" ON public.video_ads;
DROP POLICY IF EXISTS "Users can insert their own ads" ON public.video_ads;
DROP POLICY IF EXISTS "Users can update their own ads" ON public.video_ads;
DROP POLICY IF EXISTS "Users can delete their own ads" ON public.video_ads;

CREATE POLICY "Users can view company ads" ON public.video_ads
  FOR SELECT USING (
    -- Admins see all via admin policies, regular users see their company's ads
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid()) 
    OR status = 'active' -- ensure public active ads policy is not overshadowed
  );

CREATE POLICY "Users can insert company ads" ON public.video_ads
  FOR INSERT WITH CHECK (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Users can update company ads" ON public.video_ads
  FOR UPDATE USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  ) WITH CHECK (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Users can delete company ads" ON public.video_ads
  FOR DELETE USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
