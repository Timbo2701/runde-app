# Wer hat das gesagt? — Implementierungsnotizen

## Spielablauf

1. **Schreibphase**: Alle Spieler schreiben gleichzeitig. Der Zielspieler antwortet ehrlich, alle anderen schreiben Fake-Antworten.
2. **Abstimmungsphase**: Anonym gemischte Antwortkarten. Der Zielspieler sieht einen Warteschirm.
3. **Auflösungsphase**: Echte Antwort wird enthüllt, Punkte vergeben.
4. **Ergebnis**: Gesamtranking nach allen Runden.

## Punktevergabe

| Situation | Punkte |
|---|---|
| Voter rät richtig | +2 |
| Fake-Schreiber täuscht jemanden | +1 pro getäuschter Person |
| Zielspieler überlebt (<50% richtig) | +2 |
| Zielspieler perfekt (0% richtig) | +1 Bonus |

## Anti-Cheat

- Keine Tipp-Indikatoren
- Keine Einreichungsliste (keine "X hat abgestimmt"-Anzeigen)
- Rollenhinweise haben identisches visuelles Gewicht — Außenstehende können Target und Fake-Schreiber nicht unterscheiden
- Zielspieler kann nicht abstimmen
- Spieler können nicht für ihre eigene Fake-Antwort stimmen

## Was ist Mock vs. Real?

### Mock (MVP — ersetzbar mit Supabase Realtime)
- `MOCK_PLAYERS` — werden durch echte Room-Spieler aus dem Lobby-System ersetzt
- Verzögerungen via `setTimeout` — werden durch Realtime-Events ersetzt
- Bot-Stimmen (35% Trefferquote) — werden durch echte Spieler-Abstimmung ersetzt
- Mock-Fake-Antworten für bots — werden durch echte Eingaben ersetzt

### Real (bereits produktionsreif)
- Scoring-Logik (`calcScores`) — vollständig korrekt
- Phasen-Zustandsmaschine — korrekte Struktur, richtige Übergänge
- Anti-Cheat-Logik — greift bereits
- UI-Phasen — vollständig implementiert

## Wie man testet

1. Party-Modus wählen → "Wer hat das gesagt?" auswählen
2. Eine Antwort eingeben → absenden
3. Nach ~2.5s erscheint die Abstimmungsphase automatisch
4. Abstimmen → nach ~1.5s erscheint die Auflösung
5. "Weiter" → nächste Runde, bis alle Runden gespielt sind

## Supabase Realtime Integration (TODO)

```
Wenn echtes Multiplayer gewünscht:
1. Kanal erstellen: `supabase.channel("room:${roomId}:wsi")`
2. Submissions broadcasten statt via setTimeout simulieren
3. Votes broadcasten
4. Phase-Transitions durch Host koordinieren
5. Prompts aus party_questions Tabelle laden (mode = 'who_said_it')
```
