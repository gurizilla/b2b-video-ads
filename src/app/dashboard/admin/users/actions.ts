'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Note: Server actions called from forms receive the FormData directly
export async function assignUserToCompany(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return redirect('/dashboard/ads')

    const targetUserId = formData.get('user_id') as string
    const targetCompanyId = formData.get('company_id') as string

    if (!targetUserId) return

    const companyIdOrNull = targetCompanyId === 'unassigned' ? null : targetCompanyId

    const { error } = await supabase.from('profiles').update({ company_id: companyIdOrNull }).eq('id', targetUserId)

    if (error) {
        console.error('Error assigning company:', error)
    }

    revalidatePath('/dashboard/admin/users')
}
