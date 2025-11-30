from playwright.sync_api import sync_playwright

def verify_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:8080")

        # Wait for the home page to load
        page.wait_for_selector(".comic-title")

        # Wait for fonts to load
        page.wait_for_timeout(1000)

        # Take a screenshot of the whole page
        page.screenshot(path="verification_home.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_home_page()
