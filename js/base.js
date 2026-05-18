import { StorageService } from './storage.js';
import { LogisticsManager } from './logistics.js';
import { t } from './i18n.js';

function progressBar(success, total) {
  if (total === 0) return '░░░░░░';
  const filled = Math.round((success / total) * 6);
  return '█'.repeat(filled) + '░'.repeat(6 - filled);
}

function formatDate(timestamp) {
  if (!timestamp) return '??/??/??';
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(2)}`;
}

export const BaseManager = {
  onDeploy: null, // callback(rationId) set by App

  async render() {
    await this.renderRations();
    await this.renderDebrief();
  },

  async renderRations() {
    const el = document.getElementById('base-ration-list');
    if (!el) return;

    const rations = await StorageService.getRationsList();

    if (rations.length === 0) {
      el.innerHTML = `<p class="base-empty">${t('noRationsBase')}</p>`;
    } else {
      el.innerHTML = rations.map(id => `
        <div class="base-ration-row">
          <div class="base-ration-header">
            <span class="base-ration-name">RATION_${id}</span>
            <button class="btn-small btn-delete" data-id="${id}">${t('deleteBtn')}</button>
          </div>
          <button class="btn-brutal btn-deploy" data-id="${id}">${t('enterBtn')}</button>
        </div>
      `).join('');

      el.querySelectorAll('.btn-deploy').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.onDeploy) this.onDeploy(btn.dataset.id);
        });
      });

      el.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm(t('deleteConfirm'))) {
            await StorageService.deleteRation(btn.dataset.id);
            await this.render();
          }
        });
      });
    }

    // Load buttons (always shown)
    const actions = document.getElementById('base-load-actions');
    if (actions) {
      actions.querySelector('#base-load-test-btn').textContent = t('loadTestBtn');
      actions.querySelector('#base-load-url-btn').textContent = t('loadUrlBtn');
    }
  },

  async renderDebrief() {
    const el = document.getElementById('base-debrief-list');
    if (!el) return;

    const allLogs = await StorageService.getAllLogs();

    if (allLogs.length === 0) {
      el.innerHTML = `<p class="base-empty">${t('noSessions')}</p>`;
      return;
    }

    // Sort most recent first (by first log entry timestamp)
    allLogs.sort((a, b) => {
      const aTs = a.logs[0]?.timestamp || 0;
      const bTs = b.logs[0]?.timestamp || 0;
      return bTs - aTs;
    });

    el.innerHTML = allLogs.map(({ sessionId, logs }) => {
      const total = logs.length;
      const successCount = logs.filter(l => l.result === 'SUCCESS').length;
      const pct = total > 0 ? Math.round((successCount / total) * 100) : 0;
      const bar = progressBar(successCount, total);
      const date = formatDate(logs[0]?.timestamp);

      const phaseRows = logs.map(l => `
        <div class="debrief-phase-row">
          <span class="debrief-phase-name">&gt; ${l.phaseTitle || `FASE ${l.phaseIndex + 1}`}</span>
          <span class="debrief-phase-result ${l.result === 'SUCCESS' ? 'result-success' : 'result-fail'}">
            ${l.result === 'SUCCESS' ? t('sessionSuccess') : t('sessionFail')}
          </span>
          <span class="debrief-phase-time">${formatDate(l.timestamp)}</span>
        </div>
      `).join('');

      return `
        <div class="debrief-session" data-session="${sessionId}">
          <div class="debrief-summary" data-toggle="${sessionId}">
            <span class="debrief-date">${date}</span>
            <span class="debrief-id">${sessionId}</span>
            <span class="debrief-bar">${bar}</span>
            <span class="debrief-pct">${pct}%</span>
          </div>
          <div class="debrief-detail hidden" id="detail-${sessionId}">
            ${phaseRows}
          </div>
        </div>
      `;
    }).join('');

    el.querySelectorAll('[data-toggle]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.toggle;
        const detail = document.getElementById(`detail-${id}`);
        if (detail) detail.classList.toggle('hidden');
      });
    });
  },

  async loadTestRation() {
    await LogisticsManager.loadTestRation();
    await this.render();
  },

  async loadFromUrl() {
    const url = prompt(t('loadUrlPrompt'));
    if (!url) return;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(resp.statusText);
      const data = await resp.json();
      if (!data.title || !data.phases || !Array.isArray(data.phases)) {
        throw new Error('Invalid ration: missing title or phases.');
      }
      const id = data.id || `remote-${Date.now()}`;
      await StorageService.saveRation(id, data);
      await this.render();
    } catch (e) {
      alert(t('loadError') + e.message);
    }
  }
};
