import { createClient } from '@/utils/supabase/server'
import { FullScreenFeed } from '@/components/fullscreen-feed'

async function getActiveAds() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('video_ads')
    .select(`*, profiles(first_name, last_name, email), campaigns!inner(status)`)
    .eq('status', 'active')
    .eq('campaigns.status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching active ads:', JSON.stringify(error, null, 2))
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[] // Using any for simplicity with the joined profile data
}

export default async function Home() {
  const ads = await getActiveAds()

  return (
    <main className="bg-black min-h-screen text-white">
      {/* 
        Pass server-fetched data to the client component
        This ensures good SEO and initial load speed while allowing
        the client component to handle the complex scroll logic 
        and YouTube embedded iframe manipulation
      */}
      <FullScreenFeed ads={ads} />
    </main>
  )
}
