# Supabase-Setup für Runde!

## 1. Datenbank anlegen

1. Ein Supabase-Projekt erstellen.
2. Den gesamten Inhalt von `supabase/schema.sql` im Supabase SQL Editor ausführen.
3. Unter Authentication die gewünschte E-Mail-Bestätigung konfigurieren.

Das Schema legt Tabellen, Indizes, RLS-Policies, Bootstrap-Trigger, Ranked-RPCs und Seed-Daten an. Wiederholtes Ausführen aktualisiert Seeds und Funktionen, ohne Anwendungstabellen zu löschen. Nach diesem Codemagic-Fix muss es einmal erneut ausgeführt werden, damit `client_submission_id` und die aktuelle Ranked-RPC-Signatur verfügbar sind.

## 2. Expo-Variablen

`.env.example` nach `.env` kopieren und lokal befüllen:

```text
EXPO_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Für ältere Projekte wird zusätzlich `EXPO_PUBLIC_SUPABASE_ANON_KEY` unterstützt. Niemals `service_role`, Secret Keys oder Datenbankpasswörter in Expo-Variablen schreiben: `EXPO_PUBLIC_*` ist im App-Bundle sichtbar.

## 3. Datenquellen

Mit konfiguriertem Supabase kommen folgende Daten aus der Datenbank:

- Auth-Session, Profil und Setup-Status
- Einstellungen und Profil-Stats
- Ranked-Profil, Bots, Fragen, Matches und Runden
- Rangliste
- Achievements und Fortschritt
- Tagesmissionen
- Neon-Pass-Fortschritt
- Cosmetic Ownership und Auswahl

Ohne Keys zeigt die App einen Konfigurationsfehler. Persistente Produktdaten werden nicht durch lokale Demo-Werte ersetzt.

## 4. Codemagic / IPA

1. In Codemagic die App öffnen und unter **Environment variables** eine Gruppe `supabase` anlegen.
2. `EXPO_PUBLIC_SUPABASE_URL` und `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aus der lokalen `.env` in diese Gruppe übernehmen. Alternativ wird der Legacy-Anon-Key unterstützt.
3. Die Gruppe muss exakt `supabase` heißen, weil `codemagic.yaml` sie im iOS-Workflow importiert.
4. Einen neuen Build starten. `Verify Supabase production environment` prüft die Variablen vor `expo prebuild`, ohne ihre Werte auszugeben.
5. Die neue IPA frisch installieren, anmelden, App beenden und erneut öffnen. Profil, Ranked-Rang, Rangliste und Pass müssen identisch mit Expo/Supabase sein.

Expo ersetzt `process.env.EXPO_PUBLIC_*` beim Bundling. Deshalb muss die Codemagic-Umgebung bereits vor Prebuild und Xcode-Build gesetzt sein; eine nur lokal vorhandene `.env` wird nicht ins Remote-Repository übertragen.

## 5. Bewusste Grenzen

- Shop, Preise, Host Pass und Premium bleiben Mock.
- Keine StoreKit-, Google-Play-Billing- oder RevenueCat-Integration.
- `submit_ranked_match_result` schreibt Ergebnisse und aktualisiert Progress serverseitig. Die Fragen-/Antwortvalidierung ist im MVP noch nicht vollständig server-authoritative.
- Vor Produktion: signierte Match-Sessions, serverseitige Antwortprüfung, Replay-Schutz und Anti-Cheat ergänzen.
- Profilbilder werden derzeit als lokale URI gespeichert. Für geräteübergreifende Bilder ist später ein Supabase-Storage-Bucket mit eigener RLS nötig.

## 6. Manueller Smoke-Test

1. Neues Konto registrieren und gegebenenfalls E-Mail bestätigen.
2. Setup abschließen und App neu laden.
3. Prüfen, dass Onboarding nicht erneut erscheint.
4. Ranked öffnen: Bronze III, 0 LP bei neuem Konto.
5. Queue öffnen: Bot aus `profiles`/`ranked_profiles`.
6. Match abschließen: Einträge in `ranked_matches` und `ranked_rounds` prüfen.
7. Rangliste, Missionen, Achievements und Neon Pass erneut laden.
8. Shop öffnen und prüfen, dass keine echte Zahlung ausgelöst wird.
