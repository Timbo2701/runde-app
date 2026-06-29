# Seeding Guide – Supabase-Daten

Dieser Leitfaden erklärt, welche SQL-Dateien in welcher Reihenfolge ausgeführt werden müssen und was jede Datei tut.

---

## Ausführungsreihenfolge

Alle Dateien müssen über das Supabase SQL-Dashboard (oder die CLI) ausgeführt werden.

```
1. supabase/migrations/add_party_questions.sql  ← erst Migration, dann Seeds
2. supabase/seeds/01_ranked_questions_seed.sql
3. supabase/seeds/02_party_questions_seed.sql
4. supabase/seeds/03_ranked_bots_seed.sql
5. supabase/seeds/04_content_indexes_optional.sql  ← optional, aber empfohlen
```

---

## Was jede Datei tut

### `migrations/add_party_questions.sql`
- Erstellt die Tabelle `party_questions` (falls nicht vorhanden)
- Aktiviert Row Level Security (RLS) auf der Tabelle
- Erstellt eine Policy: öffentlich lesbar
- Erstellt einen Index auf `mode` (nur aktive Fragen)
- **Muss vor den Seeds ausgeführt werden**

### `seeds/01_ranked_questions_seed.sql`
- Fügt 400 Ranked-Fragen in die Tabelle `ranked_questions` ein
- Verteilung: 160 speed_choice, 140 close_guess, 100 bluff_tap
- 8 Kategorien, Difficulty 1–5 gemischt
- **Idempotent:** `ON CONFLICT DO NOTHING` – keine Fehler bei Wiederholung

### `seeds/02_party_questions_seed.sql`
- Fügt 50+ Party-Fragen in die Tabelle `party_questions` ein
- 5 Modi: klassiker (12), schaetzrunde (12), blitz_quiz (12), bluff (8), zeichen_vote (8)
- **Idempotent:** `ON CONFLICT DO NOTHING`

### `seeds/03_ranked_bots_seed.sql`
- Erstellt 60 Bot-Profile: 10 pro Liga (Bronze bis Legend)
- Jeder Bot: 1 INSERT in `profiles` + 1 INSERT in `ranked_profiles`
- Bots sind mit der **aktiven Season** verknüpft (via Subquery)
- **Idempotent:** `ON CONFLICT DO UPDATE` – aktualisiert bestehende Bots

### `seeds/04_content_indexes_optional.sql`
- Fügt Performance-Indizes hinzu
- Beschleunigt Abfragen nach `type`, `category`, `is_bot`
- **Sicher mehrfach ausführen** (`CREATE INDEX IF NOT EXISTS`)

---

## Idempotenz

Alle Seed-Dateien können **mehrfach ausgeführt werden** ohne Fehler oder Datenverdoppelung:

- `ON CONFLICT DO NOTHING` → überspringt vorhandene Einträge
- `ON CONFLICT DO UPDATE` → aktualisiert vorhandene Einträge (bei Bots)
- `CREATE TABLE IF NOT EXISTS` → erstellt Tabelle nur wenn nötig
- `CREATE INDEX IF NOT EXISTS` → erstellt Index nur wenn nötig

---

## Neue Bots hinzufügen

1. Wähle eine noch unbenutzte UUID (Format: `b00000XX-0000-4000-8000-000000000XXX`)
2. Kopiere das INSERT-Pattern aus `03_ranked_bots_seed.sql`
3. Setze `rank_tier`, `division`, `lp`, `mmr`, `wins`, `losses` passend zur Liga
4. Führe nur das neue INSERT aus (oder die gesamte Datei – sie ist idempotent)

## Neue Ranked-Fragen hinzufügen

1. Kopiere das passende INSERT-Pattern aus `01_ranked_questions_seed.sql`
2. Prüfe: Ist der Prompt wirklich einzigartig?
3. Prüfe: Stimmt die `correct_answer` (Index bei speed_choice/bluff_tap, Zahl bei close_guess)?
4. Führe das INSERT aus

## Neue Party-Fragen hinzufügen

1. Kopiere das passende INSERT-Pattern aus `02_party_questions_seed.sql`
2. Wähle den richtigen Mode (`klassiker`, `schaetzrunde`, `blitz_quiz`, `bluff`, `zeichen_vote`)
3. Führe das INSERT aus

---

## Betroffene Tabellen

| Tabelle | Seed-Datei | Aktion |
|---|---|---|
| `party_questions` | migration + 02 | CREATE TABLE + INSERT |
| `ranked_questions` | 01 | INSERT |
| `profiles` | 03 | INSERT (Bots) |
| `ranked_profiles` | 03 | INSERT (Bot-Stats) |

---

## Supabase SQL-Dashboard

1. Öffne https://app.supabase.com → dein Projekt → **SQL Editor**
2. Klicke "New query"
3. Füge den Inhalt der SQL-Datei ein
4. Klicke "Run"
5. Prüfe Output: `INSERT 0 N` bedeutet erfolgreich

---

## Voraussetzungen

Folgende Tabellen müssen bereits existieren (werden von den Supabase-Migrations erstellt, nicht von diesen Seeds):
- `profiles`
- `ranked_profiles`
- `ranked_questions`
- `seasons` (mit mindestens einer aktiven Season: `is_active = true`)
