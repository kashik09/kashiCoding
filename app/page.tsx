import { Hero } from '@/components/Hero'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Hero
        title="Build Your Digital Future"
        subtitle="Transform your ideas into powerful web applications with modern technologies and expert craftsmanship"
        ctaText="Start Your Project"
        ctaLink="/request"
      />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              What I Offer
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground-muted">
              Full-stack development services tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card hoverable>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <CardTitle>Web Development</CardTitle>
                <CardDescription>
                  Modern, responsive websites built with Next.js, React, and TypeScript
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <CardTitle>Backend Development</CardTitle>
                <CardDescription>
                  Scalable APIs and databases with Node.js, PostgreSQL, and Prisma
                </CardDescription>
              </CardHeader>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <CardTitle>UI/UX Design</CardTitle>
                <CardDescription>
                  Beautiful, intuitive interfaces that users love to interact with
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-accent py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Start Your Project?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Let&apos;s work together to bring your vision to life
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/request">
              <Button variant="secondary" size="lg">
                Request a Quote
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
