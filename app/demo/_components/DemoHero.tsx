export interface DemoHeroProps {
  title: string
  subtitle: string
  badges: string[]
  primaryCta: {
    label: string
    onClick: () => void
  }
  secondaryCta?: {
    label: string
    href: string
  }
}

export function DemoHero({ title, subtitle, badges, primaryCta, secondaryCta }: DemoHeroProps) {
  return (
    <div className="hero min-h-[50vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl mb-6 text-base-content/80">{subtitle}</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {badges.map((badge) => (
              <span key={badge} className="badge badge-lg badge-outline">
                {badge}
              </span>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={primaryCta.onClick} className="btn btn-primary btn-lg">
              {primaryCta.label}
            </button>
            {secondaryCta && (
              <a href={secondaryCta.href} className="btn btn-outline btn-lg">
                {secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
