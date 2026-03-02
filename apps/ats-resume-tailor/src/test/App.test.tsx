import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResumeTailorPage } from '../features/tailor/ResumeTailorPage'

describe('ResumeTailorPage', () => {
  it('renders diff and editing sections', () => {
    render(<ResumeTailorPage />)
    expect(screen.getByRole('heading', { name: 'Resume + JD Tailor' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Diff View' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Editing Panel' })).toBeInTheDocument()
  })
})
