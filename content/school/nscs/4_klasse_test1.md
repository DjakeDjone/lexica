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

### VLANs

Weil der Aufbau der physischen LAN-Verkabelung nicht immer den Anforderungen entspricht, werden VLANs verwendet. VLANs ermöglichen es, mehrere logische Netzwerke auf einem physischen Switch zu betreiben.

#### Eigenschaften

- **Broadcast-Domäne**: Ein Broadcast wird nur an Geräte im selben VLAN weitergeleitet. Das erhöht Performance.
- **Kommunikation**: Geräte in unterschiedlichen VLANs können nicht miteinander kommunizieren.
- **Sicherheit**: VLANs erhöhen die Sicherheit, da sie den Datenverkehr trennen.

#### Trunking

Trunking ist eine Technik, um mehrere VLANs über eine Verbindung zu übertragen.
Weil ein Frame nicht weiß, zu welchem VLAN er gehört, wird ein **Tag** hinzugefügt. Dieser enthält die VLAN-ID und wird lediglich vom Switch interpretiert. Außerhalb des Switches wird der Tag entfernt.

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
