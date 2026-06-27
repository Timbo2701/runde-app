# Runde

`Runde` ist ein mobiler Social-Game-MVP fuer Freundesgruppen. Die App setzt die bereitgestellten Referenzen nicht nach, sondern uebertraegt ihre Qualitaet in eine eigene visuelle Sprache: satte farbige Buehnen, ein Social Spotlight, wenige starke Kontraste und nur funktional begruendete Cards.

## Enthaltener Flow

- Raumcode eingeben oder neue Runde starten
- Lobby mit Raumcode und Mitspielern
- lokale Abstimmungsfrage mit Auswahl- und Bestaetigungszustand
- editierbares Profil mit sofortigem visuellen Feedback
- responsives Web sowie Expo-Basis fuer iOS und Android

Der aktuelle MVP arbeitet bewusst mit lokalen Beispieldaten. Backend, echte Raum-Synchronisation, Authentifizierung und Persistenz sind noch nicht angebunden.

## Starten

Voraussetzung: Node.js und npm.

```text
npm install
npm run start
```

Danach kann die App zuerst mit Expo Go oder im Web geoeffnet werden.

## Qualitaetschecks

```text
npm run typecheck
npm run lint
npm run test
npm run validate
```

Ein Produktions-Web-Build kann mit folgendem Befehl geprueft werden:

```text
npx expo export --platform web
```

## Verbindliche Dokumentation

- `AGENTS.md` - dauerhafte Arbeits-, Sicherheits- und Designregeln
- `docs/design/REFERENCE_ANALYSIS.md` - Analyse der gelieferten Screenshots und Anti-KI-Regeln
- `docs/design/UI_STYLE_GUIDE.md` - Tokens, Komponenten- und Abnahmeregeln
- `docs/quality/VALIDATION_PLAN.md` - Test- und Validierungsstrategie
- `docs/TODO.md` - weitere Produkt- und Infrastrukturarbeit

