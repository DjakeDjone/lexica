# Syp 1. Test 4. Klasse

## Stoff

1. [Stoff](#stoff)  
2. [Grundlagen der IT-Architektur](#grundlagen-der-it-architektur)  
   2.1. [Enterprise Architektur Management (EAM)](#enterprise-architektur-management-eam)  
   2.2. [ArchiMate Notationsstandard](#archimate-notationsstandard)  
   2.3. [IT-Architekturrollen](#it-architekturrollen)  
3. [Prozesse](#prozesse)  
   3.1. [Grundlegende Merkmale eines Prozesses](#grundlegende-merkmale-eines-prozesses)  
   3.2. [Elemente einer Prozessbeschreibung](#elemente-einer-prozessbeschreibung)  
   3.3. [Darstellungsarten für Geschäftsprozesse](#darstellungsarten-für-geschäftsprozesse)  
   3.4. [End-to-End-Prozess](#end-to-end-prozess)  
   3.5. [Rolle der IT in Geschäftsprozessmanagement](#rolle-der-it-in-geschäftsprozessmanagement)  
   3.6. [Leistungsarten bei der Prozessanalyse](#leistungsarten-bei-der-prozessanalyse)  
4. [DMN](#dmn)  
   4.1. [Unterschied zu BPMN (Prozessmodellierung)](#unterschied-zu-bpmn)  
   4.2. [Kernelemente eines DMN](#kernelemente-eines-dmn)  
   4.3. [Hit Policy](#hit-policy)  
5. [Aufwandschätzung](#aufwandschätzung)  
   5.1. [Kalkulationszeitpunkte eines Projektzyklus](#kalkulationszeitpunkte-eines-projektzyklus)  
   5.2. [Faktoren für die Aufwandschätzung](#faktoren-für-die-aufwandschätzung)  
   5.3. [FTE (Full-Time Equivalent)](#fte)  
   5.4. [Optimale Mitarbeiteranzahl (Brook'sches Gesetz)](#optimale-mitarbeiteranzahl-brooksches-gesetz)  
   5.5. [Ansätze zur Aufwandschätzung](#3-ansätze-zur-aufwandschätzung)  
   5.6. [Berechnungsmethoden zur Aufwandschätzung](#berechnungsmethoden-zur-aufwandschätzung)  
   5.7. [Schritte der Function-Point-Methode](#schritte-der-function-point-methode)  
   5.8. [Einflussfaktoren der Function-Point-Methode](#einflussfaktoren-der-function-point-methode)  
   5.9. [Umrechnung der BFP in Mitarbeiteraufwand](#umrechnung-der-bfp-in-mitarbeiteraufwand)  
   5.10. [FP-Verfahren](#fp-verfahren)  
   5.11. [SFP-Verfahren](#sfp-verfahren)  
   5.12. [Base Functional Components im SFP](#base-functional-components-im-sfp)  
   5.13. [Operationstypen im SFP](#operationstypen-im-sfp)  
   5.14. [Functional Size Table im SFP](#functional-size-table-im-sfp)  
6. [BPMN](#bpmn)  
   6.1. [BPMN-Elemente](#bpmn-elemente)  
   6.2. [Arten von Aktivitäten](#arten-von-aktivitäten)  
7. [SCRUM](#scrum)


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

### Darstellungsarten für Geschäftsprozesse

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

### Leistungsarten bei der Prozessanalyse

- **Nutzlast**: Wert für den Kunden
- **Stützlast**: Wert für das Unternehmen
- **Blindleistung**: Kein Wert
- **Fehlleistung**: Schadensfall

---

## DMN

DMN: **Decision Model and Notation**, Standard für Entscheidungsmodelle

### Unterschied zu BPMN

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

Schätzung des **Aufwands** für ein Projekt

### Kalkulationszeitpunkte eines Projektzyklus

- **Vorkalkulation**: initale Kostenschätzung
- **Plankalkulation**: detaillierte Kostenschätzung in den P-Phasen
- **Mitlaufende Kalkulation**: Kostenschätzung während der P-Durchführung
- **Nachkalkulation**: Abschlusskalkulation am Ende des Projekts

### Faktoren für die Aufwandschätzung

- **Größe u. Komplexität**: Lines of COde, Funktionsumfang..
- **Qualität**: Benutzerfreundlichkeit, Zuverlässigkeit..
- **Projektdauer**: Anz. Mitarbeiter, Zeitrahmen..
- **Produktivität**: Personal, HW/SW Verfügbarkeit..

![faktoren der aufwandschätzung img.](/images/aufwandschaetzung_faktoren.png)

### FTE

**FTE**: Full-Time Equivalent, Vollzeitäquivalent

Bsp: 2 Mitarbeiter arbeiten je 20h/Woche, also 0,5 FTE. Insgesamt also 1 FTE.

### Optimale Mitarbeiteranzahl (Brook'sches Gesetz)

Zu viele Mitarbeiter verlangsamen die Entwicklung, da die Kommunikation und Koordination zunimmt.

![Brooksches Gesetz, eine U Kurve](/images/broksches_gesetzt.png)

### 3 Ansätze zur Aufwandschätzung

1. **Algorithmische Methoden**: COCOMO, Function Points
2. **Vergleichsmethoden**: Erfahrungswerte, Analogieschlüsse
3. **Expertenschätzungen**: Experteninterviews, Delphi-Methode

### Berechnungsmethoden zur Aufwandschätzung

- Analogiemethode: Vergleich mit ähnlichen Projekten
- Relationsmethode: Verhältnis von Aufwand und Größe
- Multiplikationsmethode: Aufwand = Größe * Produktivität
- Gewichtungsmethode: Gewichtung von Faktoren
- Prozentsatzmethode: Prozentsatz von Gesamtaufwand

### Schritte der Function-Point-Methode

1. **Projektumfang** bestimmen; Funktionstypen analysieren (Ein/Ausgabedaten, Datenbestände, Referenzdaten, Abfragen)
2. Funktionstypen **bewerten** (einfach, mittel, schwer)
3. **Einflussfaktoren** bewerten (0-5)
4. Function Points **berechnen** (BFP = (Summe FP) * (0,7 + EF * 0,01))
5. **Aufwand** schätzen (Aufwand = BFP * Produktivität)

> Einflussfaktoren:
>
> - Verflechtung mit anderen Anwendungssystemen
> - Dezentrale Verwaltung der Daten
> - Transaktionsrate
> - Verarbeitungslogik
> - Wiederverwendung in anderen Anwendungen
> - Datenbestandskonvertierungen
> - Parametrisierbarkeit durch den Benutzer
>

### Einflussfaktoren der Function-Point-Methode

Function Points können durch Einflussfaktoren beeinflusst werden. Diese sind:

- **Datenkommunikation**: 0-5
- **Verteilte Verarbeitung**: 0-5
- Leistungsanforderung
- Transaktionsrate
- Benutzerinteraktion
- Wiederverwendbarkeit
- Einfache Bedienbarkeit
- Anpassbarkeit
- Installierbarkeit
- Mehrbenutzerfähigkeit
- ...

### Umrechnung der BFP in Mitarbeiteraufwand

- **BFP**: Berechnete Function Points
- **PM**: Produktivität in Personentagen/Function Point

**Mitarbeiteraufwand** = BFP * PM

![alt text](/images/zuordnung_bfp_pm.png)

**Beispiel**:
Die Function-Point-Analyse ergibt 100 BFP. Die Produktivität beträgt 10 Personentage/Function Point. Wie hoch ist der Mitarbeiteraufwand?

Mitarbeiteraufwand = 100 BFP * 10 PM = 1000 Personentage

### FP-Verfahren

- **Vorteile**: Schnell,einfach, auf historischen Daten basierend
- **Nachteile**: Subjektiv, ungenau, keine Berücksichtigung von Projektrisiken, fehler der Basisdaten werden übernommen

**Karlkulationszeitpunkte**: eher früh, da die FP-Methode eine grobe Schätzung ist (z.B. Vorkalkulation)

### SFP-Verfahren

SFP: Simplified Function Points (vereinfachte Function Points)

**Unterschiede zur Fortschreibungsverfahren**:

SFP berücksichtigt Fixkosten differenzierter
<!-- todo: besser beschreiben -->

### Base Functional Components im SFP

- **Elementary Process (EP)**: kleinste Einheit, die eine Aufgabe erfüllt
- **Data Element (DE)**: Datenobjekt, das von einem EP verarbeitet wird
- **File (F)**: Datenobjekt, das von mehreren EPs verarbeitet wird
- **External Input (EI)**: Datenobjekt, das von einem EP gelesen wird
- **External Output (EO)**: Datenobjekt, das von einem EP geschrieben wird
- **External Inquiry (EQ)**: Datenobjekt, das von einem EP gelesen und geschrieben wird

### Operationstypen im SFP

- **Additional**: ADD
- **Delete**: DEL
- **Change**: CHG
- **Conversion**: CFP (mehrere Operationen)

### Functional Size Table im SFP

Diese Tabelle zeigt die Beiträge der verschiedenen Elemente zur Funktionsgröße.

| BFC (Base Functional Component) | Contribution |
| --- | --- |
| EP | x 4.6 SFP |
| Logical File LF | x 7.0 SFP |
| External Input EI | x 4.6 SFP |
| External Output EO | x 4.6 SFP |
| External Inquiry EQ | x 4.6 SFP |

---

## BPMN

BPMN: Business Process Model and Notation (V. 2.0)

### BPMN-Elemente

- **Aktivitäten**: Task, Zugeklappter Unterprozesse
- **Ereignisse**: Start/Endereignis, Zwischenereignis
- **Verbindende Objekte** (Sequenzfluss, Nachrichtenfluss, Assoziation)
- **Artefakte** (Datenobjekte, Gruppen, Annotationen)
- **Gateways** (Exklusiv (XOR), Inklusiv (OR), Parallele (AND), Komplex)
- **Rollen** Swimmlanes (Pool, Lane)

### Was kann bei einem Prozess simuliert werden?

**Durchlaufzeit**, Aufwand und Bewertung

---

## SCRUM

*Coming soon...*
