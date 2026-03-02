import { test, expect } from '@playwright/test'

test('smoke: homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Smart Meal Planner (Low-carb, Simple)' })).toBeVisible()
})
