# Switches

## Allgemein

- Ermöglicht die Kommunikation zwischen Geräten im Netzwerk
- Verbindet die Geräte miteinander
- Leitet Datenpakete anhand der MAC-Adresse weiter
- Arbeitet auf der zweiten Schicht des OSI-Modells **(Sicherungsschicht)**
- Verhindert Schleifen im Netzwerk

## Spanning Tree Protocol (STP)

- Verhindert Schleifen in einem Netzwerk
- Wählt den kürzesten Pfad zwischen zwei Switches
- Deaktiviert Ports, um Schleifen zu verhindern
- Aktiviert Ports, wenn der kürzeste Pfad ausfällt
- Wählt den kürzesten Pfad basierend auf der Bandbreite / Kosten

### Begriffe

- **Root Bridge**: Der Switch, der den kürzesten Pfad zu allen anderen Switches hat
- **Root Port**: Der Port, der den kürzesten Pfad zur Root Bridge hat
- **Designated Port**: Der Port, der den kürzesten Pfad zur Root Bridge innerhalb eines Segments hat
- **Blocked Port**: Der Port, der deaktiviert ist, um Schleifen zu verhindern
- **Forwarding Port**: Der Port, der aktiviert ist und Datenpakete weiterleitet
- **Cost**: Die Kosten, um von einem Switch zu einem anderen zu gelangen

### STP Phasen

1. **Blocking**: Alle Ports sind deaktiviert, außer der Root Port
2. **Listening**: Der Switch hört auf BPDU-Pakete, um den kürzesten Pfad zu finden
3. **Learning**: Der Switch lernt die MAC-Adressen der angeschlossenen Geräte

### Rapid Spanning Tree Protocol (RSTP)

- Verbesserte Version von STP
- Topologieänderungen werden schneller erkannt (<1s)
- **keine Phasen wie bei STP**

```plaintext
BPDUGuard ist eine Funktion, die Ports deaktiviert, wenn sie BPDU-Pakete empfangen. Dies verhindert, dass Switches angeschlossen werden, die nicht konfiguriert sind.
```

### Begriffe STP/RSTP

- **PVSTP**: Per VLAN Spanning Tree Protocol
- **Topology Change**: Änderung der Netzwerktopologie (Baum verändert sich z.B. Switchausfall)
- **BPDU**: Bridge Protocol Data Unit (Paket, das von Switches ausgetauscht wird um den kürzesten Pfad zu finden)
- **BPDU Guard**: Deaktiviert Ports, wenn BPDU-Pakete empfangen werden
- **BPDU Filter**: Filtert BPDU-Pakete

### Konfiguration

```plaintext
Switch> enable
Switch# configure terminal
Switch(config)# spanning-tree vlan 1 root primary
Switch(config)# spanning-tree vlan 1 priority 4096
Switch(config)# spanning-tree vlan 1 root secondary
Switch(config)# spanning-tree vlan 1 priority 8192
Switch(config)# spanning-tree vlan 1 root primary
Switch(config)# spanning-tree vlan 1 priority 4096
Switch(config)# end
Switch# show spanning-tree
```


## Virtual Local Area Network (VLAN)

- Ermöglicht die Segmentierung eines Netzwerks
- Trennt Geräte in logische Gruppen
- Reduziert die Broadcast-Domäne
- Erhöht die Sicherheit
- Erhöht die Performance

### Begriffe

- **VLAN ID**: Nummer, die einem VLAN zugewiesen wird
- **Trunk**: Verbindung zwischen zwei Switches, die mehrere VLANs überträgt
- **Access Port**: Port, der nur einem VLAN zugeordnet ist
- **Trunk Port**: Port, der mehreren VLANs zugeordnet ist

### Konfiguration

```plaintext
Switch> enable
Switch# configure terminal
Switch(config)# vlan 10
Switch(config-vlan)# name Management
Switch(config-vlan)# exit
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit
Switch(config)# interface FastEthernet 0/2
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10
Switch(config-if)# exit
Switch(config)# end
Switch# show vlan
```

### Mehrere Switches

Um mehrere Switches zu verbinden braucht es eine Verbindung pro VLAN. Die Verbindung zwischen den Switches wird als **Trunk** bezeichnet.

