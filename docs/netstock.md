# Dokumentation arpaTools Netstock

## Einleitung

Netstock ist eine App im arpaTools Client und verbindet Ihre JTL-Wawi mit dem externen
Bestandsplanungssystem Netstock. Netstock berechnet auf Basis Ihrer Artikel-, Bestands- und
Verkaufsdaten Bedarfs- und Bestellvorschläge. arpaTools übernimmt dabei den Datenaustausch in beide
Richtungen:

- **Senden:** arpaTools exportiert Artikel-, Bestands-, Verkaufs- und weitere Daten aus JTL-Wawi und
  lädt sie per FTP zu Netstock hoch.
- **Empfangen:** arpaTools lädt die von Netstock berechneten Bestellvorschläge per FTP herunter und
  kann sie wahlweise in die JTL-Einkaufsliste oder direkt als Lieferantenbestellung importieren.

Der Datenaustausch lässt sich manuell über die Netstock-Ansicht anstoßen oder automatisiert über eine
Jobby-Aktion (siehe [Jobby-Dokumentation](/doku/jobby), Abschnitt „Netstock"). Für automatisierte Abläufe
empfehlen wir die Jobby-Aktion.

## Voraussetzungen

- Eine FTP-Verbindung zu Netstock, eingerichtet unter den Jobby-FTP-Servern (siehe
  [Jobby-Dokumentation](/doku/jobby), Abschnitt „FTP-Server"). Die Zugangsdaten erhalten Sie von Netstock.
- Eine gültige Netstock-Lizenz in arpaTools.

## Daten senden

In der Netstock-Ansicht wählen Sie die zu sendenden Datenpakete aus einer Liste aus und übertragen sie
per Knopfdruck. Folgende Datenpakete stehen zur Verfügung:

| Datenpaket | Beschreibung |
|---|---|
| Lager/Filialen | Stammdaten Ihrer Lager. |
| Lieferanten | Ihre Lieferantenstammdaten. |
| Artikelstamm | Artikel-Stammdaten. |
| Bestand je Lagerort | Aktueller Lagerbestand, aufgeschlüsselt je Lager. |
| Chargen | Chargeninformationen. |
| Artikelgruppen | Ihre Warengruppen. |
| Verkauf & Verbrauch | Verkaufs- und Verbrauchsdaten als Grundlage der Bedarfsplanung. |
| Offene Lieferanten- oder Produktionsbestellungen | Noch nicht abgeschlossene Bestellungen. |
| Offene Kundenbestellungen | Noch nicht abgeschlossene Kundenaufträge. |
| Offene Artikeltransfers | Umlagerungen zwischen Lagern, die noch nicht abgeschlossen sind. |
| Abgeschlossene Einkaufsbestellungen | Historische Einkaufsbestellungen. |
| Meta Daten ('Trigger'-File) | Steuerdatei, die Netstock signalisiert, dass ein Übertragungslauf abgeschlossen ist. Wird immer zuletzt gesendet. |
| Stücklisten | Stücklisteninformationen. |
| Nachfolgeartikel | Verknüpfung zwischen ausgelaufenen Artikeln und ihren Nachfolgern. |
| Zusätzliche Daten/Optionale Felder | Weitere, optionale Zusatzinformationen. |

In der Übersicht wählen Sie die gewünschten Pakete aus und klicken auf **Senden**. Zwei Schnellzugriffe
stehen zusätzlich bereit:

- **Grunddaten senden:** überträgt in einem Schritt Lager/Filialen, Lieferanten, Artikelstamm und die Meta-Daten.
- **Verkauf & Bestand senden:** überträgt Verkauf & Verbrauch, Bestand je Lagerort und die Meta-Daten. Dabei kann zwischen **Standard** und **Erweitert** gewählt werden.

## Daten empfangen

Über **Herunterladen** ruft arpaTools die von Netstock berechneten Bestellvorschläge ab. Dabei stehen
drei Verarbeitungsarten zur Auswahl:

- **Herunterladen:** lädt die Datei nur in ein Zielverzeichnis herunter, ohne sie weiter zu verarbeiten.
- **Auf Einkaufsliste:** importiert die Bestellvorschläge direkt in die JTL-Einkaufsliste.
- **Als Lieferantenbestellung:** importiert die Bestellvorschläge über JTL-Ameise direkt als Lieferantenbestellung.

## Einstellungen

In den Netstock-Einstellungen konfigurieren Sie, welche Firma, welcher Benutzer und welcher FTP-Server
für den Datenaustausch verwendet werden, sowie folgende Optionen:

- **Retouren senden:** Ja/Nein, ob Retouren mit in die Verkaufsdaten einfließen.
- **Verkaufsdaten senden:** legt fest, welche Aufträge in die Verkaufsdaten einfließen: **Alle Aufträge**, **Bezahlte Aufträge** oder **Gelieferte Aufträge**.
- **Stücklisten-Verhalten:** **Stücklistenvater senden** (die Stückliste wird als ein Artikel behandelt) oder **Komponenten senden** (die einzelnen Bestandteile werden übertragen).
- **Lieferantenartikelnummer senden:** Ja/Nein.
- **HAN senden:** Ja/Nein (Herstellerartikelnummer).
- **Warengruppe senden:** Ja/Nein.
- **Lager:** Auswahl, welche Lager in den Datenaustausch einbezogen werden, inklusive optionaler Zuordnung eigener FBA-Lager (EU und UK).
- **Eigenes Feld** (bei besonderer Stücklistenbehandlung): ein eigenes Artikel-Feld, aus dem Komponenten und Mengen für Sonderfälle gelesen werden, inklusive **Trenner Artikel und Menge** und **Trenner Komponente** zur Aufteilung des Feldinhalts.

## Automatisierung über Jobby

Für einen regelmäßigen, automatischen Datenaustausch richten Sie in Jobby einen Job mit der Aktion
**Netstock** ein. Die Aktion sendet die konfigurierten Datenpakete automatisch, zeitgesteuert über den
arpaTools Worker. Details zur Jobby-Aktion und zu den Grundlagen von Jobby in der
[Jobby-Dokumentation](/doku/jobby).

Für den Download-Weg richten Sie stattdessen einen Job mit den Aktionen **Download vom FTP-Server** und
**Auf Einkaufsliste schreiben** ein.

### Job auf Wunsch automatisch anlegen lassen

Sie müssen diese Jobs nicht von Hand erstellen. Nach einem manuellen Lauf in der Netstock-Ansicht fragt
arpaTools jeweils, ob der passende Jobby-Job automatisch angelegt werden soll, in **beide Richtungen**:

- **Nach dem Senden:** Sie werden gefragt, ob ein Sende-Job angelegt werden soll. Bei „Ja" entsteht ein
  Job mit der gebündelten Aktion **Netstock**, der Ihre Datenpakete künftig automatisch überträgt.
- **Nach dem Herunterladen:** Sie werden gefragt, ob ein Download-Job angelegt werden soll. Bei „Ja"
  entsteht ein Job mit den Aktionen **Download vom FTP-Server** und **Auf Einkaufsliste schreiben**.

Bestätigen Sie die Abfrage mit „Ja", legt arpaTools den Job an. Sie können ihn danach in Jobby prüfen und
den Zeitplan anpassen.

> **Hinweis:** Die automatische Anlage des Download-Jobs erstellt nur den Weg **auf die Einkaufsliste**.
> Möchten Sie die Bestellvorschläge stattdessen direkt **als Lieferantenbestellung** importieren, richten
> Sie diesen Job derzeit von Hand in Jobby ein.