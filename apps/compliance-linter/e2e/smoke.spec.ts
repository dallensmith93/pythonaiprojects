import { test, expect } from '@playwright/test'

test('smoke: homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Policy & Constraints Compliance Checker' })).toBeVisible()
})
