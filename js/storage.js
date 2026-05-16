import { Preferences } from '@capacitor/preferences';

/**
 * StorageService provides a wrapper around @capacitor/preferences
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
