import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database'
import Link from 'next/link'
import { MoreVertical, ExternalLink, Calendar, PlaySquare, Edit, Trash2 } from 'lucide-react'

type VideoAdWithCompany = Database['public']['Tables']['video_ads']['Row'] & {
    companies?: { name: string } | null
}

// Fetch ads from Supabase
async function getVideoAds(): Promise<{ ads: VideoAdWithCompany[], isAdmin: boolean }> {
    const supabase = await createClient()

    // Get user and profile for company filtering
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ads: [], isAdmin: false }

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id, is_admin')
        .eq('id', user.id)
        .single()

    let query = supabase
        .from('video_ads')
        .select('*, companies(name)')
        .order('created_at', { ascending: false })

    // Regular users only see their own company's ads on the dashboard
    // (RLS also applies, but this prevents public active ads from other companies from showing up on the private dashboard)
    if (!profile?.is_admin) {
        if (profile?.company_id) {
            query = query.eq('company_id', profile.company_id)
        } else {
            return { ads: [], isAdmin: false } // User not assigned to a company yet
        }
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching ads:', JSON.stringify(error, null, 2))
        return { ads: [], isAdmin: false }
    }

    return { ads: data as VideoAdWithCompany[], isAdmin: !!profile?.is_admin }
}

export default async function AdsListPage() {
    const { ads, isAdmin } = await getVideoAds()

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
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold text-gradient">Video Campaigns</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all your video advertisements including their title, link, status, and creation date.
                    </p>
                </div>
            </div>

            {ads.length === 0 ? (
                <div className="text-center rounded-lg border-2 border-dashed border-gray-300 p-12 mt-6">
                    <PlaySquare className="mx-auto h-12 w-12 text-gray-400" />
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
                                        {ads.map((ad) => (
                                            <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                                                            <PlaySquare className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{ad.title}</div>
                                                            <div className="text-gray-500 flex items-center mt-1">
                                                                <a href={ad.video_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                                                                    {new URL(ad.video_url).hostname}
                                                                    <ExternalLink className="h-3 w-3" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[ad.status as keyof typeof statusColors] || statusColors.draft}`}>
                                                        {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                            {ad.companies?.name || 'Unassigned'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="font-medium text-gray-900">
                                                        {ad.play_time_minutes || 0} min
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        {formatDate(ad.created_at)}
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex justify-end gap-3">
                                                        <Link href={`/dashboard/ads/${ad.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit, {ad.title}</span>
                                                        </Link>
                                                        <form action={`/dashboard/ads/${ad.id}/delete`} method="POST" className="inline">
                                                            <button type="submit" className="text-red-600 hover:text-red-900">
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">Delete, {ad.title}</span>
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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
