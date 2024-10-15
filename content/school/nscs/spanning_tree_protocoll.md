

# **Titel: Shells**

| **AufgabenNr:** | 10 |
|---|:---|
| **Klasse:** | 3BHIF |
| **Name:** | Benjamin Friedl |
| **Gruppe:** | 2 |
| **Abgabetermin:** | 07.04.2024 |
| **Abgabedatum:** | 08.04.2024 |

## **Kurzbeschreibung:**

In diesem Protokoll wird auf die verschiedenen Shells und deren Funktionsweise eingegangen. Außerdem werden verschiedene Befehle und deren Verwendung erklärt. Abschließend wird auf das Tool Netcat eingegangen und dessen Verwendungsmöglichkeiten aufgezeigt.

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

1. [Shells](#shells)
2. [Commands](#commands)
3. [Verketten von Befehlen](#verketten-von-befehlen)
4. [Netcat](#netcat)
    1. [Chat-Tool](#chat-tool)
    2. [File-Transfer-Tool](#file-transfer-tool)
    3. [Shellzugriff](#shellzugriff)
    4. [Netcat unter Windows](#netcat-unter-windows)
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
\
\
\
\
\
\
\

## 1. Allgemeine Aufgaben und Funktionen des STP

Das **Spanning Tree Protocol** (STP) hat folgende Funktionen:

- Verhindern von Netzwerkschleifen: STP erkennt redundante Pfade und deaktiviert unnötige Links, um Schleifen zu vermeiden.
- Ermitteln einer Root Bridge: Der Switch mit der niedrigsten Bridge-ID wird zur Root Bridge gewählt.
- Verwalten der Netzwerkpfade: Jeder Switch bestimmt einen optimalen Pfad zur Root Bridge.
-Port-Zustände: STP kann Ports in verschiedene Zustände versetzen, wie **z. B.:**
  - **Blocking**: Der Port leitet keine Frames weiter, empfängt aber BPDU-Nachrichten.
  - **Listening**: Der Port hört auf BPDU-Nachrichten, leitet aber keine Frames weiter.
  - **Learning**: Der Port beginnt, MAC-Adressen zu lernen, leitet aber noch keine Frames weiter.
  - **Forwarding**: Der Port leitet Daten weiter und lernt MAC-Adressen.
  - **Disabled**: Der Port ist deaktiviert

## 2. Timer im Spanning Tree Protocol

**STP verwendet drei Haupt-Timer, um das Netzwerk zu stabilisieren:**

- **Hello-Timer** (Standard 2 Sekunden): Gibt an, wie oft die Root Bridge BPDU-Nachrichten sendet.
- **Max Age-Timer** (Standard 20 Sekunden): Gibt an, wie lange ein Switch eine BPDU behält, bevor er den Pfad als ungültig betrachtet.
- **Forward Delay-Timer** (Standard 15 Sekunden): Gibt die Dauer an, wie lange ein Port im Listening- und Learning-Zustand bleibt.

## 3. Theoretische Fragen

<!-- TODO -->

## 4. Praktische Übungen