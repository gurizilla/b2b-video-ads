'use client'

import { assignUserToCompany } from '@/app/dashboard/admin/users/actions'

type Company = {
    id: string
    name: string
}

export function CompanySelector({
    userId,
    currentCompanyId,
    companies
}: {
    userId: string
    currentCompanyId: string | null
    companies: Company[]
}) {
    return (
        <form action={assignUserToCompany} className="flex gap-2 w-full max-w-sm">
            <input type="hidden" name="user_id" value={userId} />
            <select
                name="company_id"
                defaultValue={currentCompanyId || "unassigned"}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
                onChange={(e) => e.target.form?.requestSubmit()}
            >
                <option value="unassigned">-- Unassigned --</option>
                {companies?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
        </form>
    )
}
