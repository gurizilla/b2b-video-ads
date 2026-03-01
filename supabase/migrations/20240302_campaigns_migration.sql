-- 1. Create the campaigns table
CREATE TABLE public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add campaign_id to video_ads
ALTER TABLE public.video_ads ADD COLUMN campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE;

-- 3. Automatic Data Porting (Backward compat)
-- For every existing video ad, we create a corresponding campaign and link it
DO $$
DECLARE
    ad_row RECORD;
    new_campaign_id UUID;
BEGIN
    FOR ad_row IN SELECT id, user_id, company_id, title, description, status FROM public.video_ads WHERE campaign_id IS NULL LOOP
        -- Create a new campaign for this ad
        INSERT INTO public.campaigns (user_id, company_id, title, description, status)
        VALUES (ad_row.user_id, ad_row.company_id, ad_row.title, ad_row.description, ad_row.status)
        RETURNING id INTO new_campaign_id;

        -- Link the old ad to the new campaign
        UPDATE public.video_ads
        SET campaign_id = new_campaign_id
        WHERE id = ad_row.id;
    END LOOP;
END $$;

-- Enforce campaign_id to be NOT NULL now that data is ported
ALTER TABLE public.video_ads ALTER COLUMN campaign_id SET NOT NULL;

-- 4. Enable RLS on campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- 5. Campaigns Policies (Mirroring video_ads logic)
CREATE POLICY "Users can view company campaigns" ON public.campaigns
  FOR SELECT USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid()) 
    OR status = 'active'
  );

CREATE POLICY "Users can insert company campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Users can update company campaigns" ON public.campaigns
  FOR UPDATE USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  ) WITH CHECK (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Users can delete company campaigns" ON public.campaigns
  FOR DELETE USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

-- Update timestamp trigger for campaigns
CREATE TRIGGER update_campaigns_modtime
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
