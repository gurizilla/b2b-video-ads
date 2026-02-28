'use client'

import { useEffect, useRef, useState } from 'react'
import { Video } from 'lucide-react'
import YouTube from 'react-youtube'

// Helper to extract YouTube video ID from various URL formats
const getYouTubeId = (url: string) => {
    try {
        const urlObj = new URL(url)
        if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1)
        if (urlObj.hostname.includes('youtube.com')) return urlObj.searchParams.get('v') || ''
    } catch { return '' }
    return ''
}

// Define the shape of our ad data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FullScreenFeed({ ads }: { ads: any[] }) {
    const [currentVisualIndex, setCurrentVisualIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    // Store youtube instances to control playback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playersRef = useRef<{ [key: number]: any }>({})

    // Handle scroll snapping to determine the active video
    const handleScroll = () => {
        if (!containerRef.current) return

        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight

        // Calculate which video is currently taking up the majority of the screen
        const newIndex = Math.round(scrollPosition / windowHeight)

        if (newIndex !== currentVisualIndex && newIndex >= 0 && newIndex < ads.length) {
            setCurrentVisualIndex(newIndex)
        }
    }

    useEffect(() => {
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true })
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [currentVisualIndex, ads.length])

    // Manage playback state when index changes
    useEffect(() => {
        Object.keys(playersRef.current).forEach((key) => {
            const index = parseInt(key)
            const player = playersRef.current[index]
            if (player && typeof player.pauseVideo === 'function' && typeof player.playVideo === 'function') {
                if (index === currentVisualIndex) {
                    // Rewind to start, then play
                    if (typeof player.seekTo === 'function') {
                        player.seekTo(0);
                    }
                    player.playVideo();
                } else {
                    player.pauseVideo();
                }
            }
        })
    }, [currentVisualIndex])

    // Keep a ref of the current visible index for the interval timer to avoid stale closures
    const activeIndexRef = useRef(currentVisualIndex);
    useEffect(() => {
        activeIndexRef.current = currentVisualIndex;
    }, [currentVisualIndex]);

    // Manage play time tracking (polls every 60s)
    useEffect(() => {
        // Function to record a minute of watch time
        const recordWatchTime = async () => {
            const activeIdx = activeIndexRef.current;
            const adId = ads[activeIdx]?.id;

            if (!adId) return;

            try {
                // Ensure the player is actually playing (state 1 is playing in YT API)
                const player = playersRef.current[activeIdx];
                if (player && typeof player.getPlayerState === 'function') {
                    const state = player.getPlayerState();
                    if (state === 1) { // 1 = playing
                        // Dynamic import supabase client to avoid SSR issues if this runs in a strange context
                        const { createClient } = await import('@/utils/supabase/client');
                        const supabase = createClient();
                        await supabase.rpc('increment_play_time', { ad_id: adId });
                        console.log(`Recorded 1 min for ${adId}`);
                    }
                }
            } catch (error) {
                console.error("Failed to record watch time", error);
            }
        };

        const intervalId = setInterval(recordWatchTime, 60000); // 60 seconds

        return () => clearInterval(intervalId);
    }, [ads]);

    const scrollToNextVideo = () => {
        if (!containerRef.current) return;
        const nextIndex = currentVisualIndex + 1;

        // Wait for a small amount of time to make the transition smoother
        setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;

            if (nextIndex < ads.length) {
                // Use scrollBy to smoothly snap to the next video
                container.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            } else {
                // Loop back to the first video
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 500);
    }

    if (ads.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                <div className="text-center p-8">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">No Active Campaigns</h2>
                    <p className="text-gray-400">Please check back later.</p>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth"
            style={{
                /* Hide scrollbar for a cleaner look */
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {ads.map((ad, index) => {
                const isActive = index === currentVisualIndex
                const videoId = getYouTubeId(ad.video_url)

                return (
                    <div
                        key={ad.id}
                        className="h-screen w-full snap-start relative flex items-center justify-center bg-black overflow-hidden"
                    >
                        {/* Video Layer */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            {videoId ? (
                                <YouTube
                                    videoId={videoId}
                                    opts={{
                                        width: '100%',
                                        height: '100%',
                                        playerVars: {
                                            autoplay: isActive ? 1 : 0,
                                            controls: 0,
                                            modestbranding: 1,
                                            rel: 0,
                                            showinfo: 0,
                                            mute: 1,
                                            loop: 0
                                        }
                                    }}
                                    onReady={(e) => {
                                        playersRef.current[index] = e.target;
                                        if (isActive) e.target.playVideo();
                                    }}
                                    onEnd={scrollToNextVideo}
                                    /* 300% width/height trick zooms the video to hide black bars */
                                    className={`w-[300%] h-[300%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                                    <Video className="w-16 h-16 mb-4 opacity-50" />
                                    <p>Invalid Video Source</p>
                                </div>
                            )}

                            {/* Minimal dark overlay focusing on bottom left corner */}
                            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                        </div>

                        {/* Minimal UI Overlay Layer */}
                        <div className="absolute bottom-8 left-8 z-10 text-white pb-safe pt-4 pr-10 hover:opacity-100 opacity-80 transition-opacity max-w-lg">
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <h2 className="text-2xl font-medium mb-2 drop-shadow-md">
                                    {ad.title}
                                </h2>

                                <div className="flex items-center gap-2 opacity-90">
                                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center font-bold shadow text-xs">
                                        {ad.profiles?.first_name ? ad.profiles.first_name[0].toUpperCase() : 'B'}
                                    </div>
                                    <p className="text-sm text-gray-200 drop-shadow-md font-medium">
                                        Sponsored by {ad.profiles?.first_name ? `${ad.profiles.first_name} ${ad.profiles.last_name || ''}` : ad.profiles?.email || 'Partner'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
