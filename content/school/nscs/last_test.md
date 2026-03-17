# NSCS Letzter Test

### SMTP vs. SMTPs

- SMTP (Simple Mail Transfer Protocol) ist ein Protokoll, das zum Senden von E-Mails verwendet wird. Es arbeitet normalerweise auf Port 25 und ist unverschlüsselt, was bedeutet, dass die übertragenen Daten anfällig für Abhören und Manipulation sind.
- SMTPs (SMTP Secure) hingegen verwendet TLS (Transport Layer Security) oder SSL (Secure Sockets Layer), um die Verbindung zu verschlüsseln. Es arbeitet normalerweise auf Port 465 oder 587. Durch die Verschlüsselung bietet SMTPs eine sicherere Möglichkeit, E-Mails zu senden, da die Daten während der Übertragung geschützt sind.

## Unterschiede zwischen POP3 und IMAP

- POP3 (Post Office Protocol 3) ist ein Protokoll, das zum Abrufen von E-Mails von einem Mailserver verwendet wird. Es lädt die E-Mails auf den lokalen Computer herunter und speichert sie dort. Sobald die E-Mails heruntergeladen wurden, werden sie normalerweise vom Server gelöscht, es sei denn, der Benutzer konfiguriert den Client so, dass eine Kopie auf dem Server verbleibt.
- IMAP (Internet Message Access Protocol) hingegen ermöglicht es Benutzern, E-Mails auf dem Server zu belassen und von verschiedenen Geräten aus darauf zuzugreifen. IMAP synchronisiert die E-Mails zwischen dem Server und den Clients, sodass Änderungen, wie das Lesen oder Löschen von E-Mails, auf allen Geräten reflektiert werden. IMAP ist besonders nützlich für Benutzer, die von mehreren Geräten aus auf ihre E-Mails zugreifen möchten.

### SPF (Sender Policy Framework)

Wie aufsetzen: DNS Eintrag hinzufügen, z.B. `v=spf1 mx -all`
- SPF (Sender Policy Framework) ist ein E-Mail-Authentifizierungsprotokoll, das dazu dient, E-Mail-Spoofing zu verhindern. Es ermöglicht Domaininhabern, anzugeben, welche Mailserver berechtigt sind, E-Mails im Namen ihrer Domain zu senden. Dies geschieht durch Hinzufügen eines SPF-Eintrags in den DNS-Einstellungen der Domain.

## Stateful Paket Filtering

- `NEW`: Ein Paket, das eine neue Verbindung initiieren möchte.
- `ESTABLISHED`: Ein Paket, das zu einer bereits bestehenden Verbindung gehört.
- `RELATED`: Ein Paket, das zu einer bestehenden Verbindung gehört, aber nicht direkt Teil der Verbindung ist, z.B. eine FTP-Datenverbindung, die zu einer FTP-Steuerver
bindung gehört.
- `INVALID`: Ein Paket, das nicht zu einer gültigen Verbindung gehört oder fehlerhaft ist.

### DMZ (Demilitarized Zone)

- Eine DMZ ist ein physischer oder logischer Subnetz, das zwischen einem internen Netzwerk und einem externen Netzwerk (z.B. dem Internet) platziert wird. Es dient als zusätzliche Sicherheitsschicht, um interne Ressourcen vor potenziellen Bedrohungen aus dem Internet zu schützen. In einer DMZ werden häufig öffentlich zugängliche Dienste wie Webserver, E-Mail-Server oder DNS-Server platziert, während interne Ressourcen wie Datenbanken oder Anwendungsserver hinter einer Firewall geschützt bleiben.

### Port forwarding mittels SSH

### WAN

- PSTN: Public Switched Telephone Network
- ISDN: Integrated Services Digital Network
- DSL: Digital Subscriber Line

### Symetrische vs. asymmetrischer Anschluss
