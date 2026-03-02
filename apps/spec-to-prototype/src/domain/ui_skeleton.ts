export interface UiSkeletonOutput {
  pages: string[]
  components: string[]
  notes: string[]
}

export function generateUiSkeleton(featureIdea: string): UiSkeletonOutput {
  const base = featureIdea.trim() || 'Product'
  return {
    pages: ['Dashboard', `${base} List`, `${base} Detail`, 'Settings'],
    components: ['TopNav', 'FilterBar', 'DataTable', 'ActionDrawer', 'EmptyState'],
    notes: [
      'Keep primary action visible above the fold.',
      'Provide loading and error states for each data view.',
      'Design for mobile and desktop breakpoints.'
    ]
  }
}
