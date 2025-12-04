/**
 * Component representing the Scene Tracker Override Modal.
 * Allows manually enabling Ability Zones regardless of Health Status.
 */
app.component('scene-tracker-modal', {
    props: {
        show: Boolean,
        overrides: Object // { green: boolean, yellow: boolean, red: boolean }
    },
    emits: ['close', 'toggle-override'],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        },
        toggleZone(zone) {
            this.$emit('toggle-override', zone);
        },
        getZoneStyle(zone) {
            const isActive = this.overrides[zone];
            const baseClass = 'zone-btn';

            // Map zones to colors
            const colorMap = {
                'green': 'var(--color-green)',
                'yellow': 'var(--color-yellow)',
                'red': 'var(--color-magenta)'
            };

            const color = colorMap[zone];

            return {
                backgroundColor: color,
                opacity: isActive ? '1' : '0.3',
                filter: isActive ? 'none' : 'grayscale(80%)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                border: isActive ? '3px solid black' : '2px dashed #666',
                boxShadow: isActive ? '4px 4px 0px 0px rgba(0,0,0,1)' : 'none'
            };
        }
    },
    template: `
        <teleport to="body">
            <div v-if="show" class="modal-overlay" @click.self="close">
                <div class="modal-content wobbly-box relative bg-white" style="max-width: 400px; width: 90%;">

                    <!-- Header -->
                    <div class="comic-header-box mb-6">
                        <h2 class="comic-title text-2xl">SCENE OVERRIDE</h2>
                    </div>

                    <p class="font-comic text-center mb-6 px-4">
                        Manually enable ability zones. These overrides add to your current health-based access.
                    </p>

                    <!-- Zone Toggles -->
                    <div class="flex flex-col gap-4 px-4 mb-8">

                        <!-- Green Zone -->
                        <div class="zone-selector p-4 rounded cursor-pointer transition-all flex items-center justify-between"
                             :style="getZoneStyle('green')"
                             @click="toggleZone('green')">
                            <span class="font-bangers text-2xl text-white drop-shadow-md">GREEN ZONE</span>
                            <div class="status-indicator font-comic font-bold bg-white px-2 rounded border-2 border-black" :class="overrides.green ? 'text-green-600' : 'text-gray-400'">
                                {{ overrides.green ? 'ENABLED' : 'OFF' }}
                            </div>
                        </div>

                        <!-- Yellow Zone -->
                        <div class="zone-selector p-4 rounded cursor-pointer transition-all flex items-center justify-between"
                             :style="getZoneStyle('yellow')"
                             @click="toggleZone('yellow')">
                            <span class="font-bangers text-2xl text-black drop-shadow-sm">YELLOW ZONE</span>
                            <div class="status-indicator font-comic font-bold bg-white px-2 rounded border-2 border-black" :class="overrides.yellow ? 'text-yellow-600' : 'text-gray-400'">
                                {{ overrides.yellow ? 'ENABLED' : 'OFF' }}
                            </div>
                        </div>

                        <!-- Red Zone -->
                        <div class="zone-selector p-4 rounded cursor-pointer transition-all flex items-center justify-between"
                             :style="getZoneStyle('red')"
                             @click="toggleZone('red')">
                            <span class="font-bangers text-2xl text-white drop-shadow-md">RED ZONE</span>
                            <div class="status-indicator font-comic font-bold bg-white px-2 rounded border-2 border-black" :class="overrides.red ? 'text-red-600' : 'text-gray-400'">
                                {{ overrides.red ? 'ENABLED' : 'OFF' }}
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="flex justify-center mb-4">
                        <button class="comic-btn primary" @click="close">DONE</button>
                    </div>

                </div>
            </div>
        </teleport>
    `
});
