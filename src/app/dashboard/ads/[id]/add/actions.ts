'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createVideoAd(campaignId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const video_url = formData.get('video_url') as string

    if (!title || !video_url) {
        redirect(`/dashboard/ads/${campaignId}/add?error=Title and Video URL are required`)
    }

    const { error } = await supabase
        .from('video_ads')
        .insert({
            user_id: user.id,
            campaign_id: campaignId,
            title,
            video_url,
            status: 'active', // default to active when adding to a campaign pool
        })

    if (error) {
        console.error('Error creating video ad:', error)
        redirect(`/dashboard/ads/${campaignId}/add?error=Could not add video`)
    }

    revalidatePath(`/dashboard/ads/${campaignId}`)
    redirect(`/dashboard/ads/${campaignId}`)
}
