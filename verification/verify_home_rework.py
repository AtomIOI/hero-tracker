from playwright.sync_api import sync_playwright

def verify_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8089")

        # Verify the presence of new elements
        print("Verifying new Home Page structure...")

        # 1. Header
        if page.is_visible(".comic-header-wrapper"):
            print("PASS: Header wrapper found.")
        else:
            print("FAIL: Header wrapper not found.")

        if "HERO TRACKER" in page.inner_text(".brand-title"):
             print("PASS: Brand title found.")

        # 2. Hero Splash
        if page.is_visible(".hero-splash-container"):
            print("PASS: Hero Splash container found.")

        if page.is_visible(".health-gadget-panel"):
            print("PASS: Health gadget panel found.")

        # Check health display
        health_text = page.inner_text(".health-display-screen")
        print(f"Health Display: {health_text}")
        if "30" in health_text:
             print("PASS: Health values displayed.")

        # 3. Dossier
        if page.is_visible(".dossier-section"):
            print("PASS: Dossier section found.")

        # 4. Principles
        if page.is_visible(".principles-flow"):
            print("PASS: Principles flow found.")

        principles = page.query_selector_all(".principle-comic-panel")
        print(f"Found {len(principles)} principles.")
        if len(principles) >= 2:
            print("PASS: Principles rendered correctly.")

        # Screenshot
        page.screenshot(path="verification/home_page_rework.png")
        print("Screenshot saved to verification/home_page_rework.png")

        browser.close()

if __name__ == "__main__":
    verify_home_page()
