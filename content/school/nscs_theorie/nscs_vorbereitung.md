# NSCS Vorbereitung

## Ethernet

### Übertragung mittels Strom

- Koaxialkabel: Innenleiter, Isolator, Außenleiter, Schutzmantel
- Twisted Pair (UTP, STP): verdrillte Adernpaare, um elektromagnetische Störungen zu reduzieren

### Kollisionserkennung

- Sender horcht auf dem Medium, ob nur das gesendet wird, was er selbst sendet
- Wenn nicht, Kollision erkannt, alle Sender stoppen, warten zufällige Zeit und senden erneut

### Kollisionsdomäne

Eine Kollisionsdomäne ist ein Netzwerksegment, in dem Kollisionen auftreten können. Alle Geräte, die an dasselbe Segment angeschlossen sind, befinden sich in derselben Kollisionsdomäne.

Sie wird von einem Switch oder Router getrennt, da diese Geräte den Datenverkehr filtern und weiterleiten, wodurch Kollisionen vermieden werden.

In einem vollständig geswitchten Netzwerk hat jedes Gerät seine eigene Kollisionsdomäne, da der Switch den Datenverkehr direkt an das Zielgerät weiterleitet. Daher können in einem solchen Netzwerk **keine Kollisionen auftreten.**

> Full Dublex/Half Duplex: Full Duplex ermöglicht gleichzeitiges Senden und Empfangen von Daten, während Half Duplex nur eine Richtung gleichzeitig erlaubt. In einem Full Duplex Netzwerk können keine Kollisionen auftreten, da die Kommunikation in beide Richtungen gleichzeitig möglich ist. In einem Half Duplex Netzwerk können Kollisionen auftreten, wenn zwei Geräte gleichzeitig senden.

### Qualitätskriterien von Kabeln

- **Bandbreite**: maximale Datenrate, die über das Kabel übertragen werden kann
- **Dämpfung**: Signalverlust über die Entfernung, gemessen in dB. Die Dämpfung hängt von der Kabellänge und der Frequenz ab. Höhere Frequenzen haben in der Regel eine höhere Dämpfung.
- **Störanfälligkeit**: Anfälligkeit für elektromagnetische Störungen, z.B. durch andere Kabel oder Geräte

Ein Kabel hat Kapazitive und Induktive Eigenschaften, die die Signalübertragung beeinflussen können. (Quasi wie ein Kondensator und eine Spule) Die Kapazität und Induktivität können zu Signalverzerrungen führen, insbesondere bei höheren Frequenzen.


## Mail

### E2E encryption

- PGP (Pretty Good Privacy): Verschlüsselung von E-Mails, die auf einem Schlüsselpaar basiert (privat und öffentlich)
- S/MIME (Secure/Multipurpose Internet Mail Extensions): Verschlüsselung von E-Mails, die auf X.509-Zertifikaten basiert
- Beide Methoden bieten Authentizität, Integrität und Vertraulichkeit, aber PGP ist benutzerfreundlicher und flexibler, während S/MIME besser in Unternehmensumgebungen integriert ist.

---
# *Zweiter Termin (1. Juni)*
---

## IPv6

Aufbau:

### Arten

<https://www.elektronik-kompendium.de/sites/net/0812201.htm>

## Routing Allgemein

### Warum kann man mit MAC-Adressen nicht routen?

IP-Adressen sind sogenannte **logische** Adressen, aufgebaut durch einen Hostanteil und einen Netzwerkteil. Sie ermöglichen die Identifikation von Geräten in einem Netzwerk und die Bestimmung des Pfads, den Datenpakete durch das Netzwerk nehmen sollen.

MAC-Adressen hingegen sind physische Adressen, die jedem Netzwerkgerät zugewiesen werden und auf der Hardwareebene arbeiten. Sie sind nicht hierarchisch strukturiert und können nicht verwendet werden, um den Pfad durch ein Netzwerk zu bestimmen, da sie keine Informationen über die Netzwerkstruktur enthalten. Daher ist Routing mit MAC-Adressen nicht möglich.

### Statisches vs. dynamisches Routing

