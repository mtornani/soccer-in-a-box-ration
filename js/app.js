import { LogisticsManager } from './logistics.js';
import { FieldManager } from './field.js';
import { StorageService } from './storage.js';
import { applyLang, getSavedLang, getCurrentLang, t } from './i18n.js';

const BRIEFING_KEY = 'siab_briefing_seen';

const App = {
  async init() {
    applyLang(getSavedLang());
    this.bindEvents();
    this.showBriefingIfNeeded();
    this.setupLogisticsUI();
  },

  showBriefingIfNeeded() {
    if (localStorage.getItem(BRIEFING_KEY)) return;
    document.getElementById('briefing-screen').classList.remove('hidden');
  },

  bindEvents() {
    document.getElementById('briefing-confirm-btn')
      ?.addEventListener('click', () => {
        localStorage.setItem(BRIEFING_KEY, '1');
        document.getElementById('briefing-screen').classList.add('hidden');
      });

    document.getElementById('load-test-btn')
      ?.addEventListener('click', () => this.loadTestRation());

    document.getElementById('enter-field-btn')
      ?.addEventListener('click', () => this.enterFieldMode());

    document.getElementById('next-phase-btn')
      ?.addEventListener('click', () => FieldManager.nextPhase());

    document.getElementById('back-to-base-btn')
      ?.addEventListener('click', () => this.exitFieldMode());

    document.getElementById('lang-toggle')
      ?.addEventListener('click', () => {
        const next = getCurrentLang() === 'it' ? 'en' : 'it';
        applyLang(next);
        this.setupLogisticsUI();
      });
  },

  async loadTestRation() {
    try {
      await LogisticsManager.loadTestRation();
      this.setupLogisticsUI();
    } catch (e) {
      console.error('Failed to load test ration:', e);
      alert(t('loadError') + e.message);
    }
  },

  async setupLogisticsUI() {
    const rationListEl = document.getElementById('ration-list');
    if (!rationListEl) return;

    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        rationListEl.innerHTML = `<div class="ration-item"><span>${t('noRations')}</span><span>[${t('rationEmpty')}]</span></div>`;
        return;
      }

      rationListEl.innerHTML = rations.map(id => `
        <div class="ration-item">
          <span>RATION_${id}</span>
          <span>[${t('rationReady')}]</span>
        </div>
      `).join('');
    } catch (e) {
      console.error('Failed to setup logistics UI:', e);
    }
  },

  async enterFieldMode() {
    try {
      const rations = await LogisticsManager.listLocalRations();
      if (rations.length === 0) {
        alert(t('noRationsAlert'));
        return;
      }

      const activeRationId = rations[0];
      const activeRation = await StorageService.getRation(activeRationId);

      if (!activeRation) {
        throw new Error('Ration data corrupted or missing.');
      }

      await FieldManager.initSession(activeRation);
      document.getElementById('logistics-mode').classList.add('hidden');
      document.getElementById('field-mode').classList.remove('hidden');
    } catch (error) {
      console.error('Transition failed:', error);
      alert(t('transitionError') + error.message);
    }
  },

  exitFieldMode() {
    FieldManager.stopTimer();
    document.getElementById('field-mode').classList.add('hidden');
    document.getElementById('logistics-mode').classList.remove('hidden');
    this.setupLogisticsUI();
  }
};

App.init();
