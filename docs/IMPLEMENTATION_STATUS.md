# Implementation Status

Stand: 2026-06-29

---

## Was wurde erstellt

### Dokumentation (docs/)
| Datei | Inhalt |
|---|---|
| `CONTENT_GUIDE.md` | Fragestruktur, Kategorien, Typen, Tonregeln |
| `RANKED_QUESTIONS.md` | Mind-Clash-System, Feldübersicht, Beispielfragen |
| `PARTY_QUESTIONS.md` | 5 Party-Modi, Struktur, Grenzen, Beispiele |
| `BOT_MATCHMAKING.md` | Bot-Ligen, Auswahlregeln, Algorithmus, Antwortverhalten |
| `SEEDING_GUIDE.md` | SQL-Dateien, Reihenfolge, Idempotenz, Anleitung |
| `IMPLEMENTATION_STATUS.md` | Diese Datei |

### SQL-Migration (supabase/migrations/)
| Datei | Aktion |
|---|---|
| `add_party_questions.sql` | Erstellt Tabelle `party_questions` mit RLS und Index |

### SQL-Seeds (supabase/seeds/)
| Datei | Inhalt |
|---|---|
| `01_ranked_questions_seed.sql` | 400 Ranked-Fragen |
| `02_party_questions_seed.sql` | 52 Party-Fragen |
| `03_ranked_bots_seed.sql` | 60 Bots (120 INSERTs: profiles + ranked_profiles) |
| `04_content_indexes_optional.sql` | 8 Performance-Indizes |

---

## Fragen-Statistik

### Ranked Questions (400 total)
| Typ | Anzahl | Anteil |
|---|---|---|
| `speed_choice` | 160 | 40% |
| `close_guess` | 140 | 35% |
| `bluff_tap` | 100 | 25% |

### Party Questions (52 total)
| Modus | Anzahl |
|---|---|
| `klassiker` | 12 |
| `schaetzrunde` | 12 |
| `blitz_quiz` | 12 |
| `bluff` | 8 |
| `zeichen_vote` | 8 |

---

## Bots pro Liga

| Liga | Anzahl | IDs | MMR-Bereich | Winrate ca. |
|---|---|---|---|---|
| Bronze | 10 | b0000001–b0000010 | 900–1050 | 38–47% |
| Silver | 10 | b0000011–b0000020 | 1060–1200 | 46–53% |
| Gold | 10 | b0000021–b0000030 | 1260–1400 | 50–57% |
| Neon | 10 | b0000031–b0000040 | 1510–1680 | 55–62% |
| Elite | 10 | b0000041–b0000050 | 1760–1950 | 60–68% |
| Legend | 10 | b0000051–b0000060 | 2080–2500 | 65–75% |

---

## Bot-Matchmaking-Regeln (Zusammenfassung)

1. **Standard**: Bot aus gleicher Liga wie Spieler
2. **Near Promotion** (LP in Division ≥ 160 oder Gesamt-LP ≥ 560): Bots aus nächster Liga, Division 3 hinzufügen
3. **Win Streak ≥ 3**: Bevorzuge stärkere Bots innerhalb der Liga (kleinere Division-Nummer = stärker)
4. **Wiederholungsschutz**: Derselbe Bot nicht direkt zweimal hintereinander
5. **Fallback**: Alle aktiven Bots wenn Pool leer

---

## Betroffene Tabellen

| Tabelle | Aktion |
|---|---|
| `party_questions` | NEU – erstellt durch Migration |
| `ranked_questions` | 400 Fragen hinzugefügt |
| `profiles` | 60 Bot-Profile hinzugefügt |
| `ranked_profiles` | 60 Bot-Ranked-Profile hinzugefügt |

---

## Code-Änderungen

### `src/lib/ranked-logic.ts`
- `getBotResult()` akzeptiert jetzt `botTier: RankTier = "bronze"` Parameter
- Antwortgenauigkeit und -geschwindigkeit skalieren mit dem Tier
- Bronze: 52% accuracy, 1800–3500ms → Legend: 90% accuracy, 350–1100ms

### `src/features/ranked/ranked-match-screen.tsx`
- Beide `getBotResult()`-Aufrufe übergeben jetzt `opponent?.tier ?? "bronze"`
- Bots spielen nun ihrem Rang entsprechend stark

### `src/features/ranked/ranked-queue-screen.tsx`
- Neue `selectBot()` Funktion für intelligente Bot-Auswahl
- Berücksichtigt: Tier, Near-Promotion, Win-Streak, Wiederholungsschutz
- `lastOpponentIdRef` verhindert direkten Rückkampf gegen denselben Bot

### `src/services/supabase-data.ts`
- Neuer Typ `PartyQuestion` exportiert
- Neue Funktion `fetchPartyQuestions(mode, limit)` – lädt aus Supabase, shuffled client-side

### `src/lib/supabase-hooks.ts`
- Neuer Hook `usePartyQuestions(mode)` für Party-Modi

---

## Was noch Mock ist

| Feature | Status |
|---|---|
| Shop / Cosmetics-Kauf | Mock – keine Zahlungslogik |
| Party-Modus Fragenquelle | Fragen kommen noch aus Props (parent component) – `usePartyQuestions` ist bereit aber nicht eingebunden |
| Echtzeit-Multiplayer | Kein echter Gegner – alles Simulation gegen Bots |
| Leaderboard | Real (Supabase) aber nur Bots und eigener Account |

---

## Offene TODOs

- [ ] Party-Modi auf `usePartyQuestions(mode)` umstellen wenn bereit
- [ ] Win/Loss-Streak aus Match-History für Lose-Streak-Erkennung berechnen (aktuell nur winStreak aus DB)
- [ ] Bot-Antwort-Timing visuell in der UI anzeigen
- [ ] Bots in Leaderboard optional ausblenden
- [ ] Saison-Rotation: Bots sollten LP am Saisonende zurücksetzen
