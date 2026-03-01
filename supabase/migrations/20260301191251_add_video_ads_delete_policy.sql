CREATE POLICY "Users can delete company video ads" ON public.video_ads
  FOR DELETE USING (
    company_id = (SELECT company_id FROM public.profiles WHERE profiles.id = auth.uid())
  );
