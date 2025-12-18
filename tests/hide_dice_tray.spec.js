const { test, expect } = require('@playwright/test');

test.describe('Hide Dice Tray Feature', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000');
    });

    test('should hide dice tray when option is enabled in settings', async ({ page }) => {
        // Navigate to Settings
        await page.click('.nav-item:has-text("SETTINGS")');

        // Find and click the toggle
        // Assuming the structure from implementation: a toggle switch in .settings-container
        // We look for the label "Hide Dice Tray" and the associated input/slider
        const toggleLabel = page.locator('label:has-text("Hide Dice Tray")');
        await expect(toggleLabel).toBeVisible();

        const toggleInput = page.locator('input[type="checkbox"][id="hide-dice-tray"]'); // or verify by association
        // If the implementation uses a wrapper, we might need to click the slider.
        // Based on css/settings.css, it's typically a .slider span.
        // Let's click the label or the slider.
        await toggleLabel.click();

        // Navigate to Dice Page
        await page.click('.nav-item:has-text("DICE")');

        // Verify Dice Tray Header is visible but text is changed to "DICE"
        await expect(page.locator('h1.comic-title')).toHaveText('DICE');
        await expect(page.locator('h1.comic-title')).not.toHaveText('DICE TRAY');

        // Verify Dice Selection Area is HIDDEN
        await expect(page.locator('.dice-selection-area')).not.toBeVisible();

        // Verify Roll Button is HIDDEN
        await expect(page.locator('.roll-btn')).not.toBeVisible();

        // Verify Modifiers are VISIBLE
        await expect(page.locator('.modifiers-section')).toBeVisible();
    });

    test('should show dice tray by default', async ({ page }) => {
        // Navigate to Dice Page
        await page.click('.nav-item:has-text("DICE")');

        // Verify Header says "DICE TRAY"
        await expect(page.locator('h1.comic-title')).toHaveText('DICE TRAY');

        // Verify Dice Selection Area is VISIBLE
        await expect(page.locator('.dice-selection-area')).toBeVisible();

        // Verify Modifiers are VISIBLE
        await expect(page.locator('.modifiers-section')).toBeVisible();
    });

    test('should show dice tray when toggled back off', async ({ page }) => {
        // 1. Turn it ON
        await page.click('.nav-item:has-text("SETTINGS")');
        await page.click('label:has-text("Hide Dice Tray")');

        // 2. Turn it OFF (toggle again)
        await page.click('label:has-text("Hide Dice Tray")');

        // 3. Check Dice Page
        await page.click('.nav-item:has-text("DICE")');
        await expect(page.locator('.dice-selection-area')).toBeVisible();
    });
});
