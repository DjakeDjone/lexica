---
title: "E-Mail"
protocolAbgabedatum: "32.02.2026"
protocolAufgabenNr: 07
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "32.02.2026"
protocolDescription: "NSCS Praxis: E-Mail-Protokolle & Serverkonfiguration - Einrichtung eines Mailservers mit Postfix und Dovecot, DNS-Konfiguration, PGP-Setup, SPAM- und Virenschutz"
---

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

## Postfix und Dovecot Confskiguration für fri3dl.nscs.lan

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
nicht haben (oder ich die vergessen habe), kopieren wir die Keys zuerst zum
User `schueler`.

1. **Keys am Server vorbereiten:**

   ```bash
   ssh schueler@10.139.0.125
   sudo sh -c 'cp /home/fri3dl/*.key /home/schueler/'
   sudo chown schueler:schueler /home/schueler/*.key
   exit
   ```

2. **Keys herunterladen (SCP):**

   ```bash
   scp schueler@10.139.0.125:~/public.key .
   scp schueler@10.139.0.125:~/private.key .
   ```

3. **Import in Thunderbird:**
   - **Konten-Einstellungen** -> **End-to-End Encryption**
   - **Add Key...**
   - **Import an existing OpenPGP Key**
   - die Datei `private.key`
   - _Hinweis:_ Der Public Key ist im Private Key enthalten bzw. wird
     automatisch mit importiert. Es wird vor allem den **Private Key** benötigt, um
     Nachrichten als "fri3dl" signieren und entschlüsseln zu können.

Nach dem Import können E-Mails signiert und verschlüsselt gesendet werden.

![Thunderbird PGP Test](/images/fri3dl-thunderbird-pgp.png)

![Decrypted Email in Thunderbird](/images/thunderbird-pgp-decrypted.png)

Damit die Verschlüsselung auch funktioniert, muss der Empfänger (z.B. `martin.weixelbaum@weixmail.llan`) den Public Key von `fri3dl` importieren, damit er die Signatur überprüfen und die Nachricht entschlüsseln kann. Außerdem muss der Empfänger ebenfalls einen eigenen Key besitzen, damit `fri3dl` die Nachricht mit dem Public Key des Empfängers verschlüsseln kann. Diesen Key sendet der Empfänger dann an `fri3dl`, damit er ihn in Thunderbird importieren kann.

![Thunderbird key response](/images/thunderbird-pgp-key-response.png)

![Thunderbird import key](/images/thunderbird-pgp-import-key.png)


Jetzt verschickte Nachrichten haben ein Vorhängeschloss-Symbol, das anzeigt, dass sie verschlüsselt sind. Beim Öffnen der Nachricht wird die Verschlüsselung automatisch erkannt und die Nachricht entschlüsselt, sofern der Private Key korrekt importiert wurde.

![Thunderbird encrypted email](/images/thunderbird-pgp-encrypted-message.png)

## SPAM- und Virenfilter

```bash
sudo apt install amavisd-new clamav-daemon spamassassin razor pyzor
```

das installiert folgende Pakete:

- **Spamassassin** bietet Spamfilterung
- **ClamAV** ist ein für Linux und besonders Mailserver sehr beliebter Virenscanner
- **Amavis** verbindet Mailserver mit Virenscannern und Spamfiltern
- **Razor** und **pyzor** bieten Zugriff auf Online-Spamdatenbanken

ClamAV benötigt normalerweise keine weiteren Anpassungen. Damit er mit Amavis
integriert wird, muss der Benutzer `clamav` zur `amavis`-Gruppe hinzugefügt
werden:

```bash
sudo adduser clamav amavis
```

![ClamAV added to amavis group](/images/fri3dl-clamav-amavis-group.png)

### Amavis aktivieren

Um Spam- und Virenschutz zu aktivieren, müssen in
`/etc/amavis/conf.d/15-content_filter_mode` die folgenden vier Zeilen
einkommentiert werden:

```text
@bypass_virus_checks_maps = (
   \%bypass_virus_checks, \@bypass_virus_checks_acl, \$bypass_virus_checks_re);

@bypass_spam_checks_maps = (
   \%bypass_spam_checks, \@bypass_spam_checks_acl, \$bypass_spam_checks_re);
```

