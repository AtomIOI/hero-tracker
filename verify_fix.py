from playwright.sync_api import sync_playwright

def run(playwright):
    """
    Runs a Playwright verification script to test the Abilities Page fix.

    This script verifies:
    1. Navigation to the Abilities page.
    2. Functionality of the "Add New Ability" button.
    3. Correct display of the "Add Ability" modal.
    4. Taking a screenshot for visual verification.

    Args:
        playwright (Playwright): The Playwright instance.
    """
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8000")

    # 1. Click on 'ABILITIES' navigation item
    page.get_by_text("ABILITIES").click()
    # The ID #abilities-grid doesn't exist anymore, using .comic-header-box to verify we are on the page
    page.locator(".comic-header-box").wait_for()

    # 2. Click "Add New Ability"
    # This checks if the button works (method name fix)
    page.locator("#add-power-btn").click()

    # 3. Check for Modal
    modal_title = page.get_by_text("Add Ability", exact=True)
    modal_title.wait_for()

    print("Modal opened successfully!")

    # 4. Close modal to see the cards clearly for screenshot
    page.get_by_text("Cancel").click()
    page.wait_for_timeout(500)

    # 5. Screenshot to verify dots in header / no dots in body
    page.screenshot(path="verification_fix.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
