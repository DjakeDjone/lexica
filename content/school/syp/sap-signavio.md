# BPMN

Buisness Process Modelling Notation v2.1

## Features

- **Modeling**: Modellierung von Prozessen
- **Simulation**: Simulation von Prozessen
- **Collaboration**: Zusammenarbeit an Prozessen
- **Documentation**: Dokumentation von Prozessen
- **Analysis**: Analyse von Prozessen

## Begriffe

- **Pool**: Ein Pool ist ein Container für Prozesse. Ein Pool kann entweder ein Teilnehmer oder eine Organisationseinheit darstellen. Zugeklappt: **Blackbox-Pool**, aufgeklappt: **Whitebox-Pool**. Ein Whitebox-Pool kann mehrere Lanes enthalten. Ein Blackbox-Pool kann keine Lanes enthalten.
- **Lane**: Eine Lane ist ein Unterteilung eines Pools. Eine Lane kann eine Abteilung oder eine Person darstellen.
- **Start- und Endereignis**: Ein Start- und Endereignis markiert den Beginn und das Ende eines Prozesses.
- **Aktivität**: Eine Aktivität ist eine Aufgabe, die in einem Prozess durchgeführt wird.
- **Gateway**: Ein Gateway ist eine Entscheidung, die in einem Prozess getroffen wird. Arten: **Exklusives Gateway, Paralleles Gateway, Inklusives Gateway, Komplexes Gateway.**
- Flussobjekte: Flussobjekte sind Elemente, die den Prozessfluss darstellen.
- **Arbeitszeit**: Die Arbeitszeit ist die Zeit, die für die Durchführung einer Aktivität benötigt wird.
- **Durchlaufzeit**: Die Durchlaufzeit ist die Zeit, die für die Durchführung eines Prozesses benötigt wird.
- **Sequenzfluss**: Der Sequenzfluss ist die Reihenfolge, in der die Aktivitäten eines Prozesses durchgeführt werden.
- **Directory**: Ein zentraler Speicherort für Dateien und Ordner.

---

```markdown
**Pools und Lane**

Pool: Container für Prozess zB. HTL ST. Pölten
Lane: Unterteilung eines Pools zB. Abteilung, Lehrer etc.
```

## Prozess

Def: **Wiederholbare Abfolge** von Aktivitäten, die ein bestimmtes Ziel erreichen.

### Merkmale

- PM: Prozess-Modellierer
- GPV: Gesamtprozessverantwortlicher
- TPV: Teilprozessverantwortlicher
- Sonstige Experten

### Varianten

- Gate (Entweder oder)

### Leistungsindikatoren

- Durchlaufzeit
- Kosten
- Kundenzufriedenheit
- usw.

### End to End Prozess

Der End-to-End-Prozess ist ein Prozess, der alle Schritte von Anfang bis Ende umfasst.

zB. Bewerbung: Von der Bewerbung bis zur Zusage

- **Start**: Unternehmen erstellt Stellenanzeige
- **Ende**: Bewerber erhält Zusage

### Optimierung in Einzelprozessen

- **Schritte reduzieren/streichen**: Überflüssige Schritte entfernen
- **Schritte zusammenfassen**: Mehrere Schritte zusammenfassen (weniger Kommunikation)
- **Automatisierung**: Automatisierung von Schritten
- **Parallelisierung**: Mehrere Schritte parallel durchführen
- **Outsourcing**: Schritte an Dritte auslagern
- **Standardisierung**: Prozesse vereinheitlichen
- **Reihenfolge ändern**: Schritte in anderer Reihenfolge durchführen
- **Zusätzlicher Schritt**: zB. Testen; verbessert Qualität, man muss nicht zurückgehen
