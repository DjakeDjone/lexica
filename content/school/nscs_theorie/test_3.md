---
title: NSCS Test 3
description: "Theorie für den NSCS Test 3"
generateTableOfContents: true
---

## Stoff

Chapter 6 Multiarea OSPF
Ethernet v0.1

## Multiarea OSPF

<https://moodle.htlstp.ac.at/pluginfile.php/44457/mod_resource/content/0/ScaN_InstructorPPT_Chapter6_final_MultiareaOSPF.pptx>

### Probleme mit Single-Area OSPF

- große routing table
- große link-state database (LSDB)
- häufige SPF Berechnungen (SPF = Shortest Path First)

### OSPF Two-Layer Area Hierarchy

OSPF verwendet eine zweilagige Area-Hierarchie, um die Routing-Tabelle zu optimieren und die Last auf den Routern zu reduzieren.

- Backbone (transit) area: (area 0)
  - wichtigste funktion ist die schnelle und effiziente Verbreitung von IP Packeten
  - "Bridge" zwischen anderen OSPF Areas

- Regular (non-backbone) area: (area 1)
  - verbindet User mit Ressourcen
  - enthält Router, die nicht direkt miteinander verbunden sind

  <!-- todo: move image to correct folder -->

![types of ospf routes](/images/ospfRoutes.png)

### Router Types

- **Internal Router**: Router, der nur in einer Area arbeitet
- **Backbone Router**: Router in der **Backbone Area** (area 0)
- **Area Border Router (ABR)**: Router, der in mehreren Areas arbeitet und die Routing-Informationen zwischen diesen Areas austauscht ("Grenzrouter")
- **Autonomous System Boundary Router (ASBR)**: Router, der Routing-Informationen zwischen OSPF und anderen Routing-Protokollen austauscht (z.B. BGP). z.B. für Internet-Routing

<https://www.youtube.com/watch?v=PIMnj2oqYIo>

### OSPF LSA Types

LSA = Link State Advertisement

Die verschiedenen LSA-Typen werden verwendet, um unterschiedliche Informationen über die OSPF-Netzwerkstruktur zu verbreiten:

*Für den Test sind nur die LSA-Typen bis Type 5 relevant.*

- **Type 1 (Router LSA)**: Enthält Informationen über Router in der Area, ihre Schnittstellen und Verbindungen. Enthält die **Kosten** (Metric) zu den **benachbarten Routern.**
- **Type 2 (Network LSA)**: Wird von einem Designated Router (DR) in einem Multi-Access-Netzwerk erstellt und enthält Informationen über alle Router in diesem Netzwerk.
- **Type 3 (Summary LSA)**: Wird von einem ABR erstellt und enthält Informationen über Routen zu anderen Areas. Es wird verwendet, um Routen zwischen Areas zu verbreiten.
- **Type 4 (Summary LSA)**: Wird von einem ABR erstellt und enthält Informationen über Routen zu einem ASBR. Es wird verwendet, um Routen zu externen Netzwerken zu verbreiten.
- **Type 5 (External LSA)**: Wird von einem ASBR erstellt und enthält Informationen über Routen zu externen Netzwerken, die nicht Teil des OSPF-Netzwerks sind.
- **Type 7 (NSSA External LSA)**: Wird in Not-So-Stubby Areas (NSSA) verwendet und enthält Informationen über Routen zu externen Netzwerken, die von einem ASBR in einer NSSA verbreitet werden.
- **Type 8 (Link LSA)**: Wird in OSPFv3 verwendet und enthält Informationen über Links in einem OSPF-Netzwerk.
- **Type 9-11 (Opaque LSA)**: Werden in OSPFv3 verwendet und enthalten zusätzliche Informationen, die nicht in den anderen LSA-Typen enthalten sind.

> ### Begriffe
>
> - **Designated Router (DR)**: Router, der in einem Multi-Access-Netzwerk die Verantwortung für die Verbreitung von Routing-Informationen übernimmt.
> - **Backup Designated Router (BDR)**: Router, der als Backup für den DR fungiert und im Falle eines Ausfalls des DR die Verantwortung übernimmt.
> - **Area Border Router (ABR)**: Router, der in mehreren OSPF Areas arbeitet und Routing-Informationen zwischen diesen Areas austauscht.
> - **Autonomous System Boundary Router (ASBR)**: Router, der Routing-Informationen zwischen OSPF und anderen Routing-Protokollen austauscht.

## Ethernet v0.1

> ISO/OSI Schichtenmodell (als wiederholung)
>
> *Alle Pfarrer saufen Tequila nach der Predigt*
>
> - Layer 1: Physical Layer
> - Layer 2: Data Link Layer
> - Layer 3: Network Layer
> - Layer 4: Transport Layer
> - Layer 5: Session Layer
> - Layer 6: Presentation Layer
> - Layer 7: Application Layer

### Layer 1 (Physical Layer)

**3 Medien**

1. Strom
2. Licht
3. Luft

