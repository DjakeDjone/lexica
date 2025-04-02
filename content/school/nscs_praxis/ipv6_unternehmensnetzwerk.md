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

#### IntGw

**Remove all ACL's**:

```bash
no ipv6 access-list internal_in
```

**InternalIn**:

permit:

- ping (icmpv6)
- dns
- tcp/udp (http/ftp)

```bash
no ipv6 access-list internal_in
ipv6 access-list internal_in
remark allow icmpv6 (eig nicht nötig)
permit icmp any any
remark allow dns
permit udp any any eq 53
permit tcp any any eq 53
remark allow http/ftp
permit tcp any any eq 80
permit tcp any any eq 443
int f0/0
ipv6 traffic-filter internal_in in
```

**InternalOut**:

```bash
no ipv6 access-list internal_out
ipv6 access-list internal_out
remark allow icmpv6
permit icmp any any
remark allow dns
permit udp any any eq 53
permit tcp any any eq 53
remark allow http/ftp
permit tcp any any eq 80
permit tcp any any eq 443
int f0/1
ipv6 traffic-filter internal_out out
```

// TODO: ssh für **einen** Client erlauben

#### Auf ExGW

**Remove all ACL's**:

```bash

```

**Out** (von DMZ nach außen):

```bash
no ipv6 access-list dmz_out
ipv6 access-list dmz_out
remark dns
permit tcp 2001:db8:5:2::/64 any eq 53
permit udp 2001:db8:5:2::/64 any eq 53
remark web
permit tcp 2001:db8:5:2::/64 any eq 80
permit tcp 2001:db8:5:2::/64 any eq 443
remark TODO: SSH
remark Web/FTP Server (intern)
permit tcp host 2001:DB8:5:2::5 eq 80 any established
permit tcp host 2001:DB8:5:2::5 eq 443 any established
permit tcp host 2001:DB8:5:2::6 eq ftp any established
exit

no ipv6 access-list dmz_in
ipv6 access-list dmz_in
remark DNS
permit tcp any eq 53 2001:db8:5:2::/64 established
permit udp any eq 53 2001:db8:5:2::/64
remark Externe Ressourcen (Web)
permit tcp any eq 80 2001:db8:5:2::/64 established
permit tcp any eq 443 2001:db8:5:2::/64 established
remark Web/FTP Server (intern)
permit tcp any host 2001:db8:5:1::3 eq 80
permit tcp any host 2001:db8:5:1::3 eq 443
permit tcp any host 2001:db8:5:1::4 eq ftp
```

**Bind to interfaces**:

```bash
int s0/0/0
ipv6 traffic-filter dmz_out out
int f0/0
ipv6 traffic-filter dmz_in in
```

**Delete all ACL's**:

```bash
int s0/0/0
no ipv6 traffic-filter dmz_out out
int f0/0
no ipv6 traffic-filter dmz_in in
no ipv6 access-list dmz_out
no ipv6 access-list dmz_in
```

## Troubleshooting/Debugging

- `no ipv6...`: CASE Sensitive 🤮
- plötzlich funktioniert nichts
