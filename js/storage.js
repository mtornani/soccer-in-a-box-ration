/**
 * Preferences is a drop-in, browser-only replacement for
 * @capacitor/preferences (same get/set/keys/remove shape).
 *
 * This app is served as plain static files with no bundler, so a bare
 * module specifier like "@capacitor/preferences" cannot be resolved by
 * the browser and throws a fatal module-loading error, which silently
 * prevents app.js (and every button handler in it) from ever running.
 * Backing this with localStorage keeps offline persistence working in
 * any browser/PWA context without requiring a build step. If this app
 * is later wrapped and shipped through a real Capacitor native build
 * (with a bundler), swap this for the actual @capacitor/preferences
 * import at that point.
 */
const Preferences = {
  async set({ key, value }) {
    localStorage.setItem(key, value);
  },
  async get({ key }) {
    return { value: localStorage.getItem(key) };
  },
  async keys() {
    return { keys: Object.keys(localStorage) };
  },
  async remove({ key }) {
    localStorage.removeItem(key);
  }
};

/**
 * StorageService provides a wrapper around Preferences
 * to handle offline-first persistence of session data and logs.
 */
export const StorageService = {
  /**
   * Saves session data for a specific ration.
   * @param {string} id - The ration session ID.
   * @param {object} data - The data to save.
   */
  async saveRation(id, data) {
    await Preferences.set({
      key: `ration_${id}`,
      value: JSON.stringify(data),
    });
  },

  /**
   * Retrieves session data for a specific ration.
   * @param {string} id - The ration session ID.
   * @returns {Promise<object|null>} The session data or null if not found.
   */
  async getRation(id) {
    const { value } = await Preferences.get({ key: `ration_${id}` });
    return value ? JSON.parse(value) : null;
  },

  /**
   * Appends a log entry for a session.
   * @param {string} sessionId - The session ID.
   * @param {object} logData - The log entry to append.
   */
  async saveLog(sessionId, logData) {
    const logs = await this.getLog(sessionId);
    logs.push(logData);
    await Preferences.set({
      key: `log_${sessionId}`,
      value: JSON.stringify(logs),
    });
  },

  /**
   * Retrieves the log array for a session.
   * @param {string} sessionId - The session ID.
   * @returns {Promise<Array>} The array of log entries.
   */
  async getLog(sessionId) {
    const { value } = await Preferences.get({ key: `log_${sessionId}` });
    return value ? JSON.parse(value) : [];
  },

  /**
   * Returns a list of stored ration IDs.
   * Scans keys for the 'ration_' prefix.
   * @returns {Promise<string[]>} Array of ration IDs.
   */
  async getRationsList() {
    const { keys } = await Preferences.keys();
    return keys
      .filter(key => key.startsWith('ration_'))
      .map(key => key.replace('ration_', ''));
  }
};

/**
 * ExerciseStorage handles persistence of exercise data.
 */
export const ExerciseStorage = {
  /**
   * Load exercises from storage.
   * @returns {Promise<Array>} Array of exercise objects.
   */
  async load() {
    const { value } = await Preferences.get({ key: 'exercises' });
    return value ? JSON.parse(value) : [];
  },

  /**
   * Save exercises to storage.
   * @param {Array} exercises - Array of exercise objects.
   */
  async save(exercises) {
    await Preferences.set({
      key: 'exercises',
      value: JSON.stringify(exercises),
    });
  },

  /**
   * Sync exercises from a remote URL (when online).
   * @param {string} url - URL to fetch exercises JSON from.
   * @returns {Promise<Array>} The exercised data (from remote or fallback).
   */
  async syncFromRemote(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      await this.save(data);
      return data;
    } catch (e) {
      console.warn('Failed to sync exercises:', e);
      return await this.load(); // fallback to cached
    }
  }
};