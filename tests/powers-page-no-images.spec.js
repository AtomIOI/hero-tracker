const { test, expect } = require('@playwright/test');

test('Powers page loads with solid color cards', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Click the Powers navigation item
  await page.click('div.nav-item:has-text("POWERS")');

  // Wait for the powers grid to be visible
  await page.waitForSelector('#powers-grid');

  // Check that at least one power card is visible
  const powerCard = await page.locator('.power-card').first();
  await expect(powerCard).toBeVisible();

  // Check that the image tag is not present
  const image = await powerCard.locator('img');
  await expect(image).toHaveCount(0);

  // Take a screenshot of the powers page
  await page.screenshot({ path: '/home/jules/verification/powers-page-no-images.png' });
});
