# Modifier Section Redesign - Implementation Guide

## Overview

This document outlines the technical implementation for redesigning the hero tracker's modifier section. The goal is to transition from the current layout to a mobile-first, "vintage comic book" aesthetic that clearly differentiates between buff/debuff types and persistent/temporary states.

### Key UX Changes

* **Centralized Total:** The sum of active modifiers is now the prominent hero element.
* **Visual Clarity:** Color-coding and icons immediately distinguish modifier types.
* **Tap-to-Disable:** Modifiers are toggled on/off by tapping them, rather than deleted.
* **Conditional Clearing:** The "Clear Used Temp Mods" button only appears when temporary modifiers are present.
* **Modal Input:** Adding modifiers is moved to a dedicated pop-up modal with quick-add presets.

---

## Visual References

### Active State & Cleared State

Image references:

![Active State](./reference_images/main_screen_active_mods.png)
![Cleared State](./reference_images/main_screen_cleared_temp.png)

The main view showing active modifiers, disabled modifiers, and the conditional "Clear" button.

| Main View (Active Temp Mods) | Main View (Temp Mods Cleared) |
| --- | --- |
|  |  |
| *Note the presence of the "Poison" temp mod and the "Clear Temp Mods" button.* | *After clicking clear: "Poison" is gone, total updates, clear button disappears.* |

### Add Modifier Modal

Image references:

![Add Modifier Modal](./reference_images/add_mod_modal_default.png)
![Add Modifier Modal (Preset Selected)](./reference_images/add_mod_modal_preset.png)  

The pop-up interface for creating new modifiers.

| Modal (Default State) | Modal (Preset Selected) |
| --- | --- |
|  |  |
| *Empty state showing toggle and presets.* | *Tapping "+3" fills value and enables the Create button.* |

---

## 1. Data Structure (TypeScript Interface)

To support the new UI features (specifically toggling activation vs. deletion, and tracking persistence), the underlying data model for a modifier needs to be updated.

Suggested TypeScript interface:

```typescript
export interface Modifier {
  // Unique identifier for list rendering and updates
  id: string;

  // The display name (e.g., "High Ground")
  name: string;

  // The numerical impact.
  // Positive values denote Buffs, Negative values denote Debuffs.
  value: number;

  // Persistence type.
  // true = Persistent (∞ icon).
  // false = Temporary (⏳ icon).
  isPersistent: boolean;

  // Toggled status.
  // true = Contributes to total, shown in full color.
  // false = Greyed out, ignored in total calculation.
  isActive: boolean;
}

```

---

## 2. Component Architecture

Break down the UI into smaller, reusable components.

```
<ModifiersContainer> (State holder for the list of mods)
│
├── <TotalHeader> (The large speech bubble displaying calculated sum)
│
├── <ModifierList> (Scrollable container)
│   │
│   ├── <ModifierBanner type="buff" persist={true} active={true} />
│   ├── <ModifierBanner type="debuff" persist={false} active={true} />
│   └── <ModifierBanner type="buff" persist={true} active={false} />
│
├── <ControlsFooter> (Fixed bottom area)
│   │
│   ├── <ClearTempButton /> (Conditionally rendered)
│   └── <AddModifierButton /> (Triggers modal)
│
└── <AddModifierModal> (The pop-up form)
    │
    ├── <PersistenceToggle />
    └── <PresetGrid />

```

---

## 3. State Management & Logic

### A. Calculating the Total

The large number at the top must be a computed value derived from the state. It should only sum modifiers where `isActive` is true.

```javascript
// Example logic
const totalModifiers = modifiers
  .filter(mod => mod.isActive)
  .reduce((sum, mod) => sum + mod.value, 0);

```

### B. Tapping a Modifier Banner

Tapping a banner should not delete it. It should toggle the `isActive` boolean.

* **If active:** Change `isActive` to `false`. The banner turns grey. Recalculate total.
* **If inactive:** Change `isActive` to `true`. The banner returns to color. Recalculate total.

### C. The "Clear Temp Mods" Button

This button is **conditional**.

1. **Visibility Check:** Check if the modifier list contains *any* items where `isPersistent === false`. If yes, show the button. If no, hide it.
2. **On Click Action:** Filter the main state array to remove any items where `isPersistent === false`. (Note: This is a destructive delete action, unlike tapping a banner).

### D. Modal Logic

1. **Presets:** Tapping a preset button (e.g., "+3") should immediately populate the "Value" input field.
2. **Validation:** The "CREATE" button should be disabled until at least a numerical Value is entered. (Name can be optional, defaulting to "Modifier" if empty).

---

## 4. Styling Guidelines (Comic Aesthetic)

To achieve the look in the images, adhere to these CSS principles:

### Borders & Shadows

Do not use soft, blurred shadows. The comic look requires hard, dark outlines and solid "block" shadows to create depth.

```css
/* Example Comic Button Style */
.comic-button {
    border: 3px solid black;
    /* Hard, solid shadow offset */
    box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
    transition: all 0.1s ease-in-out;
}

.comic-button:active {
    /* Pressing effect */
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
}

```

### Typography

* **Headers/Total:** Use a bold, impactful, slightly jagged comic-book font.
* **Modifier Names:** Use a highly readable, bold, sans-serif font.

### Color Palette (Reference Images)

* **Background Texture:** Aged paper with halftone dots overlay.
* **Buffs (Positive):** Yellow to Orange gradient.
* **Debuffs (Negative):** Blue to Purple gradient.
* **Disabled State:** Desaturated Grey/Beige gradient with reduced opacity.
* **Action Color (Buttons):** Comic Red.

### Shapes

Use CSS transforms (skew) or SVG backgrounds for the modifier banners to give them the dynamic, angled appearance, rather than standard rectangles.