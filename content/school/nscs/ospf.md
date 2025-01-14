# OSPF

## OSPF Überblick

OSPF (Open Shortest Path First) ist ein Link-State Routing-Protokoll, das auf dem Dijkstra-Algorithmus basiert. Es ist ein IGP (Interior Gateway Protocol) und wird in großen Netzwerken eingesetzt. OSPF ist ein offenes Protokoll und wird in RFC 2328 spezifiziert.

## Unterschiede zu RIP

Im Gegensatz zu RIP ist OSPF ein Link-State Routing-Protokoll. Das bedeutet, dass OSPF Informationen **über alle Router** im Netzwerk hat und nicht nur über die nächsten Hops. OSPF verwendet den **Dijkstra**-Algorithmus, um den kürzesten Pfad zu berechnen, während RIP den Bellman-Ford-Algorithmus verwendet.

## OSPF Funktionsweise

OSPF hat 3 Tabellen:

- **Neighbor Table**: Liste der Nachbarn: wird durch *Hello-Pakete* aufgebaut (alle 30s)
- **Link State DB**: Liste aller Router und Links: wird durch *Link State Advertisements* aufgebaut
- **Routing Table**: Beste Pfade zu allen Zielen: wird durch den *Dijkstra-Algorithmus* berechnet

## OSPF Nachrichten

| Type | Packet Name | Description |
|------|-------------|-------------|
| 1    | Hello       | Discover neighbors |
| 2    | Database Description (DBD) | Exchange database summaries |
| 3    | Link State Request | Request missing link states |
| 4    | Link State Update | Send link states |
| 5    | Link State Acknowledgment | Acknowledge link states |

## Basic OSPF Konfiguration

```bash
Router(config)# router ospf 1 <process-id>    
```

Die Prozess-ID muss auf allen Geräten gleich sein

## OSPF Metric

Die OSPF Metric wird als **Cost** bezeichnet und basiert auf der Bandbreite des Links. Die Formel zur Berechnung der Cost ist:

```math
Cost = 100 Mbps / Bandwidth in Mbps
```

Weil OSPF die **geringste Cost** bevorzugt, bedeutet eine **höhere Bandbreite** einen **niedrigeren Cost**.
Wenn die Bandbreite eines Links 100 Mbps beträgt, beträgt die Cost 1. Wenn die Bandbreite 10 Mbps beträgt, beträgt die Cost 10. Wenn die Cost kleiner als 1 wäre sollte der Referenzwert von 100 Mbps angepasst werden. Dieser muss auf **allen Geräten** im OSPF-Netzwerk **gleich** sein.

### Multiarea OSPF

OSPF kann in **mehrere Areas** unterteilt werden, um die **Skalierbarkeit** zu verbessern. Ein **Area Border Router (ABR)** verbindet die Areas miteinander. Ein **Autonomous System Boundary Router (ASBR)** verbindet das OSPF-Netzwerk mit anderen Routing-Domains.

Bei Multi-Area OSPF gibt es mehrere arten von LSAs (Link State Advertisements):

- **Type 1**: Router LSA: Informationen über den Router
- **Type 2**: Network LSA: Informationen über das Netzwerk
- **Type 3**: Summary LSA: Informationen über andere Areas
- **Type 4**: ASBR Summary LSA: Informationen über ASBRs (Autonomous System Boundary Router)
- **Type 5**: External LSA: Informationen über externe Routen
- **Type 7**: NSSA External LSA: Informationen über externe Routen in einer Not-So-Stubby Area

> ### OSPFv3
>
>Im Gegensatz zu OSPFv2 verwendet OSPFv3 IPv6-Adressen. OSPFv3 verwendet **Multicast-Adressen** für die Kommunikation. OSPFv3 verwendet **Link-Local-Adressen** für die Nachbarschaftserkennung.

#### Autosummary

```bash
Router(config-router)# auto-summary
```

Mit dem Befehl `auto-summary` wird die automatische Zusammenfassung von Netzwerken aktiviert. Dies bedeutet, dass OSPF die Netzwerke automatisch zusammenfasst, wenn sie in verschiedenen Areas liegen.
Normalerweise wird die automatische Zusammenfassung **nicht** empfohlen, da sie zu **Problemen** führen kann.

Probleme mit der automatischen Zusammenfassung:

- **Discontiguous Networks**: OSPF kann keine disjunkten Netzwerke zusammenfassen
- **Suboptimal Routing**: OSPF kann zu Suboptimalen Routen führen, wenn die Netzwerke zusammengefasst werden