Danach Amavis neustarten:

```bash
sudo systemctl restart amavis
```

In `/etc/postfix/main.cf` folgenden Eintrag hinzufügen:

```text
content_filter = smtp-amavis:[127.0.0.1]:10024
```

Und in `/etc/postfix/master.cf` nach der Zeile mit `pickup` folgende Optionen
einfügen:

```text
  -o content_filter=
  -o receive_override_options=no_header_body_checks
```

Und am Ende der Datei folgende Blöcke hinzufügen:

```text
smtp-amavis     unix    -       -       -       -       2       smtp
  -o smtp_data_done_timeout=1200
  -o smtp_send_xforward_command=yes
  -o disable_dns_lookups=yes
  -o max_use=20

127.0.0.1:10025 inet  n       -       -       -       -       smtpd
  -o content_filter=
  -o local_recipient_maps=
  -o relay_recipient_maps=
  -o smtpd_restriction_classes=
  -o smtpd_delay_reject=no
  -o smtpd_client_restrictions=permit_mynetworks,reject
  -o smtpd_helo_restrictions=
  -o smtpd_sender_restrictions=
  -o smtpd_recipient_restrictions=permit_mynetworks,reject
  -o smtpd_data_restrictions=reject_unauth_pipelining
  -o smtpd_end_of_data_restrictions=
  -o mynetworks=127.0.0.0/8
  -o smtpd_error_sleep_time=0
  -o smtpd_soft_error_limit=1001
  -o smtpd_hard_error_limit=1000
  -o smtpd_client_connection_count_limit=0
  -o smtpd_client_connection_rate_limit=0
  -o receive_override_options=no_header_body_checks,no_unknown_recipient_checks
```

Anschließend Postfix neustarten:

```bash
sudo systemctl restart postfix
```

### Testen

Zum Testen des Virenschutzes gibt es den **EICAR**-Teststring. Eine Datei
`eicar.com` mit folgendem Inhalt erstellen:

```text
X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
```

Diese Datei als Anhang an sich selbst senden (auf Windows muss dafür kurzzeitig
der Echtzeitschutz ausgeschaltet werden). Die Mail sollte **nicht** ankommen, und
in `/var/log/mail.log` ist folgende Meldung zu sehen, dass die Mail entfernt
wurde:

![EICAR Virustest - Mail entfernt](/images/fri3dl-eicar-virus-log.png)


Für den Spamfilter gibt es ebenfalls einen Teststring (**GTUBE**):

```text
XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X
```

Wenn man versucht eine E-Mail damit zu senden, erscheint eine ähnliche Meldung
im Log.

![GTUBE Spamtest Log](/images/fri3dl-gtube-spam-log.png)

### Spam-Score konfigurieren

Die Einstellungen für den Spamfilter sind in
`/etc/amavis/conf.d/50-user` gespeichert. Jeder Mail wird ein Spam-Score
zugeordnet, hier kann das Level festgelegt werden, ab dem bestimmte Maßnahmen
getroffen werden:

```perl
$sa_tag_level_deflt  = -999; # alle Mails mit Headern versehen
$sa_tag2_level_deflt = 6.31; # Betreff markieren
$sa_kill_level_deflt = 6.31; # Mail löschen/quarantäne

$final_spam_destiny = D_DISCARD; # Spam-Mails verwerfen
```

Nach einem Neustart von Amavis ist der Score in den Mail-Headern sichtbar.

![Spam-Score in Mail-Headern](/images/fri3dl-amavis-spam-score-1.png)

![Spam-Score in Mail-Headern (2)](/images/fri3dl-amavis-spam-score-2.png)

### Whitelist / Blacklist / Greylist

Man kann den Absender auf einer Liste nachschlagen und darauf basierend
entscheiden:

- **Whitelist:** Mails werden explizit erlaubt und manche Checks werden
  umgangen.
