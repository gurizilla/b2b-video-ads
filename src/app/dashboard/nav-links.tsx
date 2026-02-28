'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ isAdmin }: { isAdmin: boolean }) {
    const pathname = usePathname()

    // Check which route is currently active
    const isAdsActive = pathname.startsWith('/dashboard/ads')
    const isAdminActive = pathname.startsWith('/dashboard/admin')

    return (
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
                href="/dashboard/ads"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isAdsActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
            >
                My Campaigns
            </Link>
            {isAdmin && (
                <Link
                    href="/dashboard/admin"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isAdminActive
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                >
                    Admin Dashboard
                </Link>
            )}
        </div>
    )
}
