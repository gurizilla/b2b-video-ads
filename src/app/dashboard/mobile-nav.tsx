'use client'

import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { NavLinks } from './nav-links'
import { signout } from '@/app/login/actions'

export function MobileNav({ email, isAdmin }: { email: string, isAdmin: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex sm:hidden">
            {/* Mobile menu button */}
            <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
            </button>

            {/* Mobile menu, show/hide based on menu state. */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg border-b border-gray-200 z-50 text-left pb-3" id="mobile-menu">
                    <NavLinks isAdmin={isAdmin} mobile />
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                    {email[0].toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800 truncate max-w-[200px]">{email}</div>
                            </div>
                            <form action={signout} className="ml-auto">
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
            )}
        </div>
    )
}
