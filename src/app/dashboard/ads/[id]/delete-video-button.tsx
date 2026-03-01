'use client'

import { useTransition, useState } from 'react'
import { Trash2, AlertCircle } from 'lucide-react'
import { deleteVideoAd } from './video-actions'

export function DeleteVideoAdButton({ adId, campaignId }: { adId: string, campaignId: string }) {
    const [pending, startTransition] = useTransition()
    const [showConfirm, setShowConfirm] = useState(false)

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        startTransition(async () => {
            try {
                await deleteVideoAd(adId, campaignId)
                setShowConfirm(false)
            } catch (e) {
                console.error('Deletion failed:', e)
                alert('Error deleting video. You might lack permissions (RLS blocked).')
            }
        })
    }

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 bg-red-50 p-2 rounded-md border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800 font-medium">Remove?</span>
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(false) }}
                    disabled={pending}
                    className="ml-2 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded border border-gray-300 bg-white"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    disabled={pending}
                    className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded border border-transparent shadow-sm"
                >
                    {pending ? '...' : 'Confirm'}
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true) }}
            className="hidden sm:inline-flex rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50 hover:text-red-700 items-center justify-center transition-colors"
        >
            <Trash2 className="h-4 w-4 mr-1.5 hidden lg:block" />Remove
        </button>
    )
}
