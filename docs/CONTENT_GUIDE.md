# Inhalts-Leitfaden für Runde!

Dieser Leitfaden beschreibt, wie Fragen für die App strukturiert sind, welchen Ton sie haben sollen und wie neue Fragen hinzugefügt werden.

---

## Kategorien

Alle Fragen – sowohl Ranked als auch Party – gehören zu einer dieser 8 Kategorien:

| Kategorie | Beschreibung |
|---|---|
| **Alltag & Menschen** | Alltagswissen, Beziehungen, Verhaltensweisen, soziale Situationen |
| **Internet & Trends** | Memes, Social Media, Influencer, Viral-Momente, Apps |
| **Popkultur** | Musik, Filme, Serien, Stars, Streaming |
| **Wissen & Fakten** | Geografie, Geschichte, Wissenschaft, Natur, Allgemeinbildung |
| **Zahlen & Schätzen** | Statistiken, Maße, Mengenschätzungen, numerische Fakten |
| **Logik & Reaktion** | Schnelle Denksport-Fragen, Muster, einfache Mathe, Reaktion |
| **Food & Lifestyle** | Essen, Trinken, Ernährung, Fitness, Wohnen, Mode |
| **Gaming & Apps** | Videospiele, Mobile Games, E-Sports, Tech-Apps |

---

## Fragetypen

### Ranked-Modus (Mind Clash)

| Typ | Beschreibung | Felder |
|---|---|---|
| `speed_choice` | Multiple-Choice, 4 Antworten, Schnelligkeit zählt | prompt, options (4), correct_answer.index |
| `close_guess` | Zahl schätzen, Nähe zur richtigen Antwort zählt | prompt, numeric_answer, correct_answer.unit, correct_answer.hint |
| `bluff_tap` | 3 Aussagen, nur eine ist wahr – die richtige finden | prompt, options (3), correct_answer.index |

### Party-Modus

| Typ | Beschreibung |
|---|---|
| `klassiker` | "Wer würde am ehesten…" – Gruppenabstimmung |
| `schaetzrunde` | Zahl schätzen, alle raten, Nächster gewinnt |
| `blitz_quiz` | Schnelles Multiple-Choice im Partyformat |
| `bluff` | Kreativprompts ("Erfinde einen Grund, warum…") |
| `zeichen_vote` | Zeichenaufgaben, Gruppe bewertet |

---

## Ton für den Ranked-Modus

- **Fair und messbar**: Jede Frage muss eine objektiv richtige Antwort haben.
- **Keine subjektiven Aussagen**: Kein "Was ist schöner?" oder "Was schmeckt besser?"
- **Kein aktuelles Tagesgeschehen**: Keine Nachrichtenfragen, die sich ändern können.
- **Schwierigkeitsgrade 1–5**: Level 1 ist für alle lösbar, Level 5 ist echter Expertenlevel.
- **Klare Formulierungen**: Fragen müssen auch bei Zeitdruck sofort verstanden werden.
- **Deutsch**: Alle Fragen auf Deutsch, korrekte Grammatik und Rechtschreibung.

---

## Ton für den Party-Modus

- **Locker und gruppenfreundlich**: Fragen, über die man lachen kann.
- **Frech, aber nicht beleidigend**: Witzige Zwickmühlen erlaubt, aber keine Angriffe auf Personen.
- **Inklusiv**: Alle Spieler sollen mitlachen können, niemand soll ausgeschlossen fühlen.
- **Erlebnisorientiert**: Ziel ist Reaktionen und Gelächter, nicht Bildung.

---

## Was vermieden werden muss

- Politische Fragen oder Parteinamen
- Religiöse Inhalte
- Sexuell explizite Inhalte
- Fragen, die Personen oder Gruppen beleidigen oder diskriminieren
- Fragen mit mehreren möglichen richtigen Antworten (für Ranked)
- Fragen, die sich auf aktuelle Ereignisse beziehen und schnell veralten
- Doppelte Prompts

---

## Neue Fragen hinzufügen

### Ranked-Fragen

1. SQL-INSERT in `supabase/seeds/01_ranked_questions_seed.sql` kopieren und anpassen
2. Format prüfen: type, category, prompt, options (JSONB-Array), correct_answer (JSONB-Objekt), numeric_answer (nur bei close_guess), difficulty (1–5), is_active (true)
3. `ON CONFLICT DO NOTHING` am Ende des Inserts nicht vergessen
4. SQL gegen die Supabase-Datenbank ausführen

### Party-Fragen

1. SQL-INSERT in `supabase/seeds/02_party_questions_seed.sql` kopieren und anpassen
2. Tabelle: `party_questions`
3. `ON CONFLICT DO NOTHING` nicht vergessen
4. SQL ausführen

### Qualitätschecks

- Faktencheck für Ranked-Fragen
- Keine Duplikate (Prompts müssen einzigartig sein)
- Schwierigkeitsgrad realistisch wählen
- Party-Fragen: immer jemanden aus der Zielgruppe (18–30) drüberschauen lassen
