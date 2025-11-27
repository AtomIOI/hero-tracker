from playwright.sync_api import sync_playwright

def verify_powers_qualities_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 375, 'height': 667}) # Mobile viewport
        page = context.new_page()

        try:
            # Navigate to the app
            page.goto("http://localhost:3000")
            print("Loaded homepage")

            # Click on the Powers & Qualities nav item
            # Since the text is "P & Q" and inside a span in a div
            page.locator(".nav-item").filter(has_text="P & Q").click()
            print("Clicked P & Q nav item")

            # Wait for the page content to load
            page.wait_for_selector(".comic-title:has-text('POWERS & QUALITIES')")
            print("Powers & Qualities page loaded")

            # Verify Tabs exist
            assert page.locator(".comic-tab:has-text('POWERS')").is_visible()
            assert page.locator(".comic-tab:has-text('QUALITIES')").is_visible()
            print("Tabs visible")

            # Verify initial content (Powers tab active by default)
            # Check for Lightning Bolt (from sample data)
            assert page.locator(".trait-name:has-text('Lightning Bolt')").is_visible()
            print("Lightning Bolt visible")

            # Switch to Qualities tab
            page.locator(".comic-tab:has-text('QUALITIES')").click()
            print("Clicked Qualities tab")

            # Check for Banter (from sample data)
            assert page.locator(".trait-name:has-text('Banter')").is_visible()
            print("Banter visible")

            # Open Add Modal (Quality)
            page.locator("button.add-trait-btn").click()
            print("Clicked Add button")

            page.wait_for_selector(".modal-overlay")
            assert page.locator(".comic-title:has-text('Add Quality')").is_visible()
            print("Add Quality modal visible")

            # Fill form
            page.fill("#trait-name", "Bravery")
            page.select_option("#trait-die", "10")

            # Save
            page.click("button.comic-btn.plus[type='submit']")
            print("Saved new Quality")

            # Verify new quality is in the list
            assert page.locator(".trait-name:has-text('Bravery')").is_visible()
            assert page.locator(".trait-die:has-text('d10')").is_visible()
            print("Bravery d10 visible")

            # Take screenshot of the Qualities list
            page.screenshot(path="verification/powers_qualities_page.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_powers_qualities_page()
