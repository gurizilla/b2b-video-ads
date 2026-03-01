import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Admin | Companies',
}
import { Building2, Plus, ArrowLeft } from 'lucide-react'
import { createCompany } from './actions'

export default async function CompaniesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
    if (!profile?.is_admin) return redirect('/dashboard/ads')

    const { data: companies } = await supabase.from('companies').select('*, profiles(count), video_ads(count)').order('created_at', { ascending: false })

    return (
        <div className="space-y-6 animate-in">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/dashboard/admin" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            Manage Companies
                        </h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                        Create and manage the business entities that your users belong to.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg border border-gray-100 p-6 mt-6">
                <h2 className="text-lg font-medium mb-4 text-gray-900">Add New Company</h2>
                <form action={createCompany} className="flex gap-4 items-end">
                    <div className="flex-1 max-w-sm">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" id="name" name="name" required className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Acme Corp" />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Create
                    </button>
                </form>
            </div>

            <div className="mt-8 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Users</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Campaigns</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {companies?.map((company) => (
                            <tr key={company.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{company.name}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.profiles[0]?.count || 0}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.video_ads[0]?.count || 0}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(company.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {(!companies || companies.length === 0) && (
                            <tr><td colSpan={4} className="py-8 text-center text-gray-500 text-sm">No companies found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
