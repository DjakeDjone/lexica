# NSCS Email Configuration Practice v1.2

## Theorie E-Mail-Protokolle

**SMTP (Simple Mail Transfer Protocol)** Zwischen Mail-Clients und Servern und
zwischen zwei Servern, normalerweise auf Port 25.

**ESMTP (Extended SMTP)** Erweitert SMTP um Authentifizierung, senden von
Binärobjekten und STARTTLS.

**SMTPS (SMTP over TLS)** Unterstützt sofortige Verschlüsselung über TLS. Bei
SMTP mit STARTTLS wird eine existierende Verbindung zu einer TLS-Verbindung
geupgraded.

**POP3 (Post Office Protocol v3)** Greift auf E-Mails zu, indem alle vom Server
auf den Client heruntergeladen werden, d.h. die gesamte Verwaltung passiert am
Client. Das ist einfacher für den Server, aber erschwert Synchronisierung
zwischen mehreren Clients.

**IMAP (Internet Message Access Protocol)** Funktioniert ähnlich wie POP3,
allerdings passiert die ganze Verwaltung der E-Mails am Server, das braucht mehr
Serverressourcen.

**MX (Mail Exchanger)** Ein DNS-Eintrag gibt an welche(r) Mailserver für diese
Zone (oder Domain) zuständig ist/sind.

### E-Mail-Pfad

1. Ein **Mail User Agent (MUA)** übergibt die Nachricht an einen Mailserver
   (**MTA, Mail Transfer Agent**) mit SMTP, hier gibt es oft Verschlüsselung.
2. Der **MTA** fragt den DNS-Server nach MX-Einträgen ab und sucht einen
   Mailserver, anschließend wird die Adresse mit A/AAAA-Einträgen aufgelöst.
3. Die Mail wird über SMTP an den nächsten Server gesendet. Wenn eine
   Weiterleitung vorliegt, ist dieser wieder ein MTA, bis ein Server die E-Mail
   behält, weil sie ihr Ziel erreicht hat.
4. Das ist der **MDA (Mail Delivery Agent)**, der die E-Mail im Posteingang
   speichert und jetzt mit POP3 oder IMAP vom MUA angefragt werden können.

### PGP (Pretty Good Privacy)

Schützt E-Mails von Man-in-the-Middle-Attacken mit Verschlüsselung und Digitalen
Signaturen. Es gewährleistet Integrität und Authentizität. Verwendet wird ein
Hybridschlüsselsystem, d.h. ein symmetrischer Session-Key wird mit einer
asymmetrischen Verschlüsselung erstellt und dann für die Sitzung verwendet.

**PGP vs GPG:** PGP ist ein proprietäres Protokoll von Zimmermann, viele
Versionen sind closed-source. GPG (GNU Privacy Guard) ist eine OpenSource
Implementierung vom OpenPGP Standard.

## Postfix und Dovecot

### DNS-Konfiguration

Für den E-Mail-Server braucht man eine funktionierende DNS-Konfiguration. Auf
`10.139.0.111:10000` ist ein Webinterface genau dafür. Man erstellt eine neue
Zone (hier `prima.nscs.lan`) mit 4 Einträgen:

1. Ein NS-Record für den Nameserver (`ns.prima.nscs.lan`)
2. Ein A-Record für den Nameserver (der zentrale Server, also `10.139.0.111`)
3. Ein A-Record für den Mailserver (unser Server, also hier `10.139.0.138`)
4. Ein MX-Record, damit klar ist, dass unser Server der Mailserver ist
   (`mail.prima.nscs.lan`)

![DNS Config 1](/images/image1.png) ![DNS Config 2](/images/image2.png)
![DNS Config 3](/images/image3.png)

### Installation

```bash
sudo apt update && sudo apt install postfix
```

Erweiterte Konfiguration mit `sudo dpkg-reconfigure postfix`

![Postfix Config 1](/images/image4.png) ![Postfix Config 2](/images/image5.png)
![Postfix Config 3](/images/image6.png) ![Postfix Config 4](/images/image7.png)

Synchrone Aktualisierungen: Nein ![Postfix Config 5](/images/image8.png)

Keine maximale Postfach-Größe. Adresserweiterung mit `+` (hier von keiner
Bedeutung). Protokolle: Nur IPv4, wir brauchen in diesem Beispiel nichts
anderes.

Das entspricht den folgenden Einstellungen in der `/etc/postfix/main.cf`-Datei:
![Main CF 1](/images/image9.png)

Andere Einstellungen: ![Main CF 2](/images/image10.png)
![Main CF 3](/images/image11.png)

Kompatibilität mit älteren Versionen von Postfix:
![Compatibility](/images/image12.png)

### Weitere User

Hinzufügen von einem Email-User: ![Add User](/images/image13.png)

Die E-Mail Adresse ist `username@host`, also bei uns `prima@nscs.lan`.

### Alias

Ein Alias ist wie eine Weiterleitung oder Verknüpfung. Sowohl lokale Benutzer
als auch andere E-Mail-Adressen können als Ziel verwendet werden. Bei postfix
werden Aliase in `/etc/aliases` gespeichert.

### E-Mails

Standardmäßig werden Emails bei UNIX in `/var/mail/<user>` in einer Datei
gespeichert. ![Mail Log](/images/image14.png)

Hier eine Log-E-Mail an `root`, weil der Benutzer „sekund“ versucht hat einen
sudo-Befehl auszuführen. Zugriff auf die Emails erfolgt mit dem Befehl `mail`,
der über das Paket `mailutils` installiert werden kann.

### Dovecot

Ist ein einfacher UNIX-Mailserver für POP3 und IMAP. Installieren mit
`sudo apt install dovecot dovecot-imapd`.

Dann müssen sowohl postfix als auch Dovecot richtig konfiguriert werden. In
`/etc/postfix/main.cf` wird folgendes hinzugefügt:

```text
home_mailbox = Maildir/
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_authenticated_header = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname
broken_sasl_auth_clients = yes
smtpd_recipient_restrictions = reject_unknown_sender_domain, reject_unknown_recipient_domain, reject_unauth_pipelining, permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
smtpd_sender_restrictions = reject_unknown_sender_domain
mailbox_command = /usr/lib/dovecot/deliver -m "${EXTENSION}"
```

In `/etc/dovecot/conf.d/10-master.conf` muss im `auth service` folgender
listener hinzugefügt werden: ![Dovecot Master](/images/image15.png)

Und in `/etc/dovecot/conf.d/10-mail.conf` wird die Mail-Location geändert:

```text
mail_location = maildir:~/Maildir
```

Danach werden postfix und dovecot neugestartet:

```bash
sudo systemclt restart postfix
sudo systemctl restart dovecot
```

### Thunderbird

Mozilla Thunderbird ist ein freies E-Mail-Programm, und Chat-Client (XMPP und
IRC). ![Thunderbird](/images/image16.png)

## PGP (GPG)

![PGP 1](/images/image17.png)

Man wird auch aufgefordert, eine Passphrase einzugeben, hier wurde der
Einfachheit halber „pass“ gewählt. ![Passphrase](/images/image18.png)

Und in eine Datei exportieren: ![Export Key](/images/image19.png)

In Thunderbird den PGP-Key importieren: ![Import Key 1](/images/image20.png)
![Import Key 2](/images/image21.png)

## Spamfilter (Optional)

![Spamfilter 1](/images/image22.png) ![Spamfilter 2](/images/image23.png)
