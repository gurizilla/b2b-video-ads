import { redirect } from 'next/navigation'

export default function Home() {
  // The user requested to remove the public root page feed.
  // Redirecting to the dashboard provides a better UX than a 404.
  redirect('/dashboard')
}
