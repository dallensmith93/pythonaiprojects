import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { WorksheetStudio } from '../features/WorksheetStudio'

describe('WorksheetStudio', () => {
  it('renders setup controls', () => {
    render(<WorksheetStudio />)
    expect(screen.getByRole('heading', { name: 'Scaled Copies Worksheet Generator' })).toBeInTheDocument()
    expect(screen.getByLabelText('worksheet-title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Problems' })).toBeInTheDocument()
  })

  it('generates worksheet and answer key panels', () => {
    render(<WorksheetStudio />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate Problems' }))

    expect(screen.getByRole('heading', { name: 'Answer Key' })).toBeInTheDocument()
    expect((screen.getByLabelText('worksheet-print') as HTMLTextAreaElement).value).toContain('#')
  })
})
