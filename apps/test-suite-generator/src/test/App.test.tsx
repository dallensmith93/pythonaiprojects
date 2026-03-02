import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TestGeneratorPage } from '../features/runner/TestGeneratorPage'

describe('TestGeneratorPage', () => {
  it('renders runner and history sections', () => {
    render(<TestGeneratorPage />)
    expect(screen.getByRole('heading', { name: 'Test Suite Generator + Flake Detector' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Generated Tests' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Run History/i })).toBeInTheDocument()
  })
})
