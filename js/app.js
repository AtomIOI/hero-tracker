const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            characterSheet: {
                meta: {
                    version: '1.0',
                    timestamp: Date.now()
                },
                hero: {
                    name: 'Super Hero',
                    archetype: 'Generic',
                    health: {
                        current: 30,
                        max: 30,
                        ranges: {
                            greenMin: 23, // floor(30 * 0.75)
                            yellowMin: 11, // floor(30 * 0.35)
                            redMin: 1
                        }
                    },
                    statusDice: {
                        green: 6,
                        yellow: 8,
                        red: 10
                    },
                    powers: [
                        { id: 'laser-eyes', name: 'Laser Eyes', die: 8 },
                        { id: 'flight', name: 'Flight', die: 10 },
                        { id: 'super-strength', name: 'Super Strength', die: 12 }
                    ],
                    qualities: [],
                    abilities: [
                        { id: 'laser-eyes', name: 'Laser Eyes', zone: 'green', text: 'Shoots lasers from eyes.' },
                        { id: 'flight', name: 'Flight', zone: 'yellow', text: 'Can fly.' },
                        { id: 'super-strength', name: 'Super Strength', zone: 'red', text: 'Is very strong.' }
                    ]
                }
            },
            showAddEditPowerModal: false,
            editingPower: null,
            currentPage: 'home'
        };
    },
    computed: {
        healthPercentage() {
            if (this.characterSheet.hero.health.max === 0) return 0;
            return (this.characterSheet.hero.health.current / this.characterSheet.hero.health.max) * 100;
        },
        displayedPowers() {
            // Merge powers and abilities by ID for UI display
            return this.characterSheet.hero.powers.map(power => {
                const ability = this.characterSheet.hero.abilities.find(a => a.id === power.id);
                return {
                    ...power,
                    zone: ability ? ability.zone : 'green', // Default to green if no ability found
                    text: ability ? ability.text : ''
                };
            });
        }
    },
    methods: {
        getStatusMessage() {
            const pct = this.healthPercentage;
            if (pct >= 75) return "READY FOR ACTION!";
            if (pct >= 35) return "I CAN KEEP GOING!";
            if (pct >= 1) return "I NEED BACKUP!";
            return "DOWN FOR THE COUNT!";
        },
        changeHealth(amount) {
            const newHealth = this.characterSheet.hero.health.current + amount;
            if (newHealth >= 0 && newHealth <= this.characterSheet.hero.health.max) {
                this.characterSheet.hero.health.current = newHealth;
            }
        },
        // heroPoints is not in the CharacterSheet model, so this can be removed or adapted.
        // For now, let's assume it's not needed.
        // changeHeroPoints(amount) { ... }
        getSegmentClass(segmentNumber) {
            const pct = this.healthPercentage;
            const segmentThreshold = segmentNumber * 10;

            if (pct < segmentThreshold) {
                return 'empty';
            }

            if (segmentNumber >= 6) return 'filled-green';
            if (segmentNumber >= 3) return 'filled-yellow';
            return 'filled-red';
        },
        openAddPowerModal() {
            this.editingPower = null;
            this.showAddEditPowerModal = true;
        },
        openEditPowerModal(power) {
            this.editingPower = power;
            this.showAddEditPowerModal = true;
        },
        closeAddEditPowerModal() {
            this.showAddEditPowerModal = false;
        },
        savePower(powerData) {
            const { id, name, die, zone, text } = powerData;
            const powerIndex = this.characterSheet.hero.powers.findIndex(p => p.id === id);
            const abilityIndex = this.characterSheet.hero.abilities.findIndex(a => a.id === id);

            if (powerIndex > -1) { // Editing existing power
                this.characterSheet.hero.powers.splice(powerIndex, 1, { id, name, die });
                if (abilityIndex > -1) {
                    this.characterSheet.hero.abilities.splice(abilityIndex, 1, { id, name, zone, text });
                }
            } else { // Adding new power
                const newId = id || name.toLowerCase().replace(/\s+/g, '-');
                this.characterSheet.hero.powers.push({ id: newId, name, die });
                this.characterSheet.hero.abilities.push({ id: newId, name, zone, text });
            }
            this.closeAddEditPowerModal();
        },
        deletePower(power) {
            this.characterSheet.hero.powers = this.characterSheet.hero.powers.filter(p => p.id !== power.id);
            this.characterSheet.hero.abilities = this.characterSheet.hero.abilities.filter(a => a.id !== power.id);
        },
        getGyroStatus() {
            const health = this.characterSheet.hero.health;
            const ranges = health.ranges;
            if (health.current >= ranges.greenMin) return 'green';
            if (health.current >= ranges.yellowMin) return 'yellow';
            if (health.current >= ranges.redMin) return 'red';
            return 'out';
        },
        isPowerAvailable(power) {
            const gyro = this.getGyroStatus();
            switch (gyro) {
                case 'green':
                    return power.zone === 'green';
                case 'yellow':
                    return ['green', 'yellow'].includes(power.zone);
                case 'red':
                    return ['green', 'yellow', 'red'].includes(power.zone);
                case 'out':
                    return false;
                default:
                    return false;
            }
        },
        setPage(page) {
            this.currentPage = page;
        }
    }
});

app.mount('#app');