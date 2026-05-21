import { prisma } from '../lib/prisma'

async function main() {
  console.log('🌱 Seeding database...')

  // Add JS Calculator project
  const calculator = await prisma.project.upsert({
    where: { slug: 'js-calculator' },
    update: {},
    create: {
      slug: 'js-calculator',
      title: 'JS Calculator - Modern Calculator App',
      description:
        'A feature-rich, modern calculator web application with draggable modals, multiple themes (Dark, Light, Ocean, Sunset), advanced operations, and comprehensive calculation history. Built with Next.js 16, React 19, and Tailwind CSS.',
      category: 'CLASS',
      tags: ['calculator', 'javascript', 'nextjs', 'tailwind'],
      techStack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Lucide React'],
      features: ['Draggable modals', 'Multiple themes', 'Calculation history', 'Keyboard support'],
      thumbnail: '/projects/js-calculator.png',
      images: [],
      featured: true,
      published: true,
      githubUrl: 'https://github.com/kashik09/js-calc',
      liveUrl: '',
      publishedAt: new Date(),
    },
  })

  console.log('✅ Created calculator project:', calculator.title)

  // Ensure singleton SiteSettings row exists
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 'site_settings_singleton' },
    update: {},
    create: {
      id: 'site_settings_singleton',
      maintenanceMode: false,
      availableForBusiness: true,
    },
  })

  console.log('✅ Ensured site settings singleton:', siteSettings.id)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
