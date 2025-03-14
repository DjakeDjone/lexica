# **Titel: Unternehmensnetzwerke IPv6**

| **AufgabenNr:** | 12 |
|---|:---|
| **Klasse:** | 4AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | X.3.2025 |
| **Abgabedatum:** | X.3.2025 |

## **Kurzbeschreibung:**

Aufgabe zur Konfiguration eines Unternehmensnetzwerkes mit DMZ und NAT mit IPv6.

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

1. [Anforderungen](#anforderungen)
2. [Init](#init)
3. [DMZ-Adresse](#3-dmz-adresse)
4. [Interne Router per NAT nach außen](#4-Interne-Router-per-NAT-nach-außen)
5. [DNS](#5-dns)
6. [ACL's](#acls)
7. [Troubleshooting/Debugging](#troubleshootingdebugging)

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

## Anforderungen

- Der interne Router soll für die internen Client's als DHCP Server fungieren (192.168.KNR.0/24)
- Die  DMZ soll die Adressen aus dem Netz 36.7.12.128/28 bekommen.
- Der interne Router soll das interne Netz per NAT nach außen verbinden
- Die Web und FTP Server sollen über ihren Namen erreichbar sein.
- Der Web und FTP Server soll vom Internet und vom LAN erreichbar sein.
- Die internen Clients sollen auf interne und externe Webserver (Port 80 und 443) zugreifen können.  Weiters sollen sie Zugriff auf den Firmen FTP-Server haben. Andere Ports sind zu sperren.
- Stellen Sie sicher, dass in der DMZ nur die notwendigen Ports erreichbar sind.

## Init

> Notiz: ipv6 aktivieren:
>
>```bash
>IntGw ipv6 unicast-routing
>int f0/0
>ipv6 add
>ipv6 address 2001:db8:99:1::1/64
>no shut
>```
>
> Das gleiche für int f0/1, nur ipv6 ist dann: `2001:db8:99:2::1/64`