- **Statisches Routing**: Routen werden manuell konfiguriert und bleiben unverändert, bis sie manuell geändert werden. Es ist einfach zu implementieren, aber unflexibel und nicht skalierbar. *Die Administrative Distance (AD) für statisches Routing beträgt in der Regel 1, was bedeutet, dass es als sehr vertrauenswürdig angesehen wird, da es manuell konfiguriert wird und nicht von dynamischen Faktoren beeinflusst wird. Sie kann aber auch manuell geändert werden.*
- **Dynamisches Routing**: Routen werden automatisch durch Routing-Protokolle (z.B. OSPF, BGP) ermittelt und angepasst, basierend auf der aktuellen Netzwerkstruktur und -bedingungen. Es ist komplexer zu implementieren, aber flexibel und skalierbar.

### Interior vs. Exterior Gateway Protocols

- **Interior Gateway Protocols (IGP)**: Routing-Protokolle, die innerhalb eines autonomen Systems (AS) verwendet werden, z.B. OSPF, RIP
- **Exterior Gateway Protocols (EGP)**: Routing-Protokolle, die zwischen autonomen Systemen verwendet werden, z.B. BGP

### Link-State vs. Distance-Vector Routing

- **Link-State Routing**: Jeder Router kennt die gesamte Netzwerkstruktur und berechnet die besten Pfade basierend auf dieser Information (z.B. **OSPF**); eher für größere/komplexere Netzwerke
- **Distance-Vector Routing**: Jeder Router kennt nur die Entfernung zu seinen direkten Nachbarn und teilt diese Informationen mit seinen Nachbarn, um die besten Pfade zu berechnen (z.B. **RIP**); eher für kleinere/einfachere Netzwerke; *weniger Aufwand für Router und leichter zu implementieren, aber anfälliger für Routing-Schleifen und langsamer bei der Konvergenz*

> **Administrative Distance**: Maß für die Vertrauenswürdigkeit einer Route, je niedriger, desto vertrauenswürdiger; z.B. OSPF hat eine AD von 110, RIP hat eine AD von 120

**Kriterien:**

- Delay
- Bandwidth
- Hop Count (billig aber unzuverlässig)
- Auslastung
- Zuverlässigkeit

> **Konvergenzzeit**: Zeit, die ein Routing-Protokoll benötigt, um nach einer Änderung im Netzwerk (z.B. Ausfall eines Links) eine neue stabile Routing-Tabelle zu erstellen; Link-State-Protokolle haben in der Regel eine schnellere Konvergenzzeit als Distance-Vector-Protokolle, da sie die gesamte Netzwerkstruktur kennen und schneller auf Änderungen reagieren können.

### RIP Schleifen verhindern

- **Split Horizon**: Verhindert, dass ein Router Informationen über eine Route zurück an den Router sendet, von dem er die Information erhalten hat
- **Route Poisoning**: Markiert eine Route als unbrauchbar (z.B. durch Setzen der Hop Count auf unendlich ~ 16), um zu verhindern, dass sie in Routing-Schleifen verwendet wird
- **Hold-Down Timers**: Verhindert, dass ein Router sofort auf eine Änderung in der Routing-Tabelle reagiert, um zu verhindern, dass vorübergehende Fehler zu Routing-Schleifen führen

> **Flapping Interface**: Ein Netzwerkinterface, das häufig zwischen aktiv und inaktiv wechselt, was zu Instabilität im Netzwerk führen kann; Routing-Protokolle können Flapping erkennen und entsprechende Maßnahmen ergreifen, um die Auswirkungen auf das Netzwerk zu minimieren (z.B. durch Erhöhung der Hold-Down Timer). Der Hold-Down Timer ignoriert Änderungen an einer Route für eine bestimmte Zeit, um zu verhindern, dass vorübergehende Fehler zu Routing-Schleifen führen.

### OSPF

OSPF hat nicht nur eine Routing-Tabelle sondern drei:

- **Link-State Database (LSDB)**: Alle Verbindungen des Netzwerks
- **Routing-Tabelle**: Alle möglichen Routen zu allen Zielen
- **Forwarding-Tabelle**/Nachbarentabelle: Beste Route zu jedem Ziel, die tatsächlich verwendet wird
- OSPF verwendet als **Metrik den Kehrwert der Bandbreite**, um die beste Route zu bestimmen (höhere Bandbreite = niedrigere Metrik)

### OSPF Ablauf

