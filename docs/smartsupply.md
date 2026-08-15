# Dokumentation arpaTools SmartSupply

## Einleitung

SmartSupply ist eine App im arpaTools Client und erstellt Ihnen je Lieferant einen
Beschaffungsvorschlag: Auf Basis von Bestand, Mindest- und Maximalbestand, bereits laufendem Zulauf und
dem Verkauf eines gewählten Zeitraums schlägt SmartSupply Bestellmengen je Artikel vor. Sie prüfen und
passen die Mengen an und übergeben das Ergebnis an JTL-Wawi, entweder als Lieferantenbestellung über die
JTL-Ameise oder als Einträge in der JTL-Einkaufsliste.

SmartSupply ist reine Handarbeit in der Oberfläche; es gibt keine Automatisierung über Jobby und keinen
Batch-Aufruf.

## Vorschlag berechnen

Im Bereich **Einstellungen** wählen Sie zunächst den **Lieferanten**, für den der Vorschlag berechnet
werden soll (Knopf daneben lädt die Lieferantenliste neu). Weitere Kriterien schränken die berechneten
Artikel ein bzw. steuern die Berechnung:

- **Nur Artikel mit Bestand unter Mindestbestand**
- **Nur Artikel mit Bestand unter Maximalbestand**
- **Nur wenn Lieferant Standardlieferant ist:** berücksichtigt einen Artikel nur, wenn der gewählte
  Lieferant sein Standardlieferant in JTL-Wawi ist.
- **Globalen Zulauf berücksichtigen:** bezieht bereits laufende Bestellungen aller Lieferanten in die
  Zulaufmenge ein, nicht nur die des gewählten Lieferanten.
- **Verkauf nur aus gewähltem Lager zählen:** schränkt die Verkaufsmenge, aus der der Vorschlag
  berechnet wird, auf ein oder mehrere ausgewählte Lager ein (Mehrfachauswahl).
- **Verkauf der letzten X Tage berechnen:** der Zeitraum, aus dem die Verkaufsmenge ermittelt wird.
- **Bedarf für X Tage berechnen:** der Zeitraum, für den die Bestellung den Bedarf decken soll.
- **Lager:** das Lager, dessen Bestand, Mindest- und Maximalbestand für die Berechnung herangezogen
  werden.

Über **Laden** starten Sie die Berechnung, **Zurücksetzen** leert die Auswahl.

## Bestellliste bearbeiten

Das Ergebnis erscheint im Bereich **Auftragsdaten** als Liste mit Artikelnummer, Bezeichnung,
Lieferantenartikelnummer, verkaufter Menge im gewählten Zeitraum, Bestand, Mindest- und Maximalbestand,
empfohlener Bestellmenge, Bestellmenge, Einkaufspreis und Einkaufspreissumme. Über das Textfeld
**Listenfilter** schränken Sie die Liste nach Artikelnummer, Artikelname oder Lieferantenartikelnummer
ein. **Inaktive Artikel ausblenden** blendet deaktivierte Artikel aus der Liste aus.

Die Spalte **Bestellmenge** ist die einzige editierbare Spalte; hier legen Sie fest, was tatsächlich
bestellt wird. Drei Wege übernehmen die empfohlene Menge automatisch:

- **Doppelklick auf eine Zelle:** Bei den Spalten Bestand, Mindest- oder Maximalbestand füllt der
  Doppelklick die Bestellmenge bis zum angeklickten Zellwert auf; ein Ziel unterhalb des aktuellen
  Bestands führt zu keiner Übernahme statt zu einer negativen Menge. Bei der Spalte empfohlene
  Bestellmenge übernimmt der Doppelklick sie direkt.
- **Kontextmenü der Zeile:** „Empfehlung für diese Zeile übernehmen" übernimmt die empfohlene
  Bestellmenge nur für die angeklickte Zeile.
- **Knopf „Empfehlung übernehmen":** übernimmt die empfohlene Bestellmenge für alle aktuell sichtbaren
  Zeilen, also nach Listenfilter und dem Schalter „Inaktive Artikel ausblenden".

Der berechnete **Bestellwert** aus den eingetragenen Bestellmengen steht neben dem Knopf.

## Lieferantenkonditionen

Rechts zeigt arpaTools die in JTL-Wawi hinterlegten Konditionen des gewählten Lieferanten: Lieferzeit,
Zahlungsbedingungen, Skontotage, Skonto, Mindestbestellwert, Mindermengenzuschlag, Versandkosten und der
Betrag, ab dem der Lieferant versandkostenfrei liefert. Darunter die **Preisstaffeln** des Lieferanten
mit Menge und zugehörigem Einkaufspreis.

## Bestellung übergeben

Über **Import** übergeben Sie die eingetragenen Bestellmengen an JTL-Wawi. Welcher der beiden Wege
verwendet wird, legen Sie in den Einstellungen fest:

- **Lieferantenbestellung:** arpaTools erzeugt eine Datei und ruft die JTL-Ameise mit der
  Importvorlage „arpaTools SmartSupply" auf, die daraus die Lieferantenbestellung anlegt.
- **Einkaufsliste:** die Bestellpositionen werden direkt in die JTL-Einkaufsliste geschrieben.

Nach einem erfolgreichen Import bestätigt arpaTools die Anzahl der übernommenen Positionen und setzt
die eingetragenen Bestellmengen zurück, damit ein weiterer Klick auf Import nicht dieselbe Bestellung
erneut anlegt.

## Einstellungen

Über **Einstellungen** öffnen Sie das Einstellungsfenster mit den Importvorgaben:

- **Firma:** unter welcher Firma importierte Lieferantenbestellungen bzw. Einkaufslistenpositionen
  angelegt werden.
- **Benutzer:** mit welchem Benutzer der Import durchgeführt wird.
- **Importweg:** Lieferantenbestellung oder Einkaufsliste (siehe oben).
- **Abfragevariante:** steuert, welche interne JTL-Wawi-Datenstruktur für Verkaufsmenge und Zulauf
  abgefragt wird. arpaTools ermittelt beim Öffnen automatisch, welche Variante zu Ihrer JTL-Wawi-Version
  passt, und blendet eine nicht passende Variante aus. Im Regelfall müssen Sie hier nichts ändern.
- **Befehls-Timeout (Sekunden):** wie lange die Berechnung höchstens laufen darf, bevor sie abgebrochen
  wird. Bei einer langen Bestellhistorie kann die Berechnung mehr Zeit benötigen; erhöhen Sie den Wert
  in diesem Fall.