# Party-Fragen – Leitfaden

Der Party-Modus ist für Gruppen ausgelegt. Spaß und Reaktionen stehen über Bildung. Die Fragen sollen Gespräche auslösen, Menschen zum Lachen bringen und unvergessliche Momente schaffen.

---

## Die 5 Party-Modi

### 1. Klassiker (`klassiker`)

**Was es ist:** "Wer würde am ehesten…"-Fragen. Die Gruppe stimmt ab, wer am ehesten zutrifft.

**Struktur:**
- `mode`: `'klassiker'`
- `prompt`: Eine "Wer würde am ehesten…"-Frage
- `options`: null (keine vorgegebenen Optionen – die Gruppe wählt aus ihren Mitgliedern)
- `correct_answer`: null (keine objektiv richtige Antwort)

**Ton:**
- Frech und witzig, aber immer liebevoll
- Niemanden erniedrigen oder beleidigen
- Situationen aus dem echten Leben: Schule, Party, Urlaub, Arbeit

**Beispiele:**
- "Wer würde am ehesten versehentlich die falsche Person anschreiben?"
- "Wer würde am ehesten eine Diät anfangen und nach einem Tag aufgeben?"
- "Wer würde am ehesten im Urlaub einen Sonnenbrand bekommen?"

---

### 2. Schätzrunde (`schaetzrunde`)

**Was es ist:** Alle schätzen eine Zahl. Wer am nächsten liegt, gewinnt.

**Struktur:**
- `mode`: `'schaetzrunde'`
- `prompt`: Eine Schätzfrage
- `numeric_answer`: Die korrekte Antwort
- `correct_answer`: `{"unit": "km"}` oder ähnlich mit Einheit

**Ton:**
- Zahlen, die niemand auswendig kennt
- Aber nicht zu absurd (kein "Wie viele Atome hat die Erde?")
- Alltagsbezug hilft: Preise, Entfernungen, Verbrauch

**Beispiele:**
- "Wie viel kostet ein Big Mac in der Schweiz in CHF?"
- "Wie viele Kilometer ist die längste Autobahn der Welt?"
- "Wie viele Liter Wasser verbraucht ein Mensch durchschnittlich pro Tag?"

---

### 3. Blitz-Quiz (`blitz_quiz`)

**Was es ist:** Schnelles Multiple-Choice im Partyformat. Kurze Fragen, 4 Antworten, Tempo zählt.

**Struktur:**
- `mode`: `'blitz_quiz'`
- `prompt`: Eine kurze, klare Frage
- `options`: Array mit 4 Antwortoptionen
- `correct_answer`: `{"index": 0}` (0-basierter Index)

**Ton:**
- Popkultur und Allgemeinwissen
- Humor ist erlaubt, aber die Fragen müssen eine klare richtige Antwort haben
- Gut für alle Altersgruppen

**Beispiele:**
- "Welche Farbe hat die App Instagram?"
- "Wie heißt die Hauptfigur in 'Squid Game'?"
- "Was bedeutet 'lol' im Internet-Slang?"

---

### 4. Bluff (`bluff`)

**Was es ist:** Kreativprompts. Jeder erfindet eine Antwort, die Gruppe stimmt ab, wer am besten war.

**Struktur:**
- `mode`: `'bluff'`
- `prompt`: Ein Kreativprompt ("Erfinde...", "Was würde X sagen wenn…", "Beschreibe…")
- `options`: null
- `correct_answer`: null (keine richtige Antwort – die Gruppe entscheidet)

**Ton:**
- Absurder Humor erlaubt
- Keine politischen oder religiösen Themen
- Soll zum Nachdenken und Lachen einladen

**Beispiele:**
- "Erfinde eine neue Ausrede, warum du zu spät zur Arbeit kommst."
- "Erkläre Netflix als wäre es ein Gericht, das man bestellt."
- "Erfinde einen Werbespruch für Socken."

---

### 5. Zeichen-Vote (`zeichen_vote`)

**Was es ist:** Jemand zeichnet etwas (auf Papier oder Bildschirm), die Gruppe rät oder bewertet.

**Struktur:**
- `mode`: `'zeichen_vote'`
- `prompt`: Eine Zeichenaufgabe ("Zeichne…")
- `options`: null
- `correct_answer`: null (Gruppe bewertet)

**Ton:**
- Einfache, erkennbare Motive
- Auch für zeichnerische Laien machbar (30 Sekunden)
- Lustige Herausforderungen, kein Kunstunterricht

**Beispiele:**
- "Zeichne einen Pinguin, der surft."
- "Zeichne die Mona Lisa in 10 Sekunden."
- "Zeichne dein Lieblingsessen so, dass andere es erraten können."

---

## Grenzen – Was nicht erlaubt ist

- Sexuell explizite Inhalte
- Politische Parteien oder Persönlichkeiten
- Religiöse Glaubensfragen
- Beleidigungen gegen echte Personen oder Gruppen
- Inhalte, die Minderjährige in unangemessene Situationen bringen
- Fragen, die Alkohol- oder Drogenkonsum verherrlichen
- Anything dangerous or illegal

---

## Qualitätschecks

1. Würde jemand bei dieser Frage das Handy weglegen? → Zu langweilig. Neu schreiben.
2. Würde sich jemand unwohl fühlen? → Zu weit gegangen. Entfernen.
3. Kann die Gruppe ohne Erklärbedarf sofort loslegen? → Gut.
