# **Titel: Unternehmensnetzwerke**

| **AufgabenNr:** | 11 |
|---|:---|
| **Klasse:** | 4AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | 6.3.2025 |
| **Abgabedatum:** | 6.3.2025 |

## **Kurzbeschreibung:**

Aufgabe zur Konfiguration eines Unternehmensnetzwerkes mit DMZ und NAT.

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

**DHCP** Pool erstellen:

![alt text](image-6.png)

*Dem Router eine IP-Adresse zuweisen*

![alt text](image-7.png)

![alt text](image-8.png)

Der `IntClient0` hat die Addresse `192.168.5.2` erhalten:

![alt text](image-9.png)

## 3. DMZ-Adresse

Der externe Router im Interface f0/1 bekommt die Adresse `36.7.12.129`:

![alt text](image-10.png)

Der externe Router im Interface f0/0 bekommt die Adresse `36.7.12.130`:

![alt text](image-12.png)

**Webserver** & **FTP Server** konfigurieren:

Der FTP Server bekommt die Adresse `36.7.12.132`, der Webserver die Adresse `36.7.12.131`

![alt text](image-13.png)

## 4. Interne Router per NAT nach außen

NAT aktivieren:

![alt text](image-14.png)

f0/1 ist für den outgoing Traffic verantwortlich, f0/0 für den incoming

### NAT Testen

Um NAT zu testen können wir von einem Client den externen Router anpingen:

![alt text](image-15.png)

## 5. DNS

![alt text](image-16.png)

DNS Server mit DNS-Records konfigurieren (im Internet):

![alt text](image-17.png)

![alt text](image-18.png)

## ACL's

### Erreichen des FTP Servers

`no ip access-list extended MyACL` - ACL löschen
`ip access-list extended MyACL` - ACL erstellen
`remark Internal FTP` - Kommentar

ACLs zum besseren Bearbeiten in einer Datei speichern:

> Die internen Clients sollen auf interne und externe Webserver (Port 80 und 443) zugreifen können.  Weiters sollen sie Zugriff auf den Firmen FTP-Server haben. Andere Ports sind zu sperren.

```acl
no ip access-list extended allow_intern
ip access-list extended allow_intern
remark DNS
permit udp any any eq 53
permit tcp any any eq 53
remark Web
permit tcp any any eq 80
permit tcp any any eq 443
remark local ftp
permit tcp any host 36.7.12.131 eq 21
permit tcp any host 36.7.12.131 eq 20
remark dhcp
permit udp host 0.0.0.0 any eq 67

interface f0/0
ip access-group allow_intern in
```

![alt text](image-19.png)

![alt text](image-20.png)

## Troubleshooting/Debugging

- Zwei DHCP Pools
- Statische IP Adressen bei den Servern
- ACLs, plötzlich hat wurde alles geblockt
