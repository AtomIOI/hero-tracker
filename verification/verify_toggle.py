from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        context = browser.new_context(viewport={'width': 390, 'height': 844}) # iPhone 12 viewport
        page = context.new_page()

        # 1. Load the page (assuming server is running on 8089)
        page.goto("http://localhost:8089")
        page.wait_for_selector('.comic-title')
        print("Page loaded.")

        # 2. Navigate to Settings and disable "Show Locked Stamps"
        print("Navigating to Settings...")
        page.get_by_text("SETTINGS", exact=True).click()
        page.wait_for_selector('.settings-container')

        # 3. Find and click the toggle
        toggle = page.locator('#pref-show-locked')
        if toggle.is_checked():
            toggle.click()
            print("Unchecked 'Show Locked Stamps'.")
        else:
            print("'Show Locked Stamps' was already unchecked.")

        # 4. Navigate to Abilities
        print("Navigating to Abilities...")
        page.get_by_text("ABILITIES", exact=True).click()
        page.wait_for_selector('.ability-card')

        # 5. Check Flight card (Yellow zone, should be locked in Green Zone)
        flight_card = page.locator('.ability-card').filter(has_text="Flight")
        if flight_card.count() > 0:
            print("Found Flight card.")
            # Check for locked overlay image - SHOULD BE HIDDEN
            locked_img = flight_card.locator('img[alt="LOCKED"]')
            if not locked_img.is_visible():
                print("SUCCESS: LOCKED image is hidden as expected.")
            else:
                print("FAILURE: LOCKED image is visible but should be hidden.")
        else:
            print("Flight card not found.")

        # 6. Re-enable to verify logic isn't permanently broken
        print("Navigating back to Settings...")
        page.get_by_text("SETTINGS", exact=True).click()
        page.wait_for_selector('.settings-container')

        toggle.click()
        print("Checked 'Show Locked Stamps'.")

        print("Navigating to Abilities...")
        page.get_by_text("ABILITIES", exact=True).click()
        page.wait_for_selector('.ability-card')

        flight_card = page.locator('.ability-card').filter(has_text="Flight")
        locked_img = flight_card.locator('img[alt="LOCKED"]')
        if locked_img.is_visible():
             print("SUCCESS: LOCKED image is visible again.")
        else:
             print("FAILURE: LOCKED image is hidden but should be visible.")

        browser.close()

if __name__ == "__main__":
    run()