- **Blacklist:** Lehnt Mails automatisch ab.
- **Greylist:** Lehnt Mails nur beim ersten Mal ab; wenn die Mail ein zweites
  Mal gesendet wird, wird sie durchgelassen (mit Spam-Checks).

Für manuelle Black-/Whitelists eine Datei `/etc/postfix/sender_access` mit dem
Format aus <https://www.postfix.org/access.5.html> erstellen, z.B.:

```text
spammer@prima.nscs.lan   REJECT
uok@prima.nscs.lan       OK
```

Dann die Datei in eine Datenbank konvertieren:

```bash
sudo postmap /etc/postfix/sender_access
```

Und den Eintrag `check_sender_access` in `/etc/postfix/main.cf` ganz vorne
einfügen:

```text
smtpd_sender_restrictions =
  check_sender_access hash:/etc/postfix/sender_access,
  reject_unknown_sender_domain
```

Postfix neustarten – danach kann `uok` normal senden, `spammer` wird abgelehnt.

![Sender Whitelist - uok erlaubt](/images/fri3dl-sender-whitelist.png)
![Sender Blacklist - spammer abgelehnt](/images/fri3dl-sender-blacklist.png)

Für **Greylisting** die Library `postgrey` installieren:

```bash
sudo apt install postgrey
```

Und `/etc/postfix/main.cf` erweitern:

```text
smtpd_recipient_restrictions =
  ...
  check_policy_service inet:127.0.0.1:10023
```

![Postgrey Konfiguration](/images/fri3dl-postgrey-config.png)
Die erste Mail wird abgelehnt, nach 5 Minuten wird sie durchgelassen.
![Postgrey - Mail nach 5 Minuten durchgelassen](/images/fri3dl-postgrey-allowed.png)

Außerdem gibt es öffentliche DNS-basierte Blocklists (DNSBL), z.B.:

```text
smtpd_recipient_restrictions =
  ...
  reject_rbl_client zen.spamhaus.org
```

## Weitere Sicherheitsmaßnahmen

### SPF (Sender Policy Framework)

SPF ist ein DNS-Eintrag (TXT-Record), der angibt, welche Server berechtigt sind,
E-Mails für eine Domain zu senden. Der empfangende Mailserver prüft, ob die
sendende IP-Adresse des eingehenden Mails in diesem Eintrag vorkommt. Stimmt die
IP nicht überein, kann die Mail als Spam markiert oder abgelehnt werden.

SPF schützt gegen **E-Mail-Spoofing**: Ein Angreifer, der vorgibt, von
`@fri3dl.nscs.lan` zu senden, kann damit erkannt und abgewiesen werden, da sein
Server nicht in der SPF-Liste steht.

**SPF-Record für `fri3dl.nscs.lan`** – erlaubt alle MX-Server der Domain:

```text
v=spf1 mx ~all
```

- `v=spf1` – SPF-Version
- `mx` – alle im MX-Record eingetragenen Server sind berechtigt zu senden
- `~all` – alle anderen Server werden als SoftFail markiert (empfohlen statt
  `-all` für den Anfang, um legitime Mails nicht zu blockieren)

Dieser TXT-Record wird in der DNS-Zone `fri3dl.nscs.lan` eingetragen.

### DKIM (DomainKeys Identified Mail)

DKIM **signiert** (nicht verschlüsselt) ausgehende E-Mails mit einem privaten
Schlüssel. Der dazugehörige öffentliche Schlüssel wird als TXT-Record im DNS
veröffentlicht. Der empfangende Mailserver kann damit prüfen, ob:

- die Mail wirklich vom angegebenen Server stammt (Authentizität), und
- der Inhalt der Mail während der Übertragung nicht verändert wurde (Integrität).

Anders als SPF schützt DKIM auch gegen **Manipulation auf dem Übertragungsweg**,
da die Signatur über den Mail-Header und -Body erstellt wird.

Installation:

```bash
sudo apt install opendkim opendkim-tools
```

In `/etc/opendkim.conf` konfigurieren:

```text
Domain                  fri3dl.nscs.lan
KeyFile                 /etc/opendkim/keys/fri3dl.nscs.lan/default.private
Selector                default
Socket                  inet:8891@localhost
TrustedHosts            /etc/opendkim/TrustedHosts
KeyTable                /etc/opendkim/KeyTable
SigningTable            refile:/etc/opendkim/SigningTable
```

