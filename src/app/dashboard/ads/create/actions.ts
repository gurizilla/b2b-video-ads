'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createCampaign(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string

    if (!title) {
        redirect('/dashboard/ads/create?error=Title is required')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    const { data: insertedCampaign, error } = await supabase
        .from('campaigns')
        .insert({
            user_id: user.id,
            company_id: profile?.company_id || null,
            title,
            description,
            status: status as 'draft' | 'active' | 'paused' | 'archived',
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error creating campaign:', error)
        redirect('/dashboard/ads/create?error=Could not create campaign')
    }

    redirect(`/dashboard/ads/${insertedCampaign.id}`)
}
