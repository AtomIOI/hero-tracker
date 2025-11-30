app.component('ability-card', {
    props: ['ability', 'hero'],
    emits: ['edit'],
    data() {
        return {
            longPressTimer: null,
            isLongPress: false
        };
    },
    computed: {
        linkedTrait() {
            if (!this.ability.traitId || !this.hero) return null;
            const powers = this.hero.powers || [];
            const qualities = this.hero.qualities || [];
            return powers.find(p => p.id === this.ability.traitId) ||
                   qualities.find(q => q.id === this.ability.traitId);
        },
        traitLabel() {
            const t = this.linkedTrait;
            return t ? `${t.name} (d${t.die})` : 'No Trait Linked';
        },
        interactionLabel() {
            const map = {
                'action': 'A',
                'reaction': 'R',
                'inherent': 'I'
            };
            return map[this.ability.interactionType] || 'A';
        },
        interactionClass() {
             const map = {
                'action': 'bg-blue-500',
                'reaction': 'bg-purple-500',
                'inherent': 'bg-orange-500'
            };
            return map[this.ability.interactionType] || 'bg-blue-500';
        },
        basicActionIcons() {
            if (!this.ability.actions || !window.ABILITY_ICONS) return [];
            return this.ability.actions.map(key => window.ABILITY_ICONS[key]).filter(Boolean);
        }
    },
    methods: {
        startLongPress() {
            this.isLongPress = false;
            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.$emit('edit', this.ability);
            }, 600);
        },
        cancelLongPress() {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        }
    },
    template: `
        <div class="ability-card no-select relative"
             :class="['bg-' + ability.zone]"
             @mousedown="startLongPress"
             @touchstart="startLongPress"
             @mouseup="cancelLongPress"
             @touchend="cancelLongPress"
             @mouseleave="cancelLongPress"
             @contextmenu.prevent>

            <!-- Header -->
            <div class="ability-card-header pattern-dots flex justify-between items-center pr-2">
                <h3 class="flex-1 truncate mr-2">{{ ability.name }}</h3>

                <!-- Interaction Type Badge -->
                <div class="w-6 h-6 rounded-full border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-sm"
                     :class="interactionClass">
                    {{ interactionLabel }}
                </div>
            </div>

            <div class="ability-card-body flex flex-col h-full">
                <!-- Trait Info -->
                <div class="text-xs font-bold uppercase tracking-wider opacity-70 mb-1 border-b border-black/10 pb-1">
                    {{ traitLabel }}
                </div>

                <!-- Description -->
                <div class="flex-1 mb-2 text-sm leading-tight">
                    {{ ability.text }}
                </div>

                <!-- Action Icons Footer -->
                <div class="flex gap-1 mt-auto pt-2 border-t border-black/10 justify-end">
                    <div v-for="(icon, idx) in basicActionIcons" :key="idx"
                         class="w-5 h-5 text-black/70"
                         :title="icon.label"
                         v-html="icon.svg">
                    </div>
                </div>
            </div>
        </div>
    `
});
