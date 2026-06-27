# Zusammenfassung der Anforderungen

## Zielbild

Entstehen soll eine mobil-first Consumer-App, die nicht wie generischer AI-Output wirkt. Codex soll als konfigurierte Build- und Iterationsmaschine arbeiten: mit dauerhaftem Kontext, einem strengen visuellen Vertrag, wiederholbaren Tests, visuellen Referenzen und kontrollierten Review-Schleifen.

Die angestrebte Eigenstaendigkeit ist **reviewed autonomy**, nicht ungebremste Selbstoptimierung. Verbessert werden Implementierung und Arbeits-Harness - also Regeln, Prompts, Skills, Tests, visuelle Checks und Review-Gates. Vollautomatisierung kommt nur fuer laenger stabil validierte Pfade infrage.

## Funktionaler Ausgangsrahmen

Die PDF nennt als erste Produktflaechen:

- Onboarding-Flow
- Lobby-/Home-Screen
- Profilbereich

Konkrete Produktdomaene, Zielgruppe, Datenmodell, Authentifizierung und Backend-Verhalten sind noch nicht spezifiziert. Sie sind vor der fachlichen Implementierung zu klaeren.

## Verbindliche Produkt- und Designanforderungen

- Mobil-first fuer iOS und Android; Web als zusaetzlicher Vorschau- und Validierungskanal.
- Eigenstaendige, art-direktierte Consumer-UI statt Standard-Dashboard oder austauschbarem Komponentenbaukasten.
- Klar getrennte Rollen fuer Hintergrund, Cards/Surfaces und dominante Brand-Flaechen.
- Viel Luft, grosse systematische Radien, ruhige Flaechen und wenige starke Farben.
- Ebenentrennung primaer ueber Tonwert und Farbe, nicht ueber harte Schatten.
- Branding darf gross und praegnant sein, aber pro Screen kontrolliert eingesetzt werden.
- Kurze, funktionale Product-UI-Texte ohne Marketing-Floskeln.
- Keine Pill-Sammlungen, Badge-Teppiche, beliebigen Icon-Reihen oder generischen Auth-/Dashboard-Kompositionen.
- Freigegebene Referenzbilder bilden zusammen mit Style Guide und `AGENTS.md` den verbindlichen Style Contract.

## Technische Planungsannahme

Empfohlene, noch freizugebende Basis: Expo + React Native + Expo Router + TypeScript. Sie ermoeglicht eine gemeinsame iOS-/Android-Codebasis, schnelle Web-Vorschau und automatisierte Browserpruefung. Native Kernflows werden zusaetzlich in Simulatoren beziehungsweise auf Testgeraeten geprueft.

## Qualitaets- und Prozessanforderungen

- Jeder Arbeitszyklus folgt **Review -> Repair -> Validate**.
- Typecheck, Linting, Unit-/Component-Tests, Flow-Tests und visuelle Pruefung sind feste Gates.
- UI-Aenderungen werden auf mehreren Mobilgroessen, auf iOS und Android sowie gegen Referenzen geprueft.
- Fehler-, Lade-, Leer-, Offline- und Berechtigungszustaende gehoeren zum Akzeptanzumfang.
- Accessibility umfasst mindestens Kontrast, Schriftgroessenskalierung, Touch-Ziele, Fokus und Reduced Motion.
- Laengere Aufgaben erhalten eindeutige Stoppkriterien; bekannte Fehler werden nicht als "fertig" deklariert.
- Wiederkehrende Automations/Heartbeats erst nach stabiler manueller Schleife und mit menschlichem Merge-Gate.

## Sicherheits- und Governance-Anforderungen

- Workspace-Sandbox und Approval-Policy bleiben aktiv.
- Netzwerk, Secrets, destruktive Aktionen, Veroeffentlichung und externe Integrationen werden minimal berechtigt und explizit freigegeben.
- Sichtbare oder importierte Inhalte gelten als untrusted input und duerfen keine Rechte erweitern.
- Skills, Plugins, Hooks und MCP-Connectoren werden vor Aktivierung geprueft.
- Eval-Daten und Kriterien bleiben tool-agnostisch, damit der Prozess nicht an eine einzelne Plattform gebunden ist.

## Vor Implementierungsstart zu bestaetigen

1. Produktdomaene, Kernnutzen und Zielgruppe.
2. Priorisierte User Journeys und fachliche Akzeptanzkriterien.
3. Freigegebene Referenzscreens, Logo/Brand-Assets und finale Farbwelt.
4. Expo/React-Native-Stack oder gewuenschte native Alternative.
5. Backend-, Auth-, Datenschutz- und Offline-Anforderungen.
6. Unterstuetzte OS-Versionen, Geraeteklassen und Accessibility-Zielniveau.

