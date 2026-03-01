'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ isAdmin, mobile, onLinkClick }: { isAdmin: boolean, mobile?: boolean, onLinkClick?: () => void }) {
    const pathname = usePathname()

    // Check which route is currently active
    const isDashboardActive = pathname === '/dashboard'
    const isAdsActive = pathname.startsWith('/dashboard/ads')
    const isUsersActive = pathname.startsWith('/dashboard/admin/users')

    if (mobile) {
        return (
            <div className="pt-2 pb-3 space-y-1">
                <Link
                    href="/dashboard"
                    onClick={onLinkClick}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isDashboardActive
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                >
                    Overview
                </Link>
                <Link
                    href="/dashboard/ads"
                    onClick={onLinkClick}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isAdsActive
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                >
                    My Campaigns
                </Link>
                {isAdmin && (
                    <Link
                        href="/dashboard/admin/users"
                        onClick={onLinkClick}
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isUsersActive
                            ? 'border-blue-500 text-blue-700 bg-blue-50'
                            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                            }`}
                    >
                        User Maintenance
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isDashboardActive
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
            >
                Overview
            </Link>
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
                    href="/dashboard/admin/users"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isUsersActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                >
                    User Maintenance
                </Link>
            )}
        </div>
    )
}
