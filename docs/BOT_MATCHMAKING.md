# Bot-Matchmaking – Dokumentation

## Überblick

Im Ranked-Modus treten Spieler gegen KI-Bots an. Jeder Bot hat eine Liga (Tier) und verhält sich entsprechend – stärkere Bots antworten schneller und häufiger richtig.

---

## Bot-Ligen

### Bronze
- **Accuracy:** 45–60%
- **Response Time:** 1800–3500ms
- **Spielerprofil:** Einsteiger, lernen gerade die Spielmechaniken

### Silver
- **Accuracy:** 55–68%
- **Response Time:** 1300–2800ms
- **Spielerprofil:** Grundkenntnis vorhanden, aber noch unregelmäßig

### Gold
- **Accuracy:** 65–75%
- **Response Time:** 900–2200ms
- **Spielerprofil:** Solide Spieler, kennen die meisten Kategorien

### Neon
- **Accuracy:** 72–82%
- **Response Time:** 700–1700ms
- **Spielerprofil:** Erfahren und schnell, kennen viele Tricks

### Elite
- **Accuracy:** 80–88%
- **Response Time:** 500–1400ms
- **Spielerprofil:** Top-Spieler, sehr zuverlässig

### Legend
- **Accuracy:** 86–94%
- **Response Time:** 350–1100ms
- **Spielerprofil:** Höchste Stufe, fast fehlerlos und blitzschnell

---

## Auswahlregeln

### Standardregel
- Spieler bekommt einen Bot aus der **gleichen Liga**
- Zufällige Auswahl aus allen Bots der Liga

### Nahe-Aufstieg-Regel (Near Promotion)
- Wenn der Spieler **≥ 80% LP einer Division** hat (LP in Division ≥ 160 von 200), oder
- Wenn der Spieler in den letzten 40 LP der gesamten Liga ist (LP ≥ 560 im Tier)
- → Bots der **nächsthöheren Liga, Division 3** werden in den Pool aufgenommen

### Streak-Anpassungen

**Win-Streak (≥ 3 Siege in Folge):**
- Bevorzuge Bots aus derselben oder höheren Division (weniger LP-Unterschied)
- Damit der Spieler herausgefordert bleibt

**Loss-Streak (≥ 3 Niederlagen in Folge):**
- Bevorzuge Bots aus der niedrigsten Division der aktuellen Liga
- Damit der Spieler wieder in Fahrt kommt

### Wiederholungsvermeidung
- Derselbe Bot wird **nicht direkt im nächsten Match** verwendet (wenn möglich)
- Die App speichert `lastOpponentId` als State
- Falls der Pool nur einen Bot enthält, wird der Wiederholungsschutz aufgehoben

### Fallback
- Wenn kein Bot aus der bevorzugten Liga verfügbar ist, wird aus allen aktiven Bots gewählt

---

## Bot-Auswahl-Algorithmus (TypeScript)

```typescript
function selectBot(
  bots: RankedOpponent[],
  profile: RankedProfile,
  lastOpponentId: string | null
): RankedOpponent {
  const TIER_ORDER = ["bronze", "silver", "gold", "neon", "elite", "legend"];
  const tierIdx = TIER_ORDER.indexOf(profile.tier);
  const lpInDiv = profile.lp % 200;
  const nearPromotion = lpInDiv >= 160 || profile.lp >= 560;
  const onWinStreak = profile.winStreak >= 3;

  // Basis-Pool: gleiche Liga
  let candidates = bots.filter(b => b.tier === profile.tier);

  // Near-Promotion: nächste Liga, Division 3 hinzufügen
  if (nearPromotion && tierIdx < TIER_ORDER.length - 1) {
    const nextTier = TIER_ORDER[tierIdx + 1];
    const nextTierBots = bots.filter(b => b.tier === nextTier && b.division === 3);
    candidates = [...candidates, ...nextTierBots];
  }

  // Win-Streak: stärkere Bots bevorzugen
  if (onWinStreak) {
    const stronger = candidates.filter(b => 
      b.tier === profile.tier && b.division <= profile.division
    );
    if (stronger.length > 0) candidates = stronger;
  }

  // Wiederholung vermeiden
  const noRepeat = candidates.filter(b => b.id !== lastOpponentId);
  const pool = noRepeat.length > 0 ? noRepeat : candidates;

  // Fallback: alle Bots
  if (pool.length === 0) return bots[Math.floor(Math.random() * bots.length)];

  return pool[Math.floor(Math.random() * pool.length)];
}
```

---

## Bot-Antwortverhalten nach Liga

Die Funktion `getBotResult()` in `src/lib/ranked-logic.ts` akzeptiert einen `botTier`-Parameter:

```typescript
const tierConfig = {
  bronze: { accuracy: 0.52, minMs: 1800, maxMs: 3500 },
  silver: { accuracy: 0.62, minMs: 1300, maxMs: 2800 },
  gold:   { accuracy: 0.70, minMs: 900,  maxMs: 2200 },
  neon:   { accuracy: 0.77, minMs: 700,  maxMs: 1700 },
  elite:  { accuracy: 0.84, minMs: 500,  maxMs: 1400 },
  legend: { accuracy: 0.90, minMs: 350,  maxMs: 1100 },
};
```

- **accuracy**: Wahrscheinlichkeit einer richtigen Antwort
- **minMs / maxMs**: Antwortzeit in Millisekunden (zufällig im Bereich)

---

## Tabellen

| Tabelle | Relevanz |
|---|---|
| `profiles` | Bot-Profil (is_bot = true) |
| `ranked_profiles` | Bot-Ranked-Stats (tier, division, lp, mmr) |
| `seasons` | Aktive Season (is_active = true) |

---

## Datenfluss

1. `fetchRankedBots()` lädt alle `profiles` mit `is_bot = true` + aktiver Season
2. `ranked-queue-screen.tsx` filtert nach Tier und Regeln
3. `selectBot()` wählt den finalen Gegner
4. Opponent-ID wird als Route-Parameter an `ranked-match-screen.tsx` übergeben
5. `getBotResult(roundType, correctNumber, opponent.tier)` simuliert Bot-Antworten
