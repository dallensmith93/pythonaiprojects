export interface TimingEstimate {
  seconds: number
  label: 'quick' | 'standard' | 'long'
}

export function estimateTiming(text: string, wordsPerMinute = 155): TimingEstimate {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const seconds = Math.max(8, Math.round((words / wordsPerMinute) * 60))

  if (seconds <= 25) return { seconds, label: 'quick' }
  if (seconds <= 55) return { seconds, label: 'standard' }
  return { seconds, label: 'long' }
}
