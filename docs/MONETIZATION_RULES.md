# Monetarisierungsregeln — Runde!

> Stand: Mock-only. Keine echten Käufe implementiert.

---

## Fairness-Regeln (absolut, niemals brechen)

- **Kein Pay-to-Win.** Käufe dürfen niemals einen spielerischen Vorteil geben.
- **Keine Punkte-Booster.** Punkte werden nur durch Spielen verdient.
- **Keine Extra-Stimmen.** Abstimmungen sind immer 1 Stimme pro Person.
- **Keine Zusatzzeit.** Timer laufen für alle Spieler gleich.
- **Keine kompetitiven Vorteile durch Geld.** Wer mehr bezahlt, gewinnt nicht häufiger.

## Was darf man kaufen?

| Kategorie | Erlaubt |
|---|---|
| Werbung entfernen | ✅ (Non-Consumable) |
| Kosmetik (Rahmen, Krone, Badges) | ✅ (rein visuell) |
| Content-Pakete (Fragenpakete) | ✅ (mehr Inhalte, kein Vorteil) |
| Host Pass (Gruppenkomfort) | ✅ (Gruppe spielt kostenlos mit) |
| Punkte / Stimmen / Zeitvorteil | ❌ VERBOTEN |

---

## Mock-Hinweis

Alle Preise, Buttons und Produkte im Shop sind **Platzhalter**.
Es werden **keine echten Zahlungen ausgelöst**.
Buttons heißen bewusst "Freischalten", "Bald verfügbar" oder "Im Store bestätigen"
und lösen in der aktuellen Implementierung keine Transaktion aus.

---

## Spätere echte IAP-Integration

### iOS
- **App Store In-App Purchase** (StoreKit 2 / StoreKit 1)
- **Kein Apple Pay für digitale Güter** (verstößt gegen App Store Review Guidelines 3.1.1)
- Empfehlung: **RevenueCat** SDK für Cross-Platform-Management

### Android
- **Google Play Billing Library**
- Empfehlung: **RevenueCat** SDK für Cross-Platform-Management

### Cross-Platform
- **RevenueCat** (revenuecat.com) — empfohlen für Subscription + Entitlement Management
- Alternative: **react-native-purchases** (RevenueCat offizieller RN-Client)
- Kein `react-native-iap` direkt, wenn möglich (mehr Aufwand, weniger Abstraktion)

### Produkttypen
| Produkt | StoreKit-Typ | Play-Typ |
|---|---|---|
| Werbung entfernen | Non-Consumable | One-time product |
| Kosmetik-Items | Non-Consumable | One-time product |
| Fragenpakete | Non-Consumable | One-time product |
| Host Pass (dauerhaft) | Non-Consumable | One-time product |
| Premium-Monatsabo | Auto-Renewable Subscription | Subscription |

---

## Achievements & kostenlose Kosmetik

Ausgewählte Kosmetik-Items können durch **Achievements** freigeschaltet werden.
Diese sind **komplett kostenlos** und fördern Engagement ohne Paywall.
Siehe: `src/data/achievements.ts`

---

## Offene TODOs für echte IAP

- [ ] RevenueCat SDK installieren (`react-native-purchases`)
- [ ] App Store Connect: Produkte anlegen (Product IDs in `src/data/shop-items.ts` hinterlegen)
- [ ] Google Play Console: Produkte anlegen
- [ ] `MockPurchaseState` durch echte Entitlement-Checks ersetzen
- [ ] Receipt Validation serverseitig (oder über RevenueCat)
- [ ] Restore Purchases Button im Shop hinzufügen
- [ ] Datenschutz-Hinweis / Privacy Policy aktualisieren
- [ ] Age-Gating prüfen (unter 13: keine IAP)
