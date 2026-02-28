'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createCompany(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return redirect('/dashboard/ads')

    const name = formData.get('name') as string
    if (!name) return

    const { error } = await supabase.from('companies').insert({ name })

    if (error) {
        console.error('Error creating company:', error)
    }

    revalidatePath('/dashboard/admin/companies')
}
