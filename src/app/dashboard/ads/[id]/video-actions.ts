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

    const { error } = await deleteClient
        .from('video_ads')
        .delete()
        .eq('id', adId)
        .eq('campaign_id', campaignId)

    if (error) {
        console.error('Error deleting video ad:', error)
        throw new Error('Failed to delete video ad')
    }

    revalidatePath(`/dashboard/ads/${campaignId}`)
}
