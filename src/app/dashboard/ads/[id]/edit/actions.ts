'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updateCampaign(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string

    if (!id || !title) {
        redirect(`/dashboard/ads/${id}/edit?error=ID and Title are required`)
    }

    const { error } = await supabase
        .from('campaigns')
        .update({
            title,
            description,
            status: status as 'draft' | 'active' | 'paused' | 'archived',
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure they only update their own campaign

    if (error) {
        console.error('Error updating campaign:', error)
        redirect(`/dashboard/ads/${id}/edit?error=Could not update campaign`)
    }

    redirect('/dashboard/ads')
}
