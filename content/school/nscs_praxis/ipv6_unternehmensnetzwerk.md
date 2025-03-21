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

Sie haben das Netzwerk 2001:db8:KNr::/48 von Ihrem ISP bekommen.

- Teilen Sie dieses Netzwerk in 2 Netzwerke (intern, DMZ) auf. Welche 2
Netzwerke ergeben sich?

- Vergeben Sie auf allen Geräten des LANs Adressen per DHCP

- Tragen Sie die notwendigen Routen im Firmennetzwerk ein. Wo setzen sie
welche Route?

- Testen Sie die Verbindungen

- Tragen Sie die Namen am DNS ein (A-Record)

- Erstellen Sie ACL’s damit:
  - der DNS Zugriff funktioniert
  - die Mitarbeiter im Web surfen können (80,443)
  - ein Mitarbeiter per ssh auf die Router zugreifen kann
  - von außen die Server (nur) auf ihren vorgesehen Ports erreichbar sein.

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

### Zwei Netzwerke

- Internes Netz (LAN): 2001:db8:5:1::/64
- DMZ: 2001:db8:5:2::/64

### DHCP Server (Stateful)

> DHCP bei IPv6 vs. IPv4
>
> - Bei IPv4 wird der DHCP-Server verwendet, um IP-Adressen an Clients zu vergeben. Weil bei IPv6 die Clients ihre IP-Adressen selbst generieren, wird der DHCP-Server verwendet, um zusätzliche Informationen wie DNS-Server und Domain-Namen bereitzustellen.

IPv6 Unicast-Routing muss aktiviert werden:

Zweck von `ipv6 unicast-routing`:

- Aktiviert das IPv6-Routing auf dem Router.
- Erlaubt dem Router, IPv6-Pakete zwischen verschiedenen Netzwerken weiterzuleiten.
- Notwendig, um den Router als Gateway für IPv6-Netzwerke zu konfigurieren.

> IntGw(config)# `ipv6 unicast-routing`
>
#### Interner Router

![alt text](image-21.png)
![alt text](image-22.png)

DNS Server konfigurieren:

![alt text](image-23.png)

DNS Feld auf automatisch bei allen Clients:

![alt text](image-24.png)

Addresse zuweisen:

```bash
IntGw(config)# interface f0/0
IntGw(config-if)# ipv6 address 2001:db8:5:1::1/64
IntGw(config-if)# no shutdown
IntGw(config-if)# exit
```

#### Externe Router

```bash
ExtGw(config)# interface f0/0
ExtGW(config-if)#ipv6 address 2001:db8:6:2::2/64
ExtGW(config)#ipv6 unicast-routing
```

##### Webserver

![alt text](image-25.png)
![alt text](image-26.png)

Das gleiche für den FTP-Server.

### Routen

Ext zum internen Router:

![alt text](image-27.png)

Default Route vom Int zum externen Gw:
![alt text](image-28.png)

Außerdem müssen alle Interfaces hochgefahren und die DNS Server konfiguriert werden. (siehe [unternehmensnetzwerke ipv4](https://lexica.fri3dl.dev/school/nscs_praxis/v2_unternehmensnetzwerk))

![alt text](image-29.png)

- Webserver: `2001:db8:5:2::5`
- FTP-Server: `2001:db8:5:2::6`

Jetzt kann mit `nslookup` mit einem Client die DNS Server IP-Adresse abgefragt werden:

```bash
nslookup web.nscs.lan
```

### ACL's

> ACL's sind unter IPv6 nocheinmal wichtigere als unter IPv4, da ohne ACL's sämtliche Geräte im DMZ im Internet erreichbar sind.

#### OUTSIDE_IN

```acls
ipv6 access-list OUTSIDE_IN
 remark *** Erlaube eingehenden Traffic nur auf definierten Server-Ports in der DMZ ***

 ! Beispiel: Webserver (80, 443) in der DMZ hat IP 2001:db8:5:2::10
 permit tcp any host 2001:db8:5:2::10 eq 80
 permit tcp any host 2001:db8:5:2::10 eq 443

 ! Beispiel: DNS-Server (Port 53 TCP/UDP) in der DMZ hat IP 2001:db8:5:2::20
 permit udp any host 2001:db8:5:2::20 eq 53
 permit tcp any host 2001:db8:5:2::20 eq 53

 ! Beispiel: FTP-Server (Port 21) in der DMZ hat IP 2001:db8:5:2::30
 permit tcp any host 2001:db8:5:2::30 eq 21
 ! Falls Sie passives FTP (Ports > 1023) benötigen, müsste man das ggf. genauer erlauben.

 remark *** Blockiere jeglichen direkten Zugriff auf das interne LAN ***
 deny ipv6 any 2001:db8:1::/64
 deny ipv6 any 2001:db8:2::/64
 ! ... ggf. weitere interne Subnetze

 remark *** Erlaube ICMPv6 Typen wie Neighbor Discovery oder Ping, falls gewünscht ***
 ! (Optional, je nachdem, was Sie benötigen)
 permit icmp any any nd-na
 permit icmp any any nd-ns
 permit icmp any any echo-reply
 permit icmp any any echo-request

 remark *** Alles andere ablehnen ***
 deny ipv6 any any

```

WICHTIG: Die ACL's müssen dann einem Interface zugewiesen werden:

```bash
ExtGw(config)# interface s0/0/0
ExtGw(config-if)# ipv6 traffic-filter OUTSIDE_IN in
```

```bash
ExtGw(config)# int s0/0
ExtGw(config-if)# ipv6 traffic-filter OUTSIDE_IN in
```

#### INSIDE_OUT

```acls
ipv6 access-list INSIDE_OUT
 remark *** Erlaube DNS-Abfragen (Port 53 TCP/UDP) an den DMZ-DNS oder externe DNS ***
 permit udp 2001:db8:1::/64 any eq 53
 permit tcp 2001:db8:1::/64 any eq 53
 ! Oder allgemeiner: permit udp any any eq 53, etc.
 ! Je nachdem, ob interne Clients auch andere DNS im Internet befragen sollen.

 remark *** Erlaube Websurfen (HTTP/HTTPS) aus dem internen LAN ins Internet ***
 permit tcp 2001:db8:1::/64 any eq 80
 permit tcp 2001:db8:1::/64 any eq 443

 remark *** Erlaube SSH-Zugriff vom internen LAN auf die Router (Port 22) ***
 ! Hier ist wichtig, dass Sie die Zieladresse des Routers kennen.
 ! Angenommen, der Router hat die IP 2001:db8:5:2::1 (DMZ-Router) 
 ! und 2001:db8:X:Y::1 (LAN-Router), je nachdem:
 permit tcp 2001:db8:1::/64 host 2001:db8:5:2::1 eq 22
 permit tcp 2001:db8:1::/64 host 2001:db8:X:Y::1 eq 22

 remark *** Optional: Erlaube Antwort-Traffic, falls "established" nicht automatisch erkannt wird ***
 ! In IPv6 kann man das mit "permit tcp any any established" NICHT mehr wie bei IPv4 machen.
 ! Man müsste Return Traffic in der OUTSIDE_IN-ACL explizit zulassen oder Stateful-Firewall-Funktion nutzen.

 remark *** Alles andere ablehnen ***
 deny ipv6 any any
```

```bash

\
\
\

---
---

## Problems

- Viele Problemen waren die schlechte Dokumentation und das mehrmalige ausführen von Commands
