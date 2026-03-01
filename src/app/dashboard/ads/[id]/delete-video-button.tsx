'use client'

import { useFormStatus } from 'react-dom'
import { Trash2 } from 'lucide-react'

export function DeleteVideoAdButton({ adId, campaignId }: { adId: string, campaignId: string }) {
    const { pending } = useFormStatus()

    return (
        <form action={`/dashboard/ads/${campaignId}/videos/${adId}/delete`} method="POST">
            <button
                type="submit"
                disabled={pending}
                className="hidden sm:block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
                {pending ? '...' : 'Remove'}
                <span className="sr-only">, video ad</span>
            </button>
        </form>
    )
}