### Strom

Der Unterschid zwischen Hochfrequenz- und Niedrigfrequenzkabeln:

- **Hochfrequenzkabeln**: Übertragen Signale mit hohen Frequenzen (über 1 MHz)
  - Beispiele: Koaxialkabel (z.B. Ethernet-Kabel)
  - Verwendung: Datenübertragung in Netzwerken, Fernsehsignale, Internetverbindungen
- **Niedrigfrequenzkabeln**: Übertragen Signale mit niedrigen Frequenzen (unter 1 MHz)
  - Beispiele: Telefonkabel, Stromkabel
  - Verwendung: Telefonkommunikation, Stromversorgung

#### Koaxialkabel

<!-- TODO -->
![Koaxialkabel](/images/koaxialkabel.png)

Diese Art von Kabel wurde früher häufig in der Ethernet-Verkabelung zusammen mit der **Bustopologie** verwendet.

![Bustologie](/images/bustologie.png)

Nachteil: sehr fehleranfällig, da ein Kabelbruch das gesamte Netzwerk lahmlegen kann.

#### Twisted Pair Kabel

Um Störungen zu vermeiden, werden die Adernpaare in einem Twisted-Pair-Kabel verdrillt. Dadurch wird die elektromagnetische Interferenz reduziert.
 (Die Magnetfelder der Adernpaare heben sich gegenseitig auf.)

<!-- TODO -->
![Twisted Pair](/images/twisted-pair.png)

![Twisted Pair: Kable Types](/images/twisted-pair-types.png)

Verwendet mit **Sterntopologie**

Ein Problem von geschirmten Twisted-Pair-Kabeln ist, dass sich die Abschirmung bei der Übertragung von Signalen auflädt und dadurch Störungen verursachen kann. Um dies zu vermeiden, sollte die Abschirmung geerdet werden. (Der Stecker muss dafür einen Kontakt haben, der mit der Abschirmung verbunden ist.)

**Problem 2**: Ist die Spannung der Erdung zu hoch, sprich wenn Strom durch die Erdung fließt, kann es zu Störungen kommen. Um dies zu vermeiden, sollte die Erdung so ausgelegt sein, dass kein Strom fließt.

#### Qualitätsmerkmale der Kabel

Qualitätsmerkmale sind

- **Dämpfung**: Verlust der Signalstärke über die Länge des Kabels
- **Übertragungsbandbreite**: Frequenzbereich, in dem das Kabel Signale übertragen kann
- **Streckenlänge**: Maximale Länge des Kabels, über die Signale ohne signifikanten Verlust übertragen werden können
- **Störsicherheit**: Fähigkeit des Kabels, Störungen von anderen Signalen zu widerstehen
- **Impedanz**: Widerstand des Kabels gegen Wechselstrom, der die Signalübertragung beeinflusst

| Name  | Typ | Frequenz | Anwendungen                                  |
|-------|-----|----------|----------------------------------------------|
| Cat1  | UTP | 0,4 MHz  | Telefon- und Modem-Leitungen                 |
| Cat2  | UTP | 4 MHz    | Ältere Terminalsysteme, z.B. IBM 3270        |
| Cat3  | UTP | 16 MHz   | 10BASE-T und 100BASE-T4 Ethernet             |
| Cat4  | UTP | 20 MHz   | 16 Mbit/s Token Ring                         |
| Cat5  | UTP | 100 MHz  | 100BASE-TX & 1000BASE-T Ethernet            |
| Cat5e | UTP | 100 MHz  | 100BASE-TX & 1000BASE-T Ethernet            |
| Cat6  | UTP | 250 MHz  | 10GBASE-T Ethernet                           |
| Cat6a | STP | 500 MHz  | 10GBASE-T Ethernet                           |
| Cat7  | STP | 600 MHz  | 10GBASE-T Ethernet                           |
| Cat7a | STP | 1000 MHz | 10GBASE-T Ethernet                           |

#### Dämpfung

Die Dämpfung berechnet sich als:

$$
D[db] = 20 * log U_{A}/U_{E}
$$

- $U_{A}$ = Amplitudenwert des Signals am Ende der Leitung
- $U_{E}$ = Amplitudenwert des Signals am Anfang der Leitung
- $D$ = Dämpfung in dB

Der Wiederstand (und somit die Dämpfung) eines Kabels ist von der **Länge** sowie der **Frequenz** des Signals abhängig.
Je höher die Frequenz, desto höher der Widerstand und somit die Dämpfung.

#### Ethernet-Standards

Die Kabelart sowie die Maximallänge eines Kabels sind in den Ethernet-Standards festgelegt. Diese Standards definieren auch die Übertragungsraten und die verwendeten Protokolle. Der aktuelle Standard ist IEEE 802.3, der verschiedene Ethernet-Varianten definiert.

<https://en.wikipedia.org/wiki/IEEE_802.3>

### Übertragung mittels Licht

