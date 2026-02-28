'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createVideoAd(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const video_url = formData.get('video_url') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string

    if (!title || !video_url) {
        redirect('/dashboard/ads/create?error=Title and Video URL are required')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    const { error } = await supabase
        .from('video_ads')
        .insert({
            user_id: user.id,
            company_id: profile?.company_id || null,
            title,
            video_url,
            description,
            status: status as 'draft' | 'active' | 'paused' | 'archived',
        })

    if (error) {
        console.error('Error creating video ad:', error)
        redirect('/dashboard/ads/create?error=Could not create campaign')
    }

    redirect('/dashboard/ads')
}
