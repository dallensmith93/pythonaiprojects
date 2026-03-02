import { test, expect } from '@playwright/test'

test('smoke: showcase hub loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Showcase Hub' })).toBeVisible()
})
