/**
 * PWA registration and utilities manager.
 * Handles service worker registration, installation prompts, wake locks, and sharing.
 */
class PWAManager {
    /**
     * Creates an instance of PWAManager.
     */
    constructor() {
        /**
         * @type {Event|null} Stores the 'beforeinstallprompt' event.
         */
        this.deferredPrompt = null;
        /**
         * @type {boolean} Indicates if the app is installed.
         */
        this.isInstalled = false;
    }

    /**
     * Registers the service worker.
     * @returns {Promise<ServiceWorkerRegistration|null>} The service worker registration object or null if failed.
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Sets up listeners for the PWA install prompt.
     */
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            console.log('PWA installed successfully');
        });
    }

    /**
     * Shows the install button in the UI.
     */
    showInstallButton() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    /**
     * Hides the install button in the UI.
     */
    hideInstallButton() {
        const installBtn = document.getElementById('install-button');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    /**
     * Triggers the browser's install prompt.
     * @returns {Promise<boolean>} True if the user accepted the install, false otherwise.
     */
    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('Install prompt not available');
            return false;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        this.deferredPrompt = null;
        return outcome === 'accepted';
    }

    /**
     * Triggers haptic feedback if supported.
     * @param {number|number[]} [pattern=50] - The vibration pattern.
     */
    vibrate(pattern = 50) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * Requests a screen wake lock to keep the device awake.
     * @returns {Promise<WakeLockSentinel|null>} The wake lock sentinel or null if failed.
     */
    async requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                const wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake lock activated');
                return wakeLock;
            } catch (error) {
                console.error('Wake lock failed:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Shares data using the Web Share API.
     * @param {Object} data - The data to share (title, text, url).
     * @returns {Promise<boolean>} True if shared successfully, false otherwise.
     */
    async shareData(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (error) {
                console.error('Share failed:', error);
                return false;
            }
        }
        return false;
    }
}

export default PWAManager;
