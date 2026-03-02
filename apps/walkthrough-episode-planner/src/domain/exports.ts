import type { EpisodePlan } from './chunking'

export function exportPlanMarkdown(episodes: EpisodePlan[]): string {
  const lines: string[] = ['# Walkthrough Episode Plan', '']

  for (const episode of episodes) {
    lines.push(`## ${episode.title}`)
    lines.push(`- Duration: ${episode.totalMinutes} min`)
    lines.push(`- Pacing: ${episode.pacing}`)
    lines.push(`- Notes: ${episode.notes.join(' ')}`)
    lines.push('- Checklist:')
    for (const item of episode.items) {
      lines.push(`  - [ ] ${item.text} (${item.estimatedMinutes}m)`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
