

# **Titel: Etherchannel und Portsecurity**

| **AufgabenNr:** | 01 |
|---|:---|
| **Klasse:** | 4AHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 1 |
| **Abgabetermin:** | 17.10.2024 |
| **Abgabedatum:** | 17.10.2024 |

## **Kurzbeschreibung:**

Einführung in Etherchannel und Portsecurity. Etherchannel ist eine Technologie, die es ermöglicht, mehrere physische Verbindungen zwischen zwei Geräten zu bündeln, um die Bandbreite zu erhöhen und die Redundanz zu verbessern. Portsecurity beschränkt den Zugriff auf den Switchport, indem er die MAC-Adresse des angeschlossenen Geräts überwacht und den Zugriff auf den Port erlaubt oder verweigert.

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

1. [Aufbau](#1-aufbau)
2. [Allgemeines zu Etherchannel und LACP](#allgemeines-zu-etherchannel-und-lacp)
3. [Konfiguration von Etherchannel mit LACP](#2-konfiguration-von-etherchannel-mit-lacp)
    1. [Physische Schnittstellen konfigurieren](#21-physische-schnittstellen-konfigurieren)
    2. [Etherchannel-Bündel erstellen](#22-etherchannel-bündel-erstellen)
    3. [Physische Schnittstellen zum Etherchannel-Bündel hinzufügen](#23-physische-schnittstellen-zum-etherchannel-bündel-hinzufügen)
    4. [Konfiguration überprüfen](#24-konfiguration-überprüfen)
4. [Portsecurity](#3-portsecurity)
    1. [Konfiguration von Portsecurity](#31-konfiguration-von-portsecurity)
        1. [Portsecurity aktivieren](#311-portsecurity-aktivieren)
        2. [Portsecurity mit MAC-Adressen konfigurieren](#312-portsecurity-mit-mac-adressen-konfigurieren)
        3. [Portsecurity-Verletzungen konfigurieren](#313-portsecurity-verletzungen-konfigurieren)
        4. [Portsecurity-Verletzungen anzeigen](#314-portsecurity-verletzungen-anzeigen)
    2. [Befehle zur Überprüfung des Portstatus](#befehle-zur-überprüfung-des-portstatus)

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

## 1. Aufbau

Ein Router verbunden mit einem Core Switch, der wiederum mit zwei weiteren Switches über 2 Ports verbunden ist. Die Switches haben wieder jeweils zwei Access Switches angeschlossen. Die Access Switches sind mit jeweils einem Client verbunden.

![base aufbau](/images/school_nscs_image.png)

## Allgemeines zu Etherchannel und LACP

Etherchannel ist eine Technologie, die es ermöglicht, mehrere physische Verbindungen zwischen zwei Geräten zu bündeln, um die Bandbreite zu erhöhen und die Redundanz zu verbessern. Etherchannel wird auch als Portbündelung oder Linkaggregation bezeichnet. Es gibt verschiedene Protokolle, die zur Konfiguration von Etherchannel verwendet werden können, darunter LACP (Link Aggregation Control Protocol) und PAgP (Port Aggregation Protocol). In diesem Abschnitt werden wir uns auf LACP konzentrieren.

LACP ist ein standardisiertes Protokoll, das von IEEE 802.3ad definiert wird und die automatische Konfiguration von Etherchannel-Gruppen ermöglicht. LACP ermöglicht es, mehrere physische Verbindungen zwischen zwei Geräten zu bündeln und als eine logische Verbindung zu behandeln. LACP verwendet eine dynamische Methode zur Bestimmung, welche Ports in einem Etherchannel-Bündel aktiv sind und welche Ports inaktiv sind. LACP ermöglicht auch die automatische Erkennung und Behebung von Fehlern in der Verbindung.

## 2. Konfiguration von Etherchannel mit LACP

**Schritte**

1. Konfigurieren Sie die physischen Schnittstellen, die Sie zu einem Etherchannel-Bündel hinzufügen möchten.
2. Erstellen Sie ein Etherchannel-Bündel und konfigurieren Sie es mit dem Befehl `channel-group <group-number> mode active`.
3. Konfigurieren Sie die Schnittstellen, die Sie zu einem Etherchannel-Bündel hinzufügen möchten, mit dem Befehl `channel-group <group-number> mode active`.
4. Überprüfen Sie die Konfiguration mit dem Befehl `show etherchannel summary`.

### 2.1 Physische Schnittstellen konfigurieren

Konfig auf Switch 1 (Core Switch):
The Access Switch are connected on Ports 2 and 3.

```bash
Switch1(config)# interface range fastethernet 0/2-3
Switch1(config-if-range)# no shutdown
```
![alt text](/images/school_nscs_image-4.png)

Der Befehl `range` wählt gleichzeitig mehrere Schnittstellen (in diesem Fall GigabitEthernet 0/2 und 0/3) aus, und der Befehl `no shutdown` aktiviert die Schnittstellen.

Konfig auf Switch 2 (Switch unter Core Switch):

```bash
Switch2(config)# interface range fastethernet 0/1-3
Switch2(config-if-range)# no shutdown
```

![alt text](/images/school_nscs_image-5.png)

### 2.2 Etherchannel-Bündel erstellen

Konfig auf Switch 1 (Core Switch):

```bash
Switch1(config)# interface port-channel 1
Switch1(config-if)# switchport mode trunk
Switch1(config-if)# no shutdown
```
![alt text](/images/school_nscs_image-6.png)

Der Befehl `interface port-channel 1` erstellt ein Etherchannel-Bündel mit der Nummer 1. Der Befehl `switchport mode trunk` konfiguriert das Etherchannel-Bündel als Trunk-Port, und der Befehl `no shutdown` aktiviert das Etherchannel-Bündel.

### 2.3 Physische Schnittstellen zum Etherchannel-Bündel hinzufügen

Konfig auf Switch 1 (Core Switch):

```bash
Switch1(config)# interface range fastethernet 0/2-3
Switch1(config-if-range)# channel-group 1 mode active
```
![alt text](/images/school_nscs_image-7.png)

Der erste Befehl wählt die Schnittstellen aus, die zum Etherchannel-Bündel hinzugefügt werden sollen, und der zweite Befehl fügt die Schnittstellen zum Etherchannel-Bündel hinzu und konfiguriert sie im aktiven Modus.

Wieder für Switch 2 (Switch unter Core Switch):

```bash
Switch1(config)# interface range fastethernet 0/1-3
Switch1(config-if-range)# channel-group 1 mode active
```

![alt text](/images/school_nscs_image-8.png)

### 2.4 Konfiguration überprüfen

Konfig auf Switch 1 (Core Switch):

```bash
Switch1# show etherchannel summary
```

![alt text](/images/school_nscs_image-9.png)

Der Befehl `show etherchannel summary` zeigt eine Zusammenfassung der Etherchannel-Konfiguration auf dem Switch an, einschließlich der Nummer des Etherchannel-Bündels, der Mitgliedsschnittstellen und ihres Status.

> **Hinweis:**
>
> In dem Beispiel muss das für jeden Switch gemacht werden, der an das Etherchannel-Bündel angeschlossen ist.

## 3. Portsecurity

Beschreibung:
Portsecurity beschränkt den Zugriff auf den Switchport, indem er die MAC-Adresse des angeschlossenen Geräts überwacht und den Zugriff auf den Port erlaubt oder verweigert.

### 3.1 Konfiguration von Portsecurity

#### 3.1.1 Portsecurity aktivieren

Konfig auf einem Access Switch:

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport mode access
Switch1(config-if)# switchport port-security
```

![Portsecurity aktivieren](/images/school_nscs_portsecurity.png)

Der Befehl `switchport port-security` aktiviert Portsecurity auf dem Switchport.

#### 3.1.2 Portsecurity mit MAC-Adressen konfigurieren

Jetzt konfigurieren wir die Portsecurity, um die MAC-Adresse des angeschlossenen Geräts zu überwachen und den Zugriff auf den Port zu erlauben oder zu verweigern.

Konfig auf einem Access Switch:

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport port-security mac-address sticky
```

`switchport port-security mac-address sticky` bedeutet, dass die MAC-Adresse des angeschlossenen Geräts automatisch gelernt und in die Konfiguration des Switchports eingetragen wird (sticky).

![img. switchport port-security mac-address sticky](/images/school_nscs_mac-sticky.png)

#### 3.1.3 Portsecurity-Verletzungen konfigurieren

Portsecurity kann so konfiguriert werden, dass es auf Verletzungen reagiert, z.B. wenn ein unbekanntes Gerät angeschlossen wird.

Konfig auf einem Access Switch:

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport port-security violation restrict
```

`switchport port-security violation restrict` bedeutet, dass der Zugriff auf den Port verweigert wird, wenn eine unerlaubte MAC-Adresse erkannt wird. Unter `restrict` wird der Port nicht deaktiviert, sondern der Zugriff auf den Port wird verweigert.

![`switchport port-security violation restrict`](/images/school_nscs_port-sec-restrict.png)

#### Alle Commands zusammen

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport mode access
Switch1(config-if)# switchport port-security
Switch1(config-if)# switchport port-security mac-address sticky
Switch1(config-if)# switchport port-security violation restrict
```

#### 3.1.4 Portsecurity-Verletzungen anzeigen

Zum Testen der Portsecurity können wir eine Verletzung erzeugen, indem wir ein unbekanntes Gerät an den Switchport anschließen.

Konfig auf einem Access Switch:

```bash
Switch1# show port-security
```

![Port Security Proof table (it worked)](/images/school_nscs_port-security-proof.png)


> Statische vs. Dynamische Portsecurity
>
> Statische Portsecurity: Die MAC-Adresse des angeschlossenen Geräts wird manuell konfiguriert. `switchport port-security mac-address` wird verwendet, um die MAC-Adresse manuell zu konfigurieren.
>
> Dynamische Portsecurity: Die MAC-Adresse des angeschlossenen Geräts wird automatisch gelernt und in die Konfiguration des Switchports eingetragen. `switchport port-security mac-address sticky` wird verwendet, um die MAC-Adresse automatisch zu lernen.
>

#### MAC-Adressen manuell konfigurieren

Konfig auf einem Access Switch:

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport port-security mac-address 0011.2233.4455
```

![Total secure mac-addresses on interface FastEthernet0/1 has reached maximum limit.](/images/school_nscs_manual-port-sec.png)

Wenn die maximale Anzahl von MAC-Adressen erreicht ist, kann man die maximale Anzahl von MAC-Adressen auf einem Port erhöhen.

```bash
Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport port-security maximum 5
```

Jetzt können die MAC-Adressen manuell konfiguriert werden. (wie oben)

![Manual-MAC-Adressen Port sec.](/images/school_nscs_port-sec-manual.png)

### Befehle zur Überprüfung des Portstatus

1. `show port-security` - Zeigt den Portstatus und die konfigurierten Portsecurity-Optionen an.
2. `show port-security address` - Zeigt die gelernten MAC-Adressen und die Anzahl der Verletzungen an.
3. `show port-security interface fastethernet 0/1` - Zeigt die Portsecurity-Konfiguration für einen bestimmten Port an.
