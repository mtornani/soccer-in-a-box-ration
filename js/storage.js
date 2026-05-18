/**
 * StorageService — offline-first persistence.
 * Uses localStorage in browser, Capacitor Preferences in native app.
 * No top-level await — safe for all browsers and GitHub Pages.
 */

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

async function getPrefs() {
  if (
    typeof window !== 'undefined' &&
    window.Capacitor != null &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform()
  ) {
    try {
      const mod = await import('@capacitor/preferences');
      return mod.Preferences;
    } catch (e) { /* fallback */ }
  }
  return BrowserPreferences;
}

export const StorageService = {
  async saveRation(id, data) {
    const p = await getPrefs();
    await p.set({ key: `ration_${id}`, value: JSON.stringify(data) });
  },

  async getRation(id) {
    const p = await getPrefs();
    const { value } = await p.get({ key: `ration_${id}` });
    return value ? JSON.parse(value) : null;
  },

  async saveLog(sessionId, logData) {
    const logs = await this.getLog(sessionId);
    const p = await getPrefs();
    logs.push(logData);
    await p.set({ key: `log_${sessionId}`, value: JSON.stringify(logs) });
  },

  async getLog(sessionId) {
    const p = await getPrefs();
    const { value } = await p.get({ key: `log_${sessionId}` });
    return value ? JSON.parse(value) : [];
  },

  async getRationsList() {
    const p = await getPrefs();
    const { keys } = await p.keys();
    return keys
      .filter(key => key.startsWith('ration_'))
      .map(key => key.replace('ration_', ''));
  }
};
