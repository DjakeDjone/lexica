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

### Alias

Ein Alias ist wie eine Weiterleitung oder Verknüpfung. Sowohl lokale Benutzer
als auch andere E-Mail-Adressen können als Ziel verwendet werden. Bei Postfix
werden Aliase in `/etc/aliases` gespeichert.

### E-Mail-Speicherung

Standardmäßig werden Emails bei UNIX in `/var/mail/<user>` in einer Datei
gespeichert (Mbox). Zugriff auf die Emails erfolgt mit dem Befehl `mail`, der
über das Paket `mailutils` installiert werden kann. Das unterscheidet sich vom
**Maildir**-Format (in dieser Übung verwendet), wo E-Mails als einzelne Dateien
in `~/Maildir` gespeichert werden.

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

![Postfix and Dovecot Installation Output](/images/postfix-dovecot-install.png)

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

![GPG Key Generation and Export](/images/gpg-key-export.png)

### Server-side Verification

Versenden einer Test-E-Mail direkt am Server mit dem `mail`-Befehl:

```bash
su - fri3dl
echo "Hello from terminal" | mail -s "Terminal Test" fri3dl@fri3dl.nscs.lan
ls -R ~/Maildir/new
```

### Troubleshooting (Externe E-Mail)

Falls E-Mails an externe Domains (z.B. `schueler@prima.nscs.lan`) mit dem Fehler
`Sender address rejected: Domain not found` abgelehnt werden, liegt das meist am
falschen System-Hostname (wie halt bei mir zB).

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

#### Troubleshooting (Zertifikat)

Beim Senden von Nachrichten kann folgende Fehlermeldung auftreten:

> Sending of the message failed. The certificate is not trusted because it is
> self-signed. The configuration related to mail.fri3dl.nscs.lan must be
> corrected.

**Lösung:** Da wir selbst-signierte Zertifikate verwenden, muss in Thunderbird
eine **Sicherheits-Ausnahmeregel** (Security Exception) hinzugefügt werden.
Klicke dazu im Warn-Dialog auf "Sicherheits-Ausnahmeregel bestätigen" (Confirm
Security Exception).

### PGP-Nutzung im Client

Um PGP im Client nutzen zu können, müssen die Schlüssel vom Server auf den
lokalen Rechner kopiert werden. Da wir das Passwort für den User `fri3dl` evtl.
nicht haben (oder SSH-Login deaktiviert ist), kopieren wir die Keys zuerst zum
User `schueler`.

1. **Keys am Server vorbereiten:** Logge dich als `schueler` am Server ein und
   kopiere die Keys:

   ```bash
   ssh schueler@10.139.0.125
   sudo sh -c 'cp /home/fri3dl/*.key /home/schueler/'
   sudo chown schueler:schueler /home/schueler/*.key
   exit
   ```

2. **Keys herunterladen (SCP):** Führe diesen Befehl **auf deinem lokalen
   Client** aus:

   ```bash
   scp schueler@10.139.0.125:~/public.key .
   scp schueler@10.139.0.125:~/private.key .
   ```

3. **Import in Thunderbird:**
   - Gehe zu **Konten-Einstellungen** -> **End-to-End Encryption**
     (End-zu-Ende-Verschlüsselung).
   - Klicke auf **Add Key...** (Schlüssel hinzufügen).
   - Wähle **Import an existing OpenPGP Key** (Vorhandenen OpenPGP-Schlüssel
     importieren).
   - Wähle die Datei `private.key` aus.
   - _Hinweis:_ Der Public Key ist im Private Key enthalten bzw. wird
     automatisch mit importiert. Du benötigst vor allem den **Private Key**, um
     Nachrichten als "fri3dl" signieren und entschlüsseln zu können.

Nach dem Import können E-Mails signiert und verschlüsselt gesendet werden.

![Thunderbird PGP Test](/images/fri3dl-thunderbird-pgp.png)

![Decrypted Email in Thunderbird](/images/thunderbird-pgp-decrypted.png)
