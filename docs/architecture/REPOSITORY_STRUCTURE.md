# Geplante Repository-Struktur

## Architekturentscheidung zur Freigabe

Empfohlen wird eine Expo-/React-Native-App mit Expo Router und TypeScript. Die Struktur ist feature-orientiert, haelt Routing duenn und trennt Produktlogik, Designsystem, Integrationen und Tests sichtbar voneinander.

```text
SmartphoneAPP/
|-- AGENTS.md
|-- app/                         # Expo-Router-Dateien; nur Navigation und Screen-Komposition
|   |-- _layout.tsx
|   |-- (onboarding)/
|   |-- (main)/
|   |   |-- _layout.tsx
|   |   |-- index.tsx           # Lobby/Home-Route
|   |   `-- profile.tsx
|   `-- +not-found.tsx
|-- src/
|   |-- features/               # Vertikale Produkt-Slices
|   |   |-- onboarding/
|   |   |-- lobby/
|   |   `-- profile/
|   |-- ui/                     # Wiederverwendbare, fachfreie UI-Bausteine
|   |   |-- primitives/
|   |   |-- patterns/
|   |   `-- feedback/
|   |-- design/                 # Tokens, Themes, Typografie, Motion
|   |-- services/               # API, Storage, Analytics, Notifications
|   |-- state/                  # App-weiter Zustand; nur wenn wirklich noetig
|   |-- lib/                    # Kleine fachfreie Hilfen
|   |-- hooks/
|   |-- types/
|   `-- config/                 # Validierte Runtime-Konfiguration
|-- assets/
|   |-- brand/
|   |-- fonts/
|   |-- icons/
|   `-- references/             # Freigegebene visuelle Referenzen, versioniert
|-- tests/
|   |-- unit/
|   |-- component/
|   |-- e2e/
|   |   |-- web/
|   |   `-- native/
|   |-- visual/
|   |   |-- baselines/
|   |   `-- fixtures/
|   `-- accessibility/
|-- .maestro/                   # Spaetere deterministische native Kernflows
|-- scripts/                    # Validierung und Build-Hilfen, keine Produktlogik
|-- docs/
|   |-- REQUIREMENTS_SUMMARY.md
|   |-- TODO.md
|   |-- architecture/
|   |   |-- REPOSITORY_STRUCTURE.md
|   |   `-- decisions/          # Kurze ADRs
|   |-- design/
|   |   `-- UI_STYLE_GUIDE.md
|   `-- quality/
|       `-- VALIDATION_PLAN.md
|-- .agents/
|   `-- skills/
|       `-- mobile-brand-ui/    # Spaeter aus freigegebenem Guide erzeugen
|-- playwright.config.ts
|-- eslint.config.js
|-- tsconfig.json
|-- app.config.ts
|-- package.json
|-- package-lock.json
`-- README.md
```

## Verantwortungsgrenzen

- `app/` kennt Features und UI, enthaelt aber keine Fachlogik oder direkten API-Aufrufe.
- `features/<name>/` besitzt seinen Flow, feature-spezifische Komponenten, Hooks, Schema und Tests.
- `ui/` ist fachfrei. Ein Baustein wandert erst dorthin, wenn seine Rolle wirklich feature-uebergreifend ist.
- `design/` ist die einzige Quelle fuer visuelle Tokens. Keine Hexwerte, Fontnamen oder freien Abstaende in Feature-Code.
- `services/` kapselt I/O. UI und Features sprechen ueber typisierte Schnittstellen mit der Aussenwelt.
- `state/` bleibt klein. Lokaler Zustand bleibt lokal; Remote-Daten werden nicht unnoetig dupliziert.
- Tests duerfen produktive Modulgrenzen verwenden, aber keine privaten Implementierungsdetails erzwingen.

## Geplante Datenrichtung

```text
Route -> Feature Screen -> Feature Logic -> Service Interface -> External System
                    |
                    `-> UI primitives -> Design tokens
```

Rueckwaertige Abhaengigkeiten - etwa `ui` auf `features` oder `services` auf Screens - sind verboten.

## Noch offene Architekturentscheidungen

- Lokale versus externe Authentifizierung und Session-Verwaltung.
- API-Protokoll und Backend-Eigentuemer.
- Server-State-Bibliothek nur bei nachgewiesenem Bedarf.
- Offline-Cache und Konfliktstrategie.
- Analytics/Crash Reporting unter Datenschutzvorgaben.
- Native E2E mit Maestro ab Phase 2 oder 3.

