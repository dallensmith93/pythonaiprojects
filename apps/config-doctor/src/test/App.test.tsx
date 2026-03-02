import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ConfigDoctorStudio } from '../features/ConfigDoctorStudio'

describe('ConfigDoctorStudio', () => {
  it('renders checklist and run button', () => {
    render(<ConfigDoctorStudio />)
    expect(screen.getByRole('heading', { name: 'Config Doctor' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run Diagnosis' })).toBeInTheDocument()
  })

  it('produces fix plans when pnpm is unchecked', () => {
    render(<ConfigDoctorStudio />)

    fireEvent.click(screen.getByLabelText('pnpmInstalled'))
    fireEvent.click(screen.getByRole('button', { name: 'Run Diagnosis' }))

    expect(screen.getByText(/Fix Plans \(/i)).toBeInTheDocument()
  })
})
