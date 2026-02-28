import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login - Video Ads Platform',
    description: 'Login to manage your video ads',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex text-gray-900 bg-gray-50">
            <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {children}
                </div>
            </div>
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="Dashboard visualization"
                />
                <div className="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="max-w-xl text-center">
                        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
                            Manage Video Campaigns with Ease
                        </h2>
                        <p className="mt-4 text-xl text-blue-100">
                            Create, edit, and track your B2B video advertisements from a single, powerful dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
