import { PrismaClient, ProjectCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding KK-Consulting to portfolio...')

  const project = await prisma.project.upsert({
    where: { slug: 'kk-consulting' },
    update: {},
    create: {
      slug: 'kk-consulting',
      title: 'KK Consulting',
      description: 'A professional consulting website for sustainable development, research, and strategic capacity-building services across Africa, the Middle East, and Asia. Built with Bootstrap 5 and featuring a clean, accessible design with responsive navigation and multi-page architecture.',
      category: ProjectCategory.WEB_DEVELOPMENT,
      tags: ['Bootstrap', 'HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Multi-page Site', 'Consulting'],
      techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'Font Awesome'],
      features: [
        'Responsive navigation with offcanvas menu',
        'Multi-page architecture (Home, About, Contact)',
        'Professional service cards showcasing expertise',
        'Clean, accessible UI with semantic HTML',
        'Optimized for mobile and desktop viewing',
        'SEO-friendly structure with proper meta tags',
        'Custom favicon implementation'
      ],
      liveUrl: 'https://kashik09.github.io/KK-Consulting/',
      githubUrl: 'https://github.com/kashik09/KK-Consulting',
      thumbnail: '/projects/kk-consulting-thumbnail.png',
      images: [
        '/projects/kk-consulting-hero.png',
        '/projects/kk-consulting-services.png',
        '/projects/kk-consulting-about.png',
        '/projects/kk-consulting-contact.png'
      ],
      problem: 'Created a professional web presence for a consulting firm specializing in sustainable development. The site needed to convey expertise and credibility while being accessible across all devices and easy to navigate for potential clients seeking advisory services.',
      content: `## Overview

KK Consulting is a professional website built for an advisory firm specializing in sustainable development, research, and capacity-building across Africa, the Middle East, and Asia.

## Technical Implementation

Built with vanilla HTML, CSS, and JavaScript using Bootstrap 5 for rapid development and responsive design. The site features:

- **Multi-page architecture** with consistent navigation across Home, About, and Contact pages
- **Responsive design** that adapts seamlessly from mobile to desktop
- **Offcanvas navigation** for mobile-friendly menu experience
- **Custom styling** on top of Bootstrap for brand consistency
- **Semantic HTML** for better SEO and accessibility

## Key Features

### Service Showcase
Three main service areas are highlighted with card components:
- Research & Social Science
- Policy & Governance
- Capacity Development

### Professional Design
Clean, corporate aesthetic with:
- Strategic use of whitespace
- Clear visual hierarchy
- Professional color scheme
- Readable typography

### User Experience
- Quick-access navigation
- Clear calls-to-action
- Contact information readily available
- Fast load times with minimal dependencies

## Deployment

Deployed on GitHub Pages with custom favicon implementation and proper meta tags for social media sharing.`,
      featured: false,
      published: true,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Successfully added KK-Consulting:', project.slug)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
