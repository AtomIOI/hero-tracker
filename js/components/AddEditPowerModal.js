app.component('add-edit-power-modal', {
    props: ['power', 'show'],
    data() {
        return {
            id: '',
            name: '',
            die: 6,
            zone: 'green',
            text: ''
        };
    },
    watch: {
        power: {
            handler(newVal) {
                if (newVal) {
                    this.id = newVal.id;
                    this.name = newVal.name;
                    this.die = newVal.die;
                    this.zone = newVal.zone;
                    this.text = newVal.text;
                } else {
                    this.id = '';
                    this.name = '';
                    this.die = 6;
                    this.zone = 'green';
                    this.text = '';
                }
            },
            immediate: true
        }
    },
    template: `
        <div class="modal-overlay" v-if="show">
            <div class="modal-content wobbly-box">
                <h2 class="comic-title">{{ power ? 'Edit' : 'Add' }} Power</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label for="power-name">Name</label>
                        <input type="text" id="power-name" v-model="name" required>
                    </div>
                    <div class="form-group">
                        <label for="power-die">Die</label>
                        <select id="power-die" v-model.number="die">
                            <option value="4">d4</option>
                            <option value="6">d6</option>
                            <option value="8">d8</option>
                            <option value="10">d10</option>
                            <option value="12">d12</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="power-zone">Zone</label>
                        <select id="power-zone" v-model="zone">
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="red">Red</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="power-text">Description</label>
                        <textarea id="power-text" v-model="text"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="comic-btn plus">{{ power ? 'Save' : 'Add' }}</button>
                        <button type="button" class="comic-btn minus" @click="$emit('close')">Cancel</button>
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
                die: this.die,
                zone: this.zone,
                text: this.text
            });
        }
    }
});