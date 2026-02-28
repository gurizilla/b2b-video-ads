import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, ArrowLeft, Building2 } from 'lucide-react'
import { CompanySelector } from '@/components/company-selector'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return redirect('/dashboard/ads')

    // Fetch all profiles and companies
    const { data: profiles } = await supabase.from('profiles').select('*, companies(name)').order('created_at', { ascending: false })
    const { data: companies } = await supabase.from('companies').select('id, name').order('name')

    return (
        <div className="space-y-6 animate-in">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard/admin" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                            <Users className="h-8 w-8 text-blue-600" />
                            Manage Users
                        </h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                        View all system users and assign them to their respective companies.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Company Assignment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {profiles?.map((p) => (
                            <tr key={p.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <div className="flex flex-col">
                                        <span>{p.first_name ? `${p.first_name} ${p.last_name || ''}` : p.email}</span>
                                        {p.first_name && <span className="text-gray-500 text-xs font-normal">{p.email}</span>}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {p.is_admin ? (
                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Admin</span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">User</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 w-1/2">
                                    <CompanySelector
                                        userId={p.id}
                                        currentCompanyId={p.company_id}
                                        companies={companies || []}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
