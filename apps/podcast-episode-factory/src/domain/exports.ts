export interface ExportsState {
  status: 'idle' | 'ready'
}

export function initExports(): ExportsState {
  return { status: 'ready' }
}
