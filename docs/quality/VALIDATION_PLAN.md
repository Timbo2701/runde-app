# Validierungsplan

## Ziel

Validierung steuert den naechsten Repair-Pass. Ein gruener Einzeltest reicht nicht: Funktion, Codequalitaet, Accessibility und visuelle Wirkung muessen gemeinsam bestehen.

## 1. Gate-Reihenfolge pro Aenderung

1. **Review:** Scope, Akzeptanzkriterien, Referenzen, bestehende Implementierung und Risiken erfassen.
2. **Static checks:** Format, Typecheck und Linting.
3. **Automated behavior:** betroffene Unit-, Component- und Flow-Tests.
4. **Runtime smoke:** App starten, Logs pruefen, geaenderten Weg bedienen.
5. **Visual check:** Screenshots auf Zielgroessen erzeugen und mit Baseline/Referenz vergleichen.
6. **Native check:** kritischen Weg mindestens auf iOS und Android pruefen.
7. **Diff review:** unbeabsichtigte Aenderungen, Secrets, tote Dateien und Doku pruefen.

Bei einem Fehler beginnt kein kosmetischer "Greenwashing"-Pass. Ursache dokumentieren, gezielt reparieren und das relevante Gate erneut ausfuehren.

## 2. Geplante Tools und Befehle

Nach dem Scaffold stellt `package.json` folgende stabile Schnittstellen bereit:

```text
npm run typecheck          # tsc --noEmit
npm run lint               # ESLint fuer TS/TSX und Projektregeln
npm run test               # Unit- und Component-Tests
npm run test:e2e:web       # Playwright-Kernflows
npm run test:visual:web    # deterministische Screenshot-Vergleiche
npm run validate           # lokales Gesamtgate
```

Die konkrete Testbibliothek wird beim Scaffold festgelegt. Bevorzugt sind Jest oder Vitest mit React Native Testing Library, Playwright fuer Web und spaeter Maestro fuer reproduzierbare native Kernflows.

## 3. Testpyramide

### Unit-Tests

Pruefen pure Fachlogik, Validatoren, Mapper, Formatierung und Zustandsuebergaenge. Sie sind schnell, deterministisch und ohne Netzwerk.

Mindestfaelle:

- normaler Fall
- Grenzen und leere Eingaben
- ungueltige externe Daten
- Fehler- und Wiederholungslogik
- Zeitzone/Locale, sofern relevant

### Component-Tests

Pruefen sichtbares Verhalten aus Nutzersicht:

- Rendering realistischer Inhalte
- Press, Tastatur/Fokus und Formularvalidierung
- Loading, Empty, Error, Offline, Disabled und Success
- Accessibility-Rollen, Namen und States
- Schriftvergroesserung ohne Verlust der Kernaktion

Keine Snapshots grosser Komponentenbaeume als Ersatz fuer Verhaltenspruefungen.

### Integration-/Flow-Tests

Pruefen Feature-Grenzen mit kontrollierten Service-Doubles:

- Onboarding abschliessen, zurueckgehen und wiederaufnehmen
- Lobby laden, leeren/fehlerhaften/offline Zustand behandeln
- Profil bearbeiten, validieren, speichern und Fehler beheben
- Navigation und Deep Links

### End-to-End

- Web: Playwright fuer schnelle, reproduzierbare Kernflows und Screenshot-Erzeugung.
- Native: zunaechst gefuehrte Simulator-Smokes; nach Stabilisierung Maestro fuer Kernflows.
- Externe Systeme werden in CI nicht unkontrolliert angesprochen; stabile Testumgebungen oder vertragstreue Stubs verwenden.

## 4. Linting und statische Qualitaet

Pflichtgates:

- TypeScript Strict Mode ohne neue `any`-Fluchtwege.
- ESLint fuer React, React Hooks, React Native, Imports und ungenutzten Code.
- Formatpruefung ohne automatische semantische Aenderungen im CI.
- Zyklus- und Modulgrenzenpruefung: `ui` darf nicht von `features` abhaengen.
- Keine Hardcoded-Farben, Fontnamen oder freien Spacingwerte ausserhalb des Designsystems.
- Keine Secrets oder sensiblen Werte im Repository.

Warnungen werden nicht dauerhaft ignoriert. Jede Ausnahme braucht eine lokale Begruendung und nachverfolgbare Entfernungsperspektive.

