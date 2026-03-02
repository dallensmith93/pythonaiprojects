import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LearningPathPlanner } from '../features/LearningPathPlanner'

describe('LearningPathPlanner', () => {
  it('renders calendar and action panel', () => {
    render(<LearningPathPlanner />)

    expect(screen.getByRole('heading', { name: 'Learning Path Builder' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Weekly Calendar' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Action Panel' })).toBeInTheDocument()
  })

  it('allows selecting and completing a task', () => {
    render(<LearningPathPlanner />)

    const taskButton = screen.getAllByRole('button').find((button) =>
      /learn|review/i.test(button.textContent ?? '')
    )

    expect(taskButton).toBeDefined()

    fireEvent.click(taskButton!)
    fireEvent.click(screen.getByRole('button', { name: /mark complete/i }))

    expect(screen.getByText(/in progress:/i)).toBeInTheDocument()
  })
})
