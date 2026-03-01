import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database'
import Link from 'next/link'
import { Video, PlusSquare, Calendar, PlaySquare, Edit, Trash2 } from 'lucide-react'

type CampaignWithCompany = Database['public']['Tables']['campaigns']['Row'] & {
    companies?: { name: string } | null
    video_ads?: { id: string, play_time_minutes: number }[]
}

// Fetch campaigns from Supabase
async function getCampaigns(): Promise<{ campaigns: CampaignWithCompany[], isAdmin: boolean }> {
    const supabase = await createClient()

    // Get user and profile for company filtering
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { campaigns: [], isAdmin: false }

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, is_admin')
        .eq('id', user.id)
        .single()

    let query = supabase
        .from('campaigns')
        .select('*, companies(name), video_ads(id, play_time_minutes)')
        .order('created_at', { ascending: false })

    // Regular users only see their own company's campaigns
    if (!profile?.is_admin) {
        if (profile?.company_id) {
            query = query.eq('company_id', profile.company_id)
        } else {
            return { campaigns: [], isAdmin: false } // User not assigned to a company yet
        }
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching campaigns:', JSON.stringify(error, null, 2))
        return { campaigns: [], isAdmin: false }
    }

    return { campaigns: data as CampaignWithCompany[], isAdmin: !!profile?.is_admin }
}

export default async function AdsListPage() {
    const { campaigns, isAdmin } = await getCampaigns()

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // Status badge colors
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        draft: 'bg-gray-100 text-gray-800',
        paused: 'bg-yellow-100 text-yellow-800',
        archived: 'bg-red-100 text-red-800'
    }

    return (
        <div className="space-y-6 animate-in">
            <div className="sm:flex sm:items-center justify-between">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold text-gradient">Video Campaigns</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all your video ad campaigns. Click a campaign to manage its ad variations.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/dashboard/ads/create"
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <PlusSquare className="h-4 w-4" />
                        New Campaign
                    </Link>
                </div>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center rounded-lg border-2 border-dashed border-gray-300 p-12 mt-6">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No campaigns</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new video ad campaign.</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/ads/create"
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            New Campaign
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="mt-8 flow-root duration-500 animate-in" style={{ animationDelay: '150ms' }}>
                    <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Campaign Title
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Status
                                            </th>
                                            {isAdmin && (
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Company
                                                </th>
                                            )}
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Ads Count
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Play Time
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Created
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white leading-5">
                                        {campaigns.map((campaign) => {
                                            const totalTime = campaign.video_ads?.reduce((sum, ad) => sum + (ad.play_time_minutes || 0), 0) || 0
                                            const adsCount = campaign.video_ads?.length || 0

                                            return (
                                                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <Video className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-4 flex flex-col items-start gap-1">
                                                                <Link href={`/dashboard/ads/${campaign.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                                                    {campaign.title}
                                                                </Link>
                                                                <div className="text-gray-500 text-xs truncate max-w-xs">{campaign.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft}`}>
                                                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                                {campaign.companies?.name || 'Unassigned'}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <Link href={`/dashboard/ads/${campaign.id}`} className="inline-flex items-center gap-1 font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors text-xs ring-1 ring-inset ring-blue-700/10">
                                                            <PlaySquare className="h-3 w-3" />
                                                            {adsCount}
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="font-medium text-gray-900">
                                                            {totalTime} min
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            {formatDate(campaign.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/dashboard/ads/${campaign.id}`} className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-blue-700 transition-colors rounded-md hover:bg-blue-50 bg-white ring-1 ring-inset ring-gray-300" title="Manage Videos">
                                                                <PlusSquare className="h-4 w-4" />
                                                            </Link>
                                                            <Link href={`/dashboard/ads/${campaign.id}/edit`} className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100 bg-white ring-1 ring-inset ring-gray-300" title="Edit Campaign Settings">
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <Link href={`/dashboard/ads/${campaign.id}/delete`} className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 transition-colors rounded-md hover:bg-red-50 bg-white ring-1 ring-inset ring-red-300" title="Delete Campaign">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
