const IDEAS = {
  projectClasses: [
    {
      name: 'Seedling',
      summary: 'Small, contained build with a clear finish line.',
    },
    {
      name: 'Bloom',
      summary: 'Multi-page product with defined scope and a few integrations.',
    },
    {
      name: 'Living Thing',
      summary: 'Evolving system that needs ongoing care and governance.',
    },
  ],
  escalationFeatures: [
    'auth',
    'roles',
    'dashboards',
    'ecommerce',
    'payments',
    'webhooks',
    'APIs',
    'background jobs',
    'analytics',
    'admin panels',
    'security hardening',
    'monitoring',
  ],
}

export default function AdminIdeasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ideas</h1>
        <p className="text-muted-foreground mt-1">
          Internal-only planning notes for project positioning.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <pre className="text-sm text-foreground whitespace-pre-wrap">
          {JSON.stringify(IDEAS, null, 2)}
        </pre>
      </div>
    </div>
  )
}
