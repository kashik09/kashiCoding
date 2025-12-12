'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

export function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut' as const,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-accent-secondary to-primary px-4 py-20">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/10" />

      {/* Animated circles in background */}
      <motion.div
        className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent-secondary/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Link href={ctaLink}>
            <motion.button
              className="group relative overflow-hidden rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary shadow-xl transition-shadow hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50 sm:px-12 sm:py-5 sm:text-xl"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Button gradient background on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Button text */}
              <span className="relative flex items-center justify-center gap-2">
                {ctaText}
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.8,
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/60"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
