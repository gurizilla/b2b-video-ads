import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ShieldAlert, Users, Settings, PlaySquare, Building2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    // Check if the user is an admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        return redirect('/dashboard/ads') // Kick them out if not admin
    }

    // Fetch exact counts
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    const { count: totalCampaigns } = await supabase
        .from('video_ads')
        .select('*', { count: 'exact', head: true })

    // Since they are an admin, we can fetch all ads for the table
    const { data: allAds } = await supabase
        .from('video_ads')
        .select(`*, profiles(email)`)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6 animate-in">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
                        <ShieldAlert className="h-8 w-8 text-blue-600" />
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Welcome to the administrator area. You have elevated privileges.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                <Link href="/dashboard/admin/users" className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate group-hover:text-blue-600 transition-colors">Total Users</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalUsers || 0}</p>
                    </div>
                </Link>
                <Link href="/dashboard/ads" className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors">
                        <PlaySquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate group-hover:text-green-600 transition-colors">Total Campaigns</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalCampaigns || 0}</p>
                    </div>
                </Link>
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 p-5 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 truncate">System Status</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">Online</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <Link href="/dashboard/admin/companies" className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 flex items-center justify-between">
                            Manage Companies
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Create new business entities and view their associated campaigns.</p>
                    </div>
                </Link>

                <Link href="/dashboard/admin/users" className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 flex items-center justify-between">
                            Manage Users
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">View all system users and assign them to companies.</p>
                    </div>
                </Link>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">All System Campaigns</h2>
                <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Campaign</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Owner</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {allAds?.map((ad) => (
                                <tr key={ad.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {ad.title}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {ad.profiles?.email || 'Unknown'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {ad.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {(!allAds || allAds.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-sm text-gray-500">No campaigns found in the system.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
