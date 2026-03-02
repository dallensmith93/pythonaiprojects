export interface ConsistencyChecksState {
  status: 'idle' | 'ready'
}

export function initConsistencyChecks(): ConsistencyChecksState {
  return { status: 'ready' }
}
