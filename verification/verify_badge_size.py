from playwright.sync_api import sync_playwright
import time
import sys
import os

def verify_badge_size_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport as per memory
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        try:
            # Ensure verification directory exists
            os.makedirs("verification", exist_ok=True)

            # Load the app
            page.goto("http://localhost:8080")
            page.wait_for_load_state('networkidle')

            # Navigate to Abilities
            page.click("text=ABILITIES")
            time.sleep(1) # Wait for animation/render

            # Find the first ability card's interaction badge
            # Updated selector to look for text-lg
            badge_locator = page.locator(".ability-card .ability-card-header .border-2.border-black.text-lg").first

            if badge_locator.count() == 0:
                print("No badge found with .text-lg selector.")
                badge_locator = page.locator(".ability-card .ability-card-header > div[style*='position: absolute'] > div").first

            if badge_locator.count() == 0:
                print("Could not find any interaction badge.")
                return

            # Scroll to element to ensure visibility
            badge_locator.scroll_into_view_if_needed()

            # Take screenshot of the badge specifically, or the card header
            # Taking screenshot of the whole card header to see context
            header_locator = page.locator(".ability-card .ability-card-header").first
            header_locator.screenshot(path="verification/badge_screenshot_updated.png")
            print("Screenshot saved to verification/badge_screenshot_updated.png")

            # Get computed styles
            font_size = badge_locator.evaluate("el => window.getComputedStyle(el).fontSize")
            print(f"Badge Font Size: {font_size}")

            # Get position
            parent = page.locator(".ability-card .ability-card-header > div[style*='position: absolute']").first
            top = parent.evaluate("el => el.style.top")
            right = parent.evaluate("el => el.style.right")
            print(f"Position: top={top}, right={right}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_badge_size_screenshot()
