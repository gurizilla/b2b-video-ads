-- Allow public read access to active video ads
CREATE POLICY "Anyone can view active video ads" ON public.video_ads
  FOR SELECT USING (status = 'active');
