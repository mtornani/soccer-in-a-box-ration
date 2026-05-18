# i18n EN/IT — Design Spec
Date: 2026-05-18

## Scope
Add Italian/English language switch to SoccerInABox Ration UI chrome only.
Ration JSON content (coaching points, phase titles) is author-controlled — not translated.

## Out of Scope
- Translating ration JSON data
- Any i18n library or bundler
- RTL support

## Architecture

### New file: `js/i18n.js`
Exports:
- `STRINGS` — object `{ en: {...}, it: {...} }` with all UI strings
- `applyLang(lang)` — updates all `[data-i18n]` elements in the DOM
- `getSavedLang()` — reads from localStorage, defaults to `'it'`
- `saveLang(lang)` — writes to localStorage

### Modified files
- `index.html` — add `data-i18n` attributes to static text nodes; add toggle button
- `js/app.js` — import i18n, call `applyLang(getSavedLang())` on init; wire toggle button
- `js/field.js` — use `STRINGS[currentLang]` for dynamic strings (TIME EXPIRED, NO TIMER, OPERATION COMPLETE, phase log buttons)

## Strings Table

| Key | EN | IT |
|-----|----|----|
| logisticsTitle | LOGISTICS MODE | MODALITÀ LOGISTICA |
| rationPack | RATION PACK: SOCCER-RATION-01 | RAZIONE: SOCCER-RATION-01 |
| loadBtn | LOAD TEST RATION | CARICA RAZIONE TEST |
| enterFieldBtn | ENTER FIELD MODE | ENTRA IN CAMPO |
| fieldTitle | FIELD MODE: OPERATIONAL | MODALITÀ CAMPO: OPERATIVA |
| nextPhaseBtn | NEXT PHASE | FASE SUCCESSIVA |
| returnBtn | RETURN TO BASE | TORNA ALLA BASE |
| noRations | NO RATIONS LOADED | NESSUNA RAZIONE CARICATA |
| rationReady | READY | PRONTA |
| rationEmpty | EMPTY | VUOTA |
| timeExpired | TIME EXPIRED | TEMPO SCADUTO |
| noTimer | NO TIMER | NESSUN TIMER |
| opComplete | OPERATION COMPLETE | OPERAZIONE COMPLETATA |
| opCompleteMsg | All phases executed. Return to base for debrief. | Tutte le fasi eseguite. Torna alla base. |
| fail | FAIL | FALLITO |
| success | SUCCESS | SUCCESSO |
| noRationsAlert | NO RATIONS LOADED. Use LOAD TEST RATION first. | NESSUNA RAZIONE. Usa CARICA RAZIONE TEST prima. |

## Toggle Button
- Fixed position top-right, small, unobtrusive
- Label: `IT` when current lang is EN (click to switch to IT), `EN` when current lang is IT
- Styled minimal: yellow text on black, no border

## Default Language
Italian (`it`) — primary user is Italian coach.

## Data Flow
1. App init → `getSavedLang()` → `applyLang(lang)`
2. Toggle click → flip lang → `saveLang()` → `applyLang()`
3. `field.js` reads current lang via exported `getCurrentLang()` for dynamic strings

## Testing
- Load page → Italian by default
- Click toggle → switches to English, persists on reload
- Enter field mode → dynamic strings (FALLITO/SUCCESSO, TEMPO SCADUTO) in correct language
