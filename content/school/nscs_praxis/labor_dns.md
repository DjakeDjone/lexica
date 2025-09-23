---
generateTableOfContents: true
title: "DNS"
protocolAufgabenNr: 01
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: 1
protocolAbgabetermin: "16.9.2025"
protocolAbgabedatum: "16.9.2025"
description: "Aufgabe zur Konfiguration eines DNS-Servers mit verschiedenen Einträgen."
---

<!-- # **Titel: DNS**

| **AufgabenNr:** | 01 |
|---|:---|
| **Klasse:** | 5AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | 16.9.2025 |
| **Abgabedatum:** | 16.9.2025 |

## **Kurzbeschreibung:**

Aufgabe zur Konfiguration eines DNS-Servers mit verschiedenen Einträgen. -->

## Bind

### Install

```bash
sudo apt install bind9
```

> **Restarten des Dienstes**
>
> ```bash
> sudo systemctl restart bind9
> ```

### Konfiguration

Die Konfigurationsdatei befindet sich unter `/etc/bind/named.conf.options`.

```bash
sudo nano /etc/bind/named.conf.options
```

## New Zone

1. Create a file named `db.friedl.lan` in the `/etc/bind/zones/` directory and add the following content:

```bash
sudo nano /etc/bind/zones/db.friedl.lan
```

```text
;; db.friedl.lan
;; Forwardlookupzone für friedl.lan
;;
$TTL 2D
@       IN      SOA     ns.friedl.lan. mail.friedl.lan. (
                        2006032201      ; Serial
                                8H      ; Refresh
                                2H      ; Retry
                                4W      ; Expire
                                3H )    ; NX (TTL Negativ Cache)

@                               IN      NS      ns.friedl.lan.
                                IN      MX      10 mailserver.friedl.lan.
                                IN      A       192.168.0.10
                                IN      AAAA    2001:db8::1

ns                     IN      A       192.168.0.10
rechner1                        IN      A       192.168.0.200
mailserver                      IN      A       192.168.0.201
rechner2                        IN      CNAME   mailserver
```

2. Then, add the new zone to the BIND configuration by editing the file `/etc/bind/named.conf.local`:

edit file `/etc/bind/named.conf.local`

```text
zone "friedl.lan" {
    type master;
    file "/etc/bind/zones/db.friedl.lan";
};
```

3. Restart the BIND service to apply the changes:

```bash
sudo systemctl restart bind9
```

### Test

To test the DNS server, you can use the `dig` command:

```bash
dig @localhost friedl.lan
```

this should return the A record for `friedl.lan`.

we got the following records:

![alt text](image.png)

## Debugging

reading the system logs:

```bash
sudo journalctl -u bind9
```

or to read the newest logs

```bash
sudo journalctl -u bind9 -f
```

## Sekundär DNS Server

Einrichtung eines sekundären DNS-Servers:

[Ubuntu Docs: Einrichtung eines Sekundären Nameservers](https://wiki.ubuntuusers.de/DNS-Server_Bind/Sekund%C3%A4re_Nameserver/)

> Warum einen Sekundären DNS-Server?
>
> Ein Sekundärer DNS-Server dient als Backup für den Primären DNS-Server. Falls der Primäre DNS-Server ausfällt oder nicht erreichbar ist, kann der Sekundäre DNS-Server weiterhin DNS-Anfragen beantworten und die Verfügbarkeit der Domain gewährleisten.

### Änderungen auf dem primären Server

edit `/etc/bind/named.conf.options`

```text
allow-transfer { 10.139.0.125; };
notify yes;
```

edit also: `/etc/bind/db.hacker.lan`
so the changes are replicated to the secondary server

```text
;; db.hacker.lan  
;; Forwardlookupzone für hacker.lan  
;;  
$TTL 2D  
@       IN      SOA     ns.hacker.lan. mail.hacker.lan. (  
                        2025091603      ; Serial  
                                8H      ; Refresh  
                                2H      ; Retry  
                                4W      ; Expire  
                                3H )    ; NX (TTL Negativ Cache)  
@                               IN      NS      ns.hacker.lan.  
@                               IN      NS      ns2.hacker.lan.  
                                IN      MX      10 mailserver.hacker.lan.  
                                IN      A       192.168.0.24  
                                IN      AAAA    2001:db8::1  
ns                              IN      A       192.168.0.24  
ns2                             IN      A       10.139.0.125  
rechner1                        IN      A       192.168.0.200  
mailserver                      IN      A       192.168.0.201  
rechner2                        IN      CNAME   mailserver  
```

### Einrichtung des sekundären Servers

edit `/etc/bind/named.conf.options`

```text
allow-notify { 10.139.0.128; };
```

and edit `/etc/bind/named.conf.local`

notes:

```text
zone "hacker.lan" {
        type slave;
        masters { 10.139.0.128; };
        file "back/hacker.lan.bak";
};

<!-- zone "0.168.192.in-addr.arpa" {
        type slave;
        masters { 10.139.0.128; };
        file "back/0.168.192.bak";
} -->
```

Create the backup directory and set the correct permissions:

```bash
sudo mkdir /var/cache/bind/back
sudo chown bind /var/cache/bind/back
```

then restart bind9

```bash
sudo systemctl restart bind9
```

### Testen des sekundären Servers

To test the secondary DNS server, you can use the `dig` command to query the secondary server for records from the primary zone.

```bash
dig @<IP_ADDRESS_OF_SECONDARY_DNS_SERVER> hacker.lan
```

```bash
dig @10.139.0.125 hacker.lan
```

![test with dig](/images/dig-dns.png)

sobald jetzt ein eintrag auf dem primären server geändert wird, wird dieser automatisch auf den sekundären server repliziert:

![logs](/images/dns-logs.png)
