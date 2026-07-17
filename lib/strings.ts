export function getPossessive(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return ''
  const endsWithS = trimmed.toLowerCase().endsWith('s')
  return endsWithS ? `${trimmed}'` : `${trimmed}'s`
}
