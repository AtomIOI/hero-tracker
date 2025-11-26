app.component('power-card', {
    props: ['power'],
    template: `
        <div class="power-card" :class="['bg-' + power.zone]">
            <div class="power-card-content">
                <div class="power-card-header">
                    <h2>{{ power.name }}</h2>
                    <div class="power-card-dice">D{{ power.die }}</div>
                </div>
            </div>
            <div class="power-card-actions">
                <button class="comic-btn" @click="$emit('edit', power)">Edit</button>
                <button class="comic-btn minus" @click="$emit('delete', power)">Delete</button>
            </div>
        </div>
    `
});