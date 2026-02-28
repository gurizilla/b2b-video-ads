import Link from 'next/link'
import { login, signup } from './actions'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleSignInButton } from '@/components/google-signin'

export default async function Login(props: { searchParams: Promise<{ message: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{' '}
                Back
            </Link>

            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">

                <div className="flex flex-col gap-2 text-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Sign in to your B2B Video Ads account</p>
                </div>

                <Label className="mt-4" htmlFor="email">
                    Email
                </Label>
                <Input
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <Label className="mt-4" htmlFor="password">
                    Password
                </Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <div className="flex flex-col gap-4 mt-8">
                    <SubmitButton
                        formAction={login}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        pendingText="Signing In..."
                    >
                        Sign In
                    </SubmitButton>
                    <SubmitButton
                        formAction={signup}
                        className="w-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-900"
                        pendingText="Signing Up..."
                    >
                        Sign Up
                    </SubmitButton>
                </div>
                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-gray-100 text-gray-900 text-center rounded-md font-medium">
                        {searchParams.message}
                    </p>
                )}

                <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-gray-50 px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <GoogleSignInButton />
            </form>
        </div>
    )
}
