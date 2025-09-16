# **Titel: DNS**

| **AufgabenNr:** | 01 |
|---|:---|
| **Klasse:** | 5AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | 16.9.2025 |
| **Abgabedatum:** | 16.9.2025 |

## **Kurzbeschreibung:**

Aufgabe zur Konfiguration eines DNS-Servers mit verschiedenen Einträgen.

---
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\

## Inhaltsverzeichnis

::Inhaltsverzeichnis
::

---
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\

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
