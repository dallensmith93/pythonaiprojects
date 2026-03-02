import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CRMStudio } from '../features/CRMStudio'

describe('CRMStudio', () => {
  it('renders CRM panels', () => {
    render(<CRMStudio />)
    expect(screen.getByRole('heading', { name: 'Personal CRM' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument()
  })

  it('updates draft preview when topic changes', () => {
    render(<CRMStudio />)
    fireEvent.change(screen.getByLabelText('draft-topic'), { target: { value: 'proposal timeline' } })

    expect((screen.getByLabelText('draft-preview') as HTMLTextAreaElement).value).toContain('proposal timeline')
  })
})
