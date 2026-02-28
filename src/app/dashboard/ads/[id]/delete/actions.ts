'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteVideoAd(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string

    if (!id) {
        redirect('/dashboard/ads?error=Ad ID is required')
    }

    const { error } = await supabase
        .from('video_ads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Extra safety check

    if (error) {
        console.error('Error deleting video ad:', error)
        redirect('/dashboard/ads?error=Could not delete campaign')
    }

    redirect('/dashboard/ads')
}
