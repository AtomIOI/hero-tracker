/**
 * Component representing the Dice Page.
 * Handles dice selection, rolling, and result display with modifiers.
 * @component
 */
app.component('dice-page', {
    props: {
        /**
         * The hero object (not currently used in logic but available).
         * @type {Object}
         */
        hero: Object,
        /**
         * The initial dice selection passed from parent.
         * @type {Array<number>}
         */
        initialDice: Array
    },
    emits: ['update-dice'],
    template: `
    <div class="dice-page pb-nav">
        <!-- Dice Tray Header -->
        <div class="comic-header-box comic-header-teal">
            <h1 class="comic-title">{{ hero.preferences?.hideDiceTray ? 'MODIFIERS' : 'DICE TRAY' }}</h1>
        </div>

        <div v-if="!hero.preferences?.hideDiceTray">
            <!-- Dice Selection Area -->
            <div class="dice-selection-area">
                <div v-if="impactText" class="impact-text-overlay" :class="{ 'red-text': isCriticalFail }">{{ impactText }}</div>
                <div v-for="(die, index) in selectedDice"
                     :key="index"
                     class="die-slot-img-container"
                     :class="{ selected: activeSlot === index, shaking: isRolling }"
                     @click="openDieSelector(index)">
                    <img :src="'assets/dice/D' + die + '.png'" class="die-img" :alt="'d'+die" />
                </div>
            </div>

            <!-- Roll Button -->
            <div class="roll-button-container">
                <div class="roll-btn" @click="rollDice" :class="{ disabled: isRolling }">
                    {{ isRolling ? '...' : 'ROLL!' }}
                </div>
            </div>

            <!-- Results Area -->
            <div class="results-container" v-if="rollResults">
                <!-- Min -->
                <div class="result-box min">
                    <div class="result-label">MIN</div>
                    <div class="result-value">{{ rollResults.min }}</div>
                    <div class="result-detail">d{{ rollResults.rawRolls[0].die }}</div>
                </div>

                <!-- Mid (Effect) -->
                <div class="result-box mid">
                    <div class="result-label">MID</div>
                    <div class="result-value">{{ finalMidValue }}</div>
                    <div class="result-detail" v-if="totalModifier !== 0">
                        {{ rollResults.mid }} {{ totalModifier >= 0 ? '+' : '' }}{{ totalModifier }}
                    </div>
                    <div class="result-detail" v-else>d{{ rollResults.rawRolls[1].die }}</div>
                </div>

                <!-- Max -->
                <div class="result-box max">
                    <div class="result-label">MAX</div>
                    <div class="result-value">{{ rollResults.max }}</div>
                    <div class="result-detail">d{{ rollResults.rawRolls[2].die }}</div>
                </div>
            </div>

            <!-- Placeholder for no results -->
            <div class="results-container" v-else style="opacity: 0.5;">
                 <div class="result-box min"><div class="result-label">MIN</div><div class="result-value">-</div></div>
                 <div class="result-box mid"><div class="result-label">MID</div><div class="result-value">-</div></div>
                 <div class="result-box max"><div class="result-label">MAX</div><div class="result-value">-</div></div>
            </div>
        </div>

        <!-- Redesigned Modifiers Section -->
        <div class="modifiers-container">
            <!-- Sticker Label -->
            <div class="section-label">MODIFIERS</div>

            <!-- Total Header - Speech Bubble -->
            <div class="total-header">
                <div class="total-bubble" 
                     :class="{ 'positive-bubble': totalModifier > 0, 'negative-bubble': totalModifier < 0, 'neutral-bubble': totalModifier === 0 }"
                     :style="{ '--intensity': Math.min(Math.abs(totalModifier) / 10, 1) }">
                    <div class="total-value" :class="{ positive: totalModifier > 0, negative: totalModifier < 0 }">
                        {{ totalModifier >= 0 ? '+' : '' }}{{ totalModifier }}
                    </div>
                </div>
            </div>

            <!-- Modifier List -->
            <div class="modifier-list">
                <div v-if="modifiers.length === 0" class="modifier-list-empty">
                    No modifiers. Tap + to add one!
                </div>
                <div v-for="mod in modifiers" 
                     :key="mod.id"
                     class="modifier-banner"
                     :class="{ 
                         buff: mod.value >= 0, 
                         debuff: mod.value < 0,
                         inactive: !mod.isActive 
                     }"
                     @click="toggleModifier(mod)"
                     @touchstart="startLongPress(mod, $event)"
                     @touchend="cancelLongPress"
                     @touchcancel="cancelLongPress"
                     @mousedown="startLongPress(mod, $event)"
                     @mouseup="cancelLongPress"
                     @mouseleave="cancelLongPress"
                     @contextmenu.prevent>
                    <div class="modifier-info">
                        <img class="persist-icon" :src="mod.isPersistent ? 'assets/icons/icon_persitent.png' : 'assets/icons/icon_temporary.png'" :alt="mod.isPersistent ? 'Persistent' : 'Temporary'">
                        <span class="modifier-name">{{ mod.name || 'Modifier' }}</span>
                    </div>
                    <div class="modifier-value-display">
                        {{ mod.value >= 0 ? '+' : '' }}{{ mod.value }}
                    </div>
                </div>
            </div>

            <!-- Controls Footer -->
            <div class="controls-footer">
                <button v-if="hasTemporaryMods" class="clear-temp-btn" @click="clearTempModifiers">
                    CLEAR TEMP
                </button>
                <button class="add-mod-btn" @click="openAddModal">
                    + ADD
                </button>
            </div>
        </div>

        <!-- Add Modifier Modal -->
        <div v-if="showAddModal" class="add-mod-modal-overlay" @click="closeAddModal">
            <div class="add-mod-modal" @click.stop>
                <div class="modal-header">ADD MODIFIER</div>
                
                <!-- Persistence Toggle -->
                <div class="persist-toggle">
                    <div class="persist-option" 
                         :class="{ selected: !newModIsPersistent }"
                         @click="newModIsPersistent = false">
                        <img src="assets/icons/icon_temporary.png" alt="Temporary" class="toggle-icon"> TEMP
                    </div>
                    <div class="persist-option" 
                         :class="{ selected: newModIsPersistent }"
                         @click="newModIsPersistent = true">
                        <img src="assets/icons/icon_persitent.png" alt="Persistent" class="toggle-icon"> PERSIST
                    </div>
                </div>

                <!-- Preset Grid -->
                <div class="preset-grid">
                    <div v-for="preset in presetValues" 
                         :key="preset"
                         class="preset-btn"
                         :class="{ 
                             positive: preset > 0, 
                             negative: preset < 0,
                             selected: newModValue === preset && !useCustomValue
                         }"
                         @click="applyPreset(preset)">
                        {{ preset > 0 ? '+' : '' }}{{ preset }}
                    </div>
                </div>

                <!-- Custom Value Input -->
                <div class="custom-value-section">
                    <div class="custom-value-row">
                        <button class="custom-adjust-btn" @click="adjustCustomValue(-1)">−</button>
                        <input type="number" 
                               class="custom-value-input"
                               v-model.number="customModValue"
                               @focus="useCustomValue = true"
                               @input="useCustomValue = true"
                               placeholder="0">
                        <button class="custom-adjust-btn" @click="adjustCustomValue(1)">+</button>
                    </div>
                </div>


                <!-- Name Input -->
                <input type="text" 
                       class="mod-name-input" 
                       v-model="newModName" 
                       placeholder="Name (optional)">

                <!-- Modal Actions -->
                <div class="modal-actions">
                    <button class="modal-btn cancel" @click="closeAddModal">CANCEL</button>
                    <button class="modal-btn create" 
                            @click="addModifier" 
                            :disabled="getEffectiveModValue() === null || getEffectiveModValue() === ''">
                        CREATE
                    </button>
                </div>
            </div>
        </div>

        <!-- Edit Modifier Modal -->
        <div v-if="showEditModal" class="add-mod-modal-overlay" @click="closeEditModal">
            <div class="edit-mod-modal" @click.stop>
                <div class="modal-header">EDIT MODIFIER</div>
                
                <!-- Persistence Toggle -->
                <div class="persist-toggle">
                    <div class="persist-option" 
                         :class="{ selected: !editingMod.isPersistent }"
                         @click="editingMod.isPersistent = false">
                        <img src="assets/icons/icon_temporary.png" alt="Temporary" class="toggle-icon"> TEMP
                    </div>
                    <div class="persist-option" 
                         :class="{ selected: editingMod.isPersistent }"
                         @click="editingMod.isPersistent = true">
                        <img src="assets/icons/icon_persitent.png" alt="Persistent" class="toggle-icon"> PERSIST
                    </div>
                </div>

                <!-- Edit Fields -->
                <div class="edit-form-group">
                    <label class="edit-form-label">NAME</label>
                    <input type="text" class="edit-form-input" v-model="editingMod.name" placeholder="Modifier name">
                </div>
                <div class="edit-form-group">
                    <label class="edit-form-label">VALUE</label>
                    <input type="number" class="edit-form-input" v-model.number="editingMod.value">
                </div>

                <!-- Edit Modal Actions -->
                <div class="edit-modal-actions">
                    <button class="modal-btn save" @click="saveEditedModifier">SAVE</button>
                    <button class="modal-btn cancel" @click="closeEditModal">CANCEL</button>
                    <button class="modal-btn delete" @click="deleteModifier">DELETE</button>
                </div>
            </div>
        </div>

        <!-- Dice Selector Modal -->
        <div v-if="showDieSelector" class="dice-selector-modal" @click="closeDieSelector">
            <div class="dice-selector-content" @click.stop>
                <div v-for="size in availableDice" :key="size" class="die-option" @click="selectDie(size)">
                    <img :src="'assets/dice/D' + size + '.png'" class="die-option-img" :alt="'d'+size" />
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            /** @type {number[]} Currently selected dice sizes */
            selectedDice: this.initialDice ? [...this.initialDice] : [6, 8, 10],
            /** @type {number[]} Available die sizes to choose from */
            availableDice: [4, 6, 8, 10, 12],
            /** @type {number|null} Index of the currently active die slot for selection */
            activeSlot: null,
            /** @type {boolean} Whether the die selector modal is shown */
            showDieSelector: false,
            /** @type {Object|null} Results of the last roll */
            rollResults: null,
            /** @type {boolean} Whether dice are currently "rolling" */
            isRolling: false,
            /** @type {string|null} Text to display for impact effect */
            impactText: null,
            /** @type {string|null} The last impact text displayed, to avoid repetition */
            lastImpactText: null,
            /** @type {boolean} Whether the current roll is a critical fail */
            isCriticalFail: false,

            // Redesigned Modifiers Data
            /** @type {Array<Object>} List of modifiers with new structure */
            modifiers: [], // { id, name, value, isPersistent, isActive }

            // Add Modal State
            /** @type {boolean} Whether the add modifier modal is shown */
            showAddModal: false,
            /** @type {string} Name input for new modifier */
            newModName: '',
            /** @type {number|null} Value input for new modifier */
            newModValue: null,
            /** @type {boolean} Whether new modifier is persistent */
            newModIsPersistent: false,
            /** @type {number[]} Preset values for quick selection */
            presetValues: [5, 4, 3, 2, 1, -1, -2, -3, -4, -5],
            /** @type {number|null} Custom value input for modifier beyond presets */
            customModValue: null,
            /** @type {boolean} Whether using custom value instead of preset */
            useCustomValue: false,

            // Edit Modal State
            /** @type {boolean} Whether the edit modifier modal is shown */
            showEditModal: false,
            /** @type {Object|null} Copy of modifier being edited */
            editingMod: null,
            /** @type {string|null} ID of modifier being edited */
            editingModId: null,

            // Long Press State
            /** @type {number|null} Timeout ID for long press detection */
            longPressTimeout: null,
            /** @type {number} Duration for long press in ms */
            longPressDuration: 500,
            /** @type {boolean} Whether a long press was triggered */
            longPressTriggered: false,

            /** @type {number|null} ID of the timeout for clearing impact text */
            impactTimeoutId: null
        };
    },
    computed: {
        /**
         * Calculates the total value of active modifiers.
         * @returns {number} The total modifier value.
         */
        totalModifier() {
            return this.modifiers
                .filter(m => m.isActive)
                .reduce((sum, m) => sum + m.value, 0);
        },
        /**
         * Calculates the final Mid value (Effect die + modifiers).
         * @returns {number|string} The calculated value or '-' if no roll.
         */
        finalMidValue() {
            if (!this.rollResults) return '-';
            return this.rollResults.mid + this.totalModifier;
        },
        /**
         * Checks if there are any temporary modifiers (for button visibility).
         * @returns {boolean} True if any temporary modifiers exist.
         */
        hasTemporaryMods() {
            return this.modifiers.some(m => !m.isPersistent);
        }
    },
    methods: {
        /**
         * Opens the die selector for a specific slot.
         * @param {number} index - The index of the die slot.
         */
        openDieSelector(index) {
            this.activeSlot = index;
            this.showDieSelector = true;
        },
        /**
         * Closes the die selector.
         */
        closeDieSelector() {
            this.showDieSelector = false;
            this.activeSlot = null;
        },
        /**
         * Selects a die size for the active slot.
         * @param {number} size - The size of the die (e.g., 6).
         */
        selectDie(size) {
            if (this.activeSlot !== null) {
                this.selectedDice[this.activeSlot] = size;
                this.$emit('update-dice', this.selectedDice);
            }
            this.closeDieSelector();
        },
        /**
         * Initiates the dice roll animation and calculation.
         */
        rollDice() {
            if (this.isRolling) return;

            // Clear any existing impact text timeout
            if (this.impactTimeoutId) {
                clearTimeout(this.impactTimeoutId);
                this.impactTimeoutId = null;
            }

            this.isRolling = true;
            this.impactText = null;
            this.rollResults = null;

            // Simulate rolling time
            setTimeout(() => {
                // Secure, unbiased random roll for each die using window.crypto with rejection sampling
                const getSecureRandomIntInclusive = (min, max) => {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    if (max < min) throw new Error('Invalid range for RNG');
                    const range = max - min + 1;
                    // Prefer Web Crypto API if available
                    const cryptoObj = (typeof window !== 'undefined') && (window.crypto || window.msCrypto);
                    if (cryptoObj && cryptoObj.getRandomValues) {
                        // Determine the maximum unbiased value we can accept
                        const maxUint32 = 0xFFFFFFFF;
                        const buckets = Math.floor((maxUint32 + 1) / range);
                        const maxUnbiased = buckets * range - 1;
                        const arr = new Uint32Array(1);
                        while (true) {
                            cryptoObj.getRandomValues(arr);
                            const v = arr[0];
                            if (v <= maxUnbiased) {
                                return min + (v % range);
                            }
                            // Otherwise, retry to avoid modulo bias
                        }
                    }
                    // Fallback to Math.random if crypto is not available
                    return Math.floor(Math.random() * range) + min;
                };

                const results = this.selectedDice.map(die => {
                    return {
                        die: die,
                        value: getSecureRandomIntInclusive(1, die)
                    };
                });

                const sortedResults = [...results].sort((a, b) => a.value - b.value);

                this.rollResults = {
                    min: sortedResults[0].value,
                    mid: sortedResults[1].value,
                    max: sortedResults[2].value,
                    rawRolls: sortedResults
                };

                this.isRolling = false;
                this.determineImpactText(this.rollResults.max, results.map(r => r.value));

            }, 800);
        },
        /**
         * Determines the impact text based on the max die roll and special conditions.
         * @param {number} maxValue - The highest value rolled.
         * @param {number[]} rawValues - Array of raw dice values.
         */
        determineImpactText(maxValue, rawValues) {
            this.isCriticalFail = false; // Reset critical fail state

            // Check for Triples
            const allSame = rawValues.every(v => v === rawValues[0]);
            if (allSame) {
                this.setImpactText("TRIPLES!");
                return;
            }

            // Check for Two Natural Ones (Critical Fail)
            const onesCount = rawValues.filter(v => v === 1).length;
            if (onesCount >= 2) {
                this.isCriticalFail = true;
                const critTexts = ["CALAMITY!", "CRITICAL FAIL!"];
                // Avoid immediate repetition for crit texts too
                let critCandidates = critTexts.filter(t => t !== this.lastImpactText);
                if (critCandidates.length === 0) critCandidates = critTexts;
                this.setImpactText(critCandidates[Math.floor(Math.random() * critCandidates.length)]);
                return;
            }

            // Check for Doubles (generic)
            // Since we already checked for triples and double ones, this catches remaining pairs
            const uniqueValues = new Set(rawValues);
            if (uniqueValues.size < rawValues.length) {
                this.setImpactText("DOUBLES!");
                return;
            }

            // Standard Threshold Logic
            const impactOptions = [
                { threshold: 11, texts: ['KA-POW!', 'KA-BLAM!', 'BOOM!', 'SHRAK!'] },
                { threshold: 8, texts: ['CRASH!', 'KABOOM!', 'BLAM!', 'THOOM!'] },
                { threshold: 5, texts: ['BAM!', 'POW!', 'WHAM!', 'SMASH!', 'CRUNCH!'] },
                { threshold: 0, texts: ['ZAP!', 'BOINK!', 'CLANK!', 'PLINK!', 'THWACK!'] }
            ];

            // Find the highest threshold met
            const tier = impactOptions.find(i => maxValue >= i.threshold);
            const possibleTexts = tier ? tier.texts : ['POW!'];

            // Filter out the last one if possible to avoid immediate repetition
            let candidates = possibleTexts.filter(t => t !== this.lastImpactText);
            if (candidates.length === 0) candidates = possibleTexts;

            // Pick random
            const selectedText = candidates[Math.floor(Math.random() * candidates.length)];

            this.setImpactText(selectedText);
        },
        /**
         * Sets the impact text and handles repetition tracking and timeout.
         * @param {string} text - The text to display.
         */
        setImpactText(text) {
            // Clear any existing timeout to prevent premature clearing
            if (this.impactTimeoutId) {
                clearTimeout(this.impactTimeoutId);
            }

            this.impactText = text;
            this.lastImpactText = text;

            // Clear text after 1.5 seconds
            this.impactTimeoutId = setTimeout(() => {
                this.impactText = null;
                this.isCriticalFail = false;
                this.impactTimeoutId = null;
            }, 1500);
        },

        // ==================== MODIFIER METHODS ====================

        /**
         * Opens the add modifier modal.
         */
        openAddModal() {
            this.showAddModal = true;
            this.newModName = '';
            this.newModValue = null;
            this.newModIsPersistent = false;
            this.customModValue = null;
            this.useCustomValue = false;
        },
        /**
         * Closes the add modifier modal.
         */
        closeAddModal() {
            this.showAddModal = false;
        },
        /**
         * Applies a preset value to the new modifier.
         * @param {number} value - The preset value.
         */
        applyPreset(value) {
            this.newModValue = value;
            this.customModValue = value;
            this.useCustomValue = false;
        },
        /**
         * Adjusts the custom modifier value by the specified amount.
         * @param {number} amount - The amount to adjust by.
         */
        adjustCustomValue(amount) {
            this.useCustomValue = true;
            if (this.customModValue === null || this.customModValue === '') {
                this.customModValue = amount;
            } else {
                this.customModValue = Number(this.customModValue) + amount;
            }
        },
        /**
         * Gets the effective modifier value (preset or custom).
         * @returns {number|null} The effective value.
         */
        getEffectiveModValue() {
            if (this.useCustomValue) {
                return this.customModValue;
            }
            return this.newModValue;
        },
        /**
         * Adds a new modifier to the list.
         */
        addModifier() {
            const value = this.getEffectiveModValue();
            if (value === null || value === '') return;
            this.modifiers.push({
                id: Date.now().toString(),
                name: this.newModName || 'Modifier',
                value: Number(value),
                isPersistent: this.newModIsPersistent,
                isActive: true // Auto-activate on add
            });
            this.closeAddModal();
        },
        /**
         * Toggles the active state of a modifier (tap action).
         * @param {Object} mod - The modifier object.
         */
        toggleModifier(mod) {
            // Only toggle if long press wasn't triggered
            if (!this.longPressTriggered) {
                mod.isActive = !mod.isActive;
            }
            this.longPressTriggered = false;
        },
        /**
         * Starts the long press timer for a modifier.
         * @param {Object} mod - The modifier object.
         * @param {Event} event - The event object.
         */
        startLongPress(mod, event) {
            this.longPressTriggered = false;
            this.longPressTimeout = setTimeout(() => {
                this.longPressTriggered = true;
                this.openEditModal(mod);
            }, this.longPressDuration);
        },
        /**
         * Cancels the long press timer.
         */
        cancelLongPress() {
            if (this.longPressTimeout) {
                clearTimeout(this.longPressTimeout);
                this.longPressTimeout = null;
            }
        },
        /**
         * Opens the edit modifier modal.
         * @param {Object} mod - The modifier to edit.
         */
        openEditModal(mod) {
            this.editingModId = mod.id;
            // Create a copy to edit
            this.editingMod = {
                name: mod.name,
                value: mod.value,
                isPersistent: mod.isPersistent
            };
            this.showEditModal = true;
        },
        /**
         * Closes the edit modifier modal.
         */
        closeEditModal() {
            this.showEditModal = false;
            this.editingMod = null;
            this.editingModId = null;
        },
        /**
         * Saves changes to the modifier being edited.
         */
        saveEditedModifier() {
            const mod = this.modifiers.find(m => m.id === this.editingModId);
            if (mod) {
                mod.name = this.editingMod.name || 'Modifier';
                mod.value = Number(this.editingMod.value);
                mod.isPersistent = this.editingMod.isPersistent;
            }
            this.closeEditModal();
        },
        /**
         * Deletes the modifier being edited.
         */
        deleteModifier() {
            this.modifiers = this.modifiers.filter(m => m.id !== this.editingModId);
            this.closeEditModal();
        },
        /**
         * Clears all temporary modifiers (destructive delete).
         */
        clearTempModifiers() {
            this.modifiers = this.modifiers.filter(m => m.isPersistent);
        }
    }
});
