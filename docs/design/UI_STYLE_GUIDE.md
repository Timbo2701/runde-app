# UI Style Guide - Planungsstand

## 1. Gestalterische These

Die App ist eine spielerische Social-Game-App fuer Freundesrunden: direkt, mutig und warm statt technisch oder dashboardartig. Jeder Screen ist eine farbige Buehne fuer genau eine soziale Aufgabe - einer Runde beitreten, auf Freunde warten oder das eigene Profil praegen.

Die Gestaltung uebernimmt Atmosphaere und Qualitaet der vier Referenzen, aber keine Logos, Figuren, Texte oder exakten Layouts. Die verbindliche Detailanalyse steht in `docs/design/REFERENCE_ANALYSIS.md`.

## 2. Signaturelement: das Social Spotlight

Ein grosser, leicht versetzter Kreis sitzt hinter Logo, Avatar oder Raumstatus und wirkt wie ein Scheinwerfer auf den sozialen Mittelpunkt. Zusammen mit einer vollflaechigen Brand-Farbe und wenigen tonalen Konfetti-Formen bildet er die wiedererkennbare Buehne. Cards, Icons und Motion bleiben bewusst zurueckhaltend.

Warum dieses Risiko sinnvoll ist: Der Spotlight macht aus Join, Lobby und Profil eine zusammenhaengende Produktwelt, ohne die Referenzfiguren zu kopieren oder in eine generische Card-Sammlung zurueckzufallen.

Regeln:

- Maximal ein Social Spotlight pro Screen.
- Es markiert Logo, Avatar oder Status - niemals eine Badge-Sammlung.
- Keine dekorativen Gradients. Form, Vollfarbe und Typografie erzeugen die Wirkung.
- Konfetti bleibt gross, geometrisch, ton-in-ton und unter 12 Prozent Deckkraft.

## 3. Farbpalette aus den Referenzprinzipien

Die Palette ist eigenstaendig, nutzt aber die hochgesaettigte Farblogik der Referenzen. Hauptseiten erhalten eine definierte Buehnenfarbe statt beliebiger Akzente.

| Token | Wert | Rolle |
|---|---:|---|
| `color.stage.grape` | `#6F2BD3` | Lobby und gemeinsamer Spielraum |
| `color.stage.berry` | `#C52A87` | Join/Home und Markenauftakt |
| `color.stage.coral` | `#F0446E` | Profil und persoenlicher Charakter |
| `color.signal.sun` | `#FFD84D` | primaere Aktion auf Berry/Coral |
| `color.ink` | `#21182B` | Text und harte Kontrastaktion |
| `color.surface` | `#FFF9F5` | seltene funktionale Surface |
| `color.surface.soft` | `#E9DDF4` | ruhige sekundare Flaeche auf Grape |

Zusaetzliche semantische Rollen wie Border, Error und Disabled werden kontrastgeprueft abgeleitet. Die jeweilige Stage-Farbe ist der Canvas; Cards duerfen nie denselben Tonwert haben. Farbe allein darf keinen Zustand tragen. Pro Screen werden eine Stage-Farbe, Ink/Weiss und hoechstens ein Signalton verwendet.

## 4. Typografie

Vorlaeufige Paarung:

- Display/Brand: **Bricolage Grotesque**, 600-800, nur fuer Logo, grosse Screen-Titel und wenige markante Zahlen.
- Body/UI: **Instrument Sans**, 400-650, fuer Navigation, Controls und Fliesstext.
- Utility/Data: **IBM Plex Mono**, 500, nur fuer Codes, kurze Statuswerte oder technisch echte Daten.

Skala bei 1x Schriftgroesse:

| Rolle | Groesse / Zeilenhoehe | Einsatz |
|---|---:|---|
| Display | 40 / 44 | Onboarding oder grosser Brand-Moment |
| Title | 30 / 35 | Screen-Titel |
| Section | 22 / 28 | Abschnitt |
| Body | 17 / 24 | Standardtext |
| UI | 16 / 20 | Button, Input, Navigation |
| Caption | 13 / 18 | Hilfstext und Metadaten |

- Keine vollstaendigen Grossbuchstaben fuer laengere Labels.
- Schriftvergroesserung darf keine Kernaktion abschneiden oder ueberdecken.
- Display-Typografie bleibt selten; die App darf nicht wie eine Marketing-Landingpage sprechen.

## 5. Layout und Flaechen

- Basiseinheit: 4 pt. Erlaubte Abstaende: 4, 8, 12, 16, 24, 32 und 48.
- Seitlicher Mobilrand: 20 pt; auf sehr kleinen Screens mindestens 16 pt.
- Inhalt folgt einer schmalen, klaren vertikalen Hauptachse. Asymmetrie gehoert ins Social Spotlight, nicht in Bedienlogik.
- Touch-Ziele mindestens 44 x 44 pt, bevorzugt 48 x 48 pt.
- Cards gruppieren echte zusammengehoerige Inhalte. Nicht jeder Textblock bekommt einen Kasten.
- Surface-Abstand innen: 20 oder 24 pt; kompakte Elemente mindestens 16 pt.
- Brand-Flaechen reichen vollflaechig in obere und untere Safe Area; kein weisser Standardrahmen um die App.

Radien:

