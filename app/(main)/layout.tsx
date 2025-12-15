export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
      {children}
    </main>
  )
}