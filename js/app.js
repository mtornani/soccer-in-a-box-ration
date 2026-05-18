import { FieldManager } from './field.js';
import { StorageService } from './storage.js';
import { BaseManager } from './base.js';
import { applyLang, getSavedLang, getCurrentLang, t } from './i18n.js';

const BRIEFING_KEY = 'siab_briefing_seen';

const App = {
  async init() {
    applyLang(getSavedLang());
    this.bindEvents();
    this.showBriefingIfNeeded();
    BaseManager.onDeploy = (rationId) => this.enterFieldMode(rationId);
    await BaseManager.render();
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

    document.getElementById('base-load-test-btn')
      ?.addEventListener('click', () => BaseManager.loadTestRation());

    document.getElementById('base-load-url-btn')
      ?.addEventListener('click', () => BaseManager.loadFromUrl());

    document.getElementById('next-phase-btn')
      ?.addEventListener('click', () => FieldManager.nextPhase());

    document.getElementById('back-to-base-btn')
      ?.addEventListener('click', () => this.exitFieldMode());

    document.getElementById('lang-toggle')
      ?.addEventListener('click', async () => {
        const next = getCurrentLang() === 'it' ? 'en' : 'it';
        applyLang(next);
        await BaseManager.render();
      });
  },

  async enterFieldMode(rationId) {
    try {
      const ration = await StorageService.getRation(rationId);
      if (!ration) throw new Error('Ration data missing.');

      await FieldManager.initSession(ration);
      document.getElementById('base-mode').classList.add('hidden');
      document.getElementById('field-mode').classList.remove('hidden');
    } catch (error) {
      alert(t('transitionError') + error.message);
    }
  },

  async exitFieldMode() {
    FieldManager.stopTimer();
    document.getElementById('field-mode').classList.add('hidden');
    document.getElementById('base-mode').classList.remove('hidden');
    await BaseManager.render();
  }
};

App.init();
