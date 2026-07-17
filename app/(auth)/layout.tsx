export const dynamic = 'force-dynamic'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
