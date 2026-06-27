# Konkrete Todo-Liste

## Phase 0 - Freigabe und fehlende Entscheidungen

- [ ] Diesen Plan, die Repository-Struktur, `AGENTS.md`, den Style Guide und den Validierungsplan freigeben.
- [ ] Produktdomaene, Zielgruppe und einen klaren Ein-Satz-Kernnutzen festlegen.
- [ ] User Journeys fuer Onboarding, Lobby/Home und Profil priorisieren.
- [ ] Referenzscreens und Brand-Assets in Originalaufloesung bereitstellen und Nutzungsrechte bestaetigen.
- [ ] Farbwelt, Typografie-Vorschlag und das "Brand Portal" als Signaturelement bestaetigen oder ersetzen.
- [ ] Expo/React Native als technischen Stack bestaetigen.
- [ ] Backend, Auth, Datenschutz, Analytics, Push und Offline-Verhalten entscheiden.
- [ ] Zielgeraete, minimale iOS-/Android-Versionen und Accessibility-Ziel festlegen.

## Phase 1 - Repository und Quality Harness

- [ ] Expo-Router-Projekt mit TypeScript Strict Mode scaffolden.
- [ ] Geplante Ordnerstruktur und Import-Aliase anlegen.
- [ ] ESLint, Prettier, Typecheck und stabile `npm run ...`-Schnittstellen konfigurieren.
- [ ] Unit-/Component-Testumgebung einrichten.
- [ ] Playwright fuer Web-E2E und visuelle Screenshots einrichten.
- [ ] Native Smoke-Test-Strategie mit Simulator/Testgeraet und spaeter Maestro einrichten.
- [ ] CI-Gates fuer Install, Typecheck, Lint, Tests und Build-Check definieren.
- [ ] Secret- und Environment-Variablen-Konzept dokumentieren.

## Phase 2 - Designsystem vor Feature-Screens

- [ ] Freigegebene Farb-, Typo-, Spacing-, Radius-, Motion- und Elevation-Tokens implementieren.
- [ ] App-Hintergrund, Brand-Flaeche, Surface, Text, Button, Input und Feedback-Grundbausteine erstellen.
- [ ] Accessibility-Grundregeln in Komponenten verankern.
- [ ] Zustandsmatrix fuer Default, Pressed, Focused, Disabled, Loading und Error abdecken.
- [ ] Interne UI-Galerie/Playground fuer alle Grundbausteine anlegen.
- [ ] Repository-Skill `.agents/skills/mobile-brand-ui/` aus dem freigegebenen Style Guide ableiten.
- [ ] Erste visuelle Baselines fuer Grundbausteine abnehmen.

## Phase 3 - Vertikale Produkt-Slices

- [ ] Onboarding als erster kompletter Slice: Happy Path, Zurueck, Abbruch, Fehler und Accessibility.
- [ ] Lobby/Home als zweiter Slice: Informationshierarchie, primaere Aktion, Loading/Empty/Error/Offline.
- [ ] Profil als dritter Slice: Ansicht, Bearbeitung, Validierung, Speichern und Fehlerfeedback.
- [ ] Navigation, Deep Links und Wiederaufnahme-Zustaende pruefen.
- [ ] Reale oder realistische Inhalte statt Lorem Ipsum verwenden.
- [ ] Jeden Slice separat durch Review -> Repair -> Validate bis zum Freigabe-Gate fuehren.

## Phase 4 - Haertung und Freigabe

- [ ] Kernflows auf iOS und Android end-to-end pruefen.
- [ ] Kleine und grosse Displays, Schriftvergroesserung und Reduced Motion pruefen.
- [ ] Performance-Budgets fuer Start, Navigation und lange Listen messen.
- [ ] Accessibility-Audit und manuellen Screenreader-Smoke-Test durchfuehren.
- [ ] Visuelle Referenzabweichungen mit begruendeten Entscheidungen dokumentieren.
- [ ] Datenschutz-, Berechtigungs-, Logging- und Fehlerbehandlung pruefen.
- [ ] Release-Checkliste und Rollback-/Hotfix-Ablauf dokumentieren.

## Phase 5 - Kontrollierte Eigenstaendigkeit

- [ ] Wiederholbaren Eval-Datensatz aus realen Fehlern, Review-Funden und visuellen Abweichungen aufbauen.
- [ ] Review-/Repair-/Validate-Ergebnisse strukturiert und tool-agnostisch speichern.
- [ ] Erst nach mehreren stabilen manuellen Durchlaeufen Hintergrundpruefungen vorschlagen.
- [ ] Menschliches Diff-/Merge-Gate fuer alle automatisierten Aenderungen beibehalten.
- [ ] Nur nach messbar stabilen Gates einzelne risikoarme Pfade selektiv automatisieren.

