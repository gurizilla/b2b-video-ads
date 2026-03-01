import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Video, LogOut } from 'lucide-react'
import { NavLinks } from './nav-links'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 transition-all duration-300 pointer-events-auto border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/dashboard/ads" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                                    <Video className="h-6 w-6" />
                                    <span>AdManager Pro</span>
                                </Link>
                            </div>
                            <NavLinks isAdmin={!!profile?.is_admin} />
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">


                            <div className="relative ml-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700">{user.email}</span>
                                    <form action={handleSignOut}>
                                        <button
                                            type="submit"
                                            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <span className="sr-only">Sign out</span>
                                            <LogOut className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
