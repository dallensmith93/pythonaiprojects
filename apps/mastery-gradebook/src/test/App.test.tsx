import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GradebookPage } from '../features/gradebook/GradebookPage'

describe('GradebookPage', () => {
  it('renders key sections', () => {
    render(<GradebookPage />)
    expect(screen.getByRole('heading', { name: 'Mastery-Based Gradebook' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Student Detail' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mastery Heatmap' })).toBeInTheDocument()
  })
})
