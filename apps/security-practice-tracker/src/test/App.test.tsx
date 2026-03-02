import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SecurityTrackerStudio } from '../features/SecurityTrackerStudio'

describe('SecurityTrackerStudio', () => {
  it('renders dashboard and legal notice', () => {
    render(<SecurityTrackerStudio />)
    expect(screen.getByRole('heading', { name: 'Security Practice Tracker' })).toBeInTheDocument()
    expect(screen.getByText(/For legal\/safe use only/i)).toBeInTheDocument()
  })

  it('allows saving a note', () => {
    render(<SecurityTrackerStudio />)
    fireEvent.change(screen.getByLabelText('note-input'), { target: { value: 'Focused on packet filtering basics' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Note' }))

    expect(screen.getByText(/Focused on packet filtering basics/)).toBeInTheDocument()
  })
})
