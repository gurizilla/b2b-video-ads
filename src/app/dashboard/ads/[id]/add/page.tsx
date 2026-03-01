import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AddVideoForm } from './add-video-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AddVideoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string }>
}) {
    const { id } = await params
    const { error } = await searchParams

    const supabase = await createClient()

    // Ensure user is authed and get profile
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single()

    // Fetch unique library videos for this company
    // We get all videos for the company, then filter in JS to keep unique titles/URLs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let libraryVideos: any[] = []

    if (profile?.company_id) {
        const { data: companyAds } = await supabase
            .from('video_ads')
            .select('title, video_url, campaign_id')
            .eq('company_id', profile.company_id)
            .order('created_at', { ascending: false })

        if (companyAds) {
            // Find which URLs are already in the current campaign
            const urlsInCurrentCampaign = new Set(
                companyAds.filter(ad => ad.campaign_id === id).map(ad => ad.video_url)
            );

            // Deduplicate by URL and filter out videos already in this campaign
            const seenUrls = new Set()
            libraryVideos = companyAds.filter(ad => {
                if (urlsInCurrentCampaign.has(ad.video_url)) return false;

                const isDuplicate = seenUrls.has(ad.video_url)
                seenUrls.add(ad.video_url)
                return !isDuplicate
            })
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href={`/dashboard/ads/${id}`}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="sr-only">Back to campaign</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Video Clip</h1>
                    <p className="text-sm text-gray-500">Add a new YouTube video link to this campaign or choose from your library.</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error adding video</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AddVideoForm campaignId={id} libraryVideos={libraryVideos} />
        </div>
    )
}
