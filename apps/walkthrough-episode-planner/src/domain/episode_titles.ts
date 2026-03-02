import type { EpisodePlan } from './chunking'

function shortLabel(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .join(' ')
}

export function applyEpisodeTitles(episodes: EpisodePlan[]): EpisodePlan[] {
  return episodes.map((episode, index) => {
    const first = episode.items[0]?.text ?? 'Progress'
    const last = episode.items[episode.items.length - 1]?.text ?? 'checkpoint'
    return {
      ...episode,
      title: `Episode ${index + 1}: ${shortLabel(first)} -> ${shortLabel(last)}`
    }
  })
}
