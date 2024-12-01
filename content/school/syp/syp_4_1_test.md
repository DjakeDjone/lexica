# Syp 1. Test 4. Klasse

## Stoff

---

## Grundlagen der IT-Architektur

### Enterprise Architektur Management (EAM)

- **Definition**: Planung, Steuerung und Kontrolle der IT-Architektur (IT-Systeme, Abläufe, Produkte)
- **Ziele**: Keine Redundanzen, Standardisierung, wichtig weil Code wiederverwendet werden kann und die Mitarbeiter nicht neue Systeme lernen müssen
- **Aufgaben**: Architekturplanung, Einsparung von Kosten, Verbesserung der Qualität u.ä.
- **Nachteile**: Aufwand, Kosten, Komplexität, schränkt Flexibilität ein

### ArchiMate Notationsstandard

- **Definition**: Notationsstandard für Enterprise Architektur (Open Source!)

**Schichtenmodell:**

- **Business Layer**: Geschäftsprozesse, Organisation
- **Application Layer**: Anwendungen, Software
- **Technology Layer**: Hardware, Software, Netzwerk

### IT-Architekturrollen

- **Business Architekt**: alle Prozesse und Capabilities des Unternehmens
- **Enterprise Architekt**:alle IT-Systeme und Prozesse, hat Überblick über alle Systeme
- **Solution Architekt**: spezifische Lösungen für ein Problem
- **IT-Architekt**: technische Umsetzung der Lösung, hat spezielle Kenntnisse

**Anforderungen** (Stark vereinfacht):

Während der **Buisness Architekt** noch keine IT-Kenntnisse benötigt, muss der **Enterprise Architekt** alle IT-Systeme kennen und der **Solution Architekt** muss spezielle Kenntnisse haben. Der **IT-Architekt** muss die Lösung technisch umsetzen können.

---

## Prozesse

### Grundlegende Merkmale eines Prozesses

- Ein Prozess ist eine **Vielzahl von Aufgaben**, die in einer **bestimmten Reihenfolge** abgearbeitet werden. Ein Prozess hat **Eingaben** und **Ausgaben** und wird von **Personen, Maschinen oder Software** durchgeführt.
- **hoher Wiederholungsgrad**
- **Ziel**: **Wertschöpfung** (Produkt, Dienstleistung)

### Elemente einer Prozessbeschreibung

| Element | BPMN |
| --- | --- |
| Auslöser/Anstoß | Start-Event |
| Input | Eingabedaten |
| Aufgaben | Aktivitäten |
| Rollen | Pools/Lanes |
| Varianten | Gateways (für Verzweigungen) |
| Ende | End-Event |
| Ergebnis (Output) | Ausgabedaten |
| Lieferant | Externe Entität/Lane |
| Kunde | Externe Entität/Lane |
| Schnittstelle | Message-Flow |
| Verantwortung | Lane |

### Darstellungsarten für Geschäftsproäzesse

a) **Tabellenform**
b) **Aufgabefolgeplan**
c) **Swimlane-Diagramm**
d) **BPMN-Notation**

### End-to-End-Prozess

- **End-to-End-Prozess**: Prozess, der **alle Schritte** von der **Anforderung** bis zur **Auslieferung** umfasst.

### Rolle der IT in Geschäftsprozessmanagement

a) **PM**: Prozessmodellierer
b) **GPV:** Gesamtprozessverantwortlicher (End-to-End)
c) **TPV:** Teilprozessverantwortlicher (Fachwissen)
d) Sonstige Experten

Generell: **IT** unterstützt **Prozessmanagement** durch **Automatisierung** und **Optimierung**.

### Leistungsarten bei der Prozessanalyse (Wertschöpfung)

- **Nutzlast**: Wert für den Kunden
- **Stützlast**: Wert für das Unternehmen
- **Blindleistung**: Kein Wert
- **Fehlleistung**: Schadensfall

---

## DMN

DMN: **Decision Model and Notation**, Standard für Entscheidungsmodelle

### Unterschied zu PMN (Prozessmodellierung)

Ein Prozessmodell beschreibt den **Ablauf** und die Reihenfolge von **Aktivitäten**.
Ein Entscheidungsmodell beschreibt die **Regeln** und die **Bedingungen** für **Entscheidungen**

![BPM vs DMN img.](/images/bpm_vs_dmn.png)

### Kernelemente eines DMN

- **Decision**: Ergebnis einer Entscheidung
- **Input Data**: Daten, die für die Entscheidung benötigt werden
- **Knowledge Source**: Wissen, das für die Entscheidung benötigt wird

### Hit Policy

Eine Hit Policy legt fest, welche und wie viele Ergeinisse bei richtigen Bedingungen ausgegeben werden. 

- **U**: Unique (genau eine Regel)
- **F**: First (erste Regel)
- **A**: Any (alle Regeln)
- **P**: Priority (Priorität)
- **C**: Collect (alle Ergebnisse, die zutreffen)

---

## Aufwandschätzung

