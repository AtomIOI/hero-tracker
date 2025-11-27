app.component('add-edit-trait-modal', {
    props: ['trait', 'type', 'show'],
    data() {
        return {
            id: '',
            name: '',
            die: 6
        };
    },
    watch: {
        trait: {
            handler(newVal) {
                if (newVal) {
                    this.id = newVal.id;
                    this.name = newVal.name;
                    this.die = newVal.die;
                } else {
                    this.id = '';
                    this.name = '';
                    this.die = 6;
                }
            },
            immediate: true
        }
    },
    template: `
        <div class="modal-overlay" v-if="show">
            <div class="modal-content wobbly-box">
                <h2 class="comic-title">{{ trait ? 'Edit' : 'Add' }} {{ type }}</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label for="trait-name">Name</label>
                        <input type="text" id="trait-name" v-model="name" required>
                    </div>
                    <div class="form-group">
                        <label for="trait-die">Die</label>
                        <select id="trait-die" v-model.number="die">
                            <option value="4">d4</option>
                            <option value="6">d6</option>
                            <option value="8">d8</option>
                            <option value="10">d10</option>
                            <option value="12">d12</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="comic-btn plus">{{ trait ? 'Save' : 'Add' }}</button>
                        <button type="button" class="comic-btn" @click="$emit('close')">Cancel</button>
                        <button v-if="trait" type="button" class="comic-btn minus" @click="handleDelete">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    methods: {
        handleSubmit() {
            this.$emit('save', {
                id: this.id,
                name: this.name,
                die: this.die
            });
        },
        handleDelete() {
            this.$emit('delete', { id: this.id });
            this.$emit('close');
        }
    }
});
