import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Campaigns | Edit',
}
import { updateCampaign } from './actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Video, AlignLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditAdPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    let campaignQuery = supabase
        .from('campaigns')
        .select('*')
        .eq('id', params.id)

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    // If admin, we must use the service role to fetch if it's outside their company
    let fetchClient = supabase
    if (profile?.is_admin) {
        const { createAdminClient } = await import('@/utils/supabase/server')
        fetchClient = await createAdminClient()
    }

    const { data: campaign, error } = await fetchClient
        .from('campaigns')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !campaign) {
        console.error('Error fetching campaign:', error)
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/dashboard/ads"
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="sr-only">Back to campaigns</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
                    <p className="text-sm text-gray-500">Update your video advertisement settings.</p>
                </div>
            </div>

            {searchParams?.error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error updating campaign</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{searchParams.error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <form action={updateCampaign} className="px-4 py-6 sm:p-8">
                    <input type="hidden" name="id" value={campaign.id} />
                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-5">
                            <Label htmlFor="title" className="flex items-center gap-2 mb-2">
                                <Video className="w-4 h-4 text-gray-500" />
                                Campaign Title *
                            </Label>
                            <div className="mt-2">
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    defaultValue={campaign.title}
                                    required
                                    className="max-w-md"
                                />
                            </div>
                        </div>



                        <div className="sm:col-span-6">
                            <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                                <AlignLeft className="w-4 h-4 text-gray-500" />
                                Description
                            </Label>
                            <div className="mt-2 text-gray-900">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                    defaultValue={campaign.description || ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <Label htmlFor="status" className="mb-2 block">Status</Label>
                            <div className="mt-2">
                                <select
                                    id="status"
                                    name="status"
                                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    defaultValue={campaign.status}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-8">
                        <Link href="/dashboard/ads" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                            Cancel
                        </Link>
                        <SubmitButton pendingText="Saving...">
                            Save Changes
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    )
}
