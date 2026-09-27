/**
 * FieldManager handles the operational phase of the mission.
 * Coordinates timers, phase transitions and logging.
 */
import { StorageService } from './storage.js';

export const FieldManager = {
  currentRation: null,
  phaseIndex: 0,
  timerInterval: null,
  results: [],

  /**
   * Initializes a field session for a specific ration.
   * @param {object} ration - The validated ration data.
   */
  async initSession(ration) {
    this.currentRation = ration;
    this.phaseIndex = 0;
    this.results = [];
    this.renderPhase();
  },

  /**
   * Renders the current operational phase.
   */
  renderPhase() {
    const content = document.getElementById('phase-content');
    const ration = this.currentRation;

    if (!ration || !ration.phases || this.phaseIndex >= ration.phases.length) {
      this.showOperationComplete();
      return;
    }

    const phase = ration.phases[this.phaseIndex];
    document.getElementById('phase-count').textContent =
      `Razione ${ration.code}, fase ${this.phaseIndex + 1} di ${ration.phases.length}`;

    content.innerHTML = `
      <h2 class="phase-title">${phase.title}</h2>
      <div class="tactical-map">${phase.map || ''}</div>
      <p class="phase-task">${phase.task || ''}</p>
      ${phase.target ? `<p class="phase-target"><strong>Obiettivo</strong> ${phase.target}</p>` : ''}
      <ul class="phase-points">
        ${phase.coachingPoints.map(point => `<li>${point}</li>`).join('')}
      </ul>
      ${phase.metrics?.length ? `<p class="phase-metrics"><strong>Da misurare</strong> ${phase.metrics.join(', ')}</p>` : ''}
      <div class="phase-actions">
        <button class="btn-secondary" data-result="FAIL">Non riuscita</button>
        <button class="btn-primary" data-result="SUCCESS">Riuscita</button>
      </div>
    `;
    content.querySelectorAll('[data-result]').forEach(btn =>
      btn.addEventListener('click', () => this.nextPhase(btn.dataset.result)));

    this.startTimer(phase.duration);
  },

  /**
   * Starts a high-visibility countdown timer.
   * @param {number} durationMinutes - Duration in minutes.
   */
  startTimer(durationMinutes) {
    this.stopTimer();
    const timerEl = document.getElementById('phase-timer');
    let seconds = durationMinutes * 60;
    const paint = () => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    paint();

    this.timerInterval = setInterval(() => {
      seconds--;
      paint();
      if (seconds <= 0) {
        this.stopTimer();
        timerEl.textContent = 'Tempo';
        timerEl.classList.add('is-expired');
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    document.getElementById('phase-timer').classList.remove('is-expired');
  },

  /**
   * Logs previous phase and transitions to next.
   * @param {string|null} result - Result of the phase ('SUCCESS', 'FAIL', or null).
   */
  async nextPhase(result = null) {
    const ration = this.currentRation;
    if (!ration) return;

    if (result) {
      this.results.push(result);
      await StorageService.saveLog(ration.id, {
        phaseIndex: this.phaseIndex,
        phaseTitle: ration.phases[this.phaseIndex].title,
        result: result,
        timestamp: Date.now()
      });
    }

    this.phaseIndex++;
    this.renderPhase();
  },

  showOperationComplete() {
    this.stopTimer();
    const ok = this.results.filter(r => r === 'SUCCESS').length;
    document.getElementById('phase-count').textContent = `Razione ${this.currentRation.code} completata`;
    document.getElementById('phase-timer').textContent = `${ok}/${this.results.length}`;
    document.getElementById('phase-content').innerHTML = `
      <h2 class="phase-title">Sessione chiusa</h2>
      <p class="phase-task">Fasi riuscite: ${ok} su ${this.results.length}. L'esito è salvato sul telefono.</p>
    `;
  }
};
