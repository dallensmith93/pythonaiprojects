import { test, expect } from '@playwright/test'

test('smoke: homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Security Practice Lab Tracker' })).toBeVisible()
})
