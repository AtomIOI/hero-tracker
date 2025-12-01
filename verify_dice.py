from playwright.sync_api import sync_playwright, expect
import os
import time

def run():
    """
    Runs a Playwright verification script to test the Dice Page functionality.

    This script performs the following actions:
    1. Launches a headless Chromium browser.
    2. Navigates to the application home page.
    3. Navigates to the Dice Page.
    4. Verifies the header text.
    5. Verifies initial dice selection.
    6. Simulates a dice roll.
    7. Adds a modifier and verifies its presence.
    8. Takes screenshots at key steps for debugging.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Using a slightly larger viewport to avoid potential layout shifts hiding elements,
        # though standard mobile is fine.
        context = browser.new_context(viewport={'width': 414, 'height': 896})
        page = context.new_page()

        # 1. Navigate to home
        page.goto("http://localhost:8000")

        # DEBUG: Take a screenshot of Home
        if not os.path.exists("verification"):
            os.makedirs("verification")
        page.screenshot(path="verification/debug_home.png")

        # 2. Navigate to Dice Page
        # Click the parent .nav-item to be safe
        page.locator(".nav-item").filter(has_text="DICE").click()

        # Wait a moment for Vue to swap components
        # (Though Playwright's auto-wait is usually good, Vue transition might be instant but DOM update async)
        page.wait_for_timeout(500)

        # DEBUG: Take a screenshot of Dice Page (or what it thinks is the Dice Page)
        page.screenshot(path="verification/debug_dice_page.png")

        # 3. Verify Header
        expect(page.locator(".dice-tray-header")).to_have_text("DICE TRAY")

        # 4. Verify Dice Selection
        # The selector .die-slot was not found, checking for the image container
        dice_slots = page.locator(".die-slot-img-container")
        # Ensure there are dice slots
        expect(dice_slots).to_have_count(3)

        # 5. Roll Dice
        page.click(".roll-btn")

        # 6. Verify Results appear
        expect(page.locator(".result-box.min")).to_be_visible()

        # 7. Add a Modifier
        page.fill("input[placeholder='Name (e.g. High Ground)']", "Boost")
        page.fill("input[placeholder='+1']", "2")
        page.click(".add-modifier-form .comic-btn.plus")

        # 8. Verify Modifier Added
        expect(page.locator(".modifier-chip")).to_contain_text("Boost")
        expect(page.locator(".modifier-chip .modifier-value")).to_have_text("+2")

        # 9. Screenshot Final
        page.screenshot(path="verification/dice_page_verified.png")

        browser.close()

if __name__ == "__main__":
    run()
