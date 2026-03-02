export interface TemplatesState {
  status: 'idle' | 'ready'
}

export function initTemplates(): TemplatesState {
  return { status: 'ready' }
}