Benötigte Dateien erstellen:

`/etc/opendkim/TrustedHosts` – alle vertrauten Hosts:

```text
127.0.0.1
localhost
fri3dl.nscs.lan
```

`/etc/opendkim/KeyTable`:

```text
default._domainkey.fri3dl.nscs.lan fri3dl.nscs.lan:default:/etc/opendkim/keys/fri3dl.nscs.lan/default.private
```

`/etc/opendkim/SigningTable`:

```text
*@fri3dl.nscs.lan default._domainkey.fri3dl.nscs.lan
```

Key generieren:

```bash
sudo mkdir -p /etc/opendkim/keys/fri3dl.nscs.lan
sudo opendkim-genkey -D /etc/opendkim/keys/fri3dl.nscs.lan -d fri3dl.nscs.lan -s default
sudo chown -R opendkim:opendkim /etc/opendkim/keys/
```
![DKIM Key Generierung](/images/fri3dl-dkim-keygen.png)

In `/etc/postfix/main.cf` eintragen:

```text
milter_default_action = accept
milter_protocol = 2
smtpd_milters = inet:localhost:8891
non_smtpd_milters = inet:localhost:8891
```

Den öffentlichen Schlüssel für den DNS-Eintrag ausgeben:

```bash
sudo cat /etc/opendkim/keys/fri3dl.nscs.lan/default.txt
```

Diesen Wert als TXT-Record `default._domainkey.fri3dl.nscs.lan` in der
DNS-Konfiguration eintragen (Anführungszeichen entfernen, jeden String in eine
eigene Zeile).
![DKIM DNS TXT-Record](/images/fri3dl-dkim-dns-record.png)

Beide Services neustarten:

```bash
sudo systemctl restart opendkim postfix
```

### DMARC (Domain-based Message Authentication, Reporting & Conformance)

DMARC baut auf SPF und DKIM auf und legt **verbindlich** fest, was mit Mails
passieren soll, bei denen beide Prüfungen fehlschlagen. Außerdem ermöglicht
DMARC das Versenden von Berichten (Reports) an den Domaininhaber, sodass dieser
sehen kann, wer E-Mails in seinem Namen versendet.

**DMARC-Policy-Optionen (`p=`):**
- `none` – nur Monitoring, keine Maßnahmen
- `quarantine` – verdächtige Mails in Spam-Ordner verschieben
- `reject` – Mails mit fehlgeschlagener Prüfung ablehnen

Konfiguration per TXT-Record `_dmarc.fri3dl.nscs.lan`:

```text
v=DMARC1; p=quarantine; rua=mailto:postmaster@fri3dl.nscs.lan
```

- `rua=` – Adresse, an die aggregierte Reports gesendet werden

### Test

#### DKIM-Key prüfen

Mit `opendkim-testkey` kann geprüft werden, ob der veröffentlichte DNS-Eintrag
zum lokalen Private Key passt:

```bash
sudo opendkim-testkey -d fri3dl.nscs.lan -s default -vvv
```
b
Eine erfolgreiche Ausgabe endet mit:

```text
opendkim-testkey: key OK
```

![DKIM Key Test](/images/fri3dl-dkim-testkey.png)

#### DKIM-Signatur in Mail-Headern prüfen

Nach dem Senden einer Test-Mail (z.B. von Thunderbird) können die rohen
Mail-Header inspiziert werden. Eine korrekt signierte Mail enthält einen
`DKIM-Signature`-Header:

```text
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/simple; d=fri3dl.nscs.lan;
    s=default; t=...; bh=...; h=From:To:Subject:...; b=...
```

#### SPF-Eintrag im DNS prüfen

```bash
dig TXT fri3dl.nscs.lan
```

Erwartete Ausgabe enthält den SPF-Record:

```text
fri3dl.nscs.lan. 300 IN TXT "v=spf1 mx ~all"
```

![SPF DNS Lookup](/images/fri3dl-spf-dig.png)
