from playwright.sync_api import sync_playwright

def verify_scene_tracker_visual():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use iPhone 12 Pro dimensions as per memory
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        # Load the application
        page.goto("http://localhost:8089")

        # Navigate to Abilities page
        page.click(".nav-item:has-text('ABILITIES')")

        # Open the modal
        page.click("#scene-override-btn")

        # Enable Red Zone override
        red_zone = page.locator(".zone-selector").nth(2)
        red_zone.click()

        # Take a screenshot of the modal
        page.locator(".modal-content").screenshot(path="verification/scene_tracker_modal.png")
        print("Screenshot taken: verification/scene_tracker_modal.png")

        browser.close()

if __name__ == "__main__":
    verify_scene_tracker_visual()