## 5. Visuelle Pruefung

### Viewport-Matrix

Web-/Responsive-Baselines:

- 320 x 568: sehr kleines Telefon
- 390 x 844: aktuelles Standardtelefon
- 430 x 932: grosses Telefon
- zusaetzlich Landscape fuer flows, die Landscape unterstuetzen muessen

Native Sichtpruefung:

- mindestens ein kleines und ein aktuelles iPhone-Profil
- mindestens ein kompaktes und ein grosses Android-Profil
- Light Theme; Dark Theme nur nach separater Produktfreigabe, nicht automatisch erfinden

### Screenshot-Regeln

- Feste Locale, Zeitzone, Testdaten, Fonts, Reduced-Motion-Einstellung und Animationsabschluss.
- Baselines werden nur nach menschlicher Sichtpruefung aktualisiert.
- Pixel-Diffs sind ein Signal, kein automatischer Designentscheid. Jede Aenderung wird auch semantisch gegen den Style Guide beurteilt.
- Referenzabweichungen werden nach Hierarchie, Abstand, Typografie, Flaechenwirkung, Farbe und Gesamtcharakter kategorisiert.
- Keine Baseline-Aktualisierung nur, um einen roten Test gruen zu machen.

### Manuelle visuelle Rubrik

- eindeutige primaere Aktion
- klare Trennung von Canvas, Surface und Brand Portal
- keine konkurrierenden Akzente oder generischen Template-Muster
- konsistente Tokens und optische Ausrichtung
- realistische lange/kurze deutsche Texte
- keine Clipping-, Overlap-, Safe-Area- oder Keyboard-Probleme
- korrekte Lade-, Leer-, Fehler-, Offline- und Disabled-Zustaende

## 6. Accessibility

- Kontrast fuer Text und Controls nach WCAG 2.2 AA anstreben.
- Touch-Ziele mindestens 44 x 44 pt.
- Sinnvolle Rollen, Namen, Reihenfolge und States fuer Assistive Technologies.
- Screenreader-Smoke-Test fuer jeden Kernflow auf iOS und Android.
- 200 % Textskalierung beziehungsweise groesste praktikable Plattformstufe ohne blockierte Kernaktion.
- Tastatur-/Fokuspruefung im Web.
- Reduced Motion und nicht-farbliche Zustandskennzeichnung.

## 7. Performance und Stabilitaet

Vor Release messbare Budgets festlegen fuer:

- kalten und warmen Start
- Zeit bis zur ersten bedienbaren Kernaktion
- Navigationsreaktion
- Listen-Scroll und Bildladen
- Bundle-/Asset-Groesse

Keine Optimierung nach Bauchgefuehl: erst messen, dann den groessten Engpass beheben und erneut messen.

## 8. CI- und Merge-Gates

Jeder Pull Request muss bestehen:

1. reproduzierbare Installation
2. Typecheck
3. Lint/Format-Check
4. betroffene Unit-/Component-/Flow-Tests
5. Web-Build- oder Start-Smoke
6. visuelle Checks fuer sichtbare Aenderungen
7. dokumentierte native Sichtpruefung fuer kritische UI-/Navigationsaenderungen
8. menschliche Diff- und Designfreigabe

## 9. Review -> Repair -> Validate-Protokoll

Jeder groessere Durchlauf dokumentiert knapp:

```text
Goal:
Gepruefter Scope:
Gefundene Abweichungen:
Gezielte Reparaturen:
Ausgefuehrte Checks:
Visuell gepruefte Geraete/Viewports:
Restliche Risiken:
Entscheidung: bestanden | weiterer Repair-Pass | blockiert
```

Dieses Schema bleibt tool-agnostisch und kann spaeter von Automations verwendet werden.

## 10. Einfuehrungsreihenfolge

1. Manuelle Gates und lokale Tests stabilisieren.
2. CI fuer deterministische Checks aktivieren.
3. Visuelle Baselines und native Smoke-Checklisten etablieren.
4. Reale Fehler und Review-Funde als Eval-Faelle sammeln.
5. Erst danach wiederkehrende Prueflaeufe vorschlagen.
6. Selective autonomy nur fuer risikoarme Pfade mit ueber mehrere Zyklen stabilen Signalen.

