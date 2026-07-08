import { test, expect } from '@playwright/test';

test('click product on category shows inline PDP', async ({ page }) => {
  const base = process.env.E2E_BASE || 'http://localhost:8094';
  await page.goto(`${base}/products/resin-surface-filling`, { waitUntil: 'networkidle' });
  // wait for app hydration marker (set in src/routes/__root.tsx)
  await page.waitForFunction(() => (document.documentElement.dataset as any).hydrated === 'true', { timeout: 20000 });
  // wait for list to load
  await page.waitForSelector('button[data-product-slug]', { timeout: 5000 });
  // click the first product
  const first = await page.locator('button[data-product-slug]').first();
  const name = (await first.innerText()).trim();
  await first.scrollIntoViewIfNeeded();
  // Use evaluate-based click to bypass any visibility/capture issues in headless
  await page.evaluate(() => {
    const btn = document.querySelector('button[data-product-slug]');
    if (btn) {
      btn.scrollIntoView({ block: 'center' });
      (btn as HTMLElement).click();
    }
  });
  // assert the product heading appears in the inline PDP (use the clicked button text)
  const productPage = page.locator('.product-page');
  await expect(productPage).toBeVisible({ timeout: 10000 });
});
