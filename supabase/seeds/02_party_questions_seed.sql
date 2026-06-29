-- Party Questions Seed – 50+ Fragen
-- Modi: klassiker (12), schaetzrunde (12), blitz_quiz (12), bluff (8), zeichen_vote (8)
-- Alle Fragen auf Deutsch, ON CONFLICT DO NOTHING

-- ════════════════════════════════════════════════════════════
-- KLASSIKER (12 Fragen) – "Wer würde am ehesten..."
-- ════════════════════════════════════════════════════════════

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten versehentlich die falsche Person anschreiben?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten eine Diät starten und nach einem Tag aufgeben?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten im Urlaub einen riesigen Sonnenbrand bekommen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten einen Rucksack ins Flugzeug mitnehmen, der eindeutig zu groß ist?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten auf einer Party mit Fremden sprechen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten vergessen, die Stummschaltung aufzuheben, wenn alle warten?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten bei einem All-you-can-eat-Restaurant das Personal kennenlernen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten in einem fremden Land die Sprache versuchen und alle damit zum Lachen bringen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten um 3 Uhr morgens noch shoppen gehen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten ein Haustier nach einer Filmfigur benennen?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten eine Stunde im Stau stehen und trotzdem guter Laune bleiben?',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('klassiker','Alltag & Menschen','Wer würde am ehesten aus Versehen einen Spoiler für alle ruinieren?',1,true) ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- SCHAETZRUNDE (12 Fragen) – Zahlen schätzen
-- ════════════════════════════════════════════════════════════

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Liter Wasser verbraucht ein Mensch durchschnittlich pro Tag (inkl. allem)?','{"unit":"Liter"}',150,2,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viel kostet ein Big Mac in der Schweiz in Schweizer Franken?','{"unit":"CHF"}',7,3,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Kilometer ist die längste Autobahn der Welt?','{"unit":"km"}',48000,5,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Mal hat Deutschland die Fußball-WM gewonnen?','{"unit":"Mal"}',4,2,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Gramm Zucker stecken in einer Dose Red Bull 250ml?','{"unit":"Gramm"}',27,3,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele aktive Vulkane gibt es auf der Erde?','{"unit":"Vulkane"}',1500,4,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Sprachen gibt es in Indien offiziell?','{"unit":"Sprachen"}',22,4,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Euro kostet ein Monatsticket für die MVG in München ungefähr?','{"unit":"Euro"}',57,3,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Kirschen sind in einem Kilogramm ungefähr?','{"unit":"Kirschen"}',150,3,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Schritte macht ein Mensch durchschnittlich in einem Jahr?','{"unit":"Schritte"}',3000000,4,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Mal kann man ein A4-Blatt falten, bevor es nicht mehr geht?','{"unit":"Mal"}',7,3,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,correct_answer,numeric_answer,difficulty,is_active)
VALUES ('schaetzrunde','Zahlen & Schätzen','Wie viele Knochen hat eine Katze?','{"unit":"Knochen"}',244,4,true) ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- BLITZ QUIZ (12 Fragen) – schnelles Multiple Choice
-- ════════════════════════════════════════════════════════════

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Internet & Trends','Welche Farbe hat das Logo von Instagram?','["Blau","Bunt/Violett-Orange","Rot","Grün"]','{"index":1}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Popkultur','Wie heißt die Hauptfigur in Squid Game?','["Oh Il-nam","Hwang Jun-ho","Seong Gi-hun","Kang Sae-byeok"]','{"index":2}',2,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Internet & Trends','Was bedeutet lol im Internet-Slang?','["Lots of Love","Laughing Out Loud","Level of Life","Look Online"]','{"index":1}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Wissen & Fakten','Wie viele Seiten hat ein Würfel?','["4","6","8","12"]','{"index":1}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Popkultur','Welches Land produziert Anime?','["China","Südkorea","Japan","USA"]','{"index":2}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Gaming & Apps','Welche Farbe ist der Creeper in Minecraft?','["Rot","Blau","Grün","Braun"]','{"index":2}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Wissen & Fakten','Was ist die Hauptstadt von Japan?','["Osaka","Kyoto","Tokio","Hiroshima"]','{"index":2}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Food & Lifestyle','Was ist Hummus?','["Eine Art Pasta","Ein Aufstrich aus Kichererbsen","Ein Fleischgericht","Ein Dessert"]','{"index":1}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Internet & Trends','Wem gehört TikTok?','["Meta","Google","ByteDance","Twitter"]','{"index":2}',2,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Popkultur','Welche Band singt Bohemian Rhapsody?','["The Beatles","Rolling Stones","Queen","Led Zeppelin"]','{"index":2}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Wissen & Fakten','Welches Tier ist das schnellste der Welt?','["Löwe","Gepard","Pferd","Adler"]','{"index":1}',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,options,correct_answer,difficulty,is_active)
VALUES ('blitz_quiz','Gaming & Apps','Welche Firma macht die PlayStation?','["Microsoft","Nintendo","Sony","Sega"]','{"index":2}',1,true) ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- BLUFF (8 Fragen) – Kreativprompts
-- ════════════════════════════════════════════════════════════

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erfinde eine neue Ausrede, warum du zu spät zur Arbeit kommst.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erkläre Netflix als wäre es ein Gericht, das man bestellt.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erfinde einen Werbespruch für Socken.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Beschreibe deinen Alltag als wäre er ein Actionfilm.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erfinde einen Firmennamen für ein Unternehmen das schlechte Ratschläge verkauft.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erkläre wie ein Toaster funktioniert – aber auf Fantasysprache.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Erfinde eine Geschichte, warum du nie wieder in ein bestimmtes Restaurant gehen kannst.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('bluff','Kreativität','Beschreibe dein Lieblingsgericht so, dass jeder danach Hunger bekommt.',1,true) ON CONFLICT DO NOTHING;

-- ════════════════════════════════════════════════════════════
-- ZEICHEN-VOTE (8 Aufgaben) – Zeichenaufgaben
-- ════════════════════════════════════════════════════════════

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne einen Pinguin, der surft.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne die Mona Lisa in 15 Sekunden.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne dein Lieblingsessen so, dass andere es erraten können.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne einen Hund, der Kaffee trinkt.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne die Skyline einer Stadt mit 5 Strichen.',2,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne dein aktuelles Gefühl als Tier.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne einen Astronauten, der eine Pizza isst.',1,true) ON CONFLICT DO NOTHING;

INSERT INTO party_questions (mode,category,prompt,difficulty,is_active)
VALUES ('zeichen_vote','Kreativität','Zeichne einen Drachen mit Smartphone.',1,true) ON CONFLICT DO NOTHING;
