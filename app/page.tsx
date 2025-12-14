import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Code2, Palette, Zap, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4 border border-green-200">
          ✨ Available for freelance projects
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
          Hi, I'm <span className="text-blue-600">Kashi</span>
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto">
          A developer building innovative solutions with modern web technologies
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View My Work
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/request">
            <Button variant="outline" size="lg">
              Hire Me
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
          <div className="inline-block p-4 bg-blue-100 rounded-xl mb-4">
            <Code2 className="text-blue-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Clean Code</h3>
          <p className="text-gray-600">
            Writing maintainable, scalable, and efficient code following best practices
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
          <div className="inline-block p-4 bg-purple-100 rounded-xl mb-4">
            <Palette className="text-purple-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Design</h3>
          <p className="text-gray-600">
            Creating beautiful, responsive interfaces that users love
          </p>
        </div>

        <div className="text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all">
          <div className="inline-block p-4 bg-green-100 rounded-xl mb-4">
            <Zap className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Performance</h3>
          <p className="text-gray-600">
            Optimized applications that load quickly and run smoothly
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4">Ready to start your project?</h2>
        <p className="text-xl mb-8 opacity-90">
          Let's work together to bring your ideas to life
        </p>
        <Link href="/request">
          <Button variant="secondary" size="lg">
            Get Started Today
          </Button>
        </Link>
      </section>
    </div>
  )
}