- **Hello-Pakete:** Router im selben Netzwerk tauschen diese aus, um Nachbarn zu erkennen und zu verwalten.
- **LSAs (Link-State Advertisements):** Informationen über den Zustand von Verbindungen und Netzwerken werden im gesamten Bereich verteilt.
- **LSDB (Link-State Database):** Alle Router bauen aus den LSAs eine identische topologische Landkarte des Netzwerks auf.
- **Dijkstra-Algorithmus:** Jeder Router nutzt die Karte, um völlig unabhängig die schnellste/beste Route zu berechnen.

### Wie definiert sich die OSPF-ID?

Die OSPF-ID ist eine eindeutige Kennung für jeden Router in einem OSPF-Netzwerk. Sie wird verwendet, um Router zu identifizieren und zu unterscheiden. Die OSPF-ID wird normalerweise als 32-Bit-Wert dargestellt, der oft in Form einer IP-Adresse angegeben wird. Sie wird entweder manuell konfiguriert oder automatisch generiert (z.B. basierend auf der höchsten IP-Adresse eines aktiven Interfaces des Routers). Es ist wichtig, dass die OSPF-ID eindeutig ist, um Konflikte im Netzwerk zu vermeiden.

### Größere Netzwerke in OSPF - Areas

- **Area 0 (Backbone Area)**: Alle anderen Areas müssen direkt mit Area 0 verbunden sein, da sie als Rückgrat des OSPF-Netzwerks dient.
- **Area 1, Area 2, ...**: Weitere Areas können erstellt werden, um die Größe und Komplexität des Netzwerks zu verwalten. Jede Area hat ihre eigene LSDB, aber Router in verschiedenen Areas tauschen nur Informationen über die besten Routen aus, nicht die vollständige Topologie.
- **ABR (Area Border Router)**: Router, die mehrere Areas verbinden und Informationen zwischen ihnen weiterleiten.

## LAN vs. WAN

- **LAN (Local Area Network)**: Ein Netzwerk, das sich über eine begrenzte geografische Fläche erstreckt, z.B. ein Bürogebäude oder ein Zuhause. Es bietet hohe Datenraten und niedrige Latenzzeiten. *Das LAN wird üblicher Weise vom Nutzer selbst betrieben, z.B. durch einen Router oder Switch, und ermöglicht die Verbindung von Geräten innerhalb des lokalen Netzwerks.*
- **WAN (Wide Area Network)**: Ein Netzwerk, das sich über eine große geografische Fläche erstreckt, z.B. das Internet. Es bietet niedrigere Datenraten und höhere Latenzzeiten im Vergleich zu LANs. *Das WAN wird in der Regel von Internet Service Providern (ISPs) betrieben und ermöglicht die Verbindung von LANs und anderen Netzwerken über große Entfernungen hinweg. Das Internet ist das größte Beispiel für ein WAN, das Milliarden von Geräten weltweit verbindet.*

