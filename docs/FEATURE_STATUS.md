# Feature-Status: Runde! App

Stand: 2026-06-28

---

## ✅ ECHT FUNKTIONIEREND (keine Platzhalter)

| Feature | Datei(en) | Hinweis |
|---|---|---|
| Onboarding (4 Slides) | `app/onboarding.tsx`, `src/features/onboarding/` | Vollständig |
| Setup / Profil anlegen | `src/features/setup/setup-screen.tsx` | Name, Foto (lokal), E-Mail gespeichert |
| Profil-Persistenz | `src/lib/profile-context.tsx` | AsyncStorage lokal |
| Home Screen | `src/features/home/home-screen.tsx` | Navigation, Room-Code-Erstellung |
| Modus-Auswahl | `src/features/mode-select/mode-select-screen.tsx` | Klassiker/Schätzrunde/Blitz-Quiz aktiv |
| Lobby (Room-Code-System) | `src/features/lobby/lobby-screen.tsx`, `src/lib/room.ts` | Mock-Multiplayer mit 1P + Bot |
| Klassiker spielen | `src/features/play/modes/klassiker-play.tsx` | 5 Runden, Bot wählt zufällig |
| Schätzrunde spielen | `src/features/play/modes/schaetz-play.tsx` | Bot schätzt mit Toleranz |
| Blitz-Quiz spielen | `src/features/play/modes/quiz-play.tsx` | Bot richtig 60%, falsch 40% |
| Bluff-Modus spielen | `src/features/play/modes/bluff-play.tsx` | 2-Phasen (Write + Vote) |
| Klassiker-Result | `src/features/results/modes/klassiker-result.tsx` | Voting-Ergebnis, Tie-Screen |
| Schätzrunde-Result | `src/features/results/modes/schaetz-result.tsx` | Abstand, Rang, Punkte |
| Blitz-Quiz-Result | `src/features/results/modes/quiz-result.tsx` | Richtig/Falsch, korrekte Antwort |
| Bluff-Reveal | `src/features/results/modes/bluff-result.tsx` | Alle Fallen, Punkte-Erklärung |
| Final-Screen | `src/features/final/final-screen.tsx` | Rangliste, Krone, Confetti, Haptics |
| Scoring-Logik | `src/lib/scoring.ts` | Klassiker/Schätz/Quiz/Bluff/Final |
| Achievements (UI) | `src/features/profile/profile-screen.tsx`, `src/data/achievements.ts` | Darstellung + Fortschritt |
| Profil-Screen | `src/features/profile/profile-screen.tsx` | Stats, Achievements, Tabs |
| Settings (UI) | Tab in Profil-Screen | Toggle-UI |
| Shop-Screen (UI) | `src/features/shop/shop-screen.tsx` | Vollständige UI, Kategorie-Filter |
| Reduced-Motion-Support | `src/lib/use-reduced-motion.ts` | Alle Screens respektieren es |

---

## 🟡 MOCK / PLATZHALTER (UI vorhanden, Funktion vorbereitet)

| Feature | Datei(en) | Was fehlt |
|---|---|---|
| **E-Mail-Konto-Sync** | `setup-screen.tsx` | Kein Backend — UI gespeichert, aber keine Authentifizierung |
| **Multiplayer (echte Spieler)** | `lobby-screen.tsx`, `play-screen.tsx` | Bot = Mika (lokal). Echtes Multiplayer braucht WebSocket/Server |
| **Shop-Käufe** | `src/features/shop/shop-screen.tsx`, `src/data/shop-items.ts` | `onPress={() => {}}` — kein echter Kauf. Braucht StoreKit / Google Play Billing |
| **Host Pass** | Shop-Screen | Funktion vorbereitet, kein echter IAP |
| **Premium-Modi entsperren** | `src/data/game-modes.ts` | `isPremiumPlaceholder: true` für Bluff/Zeichen-Vote |
| **Achievements freischalten** | `src/data/achievements.ts` | Statische Mock-Daten, kein Runtime-Tracking |
| **Winner FX / Gewinner-Effekte** | `src/features/final/final-screen.tsx` | Confetti ist echt; Kosmetik-Effekte im Shop noch nicht verknüpft |
| **Kosmetik (Badge, Titel, Frame)** | `src/lib/profile-context.tsx` | Felder existieren in State, kein UI zum Equip |
| **Settings-Toggles** | Profil-Screen, Einstellungen-Tab | Musik/Sound/Vibration togglen im State, aber keine echte Audio-Integration |
| **Runden-Statistik** | `ProfileContext: roundsPlayed, wins` | Felder existieren, werden aber noch nicht beim Spielen automatisch erhöht |
| **Freunde einladen** | Profil-Screen, Share-Button | `Share.share()` API vorhanden, aber kein Deep-Link-System |
| **Zeichen-Vote-Modus** | `src/data/game-modes.ts` | `comingSoon: true`, keine Play/Result-Implementierung |
| **Reihenfolge-Modus** | `src/data/game-modes.ts` | `comingSoon: true`, keine Implementierung |
| **Dark Party Theme** | Shop: `dark_party_theme` | `comingSoon: true` |

---

## 🔴 BEWUSST NICHT IMPLEMENTIERT (laut Monetization Rules)

- Keine echte StoreKit- / Google Play Billing-Integration
- Kein RevenueCat / react-native-purchases
- Kein Apple Pay für digitale Güter
- Keine Pay-to-Win-Mechaniken
- Keine gekauften Spielvorteile (Punkte, Zusatzzeit, Extra-Stimmen)
- Kein echtes Backend / Authentifizierungs-System

Siehe: `docs/MONETIZATION_RULES.md`

---

## Nächste technische TODOs (nach aktuellem Stand)

1. **Runden-Statistik automatisch tracken** — in `play-screen.tsx` nach jedem Spiel `roundsPlayed++` / `wins++` aufrufen
2. **Achievements Runtime-Tracking** — Events beim Spielen prüfen, Achievement-State in AsyncStorage persistieren
3. **Deep Links** — Expo Router + Branch.io / eigener Server für "Raum beitreten"-Links
4. **Echtes Multiplayer** — WebSocket-Server (z.B. Supabase Realtime, Ably, Liveblocks)
5. **IAP-Integration** — StoreKit 2 (iOS) + Google Play Billing (Android), empfohlen über RevenueCat
6. **Kosmetik-Equip-UI** — Screen zum Ausrüsten von Badge/Titel/Winner-Effect
7. **Audio-Integration** — expo-av für Musik/Soundeffekte
