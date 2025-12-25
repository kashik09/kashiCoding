import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

const principles = [
  {
    title: 'notice friction',
    description: 'if something feels slow or unclear, that is the signal to simplify.'
  },
  {
    title: 'shape the flow',
    description: 'i map the path from first glance to finished action and cut the noise.'
  },
  {
    title: 'ship in beats',
    description: 'small releases keep momentum high and feedback honest.'
  },
  {
    title: 'keep it calm',
    description: 'clean structure and readable interfaces make the work feel effortless.'
  }
]

export function HowIThink() {
  return (
    <Section id="thinking">
      <Container>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              how i think
            </p>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
              a calm build philosophy
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 bg-card/30 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
