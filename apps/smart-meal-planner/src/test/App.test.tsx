import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MealPlannerPage } from '../features/planner/MealPlannerPage'

describe('MealPlannerPage', () => {
  it('renders planner and shopping list sections', () => {
    render(<MealPlannerPage />)
    expect(screen.getByRole('heading', { name: 'Smart Meal Planner' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Weekly Planner' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Shopping List/i })).toBeInTheDocument()
  })
})
