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