<https://moodle.htlstp.ac.at/pluginfile.php/45975/mod_resource/content/0/NSCS_Ethernet_01.pdf>

Das Signal wird aufbearbeitet und mittels LEDs oder Laser übertragen. Ein Lichtwellenleiter (z.B. Glasfaser) überträgt dieses Signal.
Eine Fotodiode empfängt das Signal und wandelt es zurück in elektrische Signale.

![Glasfaser Arten](/images/glasfaserTypes.png)

- **Stufenindex**: Licht wird von der Faserwand reflektiert und in der Faser gehalten; Anwendung: Kurze Strecken (<300km), nicht mehr sehr verbreitet
- **Gradientenindex**: Licht wird durch eine Änderung des Brechungsindex in der Faser gehalten ("quasi sinusförmige Reflexion"); Anwendung: locale Netzwerke, <500m
- **Einmodenfaser/Singlemodefaser**: nur eine Modus (Lichtwelle) kann sich in der Faser ausbreiten; Anwendung: lange Strecken (>500m), hohe Bandbreite, geringe Dämpfung
- **NZDS-Faser:** "Non-Zero Dispersion-Shifted Fiber", eine Einmodenfaser mit geringer Dispersion (Verzerrung) für hohe Übertragungsraten
- **PM-Faser**

#### Verbindungsarten

- **Steckverbindung**: große Dämpfung (NT)
- **mechanische Spleiße**: Fasern werdenn durch Hülse verbunden, geringere Dämpfung (VT), aber aufwändig
- **thermische Spleiße**: Enden mit Hitze verbunden, sehr geringe Dämpfung (VT), aber sehr aufwändig u. **teuer**

### Vor- und Nachteile

| Medium          | Vorteile                                           | Nachteile                                         |
|------------------|----------------------------------------------------|---------------------------------------------------|
| Strom            | Einfach, kostengünstig, weit verbreitet           | Störungen, begrenzte Bandbreite, elektromagnetische Interferenz |
| Licht            | Hohe Bandbreite, geringe Dämpfung, keine Störungen | Teuer, aufwändig in der Installation, empfindlich gegenüber physischen Einflüssen |
| Luft             | Keine Verkabelung erforderlich, flexibel          | Begrenzte Reichweite, anfällig für Störungen, Wetterabhängigkeit |

## Layer 2 (Data Link Layer)

Ethernet wurde in den 80ern von Xerox (Drucker) erfunden und später von DIX (Digital, Intel, Xerox) standardisiert. Es ist ein Protokoll für die Datenübertragung in lokalen Netzwerken (LANs).

### Zugriffsverfahren

#### CSMA/CD (Carrier Sense Multiple Access with Collision Detection)

CSMA/CD ist ein Zugriffsverfahren, das in Ethernet-Netzwerken verwendet wird, um Kollisionen zu erkennen und zu vermeiden. Es funktioniert wie folgt:

1. **Carrier Sense**: Jedes Gerät hört den Kanal ab, um festzustellen, ob er frei ist.
2. **Multiple Access**: Mehrere Geräte können gleichzeitig auf den Kanal zugreifen.
3. **Collision Detection**: Wenn zwei Geräte gleichzeitig senden, kommt es zu einer Kollision. Die Geräte erkennen dies und stoppen die Übertragung.
4. **Backoff**: Nach einer Kollision warten die Geräte eine zufällige Zeit, bevor sie erneut versuchen zu senden.
CSMA/CD ist in modernen Ethernet-Netzwerken nicht mehr notwendig, da Switches Kollisionen vermeiden, indem sie Frames nur an den Port weiterleiten, an dem das Zielgerät angeschlossen ist.

### Koallisionsdomänen

Eine **Kollisionsdomäne** ist ein Bereich, in dem mehrere Geräte gleichzeitig senden können und sich dadurch Daten überlagern können.

Der erste Ethernet Standard schrieb eine max. Ausdehnung von **2500m** vor. Dazu musste die minimale Framelänge **64 Byte** betragen, damit eine Kollision erkannt werden konnte, bevor das Frame vollständig gesendet wurde.

Bei 100MBit wurde die max. Ausdehnung auf 250m reduziert.

Die Kollisionsdomäne wird durch **Switches** und **Hubs** gebildet. Ein Switch leitet Frames nur an den Port weiter, an dem das Zielgerät angeschlossen ist, während ein Hub Frames an alle Ports weiterleitet. [CMA/CD](#cmacd-carrier-sense-multiple-access-with-collision-detection)
ist hier nicht mehr notwendig, da Switches Kollisionen vermeiden.

Hier ist jetzt auch **FULL-Duplex** möglich!

### Physische Addressen (MAC)

#### Aufbau

- 1 Bit Unicast/Multicast
- 1 Bit Global/Local
- nächste **22**: Hersteller ID (OUI)
- letzte **24**: Geräte ID (NIC)

![Aufbau Macaddresse](/images/macAufbau.png)

![Ethernet Frame](/images/ethernet-frame.png)
