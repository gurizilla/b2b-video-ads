-- Add play_time_minutes to video_ads
ALTER TABLE public.video_ads ADD COLUMN play_time_minutes INTEGER DEFAULT 0 NOT NULL;

-- Create policy to allow any authenticated user to update the play time
-- Even if they don't own the ad, they might be viewing it on the public feed
CREATE POLICY "Anyone can update ad play time" ON public.video_ads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create an RPC function to securely increment the play time by 1
CREATE OR REPLACE FUNCTION increment_play_time(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.video_ads
  SET play_time_minutes = play_time_minutes + 1
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
