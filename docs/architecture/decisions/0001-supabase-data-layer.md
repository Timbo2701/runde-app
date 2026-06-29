# ADR 0001: Supabase als persistente App-Datenebene

## Status

Akzeptiert am 2026-06-28.

## Entscheidung

Runde! verwendet Supabase Auth und Postgres für Accounts, Profile, Ranked, Progress, Bots, Fragen, Achievements, Missionen, Battle Pass und Cosmetics. Expo nutzt ausschließlich eine öffentliche Publishable-/Anon-Konfiguration. RLS schützt nutzerbezogene Tabellen.

Der vorhandene UI- und Game-Code bleibt bestehen. Contexts und Hooks laden Produktdaten ausschließlich aus Supabase. Fehlende Build-Variablen oder Backendfehler werden als klare Konfigurations-, Lade- oder Fehlerzustände angezeigt und niemals mit lokalen Demo-Daten verdeckt.

Codemagic importiert die Variablengruppe `supabase`. Ein Build-Gate bricht vor dem nativen Prebuild ab, wenn URL oder öffentlicher Client-Key fehlen. Damit kann keine IPA mehr entstehen, deren JavaScript-Bundle versehentlich ohne Supabase-Konfiguration gebaut wurde.

Ranked-Werte werden nicht direkt vom Client aktualisiert. Der Client ruft `submit_ranked_match_result` auf. Die RPC berechnet LP und Progress und schreibt Match/Runden atomar. Vollständige serverseitige Antwortvalidierung und Anti-Cheat bleiben ein Produktions-Gate.

Der Shop bleibt absichtlich Mock. Diese Entscheidung führt keine echte Zahlungsbibliothek ein.
