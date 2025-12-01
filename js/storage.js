/**
 * Storage utilities for handling localStorage operations.
 * Provides methods to save, load, and clear hero character data.
 */
const StorageManager = {
    /**
     * The localStorage key used for storing the hero character data.
     * @type {string}
     */
    KEY: 'hero-character',
    
    /**
     * Saves data to localStorage.
     * @param {Object} data - The data to save.
     * @returns {boolean} True if save was successful, false otherwise.
     */
    save(data) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    /**
     * Loads data from localStorage.
     * @returns {Object|null} The loaded data object, or null if not found or error.
     */
    load() {
        try {
            const saved = localStorage.getItem(this.KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    /**
     * Clears the data from localStorage.
     * @returns {boolean} True if clear was successful, false otherwise.
     */
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
