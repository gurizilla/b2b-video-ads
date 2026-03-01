-- Make campaigns user_id point to public.profiles too for easy joining
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_user_id_fkey_profiles 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
