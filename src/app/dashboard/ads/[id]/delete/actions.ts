'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteCampaign(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const id = formData.get('id') as string

    if (!id) {
        redirect('/dashboard/ads?error=Campaign ID is required')
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
        .from('campaigns')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting campaign:', error)
        redirect('/dashboard/ads?error=Could not delete campaign')
    }

    redirect('/dashboard/ads')
}
