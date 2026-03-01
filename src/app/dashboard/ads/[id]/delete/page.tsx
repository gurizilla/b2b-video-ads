import type { Metadata } from 'next'
import { deleteCampaign } from './actions'

export const metadata: Metadata = {
    title: 'Campaigns | Delete',
}
export default async function DeleteAdPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    // We use a simple form here just to trigger the delete action
    // In a real app, you'd likely want a confirmation modal, but a dedicated route 
    // also works for pure server actions
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-red-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Campaign?</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this campaign? This action cannot be undone.</p>

            {searchParams?.error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{searchParams.error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <form action={deleteCampaign}>
                <input type="hidden" name="id" value={params.id} />
                <div className="flex gap-4 justify-center">
                    <a href="/dashboard/ads" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </a>
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
                        Confirm Delete
                    </button>
                </div>
            </form>
        </div>
    )
}
