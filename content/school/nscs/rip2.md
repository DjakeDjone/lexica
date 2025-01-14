
# **Titel: RIP**

| **AufgabenNr:** | 05 |
|---|:---|
| **Klasse:** | 4AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | 16.1.2025 |
| **Abgabedatum:** | 17.1.2025 |

## **Kurzbeschreibung:**

In diesem Protokoll wird das RIP-Protokoll behandelt. Ziel ist es, ein Netzwerk nach Angabe des Lehrers aufzubauen und das Routing Information Protocol (RIP) zu konfigurieren.

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

- [1. Theoretischer Teil: Dynamische Routingprotokolle und RIP](#1-theoretischer-teil-dynamische-routingprotokolle-und-rip)
- [2. RIP-Konfiguration](#2-rip-konfiguration)
  - [a. Aktivierung von RIP in allen angeschlossenen Netzwerken](#a-aktivierung-von-rip-in-allen-angeschlossenen-netzwerken)
  - [b. Überprüfung und Aktivierung von RIP Version 2](#b-überprüfung-und-aktivierung-von-rip-version-2)
  - [c. Verwendete Timer in RIP](#c-verwendete-timer-in-rip)
- [3. Anzeige der Routing-Tabelle](#3-anzeige-der-routing-tabelle)
  - [a. Anzahl der gelernten Routen](#a-anzahl-der-gelernten-routen)
  - [b. Administrative Distanz von RIP](#b-administrative-distanz-von-rip)
  - [c. Gesendete Tabellen an den einzelnen Schnittstellen](#c-gesendete-tabellen-an-den-einzelnen-schnittstellen)
  - [d. Erklärung der Werte](#d-erklärung-der-werte)
- [4. Deaktivierung von Split Horizon und Beobachtung der Updates](#4-deaktivierung-von-split-horizon-und-beobachtung-der-updates)
- [5. Verfügbare Befehle im Router-Konfigurationsmodus](#5-verfügbare-befehle-im-router-konfigurationsmodus)
- [6. Konfiguration einer Default-Route und deren Verteilung mit RIP](#6-konfiguration-einer-default-route-und-deren-verteilung-mit-rip)
- [Zusammenfassung](#zusammenfassung)

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

## 1. Theoretischer Teil: Dynamische Routingprotokolle und RIP

Dynamische Routingprotokolle ermöglichen es Routern, Routing-Informationen automatisch auszutauschen und Routing-Tabellen ohne manuelle Eingriffe zu aktualisieren. Dies gewährleistet eine effiziente Datenweiterleitung und Anpassung an Netzwerkänderungen. Zu den Haupttypen dynamischer Routingprotokolle gehören:

- **Distanzvektor-Protokolle**: Router tauschen Informationen über die Entfernung (Metrik) und Richtung (Vektor) zu Zielnetzwerken aus. Beispiele sind RIP und IGRP.

- **Link-State-Protokolle**: Router haben eine vollständige Übersicht über die Netzwerkstruktur und berechnen den besten Pfad zu jedem Ziel. Beispiele sind OSPF und IS-IS.

- **Hybrid-Protokolle**: Kombinieren Eigenschaften von Distanzvektor- und Link-State-Protokollen, z. B. EIGRP.

## Routing Information Protocol (RIP)

RIP ist ein Distanzvektor-Routingprotokoll, das die Anzahl der Hops als Metrik verwendet. Es gibt drei Versionen:

- **RIPv1**: Klassisches Routing ohne Unterstützung für Subnetzmasken (classful).

- **RIPv2**: Erweitert um Unterstützung für Subnetzmasken (classless) und Authentifizierung.

- **RIPng**: Erweiterung für IPv6.

## 2. RIP-Konfiguration

### a. Aktivierung von RIP in allen angeschlossenen Netzwerken

```plaintext
Router> enable
Router# configure terminal
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# network 
Router(config-router)# exit
Router(config)# exit
Router# write memory
```

### b. Überprüfung und Aktivierung von RIP Version 2

Standardmäßig kann RIP Version 1 aktiv sein. Um die aktive Version zu überprüfen und gegebenenfalls Version 2 zu aktivieren:

```plaintext
Router# show ip protocols
```

Wenn Version 1 aktiv ist, wechseln Sie in den RIP-Konfigurationsmodus und aktivieren Sie Version 2:

```plaintext
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# exit
Router(config)# exit
Router# write memory
```

### c. Verwendete Timer in RIP

RIP verwendet mehrere Timer zur Steuerung des Routing-Verhaltens:

- **Update Timer**: Intervall für das Senden von Routing-Updates (standardmäßig 30 Sekunden).

- **Invalid Timer**: Zeit, nach der eine Route als ungültig markiert wird, wenn kein Update empfangen wurde (standardmäßig 180 Sekunden).

- **Holddown Timer**: Zeit, während der keine Änderungen an einer Route akzeptiert werden, nachdem sie als ungültig markiert wurde (standardmäßig 180 Sekunden).

- **Flush Timer**: Zeit, nach der eine ungültige Route aus der Routing-Tabelle entfernt wird (standardmäßig 240 Sekunden).

## 3. Anzeige der Routing-Tabelle

### a. Anzahl der gelernten Routen

Um die Routing-Tabelle anzuzeigen und die Anzahl der gelernten Routen zu ermitteln:

```plaintext
Router# show ip route
```

Gelehrte Routen werden mit einem "R" gekennzeichnet. Zählen Sie die Einträge, um die Anzahl der gelernten Routen zu bestimmen.

### b. Administrative Distanz von RIP

Die administrative Distanz (AD) gibt die Vertrauenswürdigkeit einer Routing-Information an. Für RIP beträgt die AD standardmäßig 120.

### c. Gesendete Tabellen an den einzelnen Schnittstellen

Um zu sehen, welche Routing-Informationen über welche Schnittstellen gesendet werden:

```plaintext
Router# debug ip rip
```

Beachten Sie, dass der Debug-Modus die Router-Performance beeinträchtigen kann. Verwenden Sie ihn daher vorsichtig und deaktivieren Sie ihn nach der Analyse:

```plaintext
Router# undebug all
```

## d. Erklärung der Werte

In den Routing-Updates werden folgende Informationen gesendet:

- **Netzwerkadresse**: Zielnetzwerk.

- **Metrik**: Anzahl der Hops zum Zielnetzwerk.

- **Next Hop**: IP-Adresse des nächsten Routers auf dem Weg zum Ziel.

## 4. Deaktivierung von Split Horizon und Beobachtung der Updates

Split Horizon verhindert, dass Routing-Informationen über die Schnittstelle gesendet werden, über die sie empfangen wurden, um Routing-Schleifen zu vermeiden. Um Split Horizon zu deaktivieren:

```plaintext
Router(config)# interface 0/0
Router(config-if)# no ip split-horizon
Router(config-if)# exit
Router(config)# exit
Router# write memory
```

Nach der Deaktivierung von Split Horizon können Routing-Updates über dieselbe Schnittstelle gesendet werden, über die sie empfangen wurden, was das Risiko von Routing-Schleifen erhöht.

## 5. Verfügbare Befehle im Router-Konfigurationsmodus

Im Router-Konfigurationsmodus von RIP stehen eine Vielzahl von Befehlen zur Verfügung, um die Funktionalität anzupassen. Hier eine Übersicht der wichtigsten Befehle:

- **`version [1 | 2]`**: Aktiviert die gewünschte RIP-Version.
- **`network [Netzwerkadresse]`**: Fügt ein Netzwerk hinzu, das durch RIP angekündigt wird.
- **`passive-interface [Interface]`**: Konfiguriert ein Interface als passiv, wodurch Updates nicht über dieses Interface gesendet, aber empfangen werden.
- **`default-information originate`**: Veranlasst den Router, die Standardroute über RIP zu propagieren.
- **`no ip split-horizon`**: Deaktiviert Split Horizon.
- **`timers basic [update invalid holddown flush]`**: Ändert die Timer für RIP.
- **`redistribute [Protokoll]`**: Ermöglicht die Verteilung von Routen aus anderen Protokollen (z. B. OSPF) in RIP.

Diese Befehle werden im Modus `Router(config-router)#` ausgeführt.

---

## 6. Konfiguration einer Default-Route und deren Verteilung mit RIP

Um eine Standardroute (Default Gateway) zu konfigurieren und sie mit RIP zu propagieren, gehen Sie wie folgt vor:

1. **Default-Route konfigurieren**:

   ```plaintext
   Router(config)# ip route 0.0.0.0 0.0.0.0 [Next-Hop-IP]
   ```

   Ersetzen Sie `[Next-Hop-IP]` durch die IP-Adresse des nächsten Routers.

2. **Propagieren der Default-Route mit RIP**:
   Wechseln Sie in den RIP-Konfigurationsmodus und aktivieren Sie die Weitergabe:

   ```plaintext
   Router(config)# router rip
   Router(config-router)# default-information originate
   Router(config-router)# exit
   ```

3. **Überprüfen der Konfiguration**:
   Nach der Konfiguration können Sie die Routing-Tabelle überprüfen, um sicherzustellen, dass die Standardroute propagiert wurde:

   ```plaintext
   Router# show ip route
   ```

---

## Zusammenfassung

Dieses Protokoll bietet eine Schritt-für-Schritt-Anleitung zur Aktivierung, Konfiguration und Analyse von RIP gemäß den Anforderungen der Aufgabenstellung. Es umfasst sowohl die Grundlagen dynamischer Routingprotokolle als auch spezifische Konfigurationen wie die Timer-Einstellungen, Split Horizon und die Verteilung einer Default-Route.
