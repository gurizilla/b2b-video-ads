import type { Metadata } from 'next'
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Dashboard | Overview',
}
import {
    PlaySquare,
    Clock,
    ShieldAlert,
    Users,
    Settings,
    Building2,
    ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardRoot() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, is_admin')
        .eq('id', user.id)
        .single()

    let activeCampaignsCount = 0
    let totalPlayTime = 0

    if (profile?.company_id) {
        // Fetch ad data for this company
        const { data: ads } = await supabase
            .from('video_ads')
            .select('status, play_time_minutes')
            .eq('company_id', profile.company_id)

        if (ads) {
            activeCampaignsCount = ads.filter((ad) => ad.status === 'active').length
            totalPlayTime = ads.reduce(
                (sum, ad) => sum + (ad.play_time_minutes || 0),
                0
            )
        }
    }

    // --- ADMIN DATA FETCHING ---
    let totalUsers = 0
    let totalCampaigns = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allAds: any[] | null = null

    if (profile?.is_admin) {
        const adminClient = await createAdminClient()

        const { count: usersCount, error: usersError } = await adminClient
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        console.log('--- ADMIN USERS COUNT FETCH ---', { usersCount, usersError })
        totalUsers = usersCount || 0

        const { count: campaignsCount } = await adminClient
            .from('campaigns')
            .select('*', { count: 'exact', head: true })
        totalCampaigns = campaignsCount || 0

        const { data: campaignsData, error } = await adminClient
            .from('campaigns')
            .select(`
                *, 
                companies(name)
            `)
            .order('created_at', { ascending: false })

        console.log('--- ADMIN CAMPAIGNS FE FETCH ---', { campaignsData, error })

        if (campaignsData) {
            // Get unique user IDs to fetch emails
            const userIds = [...new Set((campaignsData || []).map(c => c.user_id))]

            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, email')
                .in('id', userIds)

            // Map emails back into the campaign objects to match expected UI structure
            allAds = campaignsData.map(campaign => ({
                ...campaign,
                profiles: {
                    email: (profilesData || []).find(p => p.id === campaign.user_id)?.email || 'Unknown'
                }
            }))
        } else {
            allAds = []
        }
    }

    return (
        <div className="space-y-6 animate-in">
            {/* STANDARD OVERVIEW SECTION */}
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
                        Dashboard Overview
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        At-a-glance statistics and metrics for your company's advertising
                        campaigns.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.2)] rounded-xl border border-gray-100 p-5 flex items-center gap-5">
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <PlaySquare className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            Active Campaigns
                        </p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">
                            {activeCampaignsCount}
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.2)] rounded-xl border border-gray-100 p-5 flex items-center gap-5">
                    <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-500 mb-1">
                            Total Display Time
                        </p>
                        <p className="text-2xl font-bold text-gray-900 leading-none">
                            {totalPlayTime} min
                        </p>
                    </div>
                </div>
            </div>

            {/* ADMIN SECTION */}
            {profile?.is_admin && (
                <div className="mt-12 pt-8 border-t border-gray-200 space-y-6">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-gradient">
                                <ShieldAlert className="h-7 w-7 text-blue-600" />
                                System Administration
                            </h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Global system metrics and management tools for administrators.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                        <Link
                            href="/dashboard/admin/users"
                            className="bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.2)] rounded-xl border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Users className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-blue-600 transition-colors">
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-gray-900 leading-none">
                                    {totalUsers}
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/ads"
                            className="bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.2)] rounded-xl border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md transition-shadow group cursor-pointer"
                        >
                            <div className="p-3.5 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <PlaySquare className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-green-600 transition-colors">
                                    Total Campaigns
                                </p>
                                <p className="text-2xl font-bold text-gray-900 leading-none">
                                    {totalCampaigns}
                                </p>
                            </div>
                        </Link>
                        <div className="bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),_0_0_1px_rgba(0,0,0,0.2)] rounded-xl border border-gray-100 p-5 flex items-center gap-5">
                            <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Settings className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    System Status
                                </p>
                                <p className="text-2xl font-bold text-gray-900 leading-none">
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <Link
                            href="/dashboard/admin/companies"
                            className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group"
                        >
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 flex items-center justify-between">
                                    Manage Companies
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Create new business entities and view their associated
                                    campaigns.
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/admin/users"
                            className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group"
                        >
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 flex items-center justify-between">
                                    Manage Users
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    View all system users and assign them to companies.
                                </p>
                            </div>
                        </Link>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            All System Campaigns
                        </h2>
                        <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Campaign
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Company
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Owner
                                        </th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {allAds?.map((ad) => (
                                        <tr key={ad.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {ad.title}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                    {ad.companies?.name || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {ad.profiles?.email || 'Unknown'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${ad.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!allAds || allAds.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-8 text-center text-sm text-gray-500"
                                            >
                                                No campaigns found in the system.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
