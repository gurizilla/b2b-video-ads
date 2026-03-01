'use client'

import Link from 'next/link'
import { createVideoAd } from './actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Video, Link2 } from 'lucide-react'
import { use } from 'react'

export default function AddVideoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ error?: string }>
}) {
    const { id } = use(params)
    const { error } = use(searchParams)

    // Bind the campaign ID to the server action
    const addVideoWithCampaignId = createVideoAd.bind(null, id)

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
                    <p className="text-sm text-gray-500">Add a new YouTube video link to this campaign.</p>
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

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <form action={addVideoWithCampaignId} className="px-4 py-6 sm:p-8">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-6">
                            <Label htmlFor="title" className="flex items-center gap-2 mb-2">
                                <Video className="w-4 h-4 text-gray-500" />
                                Video Title *
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="e.g. Q3 Opening Hook"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <Label htmlFor="video_url" className="flex items-center gap-2 mb-2">
                                <Link2 className="w-4 h-4 text-gray-500" />
                                YouTube URL *
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="url"
                                    name="video_url"
                                    id="video_url"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                />
                                <p className="mt-2 text-sm text-gray-500">Must be a valid YouTube watch URL.</p>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
                        <Link href={`/dashboard/ads/${id}`} className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                            Cancel
                        </Link>
                        <SubmitButton pendingText="Adding...">
                            Add Video
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
