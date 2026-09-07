# Dokumentation arpaTools GoReturn

## Einleitung

GoReturn ist ein Retourenportal eines anderen Anbieters. Damit es mit Ihrer JTL-Wawi arbeiten kann,
muss es die Wawi-Datenbank erreichen. Bisher ging das nur, wenn Ihr Server von außen erreichbar war.

Diese App dreht die Richtung um: **arpaTools baut die Verbindung von sich aus zu GoReturn auf.** An
Ihrem Server muss dafür nichts geöffnet werden, keine Portfreigabe und keine Ausnahme in der
Firewall. Die Verbindung geht ausschließlich nach außen, verschlüsselt.

> **Nicht zu verwechseln mit dem arpaTools Retourenportal.** Das ist eine eigene App mit eigenem
> Abgleich (siehe [Retourenportal-Dokumentation](/doku/retourenportal)). GoReturn ist ein fremdes
> Portal; arpaTools stellt hier nur den Weg zu Ihrer Datenbank bereit.

## Voraussetzungen

- Ein Zugang bei GoReturn und ein dort erzeugter **API-Token**. Den Token legen Sie in GoReturn
  unter *Integrationen* beim Eintrag für arpaTools an.
- Eine **Datenbankverbindung** in arpaTools, die auf Ihre JTL-Datenbank zeigt (siehe unten).
- Der **arpaTools-Dienst** muss auf dem Server laufen. Er hält die Verbindung offen, solange er
  läuft. Ohne den Dienst passiert nichts.
- Eine gültige Lizenz für GoReturn in arpaTools.

## Der eigene Datenbankbenutzer

**Das ist der wichtigste Schritt, und wir empfehlen ihn ausdrücklich:** Legen Sie für GoReturn einen
**eigenen SQL-Server-Benutzer mit eingeschränkten Rechten** an, statt die Verbindung zu verwenden,
mit der arpaTools selbst arbeitet.

Der Grund: GoReturn schickt über diese Verbindung Anweisungen an Ihre Datenbank, die arpaTools nicht
kennt und nicht prüfen kann. Die Rechte dieses Benutzers sind die einzige Grenze dafür. Wählen Sie
hier Ihre normale Wawi-Verbindung, hat GoReturn dieselben Rechte wie arpaTools.

Der Benutzer braucht:

- **Leserecht auf die gesamte Datenbank** — für Aufträge, Artikel, Kunden und Lieferscheine.
- **Schreibrecht auf die Retouren-Tabellen** — damit eine in GoReturn angelegte Retoure auch in
  JTL-Wawi entsteht.
- **Kein** `sysadmin` und **kein** `db_owner`.

Das fertige Einrichtungsskript dafür erhalten Sie von GoReturn. Es wird einmalig von Ihrer IT
ausgeführt und legt genau diese Rechte an, nicht mehr.

Anschließend tragen Sie den Benutzer in arpaTools unter **Verbindungen** als Datenbankverbindung ein,
so wie jede andere auch. Vergeben Sie einen sprechenden Namen, etwa „GoReturn", damit Sie ihn später
wiedererkennen.

## Einrichtung

1. Öffnen Sie **Verbindungen** und legen Sie die Datenbankverbindung für den GoReturn-Benutzer an
   (siehe oben).
2. Öffnen Sie **GoReturn**.
3. Tragen Sie die **Backend-Adresse** ein, die Sie von GoReturn erhalten haben.
4. Tragen Sie den **API-Token** ein. Er wird verdeckt angezeigt und verschlüsselt gespeichert.
5. Wählen Sie unter **Datenbankverbindung für GoReturn** die eben angelegte Verbindung aus.
6. Schalten Sie **Agent aktiv** ein.
7. Speichern.

Der Schalter lässt sich erst einschalten, wenn Adresse, Token und Verbindung alle drei gefüllt sind.
Das ist Absicht: Ohne eines davon käme keine Verbindung zustande, und Sie sähen nicht, woran es liegt.

## Was arpaTools prüft, bevor es startet

Beim Start prüft arpaTools, ob der eingetragene Datenbankbenutzer ausreicht, und meldet das Ergebnis
an GoReturn. So fällt eine unvollständige Einrichtung sofort auf und nicht erst Wochen später beim
ersten Vorgang.

| Ergebnis | Bedeutung |
|---|---|
| **In Ordnung** | Der Benutzer hat alle nötigen Rechte. |
| **Warnung** | Ein Schreibrecht fehlt. Der Abgleich läuft, aber Vorgänge, die in die Wawi schreiben, schlagen später fehl. Die betroffene Tabelle wird genannt. |
| **Fehler** | Ein Leserecht fehlt, oder die Auftragstabellen sind unvollständig berechtigt. Der Agent startet nicht. |

Tabellen, die es in Ihrer Wawi-Version nicht gibt, werden übersprungen. Das ist kein Fehler, sondern
ein Unterschied zwischen den Wawi-Versionen.

## Wenn etwas nicht funktioniert

**Der Token wurde in GoReturn widerrufen.** arpaTools stellt die Verbindungsversuche dann ein und
meldet das im Protokoll. Legen Sie in GoReturn einen neuen Token an und tragen Sie ihn hier ein.

**Die gewählte Datenbankverbindung wurde gelöscht.** Der Agent startet nicht und meldet es. Wählen
Sie die Verbindung neu aus. arpaTools weicht bewusst nicht auf eine andere Verbindung aus.

**Der Dienst läuft nicht.** Ohne den arpaTools-Dienst wird keine Verbindung aufgebaut. Prüfen Sie ihn
unter den Jobby-Einstellungen im Abschnitt „Dienst".

**Netzwerkstörung.** arpaTools verbindet selbstständig neu, mit wachsendem Abstand bis zu einer
Minute. Sie müssen nichts tun.

## Was noch nicht geht

Der folgende Teil ist gebaut, aber noch nicht gegen das laufende GoReturn-System nachgewiesen:

- Der eigentliche Verbindungsaufbau zu GoReturn (wartet auf einen Testzugang).
- Die Massen-Synchronisation großer Datenmengen.
- Die Statusanzeige auf dem Einstellungsbildschirm (verbunden seit, letzter Vorgang).

Solange das Modul nicht verkäuflich ist, sehen Sie es nur mit einer Entwicklerlizenz.