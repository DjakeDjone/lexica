# DNS

Empfehlung: [DNS Explained in 100 Seconds @fireship](https://www.youtube.com/watch?v=UVR9lhUGAyU)

![dns tree](/images/dns_tree.png)

**Treeförmig**:

Root-Punkt -> Top Level Domain -> Second Label Domain -> Third Level Domain ...

eg.: . -> com -> wikipedia -> de :::=> de.wikipedia.org.

## Ablauf einer DNS-Abfrage

wir wollen moodle.htlstp.at aufrufen:

1. Wir fragen den lokalen DNS-Server (meistens der Router) nach der IP-Adresse von moodle.htlstp.at
2. Der lokale DNS-Server fragt den Root-Server (.) nach dem zuständigen Top-Level-Domain-Server (.at)
3. Der Root-Server antwortet mit der IP-Adresse des .at-Servers
4. Der lokale DNS-Server fragt den .at-Server nach dem zuständigen Second-Level-Domain-Server (htlstp.at)
5. Der .at-Server antwortet mit der IP-Adresse des htlstp.at-Servers
6. Der lokale DNS-Server fragt den htlstp.at-Server nach der IP-Adresse von moodle.htlstp.at
7. Der htlstp.at-Server antwortet mit der IP-Adresse von moodle.htlstp.at
8. Der lokale DNS-Server antwortet mit der IP-Adresse von moodle.htlstp.at an den Client
9. Der Client verbindet sich mit der IP-Adresse von moodle.htlstp.at

## Wichtige DNS Einträge

- `A`/`AAAA`: Zuordnung eines Hostnamens zu einer IPv4/IPv6-Adresse
- `CNAME`: Alias für einen anderen Hostnamen
- `MX`: Mail Exchange, gibt Mailserver für eine Domain an
- `NS`: Name Server, gibt autoritative DNS-Server für eine Domain an
- `SOA`: Start of Authority, gibt grundlegende Informationen über die Domain und den DNS-Server an
- `PTR`: Pointer Record, Zuordnung einer IP-Adresse zu einem Hostnamen (Reverse DNS)

## Tools

- nslookup: fragt einen DNS-Server nach der IP-Adresse eines Hostnamens
- dig: detailliertere Abfrage eines DNS-Servers

> Dig vs nslookup: dig ist moderner und bietet mehr Funktionen, während nslookup einfacher zu bedienen ist.

```bash
nslookup moodle.htlstp.at
dig moodle.htlstp.at
```

Tipp: auf `Status` und `Antwort` Flag achten, ob Request wirklich erfolgreich war.

## Security

Gesichert werden müssten:

- Authentizität: ist die Antwort wirklich von dem DNS-Server, den ich gefragt habe?
- Integrität: wurde die Antwort unterwegs verändert?
- Vertraulichkeit: kann jemand mitlesen, welche Domains ich abfrage?

### Problem

DNS-Spoofing: Angreifer sendet gefälschte DNS-Antworten, um Benutzer auf bösartige Websites umzuleiten.

### Lösung: DNSSEC

ca ein drittel aller Domains weltweit nutzen DNSSEC

DNSSEC: Erweiterung des DNS-Protokolls, die digitale **Signaturen** verwendet, um die Authentizität von DNS-Antworten zu überprüfen.

- Jede Zone (Domain) hat ein Schlüsselpaar (privat und öffentlich)
- Der private Schlüssel wird verwendet, um DNS-Antworten zu signieren
- Der öffentliche Schlüssel wird im DNS veröffentlicht, damit Clients die Signatur überprüfen können
- Signaturen werden in DNS-Antworten als zusätzliche Resource Records (RRs) gesendet
- Clients, die DNSSEC unterstützen, können die Signatur überprüfen und sicherstellen, dass die Antwort authentisch ist
- DNSSEC schützt nicht vor Spoofing, wenn der Angreifer den privaten Schlüssel der Zone kennt

> **Chain of Trust**: Jede Zone wird von der übergeordneten Zone signiert, beginnend bei der Root-Zone. Clients können die Signaturkette überprüfen, um sicherzustellen, dass die Antwort authentisch ist.

### Verschlüsselung

DNSSEC gewährleistet Authentizität und Integrität, aber keine Vertraulichkeit. Deshalb werden oft noch zusätzliche Protokolle verwendet:

- DNS over HTTPS (DoH)
- DNS over TLS (DoT)

Diese Protokolle verschlüsseln die DNS-Anfragen und -Antworten, um zu verhindern, dass Dritte mitlesen können, welche Domains abgefragt werden.
