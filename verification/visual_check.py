from playwright.sync_api import sync_playwright

def visual_check():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport to match user instructions
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Load the page
        page.goto("http://localhost:8089/")

        # Wait for content
        page.wait_for_selector(".merged-hero-health")

        # Take screenshot of the home page
        page.screenshot(path="verification/home_visual_update.png")

        # Navigate to Settings to see other updated styles
        page.click(".nav-item:has-text('SETTINGS')")
        page.wait_for_selector(".settings-page")
        page.screenshot(path="verification/settings_visual_update.png")

        browser.close()

if __name__ == "__main__":
    visual_check()
