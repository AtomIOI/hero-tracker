// Main Vue 3 Application
import StorageManager from './storage.js';

const { createApp } = Vue;

createApp({
    data() {
        return {
            showAddModuleModal: false,
            newModule: {
                name: '',
                dieRating: 'd8',
                text: '',
                zoneTag: 'green'
            },
            character: {
                currentHealth: 100,
                maxHealth: 100,
                sceneOverride: false,
                modules: [],
                principles: '',
                heroPoints: 0,
                modifiers: 0
            },
            diceEngine: {
                powerDie: 'd8',
                qualityDie: 'd8',
                statusDie: 'd8',
                results: null
            }
        };
    },
    mounted() {
        this.loadFromLocalStorage();
    },
    methods: {
        getHealthPercentage() {
            if (this.character.maxHealth === 0) return 0;
            return Math.round((this.character.currentHealth / this.character.maxHealth) * 100);
        },
        getZone() {
            if (this.character.sceneOverride) return 'red';
            if (this.character.currentHealth <= 0) return 'out';

            const percentage = this.getHealthPercentage();
            if (percentage >= 75) return 'green';
            if (percentage >= 35) return 'yellow';
            if (percentage >= 1) return 'red';
            return 'out';
        },
        getThemeClass() {
            const zone = this.getZone();
            return `theme-${zone}`;
        },
        getTextColorClass() {
            const zone = this.getZone();
            const colors = {
                green: 'text-green-600',
                yellow: 'text-yellow-600',
                red: 'text-red-600',
                out: 'text-gray-600'
            };
            return colors[zone];
        },
        getHealthBarClass() {
            const zone = this.getZone();
            const colors = {
                green: 'bg-green-500',
                yellow: 'bg-yellow-500',
                red: 'bg-red-500',
                out: 'bg-gray-500'
            };
            return colors[zone];
        },
        toggleOverride() {
            this.character.sceneOverride = !this.character.sceneOverride;
            this.saveToLocalStorage();
        },
        addModule() {
            this.newModule = {
                name: '',
                dieRating: 'd8',
                text: '',
                zoneTag: 'green'
            };
            this.showAddModuleModal = true;
        },
        confirmAddModule() {
            if (!this.newModule.name) this.newModule.name = 'New Power';

            this.character.modules.push({ ...this.newModule });
            this.saveToLocalStorage();
            this.showAddModuleModal = false;
        },
        removeModule(index) {
            this.character.modules.splice(index, 1);
            this.saveToLocalStorage();
        },
        isModuleLocked(module) {
            const currentZone = this.getZone();

            // Green Zone: Lock Yellow and Red
            if (currentZone === 'green' && (module.zoneTag === 'yellow' || module.zoneTag === 'red')) {
                return true;
            }

            // Yellow Zone: Lock Red
            if (currentZone === 'yellow' && module.zoneTag === 'red') {
                return true;
            }

            return false;
        },
        getSuggestedStatusDie() {
            const zone = this.getZone();
            const suggestions = {
                green: 'd10',
                yellow: 'd8',
                red: 'd6',
                out: 'd4'
            };
            return suggestions[zone];
        },
        rollDie(dieType) {
            const max = parseInt(dieType.substring(1));
            return Math.floor(Math.random() * max) + 1;
        },
        rollDice() {
            const results = [
                this.rollDie(this.diceEngine.powerDie),
                this.rollDie(this.diceEngine.qualityDie),
                this.rollDie(this.diceEngine.statusDie)
            ];

            results.sort((a, b) => a - b);

            this.diceEngine.results = {
                min: results[0],
                mid: results[1],
                max: results[2]
            };
        },
        saveToLocalStorage() {
            const saveData = {
                character: this.character,
                diceEngine: {
                    powerDie: this.diceEngine.powerDie,
                    qualityDie: this.diceEngine.qualityDie,
                    statusDie: this.diceEngine.statusDie
                }
            };
            StorageManager.save(saveData);
        },
        loadFromLocalStorage() {
            const data = StorageManager.load();
            if (data) {
                try {
                    this.character = data.character;
                    if (data.diceEngine) {
                        this.diceEngine.powerDie = data.diceEngine.powerDie;
                        this.diceEngine.qualityDie = data.diceEngine.qualityDie;
                        this.diceEngine.statusDie = data.diceEngine.statusDie;
                    }
                } catch (e) {
                    console.error('Error loading from localStorage:', e);
                }
            }
        },
        exportJSON() {
            const data = {
                character: this.character,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hero-character-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        async importJSON(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.character) {
                        this.character = data.character;
                        this.saveToLocalStorage();
                        alert('Character loaded successfully!');
                    } else {
                        alert('Invalid character file format.');
                    }
                } catch (error) {
                    alert('Error reading file: ' + error.message);
                }
            };
            reader.readAsText(file);

            // Reset the input
            event.target.value = '';
        },

        // PWA Share functionality
        async shareCharacter() {
            const data = {
                character: this.character,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const file = new File([blob], `hero-character-${Date.now()}.json`, { type: 'application/json' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'My Hero Character',
                        text: 'Check out my hero!',
                        files: [file]
                    });
                } catch (error) {
                    console.log('Share cancelled or failed:', error);
                    // Fallback to download
                    this.exportJSON();
                }
            } else {
                // Fallback to download
                this.exportJSON();
            }
        }
    }
}).mount('#app');
