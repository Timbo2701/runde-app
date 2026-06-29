# Ranked-Fragen – Mind Clash System

## Das Mind Clash System

Mind Clash ist der Kern des Ranked-Modus. Pro Match werden 3 Runden gespielt, je eine pro Fragetyp (in zufälliger Reihenfolge). Jede Runde testet eine andere Fähigkeit: Geschwindigkeit, Schätzgenauigkeit oder kritisches Denken.

---

## Die 3 Fragetypen

### 1. Speed Choice (`speed_choice`)

**Was es ist:** Multiple-Choice mit 4 Antwortoptionen. Schnelligkeit und Korrektheit zählen.

**Punktevergabe:**
- Richtig + schnell (< 2s): 5 Punkte
- Richtig + mittel (< 5s): 4 Punkte
- Richtig + langsam: 3 Punkte
- Falsch: 0 Punkte

**Felder:**
| Feld | Typ | Beschreibung |
|---|---|---|
| `type` | text | `'speed_choice'` |
| `category` | text | Eine der 8 Kategorien |
| `prompt` | text | Die Frage |
| `options` | jsonb | Array mit 4 Strings (Antwortoptionen) |
| `correct_answer` | jsonb | `{"index": 0}` – Index der richtigen Option (0-basiert) |
| `difficulty` | integer | 1–5 |

### 2. Close Guess (`close_guess`)

**Was es ist:** Eine Zahl schätzen. Je näher, desto mehr Punkte.

**Punktevergabe:**
- Exakt: 5 Punkte
- ≤ 3% Abweichung: 4 Punkte
- ≤ 10% Abweichung: 3 Punkte
- ≤ 25% Abweichung: 2 Punkte
- ≤ 50% Abweichung: 1 Punkt
- > 50% Abweichung: 0 Punkte

**Felder:**
| Feld | Typ | Beschreibung |
|---|---|---|
| `type` | text | `'close_guess'` |
| `category` | text | Eine der 8 Kategorien |
| `prompt` | text | Die Schätzfrage |
| `options` | jsonb | `null` |
| `correct_answer` | jsonb | `{"unit": "km", "hint": "optional"}` |
| `numeric_answer` | numeric | Die korrekte Zahl |
| `difficulty` | integer | 1–5 |

### 3. Bluff Tap (`bluff_tap`)

**Was es ist:** 3 Aussagen – nur eine ist wahr. Die wahre finden.

**Punktevergabe:**
- Richtig: 3 Punkte
- Falsch: 0 Punkte

**Felder:**
| Feld | Typ | Beschreibung |
|---|---|---|
| `type` | text | `'bluff_tap'` |
| `category` | text | Eine der 8 Kategorien |
| `prompt` | text | Die Frageeinleitung |
| `options` | jsonb | Array mit 3 Strings (Aussagen) |
| `correct_answer` | jsonb | `{"index": 0}` – Index der wahren Aussage |
| `difficulty` | integer | 1–5 |

---

## Kategorienübersicht

| Kategorie | Geeignete Typen | Anteil |
|---|---|---|
| Alltag & Menschen | speed_choice, bluff_tap | ~12% |
| Internet & Trends | speed_choice, bluff_tap | ~10% |
| Popkultur | speed_choice, bluff_tap | ~12% |
| Wissen & Fakten | speed_choice, bluff_tap | ~15% |
| Zahlen & Schätzen | close_guess | ~20% |
| Logik & Reaktion | speed_choice | ~10% |
| Food & Lifestyle | speed_choice, close_guess, bluff_tap | ~11% |
| Gaming & Apps | speed_choice, bluff_tap | ~10% |

---

## Schwierigkeitsgrade 1–5

| Level | Zielgruppe | Beispiel |
|---|---|---|
| 1 | Jeder weiß das | "Welche Farbe hat eine reife Banane?" |
| 2 | Allgemeinwissen | "Wie viele Planeten hat das Sonnensystem?" |
| 3 | Mittelfeld | "Was ist die Hauptstadt von Australien?" |
| 4 | Wissensfan | "In welchem Jahr wurde das WWW erfunden?" |
| 5 | Experte | "Wie viele Knochen hat ein erwachsener Mensch?" |

