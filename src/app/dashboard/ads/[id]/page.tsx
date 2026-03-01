import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Campaigns | Details',
}
import { PlaySquare, ArrowLeft, Plus, ExternalLink, Calendar, Trash2 } from 'lucide-react'
import { Campaign, VideoAd } from '@/types/database'
import { DeleteVideoAdButton } from './delete-video-button'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single()

    if (campaignError || !campaign) {
        redirect('/dashboard/ads')
    }

    // Fetch video ads for this campaign
    const { data: videoAds, error: adsError } = await supabase
        .from('video_ads')
        .select('*')
        .eq('campaign_id', id)
        .order('created_at', { ascending: false })

    const totalTime = videoAds?.reduce((sum, ad) => sum + ad.play_time_minutes, 0) || 0

    return (
        <div className="space-y-6 animate-in">
            <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6">
                <Link
                    href="/dashboard/ads"
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="sr-only">Back</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
                        {campaign.title}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage the video clips for this campaign. {totalTime} total minutes played.
                    </p>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between mb-6">
                        <div>
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Campaign Videos ({videoAds?.length || 0})</h3>
                            <div className="mt-2 max-w-xl text-sm justify-between text-gray-500">
                                <p>Add video clips to this campaign pool. Active campaigns will randomly cycle through these videos.</p>
                            </div>
                        </div>
                        <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex-shrink-0 flex items-center gap-3">
                            <Link href={`/dashboard/ads/${campaign.id}/add`} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-1.5 focus:ring-2 focus:ring-offset-2">
                                <Plus className="-ml-0.5 h-4 w-4" aria-hidden="true" />
                                Add Video
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-6">
                        {videoAds && videoAds.length > 0 ? (
                            <ul role="list" className="divide-y divide-gray-100 border border-gray-200 rounded-md overflow-hidden">
                                {videoAds.map((ad) => (
                                    <li key={ad.id} className="flex items-center justify-between gap-x-6 py-5 px-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="h-12 w-12 flex-none rounded-md bg-gray-100 flex items-center justify-center">
                                                <PlaySquare className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                            </div>
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {ad.title}
                                                </p>
                                                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                                    <a href={ad.video_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 flex items-center gap-1">
                                                        {new URL(ad.video_url).hostname}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                                        <circle cx={1} cy={1} r={1} />
                                                    </svg>
                                                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ad.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                                        }`}>
                                                        {ad.status}
                                                    </span>
                                                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                                                        <circle cx={1} cy={1} r={1} />
                                                    </svg>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(ad.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-none items-center gap-x-4">
                                            <div className="hidden sm:flex sm:flex-col sm:items-end mr-4">
                                                <p className="text-sm leading-6 text-gray-900">{ad.play_time_minutes} minutes</p>
                                                <p className="mt-1 text-xs leading-5 text-gray-500">Play Time</p>
                                            </div>
                                            <DeleteVideoAdButton adId={ad.id} campaignId={campaign.id} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center rounded-lg border-2 border-dashed border-gray-300 p-12">
                                <PlaySquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No videos</h3>
                                <p className="mt-1 text-sm text-gray-500">This campaign doesn't have any video clips yet.</p>
                                <div className="mt-6">
                                    <Link
                                        href={`/dashboard/ads/${campaign.id}/add`}
                                        className="inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 rounded-md"
                                    >
                                        <Plus className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Add Video
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