[Zusammenfassung WAN](https://lexica.fri3dl.dev/school/nscs_theorie/wan#wan-topoligie)

### DTE und DCE

- **DTE (Data Terminal Equipment)**: stellt Verbindung zum LAN her, z.B. Computer, Router, Switch
- **DCE (Data Circuit-terminating Equipment)**: stellt Verbindung zum WAN her, z.B. Modem, CSU/DSU (Channel Service Unit/Data Service Unit)

### Packet switched vs. circuit switched networks

- **Packet switched networks**: Daten werden in kleine Pakete aufgeteilt, die unabhängig voneinander über das Netzwerk gesendet und am Zielort wieder zusammengesetzt werden (z.B. Internet); VT: Infrastruktur effizienter genutzt, da mehrere Pakete gleichzeitig über dasselbe Medium gesendet werden können, aber es kann zu Verzögerungen und Paketverlusten kommen
- **Circuit switched networks**: Eine **dedizierte Verbindung** wird für die Dauer der Kommunikation zwischen den beteiligten Geräten hergestellt (z.B. früher Telefonnetz) NT: Verbindung blockiert, auch wenn keine Daten übertragen werden, was zu Ineffizienz führen kann

## VPN

*geskippt*

## SNMP (Simple Network Management Protocol)

Versionen:
- SNMPv1: einfache Authentifizierung (Community Strings), keine Verschlüsselung
- SNMPv2: verbesserte Funktionen, aber immer noch keine Verschlüsselung; Community String; keine Verschlüsselung
- SNMPv2c: verbesserte Sicherheit (Community Strings mit Authentifizierung), aber immer noch keine Verschlüsselung; mit set-Befehl der Community String kann geändert werden, was ein Sicherheitsrisiko darstellt
- SNMPv3: verbesserte Sicherheit (Authentifizierung und Verschlüsselung), Benutzerbasiertes Sicherheitsmodell (USM)

**Funktionsweise:**
- SNMP-Manager: zentraler Server, der Informationen von SNMP-Agenten sammelt
- SNMP-Agenten: Software auf Netzwerkgeräten, die Informationen über den Zustand des Geräts sammelt und an den SNMP-Manager sendet
- MIB (Management Information Base): Hierarchische Datenbank, die die Informationen definiert, die von SNMP-Agenten gesammelt und an den SNMP-Manager gesendet werden können

> *SNMP verwendet UDP*

**Traps**: SNMP-Agenten können auch Traps an den SNMP-Manager senden, um über bestimmte Ereignisse oder Zustände zu informieren (z.B. Fehler, Schwellenwertüberschreitungen)

### Syslog vs. SNMP

- **Syslog**: Protokoll zur Protokollierung von Ereignissen und Fehlermeldungen auf Netzwerkgeräten; verwendet UDP oder TCP; ermöglicht die zentrale Sammlung von Protokolldaten für die Überwachung und Fehlerbehebung
- **SNMP**: Protokoll zur Überwachung und Verwaltung von Netzwerkgeräten; ermöglicht die Sammlung von Informationen über den Zustand von Geräten und die Konfiguration von Geräten; bietet auch Funktionen zur Fehlerbehebung und Alarmierung (z.B. Traps)

### Warum ist es wichtig, dass die Uhrzeit auf Netzwerkgeräten synchronisiert ist?

Der zeitliche Ablauf muss rekonstruierbar sein, um Ereignisse korrekt zuordnen und analysieren zu können.

Die Uhren werden üblicherweise über das **Network Time Protocol (NTP)** synchronisiert, das es ermöglicht, die Uhren von Netzwerkgeräten mit einer zuverlässigen Zeitquelle zu synchronisieren, um sicherzustellen, dass alle Geräte die gleiche Zeit verwenden.

### Verschlüsselung

### TLS (Transport Layer Security) vs. SSL (Secure Sockets Layer)

TLS Versionen:
- TLS 1.0: Erste Version, jetzt veraltet
- TLS 1.1: Verbesserte Sicherheit, aber immer noch veraltet
- TLS 1.2: Weit verbreitet, unterstützt viele Verschlüsselungsalgorithmen
- TLS 1.3: Neueste Version, verbessert die Sicherheit und Leistung, entfernt veraltete Funktionen

**TLS Verbindungsaufbau:**

## UDP/TCP

Ports:
- 20/21: FTP (File Transfer Protocol)
- 22: SSH (Secure Shell)
- 23: Telnet (veraltet, unsicher)
- 25: SMTP (Simple Mail Transfer Protocol)
- 53: DNS (Domain Name System)
- 80: HTTP (Hypertext Transfer Protocol)
- 110: POP3 (Post Office Protocol 3)
- 143: IMAP (Internet Message Access Protocol)
- 443: HTTPS (HTTP Secure)
- 3389: RDP (Remote Desktop Protocol)

### Wird UDP in Zukunft mehr oder weniger verwendet werden?

Wrsl Ja:
HTTP kann sowohl über TCP als auch über UDP (**HTTP/3**) verwendet werden. HTTP/3 basiert auf dem QUIC-Protokoll, das UDP als Transportprotokoll verwendet, um die Leistung zu verbessern und die Latenz zu reduzieren. Daher könnte die Verwendung von UDP in Zukunft zunehmen, insbesondere für Anwendungen, die von den Vorteilen von HTTP/3 profitieren können.

QUIC ist schneller, weil es die Verbindungs- und Transportschicht kombiniert, was die Anzahl der Round-Trips reduziert, die für den Verbindungsaufbau erforderlich sind. Es bietet auch verbesserte Fehlerbehandlung und Multiplexing von Streams, was die Leistung weiter verbessert.