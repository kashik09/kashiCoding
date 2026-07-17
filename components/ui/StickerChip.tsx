'use client'

interface StickerChipProps {
  label: string
  treatment?: 'solid' | 'outline' | 'glass' | 'egg'
  tone?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md'
  className?: string
}

export function StickerChip({
  label,
  treatment = 'solid',
  tone = 'primary',
  size = 'sm',
  className = '',
}: StickerChipProps) {
  // Size classes
  const sizeClasses = {
    sm: 'px-3.5 py-2 text-[0.7rem] tracking-[0.15em] leading-none',
    md: 'px-4 py-2.5 text-[0.75rem] tracking-[0.18em] leading-tight',
  }[size]

  // Treatment-specific styles using DaisyUI tokens
  const treatmentClasses = {
    solid: `
      bg-primary text-primary-content
      border border-primary/30
      shadow-sm hover:shadow-md
      relative overflow-hidden
      before:absolute before:top-0 before:right-0
      before:w-3 before:h-3
      before:bg-gradient-to-br before:from-primary-content/10 before:to-transparent
      before:rounded-bl-full
      before:pointer-events-none
    `,
    outline: `
      bg-transparent text-secondary
      border border-secondary/40
      hover:bg-secondary/10
    `,
    glass: `
      bg-base-100/10 text-base-content
      border border-base-content/10
      backdrop-blur-md
      relative overflow-hidden
      before:absolute before:top-0 before:right-0
      before:w-3 before:h-3
      before:bg-gradient-to-br before:from-base-content/8 before:to-transparent
      before:rounded-bl-full
      before:pointer-events-none
    `,
    egg: `
      bg-accent/15 text-accent
      border border-dashed border-accent/40
      opacity-80 hover:opacity-100
    `,
  }[treatment]

  return (
    <div
      className={`
        ${sizeClasses}
        ${treatmentClasses}
        ${className}
        inline-flex items-center justify-center
        rounded-full
        whitespace-nowrap
        max-w-full
        overflow-hidden
        text-ellipsis
        transition-all duration-300 ease-out
        hover:-translate-y-[1px]
        hover:scale-[1.02]
        hover:ring-2 hover:ring-primary/20
        cursor-default
        select-none
        sticker-chip
      `}
    >
      <span className="block uppercase relative z-10">{label}</span>

      <style jsx>{`
        .sticker-chip {
          position: relative;
        }

        .sticker-chip::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 70%
          );
          opacity: 0;
          transform: translateX(-100%);
          transition: opacity 300ms ease;
        }

        .sticker-chip:hover::after {
          opacity: 1;
          animation: shine 1.2s ease-in-out;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(25deg);
          }
          100% {
            transform: translateX(100%) rotate(25deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sticker-chip,
          .sticker-chip::after {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
