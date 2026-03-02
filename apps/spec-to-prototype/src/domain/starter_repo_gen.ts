import type { ApiSchemaOutput } from './schemas'
import type { UiSkeletonOutput } from './ui_skeleton'

export interface StarterRepoOutput {
  files: string[]
  notes: string[]
}

export function generateStarterRepo(api: ApiSchemaOutput, ui: UiSkeletonOutput): StarterRepoOutput {
  const endpointFiles = api.endpoints.map((endpoint) => `backend/routes/${endpoint.method.toLowerCase()}_${endpoint.path.replace(/\//g, '_').replace(/[{}]/g, '')}.ts`)

  return {
    files: [
      'README.md',
      'frontend/src/app/page.tsx',
      'frontend/src/features/Dashboard.tsx',
      'frontend/src/features/components.tsx',
      'backend/app/main.py',
      'backend/app/schemas.ts',
      ...endpointFiles
    ],
    notes: [
      `Create UI shells for pages: ${ui.pages.join(', ')}.`,
      'Wire generated API routes to typed schema validators.',
      'Add lint/test/typecheck scripts before feature coding.'
    ]
  }
}
