

# **Titel: VLan**

| **AufgabenNr:** | 03 |
|---|:---|
| **Klasse:** | 4AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | X |
| **Abgabedatum:** | X |

## **Kurzbeschreibung:**

In diesem Protokoll wird das Virtual Local Area Network (VLAN) behandelt. VLANs sind logische Gruppen von Geräten, die so konfiguriert sind, als ob sie sich in einem einzigen physischen LAN befinden. VLANs ermöglichen es, dass Geräte in verschiedenen physischen Standorten in einem Netzwerk miteinander kommunizieren können, als ob sie sich im selben physischen Standort befinden.

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

# Inhaltsverzeichnis


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

## Angabe

- VLAN Konfiguration
  - Löschen Sie ggf. die bestehende Konfiguration
  - Erstellen der Trunkverbindung (letzter Port). Kontrolle mittels CDP
  - Konfiguration von Switch_Etage1 als Server, Switch_Etage2 als Client
  - Konfiguration der VTP Domain: IFDOM
  - Anzeige der VTP Konfiguration
  - Erstellen von VLAN: Verkauf und Entwicklung
  - Zuweisen der Ports 1-3 zu Verkauf; 4-6 zu Entwicklung
  - Anzeige und Analyse der VLAN Konfiguration
  - Überprüfen der Verbindung (Ping)

- Inter-VLAN Routing
  - Aktivieren Sie das Intervlan Routing
  - Überprüfen der Erreichbarkeiten

## Commands

- `show vlan`: Zeigt die VLAN-Konfiguration an
- `show vtp status`: Zeigt den VTP-Status an

> VTP: VLAN Trunking Protocol
>
> - VTP ist ein Protokoll, das die Konfiguration von VLANs auf einem Netzwerk von Switches vereinfacht.
> - VTP ermöglicht es, VLAN-Informationen über das Netzwerk zu verteilen.
> - VTP ermöglicht es, VLANs auf einem Switch zu erstellen, zu löschen und zu ändern, und diese Änderungen werden automatisch auf alle anderen Switches im Netzwerk übertragen.

## VLAN Konfiguration

### Löschen Sie ggf. die bestehende Konfiguration

```bash
Switch# delete flash:vlan.dat
Switch# reload
```

### Erstellen der Trunkverbindung (letzter Port). Kontrolle mittels CDP

```bash
Switch(config)# interface range fa0/24
Switch(config-if-range)# switchport mode trunk
Switch(config-if-range)# switchport trunk encapsulation dot1q
Switch(config-if-range)# switchport trunk allowed vlan all
Switch(config-if-range)# no shutdown
```

### Konfiguration von Switch_Etage1 als Server, Switch_Etage2 als Client

```bash
Switch_Etage1(config)# vtp mode server
Switch_Etage1(config)# vtp domain IFDOM
Switch_Etage1(config)# vtp password cisco
Switch_Etage1(config)# vtp version 2
Switch_Etage1(config)# no shutdown
```

```bash
Switch_Etage2(config)# vtp mode client
Switch_Etage2(config)# vtp domain IFDOM
Switch_Etage2(config)# vtp password cisco
Switch_Etage2(config)# vtp version 2
Switch_Etage2(config)# no shutdown
```
