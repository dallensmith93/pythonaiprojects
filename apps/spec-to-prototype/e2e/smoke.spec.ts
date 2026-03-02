import { test, expect } from '@playwright/test'

test('smoke: homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Product Spec → Prototype Builder' })).toBeVisible()
})
