'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createVideoAd } from './actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Video, Link2, Library } from 'lucide-react'

type VideoLibraryItem = {
    title: string;
    video_url: string;
}

export function AddVideoForm({
    campaignId,
    libraryVideos
}: {
    campaignId: string;
    libraryVideos: VideoLibraryItem[];
}) {
    const [mode, setMode] = useState<'new' | 'library'>('new');
    const addVideoWithCampaignId = createVideoAd.bind(null, campaignId);

    // If the user selects a video from the library, auto-fill the hidden inputs
    const [selectedLibraryIndex, setSelectedLibraryIndex] = useState<number>(0);
    const selectedVideo = libraryVideos[selectedLibraryIndex] || null;

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

            {/* Mode selection tabs */}
            {libraryVideos.length > 0 && (
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setMode('new')}
                        className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${mode === 'new'
                                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        <Video className="w-4 h-4" />
                        Add New Video
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('library')}
                        className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors ${mode === 'library'
                                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        <Library className="w-4 h-4" />
                        Choose from Library ({libraryVideos.length})
                    </button>
                </div>
            )}

            <form action={addVideoWithCampaignId} className="px-4 py-6 sm:p-8">

                {mode === 'new' ? (
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                ) : (
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="sm:col-span-6">
                            <Label htmlFor="library_select" className="flex items-center gap-2 mb-2">
                                <Library className="w-4 h-4 text-gray-500" />
                                Select Video *
                            </Label>
                            <div className="mt-2">
                                <select
                                    id="library_select"
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    value={selectedLibraryIndex}
                                    onChange={(e) => setSelectedLibraryIndex(Number(e.target.value))}
                                >
                                    {libraryVideos.map((vid, idx) => (
                                        <option key={idx} value={idx}>
                                            {vid.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hidden inputs to pass the selected library values to the server action */}
                            {selectedVideo && (
                                <>
                                    <input type="hidden" name="title" value={selectedVideo.title} />
                                    <input type="hidden" name="video_url" value={selectedVideo.video_url} />
                                </>
                            )}

                            {selectedVideo && (
                                <div className="mt-4 p-4 rounded-md bg-gray-50 border border-gray-100 flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Link2 className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{selectedVideo.title}</p>
                                        <a href={selectedVideo.video_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 break-all truncate block max-w-md">
                                            {selectedVideo.video_url}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
                    <Link href={`/dashboard/ads/${campaignId}`} className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                        Cancel
                    </Link>
                    <SubmitButton pendingText="Adding...">
                        Add Video
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}
