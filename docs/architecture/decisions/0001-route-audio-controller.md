# ADR 0001: Zentrale, routenbasierte Audiosteuerung

## Status

Akzeptiert am 2026-07-01.

## Kontext

Lobby, Ranked und Ergebnisansichten benoetigen unterschiedliche lokale Musik- und Sounddateien. Beim Routenwechsel duerfen sich Tracks nicht ueberschneiden. Hintergrundmusik soll wiederholt werden, Ergebnis-Sounds enden nach acht Sekunden und die Profil-Einstellungen muessen sofort greifen.

## Entscheidung

- `AppAudioController` ist die einzige Stelle, die einen `expo-audio`-Player steuert.
- `/lobby` nutzt `lobby_musik.mp3` als Loop.
- Ranked-Routen nutzen `ranked_musik.mp3` als Loop; `/ranked/result` ist davon ausgenommen.
- `/final` und `/ranked/result` nutzen je nach lokalem Ergebnis Gewinner- oder Verlierer-Sound und stoppen nach 8 Sekunden.
- Vor jedem Trackwechsel wird der aktive Player pausiert. Damit kann immer nur ein Track aktiv sein.
- Hintergrundmusik folgt `musicEnabled`, Ergebnis-Sounds folgen `soundEnabled`. Gespeicherte Einstellungswechsel werden an alle aktiven Nutzer der Settings-Hook-Instanz verteilt.

## Folgen

Neue Audiozustaende werden in `audio-policy.ts` ergaenzt und dort als reine Routenregel getestet. Feature-Screens starten keine eigenen Player, damit die Exklusivitaetsgarantie erhalten bleibt.