---

## Balancing-Regeln

- Mindestens 40% der Fragen haben Difficulty ≤ 2 (damit neue Spieler Spaß haben)
- Maximal 15% haben Difficulty 5
- Keine Kategorie darf mehr als 20% aller Fragen ausmachen
- Alle 3 Typen müssen ausgewogen verteilt sein (grob 40/35/25)
- Keine Duplikate (gleicher Prompt zweimal = verboten)

---

## Beispielfragen

### Speed Choice (3 Beispiele)

```sql
-- Difficulty 1
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('speed_choice', 'Wissen & Fakten', 'Wie viele Seiten hat ein Würfel?',
  '["4","6","8","12"]', '{"index": 1}', 1, true) ON CONFLICT DO NOTHING;

-- Difficulty 3
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('speed_choice', 'Wissen & Fakten', 'Welche Stadt ist die Hauptstadt von Australien?',
  '["Sydney","Melbourne","Canberra","Brisbane"]', '{"index": 2}', 3, true) ON CONFLICT DO NOTHING;

-- Difficulty 4
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('speed_choice', 'Internet & Trends', 'Welche Plattform hat TikTok 2016 aufgekauft?',
  '["Vine","Musical.ly","Dubsmash","Triller"]', '{"index": 1}', 4, true) ON CONFLICT DO NOTHING;
```

### Close Guess (3 Beispiele)

```sql
-- Difficulty 1
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, numeric_answer, difficulty, is_active)
VALUES ('close_guess', 'Zahlen & Schätzen', 'Wie viele Minuten hat ein Tag?',
  null, '{"unit": "Minuten", "hint": "24 Stunden × 60"}', 1440, 1, true) ON CONFLICT DO NOTHING;

-- Difficulty 3
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, numeric_answer, difficulty, is_active)
VALUES ('close_guess', 'Zahlen & Schätzen', 'Wie hoch ist der Eiffelturm in Metern?',
  null, '{"unit": "Meter", "hint": "Wahrzeichen von Paris"}', 330, 3, true) ON CONFLICT DO NOTHING;

-- Difficulty 5
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, numeric_answer, difficulty, is_active)
VALUES ('close_guess', 'Wissen & Fakten', 'Wie viele Knochen hat ein erwachsener Mensch?',
  null, '{"unit": "Knochen", "hint": "Ungefähr 200"}', 206, 5, true) ON CONFLICT DO NOTHING;
```

### Bluff Tap (3 Beispiele)

```sql
-- Difficulty 2
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('bluff_tap', 'Wissen & Fakten', 'Welche Aussage über Oktopusse stimmt?',
  '["Ein Oktopus hat drei Herzen.","Ein Oktopus hat ein Herz.","Ein Oktopus hat fünf Herzen."]',
  '{"index": 0}', 2, true) ON CONFLICT DO NOTHING;

-- Difficulty 3
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('bluff_tap', 'Food & Lifestyle', 'Welche Aussage über Avocados stimmt?',
  '["Avocados sind botanisch gesehen Beeren.","Avocados gehören zur Familie der Rosen.","Avocados wachsen unter der Erde."]',
  '{"index": 0}', 3, true) ON CONFLICT DO NOTHING;

-- Difficulty 4
INSERT INTO ranked_questions (type, category, prompt, options, correct_answer, difficulty, is_active)
VALUES ('bluff_tap', 'Gaming & Apps', 'Welche Aussage über Minecraft stimmt?',
  '["Minecraft ist das meistverkaufte Videospiel aller Zeiten.","Minecraft wurde 2005 veröffentlicht.","Minecraft wurde ursprünglich von EA entwickelt."]',
  '{"index": 0}', 4, true) ON CONFLICT DO NOTHING;
```
