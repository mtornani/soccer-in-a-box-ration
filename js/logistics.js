import { StorageService } from './storage.js';

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
   * Loads the test ration from the local assets folder.
   * Used for testing and development.
   */
  async loadTestRation() {
    try {
      const response = await fetch('./assets/ration_test.json');
      if (!response.ok) {
        throw new Error(`Failed to load test ration: ${response.statusText}`);
      }
      const data = await response.json();
      const rationId = data.id || 'test-001';
      await StorageService.saveRation(rationId, data);
      console.log(`Test ration ${rationId} loaded successfully.`);
      return data;
    } catch (error) {
      console.error('Test Ration Load Error:', error.message);
      throw error;
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
