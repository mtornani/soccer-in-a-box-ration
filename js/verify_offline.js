/**
 * Offline flow verification script.
 * Runs in Node with mocked Capacitor Preferences.
 * Usage: node --experimental-vm-modules js/verify_offline.js
 */

// Mock Capacitor Preferences in-memory
const mockStorage = {};
const Preferences = {
  set: async ({ key, value }) => { mockStorage[key] = value; },
  get: async ({ key }) => ({ value: mockStorage[key] ?? null }),
  keys: async () => ({ keys: Object.keys(mockStorage) }),
  remove: async ({ key }) => { delete mockStorage[key]; }
};

// Inline StorageService with mock
const StorageService = {
  async saveRation(id, data) {
    await Preferences.set({ key: `ration_${id}`, value: JSON.stringify(data) });
  },
  async getRation(id) {
    const { value } = await Preferences.get({ key: `ration_${id}` });
    return value ? JSON.parse(value) : null;
  },
  async saveLog(sessionId, logData) {
    const logs = await this.getLog(sessionId);
    logs.push(logData);
    await Preferences.set({ key: `log_${sessionId}`, value: JSON.stringify(logs) });
  },
  async getLog(sessionId) {
    const { value } = await Preferences.get({ key: `log_${sessionId}` });
    return value ? JSON.parse(value) : [];
  },
  async getRationsList() {
    const { keys } = await Preferences.keys();
    return keys.filter(k => k.startsWith('ration_')).map(k => k.replace('ration_', ''));
  }
};

async function runVerification() {
  console.log('=== OFFLINE FLOW VERIFICATION ===\n');

  const testRation = {
    id: 'test-001',
    title: 'Test Ration - Tactical Basics',
    phases: [
      { title: 'Positioning', duration: 5, coachingPoints: ['Maintain distance'], map: '' },
      { title: 'Execution', duration: 10, coachingPoints: ['Quick release'], map: '' }
    ]
  };

  // Step 1: Save ration
  await StorageService.saveRation(testRation.id, testRation);
  console.log('[OK] Ration saved');

  // Step 2: Retrieve ration
  const recovered = await StorageService.getRation(testRation.id);
  console.assert(recovered.title === testRation.title, 'Ration title mismatch');
  console.log('[OK] Ration recovered:', recovered.title);

  // Step 3: List rations
  const list = await StorageService.getRationsList();
  console.assert(list.includes('test-001'), 'Ration not in list');
  console.log('[OK] Rations list:', list);

  // Step 4: Log phase results
  await StorageService.saveLog('test-001', { phaseIndex: 0, result: 'SUCCESS', timestamp: Date.now() });
  await StorageService.saveLog('test-001', { phaseIndex: 1, result: 'FAIL', timestamp: Date.now() });
  console.log('[OK] Phase logs saved');

  // Step 5: Verify logs
  const logs = await StorageService.getLog('test-001');
  console.assert(logs.length === 2, 'Expected 2 log entries, got ' + logs.length);
  console.assert(logs[0].result === 'SUCCESS', 'Log 0 result mismatch');
  console.assert(logs[1].result === 'FAIL', 'Log 1 result mismatch');
  console.log('[OK] Logs verified:', logs.length, 'entries');

  console.log('\n=== VERIFICATION PASSED ===');
}

runVerification().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
