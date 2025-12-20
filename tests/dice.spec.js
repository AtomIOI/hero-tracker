const { test, expect } = require('@playwright/test');

test.describe('Dice Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000');
        await page.click('.nav-item:has-text("DICE")');
    });

    test('should load dice page', async ({ page }) => {
        await expect(page.locator('.comic-title')).toHaveText('DICE TRAY');
        // Check default dice (d6, d8, d10)
        await expect(page.locator('.die-slot-img-container')).toHaveCount(3);
    });

    test('should roll dice', async ({ page }) => {
        const rollBtn = page.locator('.roll-btn');
        await expect(rollBtn).toHaveText('ROLL!');

        await rollBtn.click();

        // Should show rolling state
        await expect(rollBtn).toHaveText('...');

        // Wait for results (simulated delay 800ms)
        await expect(page.locator('.result-box')).toHaveCount(3, { timeout: 3000 });
        await expect(rollBtn).toHaveText('ROLL!');

        // Verify results displayed
        const minVal = await page.locator('.result-box.min .result-value').innerText();
        const midVal = await page.locator('.result-box.mid .result-value').innerText();
        const maxVal = await page.locator('.result-box.max .result-value').innerText();

        expect(Number(minVal)).not.toBeNaN();
        expect(Number(midVal)).not.toBeNaN();
        expect(Number(maxVal)).not.toBeNaN();
    });

    test('should add modifier via modal', async ({ page }) => {
        test.setTimeout(60000);

        // Verify initial total is +0
        await expect(page.locator('.total-value')).toHaveText('+0');

        // Click add button to open modal
        await page.click('.add-mod-btn');

        // Modal should be visible
        await expect(page.locator('.add-mod-modal')).toBeVisible();

        // Click +3 preset
        await page.click('.preset-btn:has-text("+3")');

        // Enter name
        await page.fill('.mod-name-input', 'High Ground');

        // Click create
        await page.click('.modal-btn.create');

        // Modal should close
        await expect(page.locator('.add-mod-modal')).not.toBeVisible();

        // Verify modifier banner appears
        const modBanner = page.locator('.modifier-banner').filter({ hasText: 'High Ground' });
        await expect(modBanner).toBeVisible();
        await expect(modBanner).toContainText('+3');

        // Verify total updated
        await expect(page.locator('.total-value')).toHaveText('+3');
    });

    test('should toggle modifier active state on tap', async ({ page }) => {
        test.setTimeout(60000);

        // Add a modifier first
        await page.click('.add-mod-btn');
        await page.click('.preset-btn:has-text("+2")');
        await page.fill('.mod-name-input', 'Cover');
        await page.click('.modal-btn.create');

        // Verify total is +2
        await expect(page.locator('.total-value')).toHaveText('+2');

        // Click the modifier to toggle inactive
        await page.click('.modifier-banner');

        // Verify total is now +0 (modifier inactive)
        await expect(page.locator('.total-value')).toHaveText('+0');

        // Verify banner has inactive class
        await expect(page.locator('.modifier-banner')).toHaveClass(/inactive/);

        // Click again to reactivate
        await page.click('.modifier-banner');

        // Verify total is +2 again
        await expect(page.locator('.total-value')).toHaveText('+2');
    });

    test('should clear temporary modifiers', async ({ page }) => {
        test.setTimeout(60000);

        // Add a temporary modifier (default is temp)
        await page.click('.add-mod-btn');
        await page.click('.preset-btn:has-text("+1")');
        await page.fill('.mod-name-input', 'TempMod');
        await page.click('.modal-btn.create');

        // Verify modifier exists
        await expect(page.locator('.modifier-banner')).toBeVisible();

        // Verify Clear Temp button is visible
        await expect(page.locator('.clear-temp-btn')).toBeVisible();

        // Click Clear Temp
        await page.click('.clear-temp-btn');

        // Verify modifier is gone
        await expect(page.locator('.modifier-banner')).not.toBeVisible();

        // Verify Clear Temp button is hidden (no temp mods left)
        await expect(page.locator('.clear-temp-btn')).not.toBeVisible();
    });

    test('should show modifiers container with speech bubble', async ({ page }) => {
        // Verify the new modifiers container structure exists
        await expect(page.locator('.modifiers-container')).toBeVisible();
        await expect(page.locator('.total-header')).toBeVisible();
        await expect(page.locator('.total-bubble')).toBeVisible();
        await expect(page.locator('.modifier-list')).toBeVisible();
        await expect(page.locator('.controls-footer')).toBeVisible();
    });

    test('should change selected die', async ({ page }) => {
        test.setTimeout(60000);
        // Click first die (index 0, default d6)
        await page.locator('.die-slot-img-container').nth(0).click();

        // Modal appears
        await expect(page.locator('.dice-selector-modal')).toBeVisible();

        // Select d12
        // Use force: true because of the overlay issue seen in other tests
        await page.locator('.die-option img[alt="d12"]').click({ force: true });

        // Modal closes
        await expect(page.locator('.dice-selector-modal')).not.toBeVisible();

        // Verify die changed
        await expect(page.locator('.die-slot-img-container img').nth(0)).toHaveAttribute('alt', 'd12');
    });
});
