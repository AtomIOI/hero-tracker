from playwright.sync_api import sync_playwright

def verify_visuals():
    with sync_playwright() as p:
        # Use iPhone 12 Pro dimensions as per memory
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        # Load the local file
        page.goto("http://localhost:8080/index.html")

        # Navigate to Abilities page
        # Assuming the button text is "ABILITIES" as per index.html
        page.click("text=ABILITIES")

        # Wait for ability cards to render
        page.wait_for_selector(".ability-card")

        # Take a screenshot of the first ability card
        # We need to find the element
        card = page.locator(".ability-card").first

        # Ensure it's visible
        card.wait_for()

        # Screenshot the card
        card.screenshot(path="ability_card_visual.png")
        print("Screenshot saved to ability_card_visual.png")

        browser.close()

if __name__ == "__main__":
    verify_visuals()
