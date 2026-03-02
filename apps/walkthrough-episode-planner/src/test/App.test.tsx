import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EpisodePlannerStudio } from '../features/EpisodePlannerStudio'

describe('EpisodePlannerStudio', () => {
  it('renders checklist controls', () => {
    render(<EpisodePlannerStudio />)

    expect(screen.getByRole('heading', { name: 'Walkthrough Episode Planner' })).toBeInTheDocument()
    expect(screen.getByLabelText('checklist-input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Build Episode Plan' })).toBeInTheDocument()
  })

  it('builds episodes and export markdown', () => {
    render(<EpisodePlannerStudio />)

    fireEvent.click(screen.getByRole('button', { name: 'Build Episode Plan' }))

    expect(screen.getByText(/episodes \(/i)).toBeInTheDocument()
    expect((screen.getByLabelText('markdown-export') as HTMLTextAreaElement).value).toContain('# Walkthrough Episode Plan')
  })
})
