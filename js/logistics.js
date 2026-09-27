import { StorageService } from './storage.js';

const BUNDLED_RATIONS = ['r01', 'r02'];

/**
 * LogisticsManager handles the fetching and validation of "Rations" (mission data).
 * Ensures that only valid rations are stored locally for offline use.
 */
export const LogisticsManager = {
  /**
   * Downloads a ration from a remote URL, validates its structure, and saves it.
   * @param {string} rationId - Unique identifier for the ration.
   * @param {string} url - Remote URL of the JSON ration.
   * @throws {Error} If the ration is invalid or download fails.
   */
  async downloadRation(rationId, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download ration: ${response.statusText}`);
      }

      const data = await response.json();

      // Surgical Minimum Validation
      if (!data.title || !data.phases || !Array.isArray(data.phases)) {
        throw new Error('Invalid Ration: Missing Surgical Minimum (title and phases array).');
      }

      await StorageService.saveRation(rationId, data);
      console.log(`Ration ${rationId} successfully downloaded and stored.`);
      return data;
    } catch (error) {
      console.error(`Logistics Error [${rationId}]:`, error.message);
      throw error;
    }
  },

  /**
   * Copies the rations bundled with the app into local storage.
   * Runs at every start so content updates reach the device; if the fetch
   * fails (offline, no cache) the stored copies stay untouched.
   */
  async loadBundledRations() {
    for (const id of BUNDLED_RATIONS) {
      try {
        const response = await fetch(`./assets/rations/${id}.json`);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        await StorageService.saveRation(data.id || id, data);
      } catch (error) {
        console.warn(`Bundled ration ${id} not refreshed:`, error.message);
      }
    }
  },

  /**
   * Lists all rations currently stored locally.
   * @returns {Promise<string[]>} List of ration IDs.
   */
  async listLocalRations() {
    return await StorageService.getRationsList();
  }
};
