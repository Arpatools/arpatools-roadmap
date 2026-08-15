# Dokumentation arpaTools Retourenportal

## Einleitung

Retourenportal ist eine App im arpaTools Client und verbindet Ihre JTL-Wawi mit dem externen
Retourenportal. Der Abgleich läuft in beide Richtungen:

- **Senden:** arpaTools ermittelt neue Lieferscheine und lädt sie als XML-Dateien zum Retourenportal
  hoch.
- **Empfangen:** arpaTools lädt vom Kunden im Portal gemeldete Retouren herunter und legt sie
  automatisch als Retoure in JTL-Wawi an, mit passenden Positionen und den konfigurierten Workflows.

Der Abgleich lässt sich manuell über die Retourenportal-Ansicht anstoßen oder automatisiert über eine
Jobby-Aktion (siehe [Jobby-Dokumentation](/doku/jobby), Abschnitt „Retourenportal"). Für den regelmäßigen
Betrieb empfehlen wir die Jobby-Aktion.

## Voraussetzungen

- Eine FTP-Verbindung zum Retourenportal, eingerichtet unter den Jobby-FTP-Servern (siehe
  [Jobby-Dokumentation](/doku/jobby), Abschnitt „FTP-Server"). Die Zugangsdaten erhalten Sie vom
  Retourenportal.
- Eine gültige Retourenportal-Lizenz in arpaTools.
- Vollständig gepflegte Einstellungen: FTP-Server, Benutzer, Warenlager und Rückgabegrund. Fehlt eines
  davon, weist arpaTools darauf hin und der Abgleich lässt sich nicht starten.

## Abgleich manuell starten

In der Retourenportal-Ansicht starten Sie den Abgleich über **Start**. Der Ablauf ist protokolliert:

- **Fortschritt, Erfolgreich, Information, Warnung, Fehler:** über die gleichnamigen Kontrollkästchen
  blenden Sie einzelne Meldungsarten in der Liste aus oder ein.
- **Liste leeren:** entfernt alle bisherigen Protokolleinträge aus der Ansicht.
- **Retoure ignorieren:** verschiebt die zur ausgewählten Meldung gehörende Rückgabedatei in einen
  Ignorieren-Ordner, damit sie beim nächsten Abgleich nicht erneut verarbeitet wird. Nützlich, wenn eine
  fehlerhafte Rückgabe manuell geklärt statt automatisch nachverarbeitet werden soll.

## Was beim Abgleich passiert

1. arpaTools ermittelt Lieferscheine der letzten Tage (siehe „Synchronisationsalter" unten), erzeugt je
   Lieferschein eine XML-Datei und lädt sie zum Retourenportal hoch.
2. arpaTools lädt neu verarbeitete Rückgaben als CSV-Dateien vom Retourenportal herunter.
3. Für jede heruntergeladene Rückgabe legt arpaTools eine Retoure in JTL-Wawi an, mit einer Position je
   zurückgegebenem Artikel, und startet die dafür konfigurierten Workflows.
4. Betrifft eine Rückgabeposition einen Stücklistenartikel, wird sie je nach Einstellung als
   Stücklistenvater oder anteilig auf die einzelnen Komponenten zurückgenommen.
5. Erfolgreich verarbeitete und endgültig fehlerhafte Rückgabedateien werden in einem Sicherungsordner
   abgelegt, nicht erneut verarbeitete Dateien bleiben für den nächsten Lauf oder eine manuelle Prüfung
   liegen.

Kennt arpaTools den vom Retourenportal gemeldeten Rückgabegrund nicht, verwendet es ersatzweise den in
den Einstellungen hinterlegten Rückgabegrund.

## Einstellungen

- **FTP-Server:** die Verbindung zum Retourenportal (siehe [Jobby-Dokumentation](/doku/jobby), Abschnitt
  „FTP-Server").
- **Benutzer:** der JTL-Wawi-Benutzer, mit dem die Retoure angelegt wird.
- **Warenlager:** das Lager, dem die Retoure zugeordnet wird.
- **Rückgabegrund:** der Rückgabegrund, der verwendet wird, wenn der vom Portal gemeldete Grund in
  JTL-Wawi nicht bekannt ist.
- **„Gutschreiben" aktivieren:** ob Rückgabepositionen mit der Gutschreiben-Kennzeichnung angelegt
  werden.
- **Coupons einschließen:** ob Coupons/Gutscheine mit in die Retoure einfließen.
- **Versandkosten erstatten:** ob die Versandkosten der Bestellung mit erstattet werden.
- **Stücklistenverarbeitung:** **Väter senden** (die Stückliste wird als ein Artikel zurückgenommen)
  oder **Komponenten senden** (die einzelnen Bestandteile werden anteilig zurückgenommen).

### Synchronisationseinstellungen

- **Synchronisationsalter (Tage):** wie weit zurückliegende Lieferscheine für den nächsten Abgleich
  berücksichtigt werden. Der Knopf daneben ermittelt sie sofort neu, ohne auf den nächsten Abgleich zu
  warten.
- **Aufbewahrungsdauer (Tage):** wie lange verarbeitete Daten aufbewahrt werden, bevor arpaTools sie
  aufräumt. Der Knopf daneben stößt das Aufräumen sofort an. Muss mindestens so groß sein wie das
  Synchronisationsalter.

### Warengruppen- und Plattformfilter

Standardmäßig verarbeitet arpaTools Lieferscheine aller Warengruppen und Plattformen. Über
**Warengruppen filtern** bzw. **Plattform filtern** schränken Sie den Abgleich auf eine Auswahl davon
ein; die zugehörige Liste wird erst nach Aktivieren des Filters bedienbar.

## Automatisierung über Jobby

Für einen regelmäßigen, automatischen Abgleich richten Sie in Jobby einen Job mit der Aktion
**Retourenportal** ein. Die Aktion überträgt neue Lieferscheine und importiert neu gemeldete Retouren
zeitgesteuert über den arpaTools Worker, vollautomatisch und ohne weitere Einstellungen in der Aktion
selbst. Details zu Jobby in der [Jobby-Dokumentation](/doku/jobby).

## Einstellungen aus einer Vorversion übernehmen

Wurde auf diesem Rechner bereits eine ältere, eigenständige Version von arpaTools Retourenportal
verwendet, bietet arpaTools beim ersten Öffnen der Einstellungen an, deren Konfiguration in das aktuelle
Profil zu übernehmen. Diese Übernahme ist einmalig und nur relevant, wenn eine solche Vorversion
tatsächlich auf dem Rechner installiert war.