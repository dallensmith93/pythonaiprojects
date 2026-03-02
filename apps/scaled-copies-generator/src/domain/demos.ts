export interface DemosState {
  status: 'idle' | 'ready'
}

export function initDemos(): DemosState {
  return { status: 'ready' }
}
