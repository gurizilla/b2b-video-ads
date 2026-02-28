'use client'

import { useFormStatus } from 'react-dom'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps extends ButtonProps {
    pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
    const { pending, action } = useFormStatus()

    const isPending = pending && action === props.formAction

    return (
        <Button {...props} type="submit" aria-disabled={pending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? pendingText : children}
        </Button>
    )
}
