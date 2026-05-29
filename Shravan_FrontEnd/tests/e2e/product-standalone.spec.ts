import { test, expect } from '@playwright/test';

test('standalone product page loads', async ({ page }) => {
  // Visit a known product slug directly
  await page.goto('http://localhost:8093/product/bond-tite-high-gloss-part-a', { waitUntil: 'domcontentloaded' });
  // wait for client hydration marker
  await page.waitForFunction(() => (document.documentElement.dataset as any).hydrated === 'true', { timeout: 10000 });

  const productPage = page.locator('.product-page');
  await expect(productPage).toBeVisible({ timeout: 10000 });
});
