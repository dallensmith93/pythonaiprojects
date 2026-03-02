import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { KBStudio } from '../features/KBStudio'

describe('KBStudio', () => {
  it('renders ingestion and search controls', () => {
    render(<KBStudio />)
    expect(screen.getByRole('heading', { name: 'Knowledge Base Builder' })).toBeInTheDocument()
    expect(screen.getByLabelText('docs-input')).toBeInTheDocument()
    expect(screen.getByLabelText('search-input')).toBeInTheDocument()
  })

  it('ingests docs and shows citation-backed search results', () => {
    render(<KBStudio />)

    fireEvent.click(screen.getByRole('button', { name: 'Ingest + Index' }))

    expect(screen.getByText(/Chunks:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/#chunk-/i).length).toBeGreaterThan(0)
  })
})
