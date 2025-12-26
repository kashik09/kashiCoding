import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-2xl border border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Reset</h1>
          <p className="text-muted-foreground">
            Password reset functionality coming soon
          </p>
        </div>

        <div className="p-6 bg-muted/40 border border-border rounded-lg mb-6">
          <p className="text-sm text-foreground/80 mb-4">
            This feature is currently under development. For now, please contact support to reset your password.
          </p>
          <p className="text-xs text-muted-foreground">
            We&apos;ll notify you when password reset is available.
          </p>
        </div>

        <Link href="/login" className="block">
          <Button variant="outline" size="lg" className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
