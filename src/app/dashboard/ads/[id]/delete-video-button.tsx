'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteVideoAd } from './video-actions'

export function DeleteVideoAdButton({ adId, campaignId }: { adId: string, campaignId: string }) {
    const [pending, startTransition] = useTransition()

    const handleDelete = () => {
        if (confirm('Are you sure you want to remove this video from the campaign?')) {
            startTransition(async () => {
                try {
                    await deleteVideoAd(adId, campaignId)
                } catch (e) {
                    alert('Error deleting video')
                }
            })
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="hidden sm:inline-flex rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 items-center justify-center transition-colors"
        >
            {pending ? '...' : (
                <><Trash2 className="h-4 w-4 mr-1.5 hidden lg:block" />Remove</>
            )}
            <span className="sr-only">, video ad</span>
        </button>
    )
}
