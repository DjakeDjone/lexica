# NSCS Email Configuration Practice - fri3dl.nscs.lan

## Theorie E-Mail-Protokolle

**SMTP (Simple Mail Transfer Protocol)** Zwischen Mail-Clients und Servern und
zwischen zwei Servern, normalerweise auf Port 25.

**Postfix Alternativen:**

- **Sendmail:** Der "Klassiker", sehr mächtig und komplex, aber schwer zu
  konfigurieren und in der Vergangenheit sicherheitsanfällig (monolithische
  Struktur).
- **Exim:** Standard bei Debian, sehr flexibel und konfigurierbar, aber
  Konfiguration kann unübersichtlich werden.
- **Qmail:** Fokus auf Sicherheit und Modularität, aber wird nicht mehr aktiv
  weiterentwickelt und Lizenz war lange restriktiv.
- **Microsoft Exchange:** Proprietärer Server, sehr verbreitet in Firmen
  (Groupware), aber teuer und nur auf Windows.

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

## Postfix und Dovecot Configuration für fri3dl.nscs.lan

### DNS-Konfiguration

Für den E-Mail-Server wurde eine funktionierende DNS-Konfiguration auf
`10.139.0.111:10000` erstellt. Zone: `fri3dl.nscs.lan`.

1. **Zone Creation**: ![Create Zone](/images/fri3dl-dns-create.png)
   ![Zone Created](/images/fri3dl-dns-created.png)

2. **Records**:
   - NS: `ns.fri3dl.nscs.lan`
   - A (ns): `10.139.0.111`
   - A (mail): `10.139.0.125` (Updated from placeholder .138)
   - MX: `mail.fri3dl.nscs.lan` (Priority 10)

   ![Add NS](/images/fri3dl-dns-2.png) ![Add MX](/images/fri3dl-dns-3.png)
   ![Overview](/images/fri3dl-dns-overview.png)

3. **Final Configuration Applied**: ![Final](/images/fri3dl-dns-final.png)
   ![Applied](/images/fri3dl-dns-applied.png)

### Installation auf Server 10.139.0.125

Verbindung via SSH: `ssh schueler@10.139.0.125`.

Installation von Postfix und Dovecot:

```bash
sudo apt update
sudo apt install postfix dovecot-imapd mailutils -y
```

_Log Output:_

```text
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following additional packages will be installed:
  dovecot-core libexttextcat-2.0-0 libexttextcat-data liblua5.4-0 libnsl2
  ssl-cert
...
postfix (3.8.6-1build2) wird eingerichtet ...
setting myhostname: 5AHIF5.htl-stp.if
...
INSTALL_DONE
```

### Konfiguration Postfix (Main.cf)

Die Datei `/etc/postfix/main.cf` wurde angepasst:

```bash
smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
biff = no
append_dot_mydomain = no
readme_directory = no
compatibility_level = 3.6
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_tls_security_level=may
smtp_tls_CApath=/etc/ssl/certs
smtp_tls_security_level=may
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination
myhostname = mail.fri3dl.nscs.lan
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases

# Alias Erklärung & Erstellung
# Ein Alias ist ein alternativer Name für eine E-Mail-Adresse. Mails an den Alias
# werden an das eigentliche Ziel weitergeleitet.
# Erstellt in /etc/aliases:
# postmaster:    root
# fri3dl-alias:  fri3dl
# Danach muss 'sudo newaliases' ausgeführt werden, um die Datenbank zu aktualisieren.
myorigin = /etc/mailname
mydestination = $myhostname, fri3dl.nscs.lan, localhost.nscs.lan, localhost
relayhost = 
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all
inet_protocols = all

# Dovecot integration
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

### Dovecot Konfiguration

Konfiguration der Authentifizierung für Postfix in
`/etc/dovecot/conf.d/99-postfix-auth.conf`:

```text
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }
}
```

Mail Location in `/etc/dovecot/conf.d/99-mail-location.conf`:

```text
mail_location = maildir:~/Maildir
```

Dienste neustarten:

```bash
sudo systemctl restart postfix dovecot
```

### User Setup

User `fri3dl` erstellt:

```bash
adduser fri3dl
```

### PGP (GPG) Setup

GPG Key für `fri3dl@fri3dl.nscs.lan` wurde am Server generiert:

```bash
su - fri3dl
gpg --full-generate-key
```

Export der Keys:

```bash
gpg --export -a "fri3dl" > public.key
gpg --export-secret-key -a "fri3dl" > private.key
```

_Prüfung:_

```text
-rw-rw-r-- 1 fri3dl fri3dl 740 Jan 20 10:45 /home/fri3dl/private.key
-rw-rw-r-- 1 fri3dl fri3dl 640 Jan 20 10:45 /home/fri3dl/public.key
```

### Server-side Verification

Versenden einer Test-E-Mail direkt am Server mit dem `mail`-Befehl:

```bash
su - fri3dl
echo "Hello from terminal" | mail -s "Terminal Test" fri3dl@fri3dl.nscs.lan
ls -R ~/Maildir/new
```

_Output:_

```text
/home/fri3dl/Maildir/new:
1768906582.M961934P334838.5AHIF5,S=450,W=463
```

Das bestätigt, dass Postfix die E-Mail korrekt erhält und in das Maildir des
Users zustellt.

### Troubleshooting (Externe E-Mail)

Falls E-Mails an externe Domains (z.B. `schueler@prima.nscs.lan`) mit dem Fehler
`Sender address rejected: Domain not found` abgelehnt werden, liegt das meist am
falschen System-Hostname.

_Lösung:_ Hostname korrekt auf den FQDN setzen:

```bash
sudo hostnamectl set-hostname mail.fri3dl.ncs.lan
sudo systemctl reload postfix
```

### Client Setup (Thunderbird)

Auf dem Client wird Thunderbird eingerichtet mit:

- E-Mail: `fri3dl@fri3dl.nscs.lan`
- Server: `mail.fri3dl.nscs.lan` (IP: `10.139.0.125`)
- IMAP Port 143 (STARTTLS)
- SMTP Port 25 (STARTTLS)

### PGP-Nutzung im Client

Nach dem Import des Private/Public Keys in Thunderbird (OpenPGP Key Manager)
können E-Mails signiert und verschlüsselt gesendet werden.

![Thunderbird PGP Test](/images/fri3dl-thunderbird-pgp.png)

Die Abbildung zeigt eine erfolgreich signierte und verschlüsselte E-Mail in
Thunderbird. Der grüne Haken bzw. das Schloss-Symbol bestätigen die sichere
Übertragung.
