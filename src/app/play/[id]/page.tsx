import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { FullScreenFeed } from '@/components/fullscreen-feed'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data: campaign } = await supabase
        .from('campaigns')
        .select('title')
        .eq('id', id)
        .single()

    return {
        title: campaign?.title ? `AdManager | Play | ${campaign.title}` : 'AdManager | Play',
    }
}

async function getCampaignAds(campaignId: string) {
    const supabase = await createClient()

    // 1. Verify the campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('id, status')
        .eq('id', campaignId)
        .single()

    if (campaignError || !campaign) {
        console.error('Error fetching campaign or it does not exist:', campaignError)
        return null // Will trigger a 404
    }

    if (campaign.status !== 'active') {
        return [] // Will show the "No Active Campaigns" empty state
    }

    // 2. Fetch the active video ads for this specific campaign
    const { data: ads, error: adsError } = await supabase
        .from('video_ads')
        .select(`*, profiles(first_name, last_name, email)`)
        .eq('campaign_id', campaign.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (adsError) {
        console.error('Error fetching campaign ads:', JSON.stringify(adsError, null, 2))
        return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ads || []) as any[]
}

export default async function PlayCampaignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const ads = await getCampaignAds(id)

    // If the campaign doesn't exist, throw a Next.js 404
    if (ads === null) {
        notFound()
    }

    return (
        <main className="bg-black min-h-screen text-white">
            <FullScreenFeed ads={ads} />
        </main>
    )
}
