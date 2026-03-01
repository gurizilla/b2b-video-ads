'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteVideoAd(adId: string, campaignId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    let deleteClient = supabase
    if (profile?.is_admin) {
        const { createAdminClient } = await import('@/utils/supabase/server')
        deleteClient = await createAdminClient()
    }

    const { data, error } = await deleteClient
        .from('video_ads')
        .delete()
        .eq('id', adId)
        .eq('campaign_id', campaignId)
        .select('id')

    if (error) {
        require('fs').writeFileSync('/tmp/delete-video-error.log', JSON.stringify({ error, adId, campaignId }))
        console.error('Error deleting video ad:', error)
        throw new Error('Failed to delete video ad')
    }

    if (!data || data.length === 0) {
        require('fs').writeFileSync('/tmp/delete-video-empty.log', JSON.stringify({ message: "0 rows deleted (RLS issue?)", adId, campaignId, isAdmin: profile?.is_admin }))
    }

    revalidatePath(`/dashboard/ads/${campaignId}`)
}
