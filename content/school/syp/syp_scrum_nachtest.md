# SYP SCRUM Basics (Wunschprüfung)

## Table of Contents

## SCRUM

### SCRUM Bestandteile

1. **Product Backlog | Releaseplan**
2. **Sprint**: Planning » Entwicklung (-> Daily Scrum <-) » Review » Retrospektive
3. **Sprint Backlog**
4. **Product Increment**

+ **Impedient Backlog** (Was behindert die Entwicklung?)

### User Story

**INVEST**:

+ **Independent**
+ **Negoiable** (Verhandelbar)
+ **Valuable**
+ **Estimatable** (Schätzbar)
+ **Small**
+ **Testable**

### Karaban vs. Scrum

| Kriterium | Karaban | Scrum |
|---------|----------|-------|
| Optimierungskriterium | Durchlaufzeit | Velocity |
| Rollen | Keine | Product Owner, Scrum Master, Team |
| Board | fortschrittorientiertes Kanban-Board | Task-orientiertes Scrum-Board |

## BPMN

### Arten von Verbindungen

1. **Assosation**: Verbindet Anmerkungen zu Tasks
2. **Sequenzfluss**: Task zu Task (+ Ereignisse)
3. **Nachrichtenfluss**: kennzeichnet Kommunikation zu externen Kommunikationspartnern

### Optimierungsmöglichkeiten bei Prozessen

1. **Zusammenfassen**
2. **Weglassen**
3. **Auslagern**
4. **Parallelisieren**: Workflowsteuerung
5. **Hinzufügen**
6. **Automatisieren**: Berechnung
7. **Umsortieren**
8. **Informationsbedarf decken**: Archivsysteme
9. **Eliminieren von Schnittstellen**: EDI-Formate

### Leistungsarten

1. **Nutzleistung**
2. **Stützleistung**
3. **Blindleistung**
4. **Fehlleistung**
5. TODO

## SW-Aufwandschätzung

### Kalkulationszeitpunkte

+ **Vorprojekt**kalkulation
+ **Planungs**kalkulation
+ **mitlaufende P-Kalkulation**
+ **Nach**projektkalkulation
+ TODO

## Function Points (FP) u. Simple Function Points (SFP)

### Function Points

**BFP = (Summe FP) *(0.7 + EF (Einflussfaktoren)* 0.01)**

#### Schritte des Function Point Verfahrens

1. **Quantifizierung** des **Projektumfangs**: Analyse der 5 Funktionstypen (Eingabe; Ausgaben; Datenbestände; Referenzdaten; Abfragen)
2. **Bewertung** der **Funktionstypen** (leicht, mittel, schwer)
3. Analyse der **Einflussfaktoren** (in %)
4. Berechnung der **bewerteten Function Points**
5. **Kalkulation** der **Aufwände**: Tabelle auf Basis von Erfahrungswerten

#### EInflussfaktoren auf den Rohen Function Point Wert

+ Datenkommunikation
+ Verteilte Verarbeitung
+ Leistungsanforderungen
+ Transaktionsrate
+ Anpassbarkeit
+ Installierbarkeit
+ Mehrfachbenutzbarkeit

### notwendige Informationen

1. Rollen/Zuweisungen an MA
2. Entscheidungs Gateways
3. Startereignisse
4. Informationen aus vorherigen Sprints
5. Art der Tasks
