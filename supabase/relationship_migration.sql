-- Add explicit foreign key relationship between video_ads and profiles
-- This allows PostgREST/Supabase JS client to perform JOINs like .select('*, profiles(*)')

ALTER TABLE public.video_ads 
DROP CONSTRAINT IF EXISTS fk_video_ads_profiles;

ALTER TABLE public.video_ads 
ADD CONSTRAINT fk_video_ads_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Notify PostgREST to reload the schema cache (in case it doesn't do it automatically)
NOTIFY pgrst, 'reload schema';
