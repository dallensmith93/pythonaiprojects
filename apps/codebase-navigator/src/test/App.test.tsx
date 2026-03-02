import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CodebaseNavigatorPage } from '../features/navigator/CodebaseNavigatorPage'

describe('CodebaseNavigatorPage', () => {
  it('renders file tree and graph sections', () => {
    render(<CodebaseNavigatorPage />)
    expect(screen.getByRole('heading', { name: 'Codebase Navigator Agent' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'File Tree' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dependency Graph' })).toBeInTheDocument()
  })
})
