export function formatDate(date?: Date | string | null): string {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString()
  } catch {
    return ''
  }
}
