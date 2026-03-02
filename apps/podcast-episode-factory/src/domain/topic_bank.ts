export interface TopicBankState {
  status: 'idle' | 'ready'
}

export function initTopicBank(): TopicBankState {
  return { status: 'ready' }
}
