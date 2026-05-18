/**
 * i18n — EN/IT UI string switcher.
 * Ration content (coaching points, phase titles) is author-controlled, not translated.
 */

export const STRINGS = {
  en: {
    logisticsTitle: 'LOGISTICS MODE',
    rationPack: 'RATION PACK: SOCCER-RATION-01',
    loadBtn: 'LOAD TEST RATION',
    enterFieldBtn: 'ENTER FIELD MODE',
    fieldTitle: 'FIELD MODE: OPERATIONAL',
    nextPhaseBtn: 'NEXT PHASE',
    returnBtn: 'RETURN TO BASE',
    noRations: 'NO RATIONS LOADED',
    rationReady: 'READY',
    rationEmpty: 'EMPTY',
    timeExpired: 'TIME EXPIRED',
    noTimer: 'NO TIMER',
    opComplete: 'OPERATION COMPLETE',
    opCompleteMsg: 'All phases executed. Return to base for debrief.',
    fail: 'FAIL',
    success: 'SUCCESS',
    noRationsAlert: 'NO RATIONS LOADED. Use LOAD TEST RATION first.',
    loadError: 'LOAD FAILURE: ',
    transitionError: 'TRANSITION FAILURE: ',
    tacticalMap: '// TACTICAL MAP //',
    briefingTitle: '// BRIEFING //',
    briefingLine1: 'SYSTEM: SOCCER IN A BOX — RATION',
    briefingLine2: 'MISSION: EXECUTE STRUCTURED TRAINING SESSION',
    briefingStep1Label: '[ PHASE 1 — LOGISTICS ]',
    briefingStep1: 'Load a ration. The ration contains training phases, coaching points and duration.',
    briefingStep2Label: '[ PHASE 2 — FIELD ]',
    briefingStep2: 'Execute phases in sequence. For each phase: read the points, check the tactical map, mark SUCCESS or FAIL.',
    briefingStep3Label: '[ PHASE 3 — BASE ]',
    briefingStep3: 'When done, return to base. Logs are saved locally for debrief.',
    briefingWarn: 'WORKS OFFLINE. NO CONNECTION NEEDED IN THE FIELD.',
    briefingConfirm: 'ACKNOWLEDGED — BEGIN',
    baseTitle: 'BASE — COMMAND',
    rationsSectionTitle: 'AVAILABLE RATIONS',
    debriefSectionTitle: 'DEBRIEF — SESSIONS',
    enterBtn: 'DEPLOY →',
    deleteBtn: 'DEL',
    loadTestBtn: 'LOAD TEST RATION',
    loadUrlBtn: 'LOAD FROM URL',
    loadUrlPrompt: 'Enter ration URL (JSON):',
    noRationsBase: 'NO RATIONS LOADED.',
    noSessions: 'NO SESSIONS RECORDED.',
    sessionSuccess: 'SUCCESS',
    sessionFail: 'FAIL',
    deleteConfirm: 'Delete this ration and its logs?',
  },
  it: {
    logisticsTitle: 'MODALITÀ LOGISTICA',
    rationPack: 'RAZIONE: SOCCER-RATION-01',
    loadBtn: 'CARICA RAZIONE TEST',
    enterFieldBtn: 'ENTRA IN CAMPO',
    fieldTitle: 'MODALITÀ CAMPO: OPERATIVA',
    nextPhaseBtn: 'FASE SUCCESSIVA',
    returnBtn: 'TORNA ALLA BASE',
    noRations: 'NESSUNA RAZIONE CARICATA',
    rationReady: 'PRONTA',
    rationEmpty: 'VUOTA',
    timeExpired: 'TEMPO SCADUTO',
    noTimer: 'NESSUN TIMER',
    opComplete: 'OPERAZIONE COMPLETATA',
    opCompleteMsg: 'Tutte le fasi eseguite. Torna alla base.',
    fail: 'FALLITO',
    success: 'SUCCESSO',
    noRationsAlert: 'NESSUNA RAZIONE. Usa CARICA RAZIONE TEST prima.',
    loadError: 'ERRORE CARICAMENTO: ',
    transitionError: 'ERRORE TRANSIZIONE: ',
    tacticalMap: '// MAPPA TATTICA //',
    briefingTitle: '// BRIEFING //',
    briefingLine1: 'SISTEMA: SOCCER IN A BOX — RATION',
    briefingLine2: 'MISSIONE: ESEGUIRE SESSIONE DI ALLENAMENTO STRUTTURATA',
    briefingStep1Label: '[ FASE 1 — LOGISTICA ]',
    briefingStep1: 'Carica una razione. La razione contiene le fasi dell\'allenamento, i punti di coaching e la durata.',
    briefingStep2Label: '[ FASE 2 — CAMPO ]',
    briefingStep2: 'Esegui le fasi in sequenza. Per ogni fase: leggi i punti, osserva la mappa tattica, segna SUCCESSO o FALLITO.',
    briefingStep3Label: '[ FASE 3 — BASE ]',
    briefingStep3: 'Al termine torna alla base. I log vengono salvati localmente per il debriefing.',
    briefingWarn: 'FUNZIONA OFFLINE. NESSUNA CONNESSIONE NECESSARIA IN CAMPO.',
    briefingConfirm: 'RICEVUTO — INIZIA',
    baseTitle: 'BASE — COMANDO',
    rationsSectionTitle: 'RAZIONI DISPONIBILI',
    debriefSectionTitle: 'DEBRIEFING — SESSIONI',
    enterBtn: 'DEPLOY →',
    deleteBtn: 'DEL',
    loadTestBtn: 'CARICA RAZIONE TEST',
    loadUrlBtn: 'CARICA DA URL',
    loadUrlPrompt: 'Inserisci URL razione (JSON):',
    noRationsBase: 'NESSUNA RAZIONE CARICATA.',
    noSessions: 'NESSUNA SESSIONE REGISTRATA.',
    sessionSuccess: 'SUCCESSO',
    sessionFail: 'FALLITO',
    deleteConfirm: 'Eliminare questa razione e i suoi log?',
  }
};

const LANG_KEY = 'siab_lang';

let currentLang = localStorage.getItem(LANG_KEY) || 'it';

export function getCurrentLang() {
  return currentLang;
}

export function getSavedLang() {
  return currentLang;
}

export function saveLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

export function t(key) {
  return STRINGS[currentLang][key] || STRINGS.en[key] || key;
}

export function applyLang(lang) {
  saveLang(lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Update toggle button label
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = lang === 'it' ? 'EN' : 'IT';
}
