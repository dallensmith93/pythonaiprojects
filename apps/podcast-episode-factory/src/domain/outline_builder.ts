export interface OutlineBuilderState {
  status: 'idle' | 'ready'
}

export function initOutlineBuilder(): OutlineBuilderState {
  return { status: 'ready' }
}
