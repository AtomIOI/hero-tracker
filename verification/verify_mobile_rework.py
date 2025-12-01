from playwright.sync_api import sync_playwright

def verify_mobile_home_page():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Emulate iPhone 12
        iphone_12 = p.devices['iPhone 12']
        context = browser.new_context(**iphone_12)
        page = context.new_page()

        page.goto("http://localhost:8089")

        print("Verifying Mobile Layout...")

        # Check if header is stacked or adjusted
        header_box = page.locator(".comic-header-wrapper")
        if header_box.is_visible():
            print("PASS: Header visible on mobile.")

        # Check Health Gadget position relative to splash
        # In mobile, health gadget should be stacked below or visible (it has z-index 10)
        health_panel = page.locator(".health-gadget-panel")
        if health_panel.is_visible():
             print("PASS: Health panel visible on mobile.")

        # Check touch targets (min size 40x40 roughly)
        btns = page.query_selector_all(".control-btn")
        for btn in btns:
            box = btn.bounding_box()
            if box['width'] >= 40 and box['height'] >= 40:
                print(f"PASS: Control button size {box['width']}x{box['height']} is adequate.")
            else:
                print(f"FAIL: Control button size {box['width']}x{box['height']} is too small.")

        # Check for horizontal overflow
        viewport_width = page.viewport_size['width']
        body_width = page.evaluate("document.body.scrollWidth")
        print(f"Viewport: {viewport_width}, Body: {body_width}")

        if body_width <= viewport_width + 5: # Tolerance for scrollbar
            print("PASS: No horizontal overflow detected.")
        else:
            print("WARNING: Horizontal overflow detected.")

        page.screenshot(path="verification/mobile_home_rework.png")
        print("Screenshot saved to verification/mobile_home_rework.png")

        browser.close()

if __name__ == "__main__":
    verify_mobile_home_page()
