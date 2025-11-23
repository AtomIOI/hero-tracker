// Storage utilities for localStorage
const StorageManager = {
    KEY: 'hero-character',
    
    save(data) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem(this.KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    clear() {
        try {
            localStorage.removeItem(this.KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

export default StorageManager;
