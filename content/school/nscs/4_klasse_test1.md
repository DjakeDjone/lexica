# NSCS Test 1 (4. Klasse)

## Stoff

Switching und VLANs V0.2

SRWE Module 14 Routing Concepts

## Table of Contents

- [NSCS Test 1 (4. Klasse)](#nscs-test-1-4-klasse)
  - [Stoff](#stoff)
  - [Table of Contents](#table-of-contents)
  - [Switching](#switching)
    - [Funktionsweise](#funktionsweise)
    - [Verarbeitung von Frames](#verarbeitung-von-frames)
    - [Switching-Methoden (4)](#switching-methoden-4)
    - [Redundanz](#redundanz)
    - [Spanning Tree Protocol (STP)](#spanning-tree-protocol-stp)
    - [VLANs](#vlans)
      - [Eigenschaften](#eigenschaften)
      - [Trunking](#trunking)
      - [VTP](#vtp)
    - [Redundanz](#redundanz)
    - [Spanning Tree Protocol (STP)](#spanning-tree-protocol-stp)
    - [VLANs](#vlans)
      - [Eigenschaften](#eigenschaften)
      - [Trunking](#trunking)
      - [VTP](#vtp)
  - [SRWE Module 14 Routing Concepts](#srwe-module-14-routing-concepts)
    - [Path Determination](#path-determination)
    - [Packet Forwarding](#packet-forwarding)
    - [Grundlegende Router Konfiguration](#grundlegende-router-konfiguration)
    - [IP-Routing-Table](#ip-routing-table)
    - [Static & Dynamic Routing](#static--dynamic-routing)

---

## Switching

### Funktionsweise

Eine **Bridge** verbindet Ethernet- Segmente (Kabel) und leitet Frames von einem Segment zum anderen weiter. Eine **Switch** ist eine Bridge mit mehreren Ports.

![Switch Mac Table](/images/switch_mac_table.png)

### Verarbeitung von Frames

1. **Learning**: Der Switch lernt die MAC-Adressen der angeschlossenen Geräte.
2. **Forwarding**: Der Switch leitet Frames anhand der MAC-Adressen weiter.
3. **Filtering**: Der Switch filtert Frames, die nicht an den Zielrechner gerichtet sind.
4. **Loop Avoidance**: Der Switch verhindert Schleifen im Netzwerk.

### Switching-Methoden (4)

- **Store-and-Forward**: Der Switch empfängt den gesamten Frame, prüft ihn und leitet ihn weiter. Vt: **Sicher**; Nt: **Langsam**
- **Cut-Through**: Der Switch leitet den Frame weiter, sobald die Ziel-MAC-Adresse bekannt ist. Vt: **Schnell**; Nt: **Unsicher**
- **Fragment-Free**: Der Switch prüft die ersten 64 Bytes des Frames. Dadurch werden Kollisionen vermieden. Vt: **Schnell**; Nt: **Fehlerhafte Frames werden weitergeleitet**
- **Adaptiver Mode**: Switch beginnt mit Store-and-Forward und prüft Fehlerquote. Bei geringer Fehlerquote wird auf Cut-Through umgeschaltet. Vt: **Schnell**; Nt: **Aufwendig**

![bearbeitung switch](/images/switch-frame-bearbeitung.png)

![Switch Ebenen: Core Switch, Distributed Switch (E2), Access Switch (E3)](switch-ebenen.png)

### Redundanz

Weil Switches Single-Points-of-Failure sind, werden sie redundant aufgebaut. Um Schleifen zu vermeiden, wird **Spanning Tree Protocol (STP)** verwendet.

### Spanning Tree Protocol (STP)

STP verhindert Schleifen im Netzwerk, indem es redundante Verbindungen deaktiviert. Der Switch mit der niedrigsten Bridge-ID wird als Root-Bridge gewählt.

Siehe auch [Spanning Tree Protocol (STP)](https://lexica.fri3dl.dev/school/nscs/spanning_tree_protocoll#_1-allgemeine-aufgaben-und-funktionen-des-stp).

> ## BPDU Pakete
>
> **Bridge Protocol Data Units (BPDU)** sind Nachrichten, die von Switches ausgetauscht werden, um das Spanning Tree Protocol zu verwalten. z. B.: Root Bridge, Root Path Cost, Bridge ID, Port ID, etc.
>
> Enthält: Root Bridge ID, Message Age, Max Age, Root Path Cost, Sender Bridge ID, Sender Port ID, etc.

#### Aufbau der Bridge ID

Die Bridge ID wird benötigt, um die Root Bridge zu bestimmen. Sie besteht aus zwei Teilen:

- **Priority**: 2 Bytes (0-65535)
- **MAC-Adresse**: 6 Bytes

Die Bridge ID wird wie folgt dargestellt: `Priority:MAC-Adresse`. Es macht Sinn, die Bridge ID so zu wählen, dass die MAC-Adresse der Switch-ID entspricht. Geändert sollte sie nur werden, wenn die Priorität geändert werden muss. Die Root Bridge hat die niedrigste Bridge ID.

#### States des Spanning Tree Protocols

- **Blocking**: Der Port leitet keine Frames weiter, empfängt aber BPDU-Nachrichten.
- **Listening**: Der Port hört auf BPDU-Nachrichten, leitet aber keine Frames weiter.
- **Learning**: Der Port beginnt, MAC-Adressen zu lernen, leitet aber noch keine Frames weiter.
- **Forwarding**: Der Port leitet Daten weiter und lernt MAC-Adressen.
- **Disabled**: Der Port ist deaktiviert

> ## Problem
>
> Weil das Spanning Tree Protocol (STP) redundante Verbindungen deaktiviert, kann es zu Performance-Problemen kommen. Um das zu vermeiden, kann **Rapid Spanning Tree Protocol (RSTP)** verwendet werden. Außerdem ist das wechseln von Blocking auf Forwarding langsam.

### VLANs

Weil der Aufbau der physischen LAN-Verkabelung nicht immer den Anforderungen entspricht, werden VLANs verwendet. VLANs ermöglichen es, mehrere logische Netzwerke auf einem physischen Switch zu betreiben.

#### Eigenschaften

- **Broadcast-Domäne**: Ein Broadcast wird nur an Geräte im selben VLAN weitergeleitet. Das erhöht Performance.
- **Kommunikation**: Geräte in unterschiedlichen VLANs können nicht miteinander kommunizieren.
- **Sicherheit**: VLANs erhöhen die Sicherheit, da sie den Datenverkehr trennen.

> Default VLAN
>
> Das Default VLAN ist VLAN 1. Es wird verwendet, wenn ein Port nicht explizit einem VLAN zugewiesen wurde.
>

#### Trunking

Trunking ist eine Technik, um mehrere VLANs über eine Verbindung zu übertragen. Es gitb zwei Trunking-Protokolle:

- **IEEE 802.1Q**: Standard-Trunking-Protokoll, fügt Tag mit VLAN-Informationen hinzu.
- **ISL**: Cisco-Proprietäres Trunk, fügt Tag mit VLAN-Informationen hinzu.

#### VTP

> Das **VLAN Trunking Protocol (VTP)** ist ein Protokoll, um VLAN-Informationen über das Netzwerk zu verteilen.

> Es wird verwendet, um VLANs auf mehreren Switches zu konfigurieren.

Es gibt drei VTP-Modi:

- **Server**: Der Server verwaltet die VLAN-Konfiguration und sendet sie an die Clients.
- **Client**: Der Client empfängt die VLAN-Konfiguration vom Server.
- **Transparent**: Der Transparent-Modus leitet VTP-Pakete durch, speichert aber keine VLAN-Informationen.

---

## SRWE Module 14 Routing Concepts

### Path Determination

### Packet Forwarding

### Grundlegende Router Konfiguration

### IP-Routing-Table

### Static & Dynamic Routing

---

## NSCS Test Antworten

###
