import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SprintPlannerPage } from '../features/planner/SprintPlannerPage'

describe('SprintPlannerPage', () => {
  it('renders kanban and dependency sections', () => {
    render(<SprintPlannerPage />)
    expect(screen.getByRole('heading', { name: 'AI Sprint Planner' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Kanban' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dependency View' })).toBeInTheDocument()
  })
})
