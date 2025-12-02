from playwright.sync_api import sync_playwright
import time

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile viewport
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()

        # Load the page
        page.goto("http://localhost:8089/")

        # Wait for the page to load
        page.wait_for_selector(".comic-title")

        # Check for new styles being applied

        # 1. Check if variables are working (e.g. background color of home page panels)
        # .merged-hero-health should have background-color from --comic-green-bg (#8FB676)
        merged_health = page.locator(".merged-hero-health")
        bg_color = merged_health.evaluate("el => getComputedStyle(el).backgroundColor")
        print(f"Merged Health BG Color: {bg_color}")

        # 2. Check if .wobbly-box (now .comic-panel) has border-radius 4px
        profile_panel = page.locator(".hero-profile-panel")
        border_radius = profile_panel.evaluate("el => getComputedStyle(el).borderRadius")
        print(f"Profile Panel Border Radius: {border_radius}")

        # 3. Check button styles
        nav_bar = page.locator(".nav-bar")
        nav_bg = nav_bar.evaluate("el => getComputedStyle(el).backgroundColor")
        print(f"Nav Bar BG Color: {nav_bg}")

        browser.close()

if __name__ == "__main__":
    verify_ui()
