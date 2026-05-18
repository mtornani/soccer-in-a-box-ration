/**
 * StorageService — offline-first persistence.
 * Uses localStorage in browser, Capacitor Preferences in native app.
 */

// Browser-compatible Preferences shim
const BrowserPreferences = {
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      keys.push(localStorage.key(i));
    }
    return { keys };
  },
  async remove({ key }) {
    localStorage.removeItem(key);
  }
};

// Try Capacitor native, fallback to localStorage
let Prefs = BrowserPreferences;
try {
  if (window.Capacitor?.isNativePlatform()) {
    const mod = await import('@capacitor/preferences');
    Prefs = mod.Preferences;
  }
} catch (e) {
  // Stay on browser shim
}

export const StorageService = {
  async saveRation(id, data) {
    await Prefs.set({ key: `ration_${id}`, value: JSON.stringify(data) });
  },

  async getRation(id) {
    const { value } = await Prefs.get({ key: `ration_${id}` });
    return value ? JSON.parse(value) : null;
  },

  async saveLog(sessionId, logData) {
    const logs = await this.getLog(sessionId);
    logs.push(logData);
    await Prefs.set({ key: `log_${sessionId}`, value: JSON.stringify(logs) });
  },

  async getLog(sessionId) {
    const { value } = await Prefs.get({ key: `log_${sessionId}` });
    return value ? JSON.parse(value) : [];
  },

  async getRationsList() {
    const { keys } = await Prefs.keys();
    return keys
      .filter(key => key.startsWith('ration_'))
      .map(key => key.replace('ration_', ''));
  }
};