| Token | Wert | Einsatz |
|---|---:|---|
| `radius.input` | 10 | Codes und Textfelder, bewusst klar |
| `radius.control` | 16 | primaere und sekundare Aktionen |
| `radius.card` | 24 | soziale oder statusbezogene Surface |
| `radius.spotlight` | 999 | echter Kreis fuer Logo/Avatar/Status |
| `radius.round` | 999 | nur echte kreisfoermige Buttons/Avatare oder kurze Status-Chips |

Schatten werden nur fuer schwebende, interaktive Ebenen eingesetzt. Standard-Cards trennen sich durch Tonwert, Abstand und gegebenenfalls eine sehr feine Kontur.

## 6. Komponentenregeln

### Buttons

- Pro Viewport eine klar erkennbare primaere Aktion.
- Labels nennen die Wirkung: "Profil speichern" statt "Absenden".
- Primaerbutton nutzt Signal Sun mit Ink auf Berry/Coral oder Ink/Surface-Kontrast auf Grape.
- Pill-Form nur bei sehr kurzen, semantisch kompakten Filtern - nicht als Standardbutton.

### Cards und Listen

- Cards haben eine klare Aufgabe, maximal eine Hauptaktion und sparsame Metadaten.
- Lange gleichartige Inhalte als Liste statt Kartenraster darstellen.
- Keine verschachtelten Card-in-Card-Kompositionen ohne zwingende Hierarchie.
- Keine gleichfoermige Kette aus weissen Cards. Eine einzelne helle Surface muss sich ihre Flaeche durch Funktion verdienen.
- Spieler-/Profilzeilen duerfen innerhalb einer gemeinsamen Surface tonale Unterflaechen nutzen, statt fuer jeden Eintrag eine neue Card zu bauen.

### Inputs und Feedback

- Labels bleiben sichtbar; Placeholder ersetzt kein Label.
- Fehler nennen Problem und naechsten Schritt direkt.
- Loading, Empty, Error, Offline, Disabled und Success werden als echte Zustaende gestaltet.
- Leere Zustaende fuehren zu einer sinnvollen Aktion und vermeiden Stimmungsfloskeln.

### Icons und Bilder

- Icons erklaeren oder verstaerken eine Handlung; sie sind keine Fuellornamente.
- Ein konsistenter Icon-Stil, keine Mischung aus duenn, gefuellt und Emoji.
- Referenz- und Brandbilder nur mit dokumentierter Herkunft und Nutzungsrecht.
- Charakter-Illustrationen oder Avatare sitzen im Social Spotlight; sie werden nicht als zufaellige Stock-Dekoration ueber den Screen verteilt.

## 7. Motion

- Ein orchestrierter Moment ist besser als viele Mikroeffekte: Social Spotlight und Kerninhalt duerfen beim Einstieg gestaffelt aufbauen; die restliche UI reagiert direkt.
- Standarddauer: 180 ms fuer Feedback, 260 ms fuer Navigation/Reveal.
- Bewegung nutzt Opacity und kleine Translation/Scale-Werte; keine federnden Effekte ohne funktionalen Grund.
- Reduced Motion ersetzt Translation/Scale durch kurzen Opacity-Wechsel oder entfernt die Animation.

## 8. Sprache

- Deutsch in klarer, aktiver, knapper Alltagssprache; spaetere Lokalisierung von Anfang an ermoeglichen.
- Aus Sicht der Person formulieren, nicht aus Sicht des Systems.
- Gleiche Aktion heisst im Button, Lade- und Erfolgstext gleich.
- Fehler entschuldigen sich nicht und bleiben nicht vage: Ursache, Auswirkung und naechster Schritt.
- Kein Lorem Ipsum in Review-Screenshots.

## 9. Verbotene Muster

- Generische Login-Karte mittig auf farblosem Hintergrund.
- Dashboard aus gleichwertigen KPI-Kacheln ohne Produktlogik.
- Weisse Cards auf hellem Pastell-Canvas als Standard-Seitenaufbau.
- Header oben, darunter Card auf Card mit identischem Radius.
- "Pill soup", Badge-Teppiche und dekorative Icon-Reihen.
- Beliebige Lila-Blau-Gradients, Glassmorphism oder Neon-Glow als Stilabkuerzung.
- Canvas und Cards im selben Tonwert.
- Freie Hexwerte, spontane Radien oder nicht dokumentierte Schriften im Feature-Code.
- Marketing-Sprache in Bedienoberflaechen.
- Bewegung ohne Informations- oder Orientierungswert.

## 10. Visuelle Abnahmefragen

Ein Screen gilt gestalterisch nur dann als bestanden, wenn alle Antworten "ja" lauten:

1. Ist innerhalb von drei Sekunden klar, was dieser Screen ist und was als Naechstes moeglich ist?
2. Sind farbige Stage und interaktive Surfaces klar unterscheidbar?
3. Gibt es genau einen dominanten visuellen Moment statt vieler konkurrierender Akzente?
4. Wirkt die Informationshierarchie auch ohne Farbe?
5. Sind Abstand, Radius und Typografie tokenkonform?
6. Wurde mindestens ein generisches Default-Muster bewusst vermieden?
7. Funktioniert der Screen mit realistischem deutschem Text, grosser Schrift und Reduced Motion?
8. Ist jede Abweichung von einer freigegebenen Referenz begruendet und dokumentiert?
9. Koennte der Screen ein beliebiges AI-App-Template sein? Falls ja, ist er noch nicht fertig.
