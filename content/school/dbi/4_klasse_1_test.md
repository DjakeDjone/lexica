# DBI 1. Test 4. Klasse

```text
Von 1.1 Entwicklung (+Zusatzdokument Moodle)

bis inkl. 1.4 Datenbankarchitektur: Drei-Schichten-Konzept

Von 2.3.2 ER-Diagramm mit Arten der Beziehungs-Typen

bis inkl. 2.8 Beziehungen zwischen mehr als zwei Entity-Typen

3.1 Identifizierung von Entities

3.2 Redundanz und Fremdschlüssel

4 Weiterführende ER-Modellierung

bis inkl. 4.4 Arten von Attributen
```

---

## Themen

- [Entwicklung](#entwicklung)
- [Datenbankarchitektur: Drei-Schichten-Konzept](#datenbankarchitektur-drei-schichten-konzept)
- [ER-Diagramm mit Arten der Beziehungs-Typen](#er-diagramm-mit-arten-der-beziehungs-typen)
- [Beziehungen zwischen mehr als zwei Entity-Typen](#beziehungen-zwischen-mehr-als-zwei-entity-typen)
- [Identifizierung von Entities](#identifizierung-von-entities)
- [Redundanz und Fremdschlüssel](#redundanz-und-fremdschlüssel)
- [Weiterführende ER-Modellierung](#weiterführende-er-modellierung)
- [Arten von Attributen](#arten-von-attributen)

---

## Entwicklung

### Geschichte der Datenbanken

- **60er Jahre**: Filesysteme, Datenverwaltung in Dateien
- **70er Jahre**: Hierarchische Datenbanken (Baumstruktur); Netzwerkdatenbanken (Graphstruktur)
- **80er Jahre**: Relationale Datenbanken (SQL)
- **90er Jahre**: Client-Server-Systeme (Datenbankserver); Verteilte Datenbanken

### Datenbank vs. Datei

- **Datenbank**: Strukturierte Sammlung von Daten (mit Data Dictionary ~ Metadaten)
- **Datei**: Unstrukturierte Sammlung von Daten

*weiteres siehe [DB Allgemeines](db_allgemeines.md)*

### Eigenschaften von Datenbanksystemen

- **Redundanzfreiheit** (mehr Speicherplatz, Updates problematisch)
- **Konsistenz**, **Integrität**: Daten müssen konsistent und korrekt sein (z.B. Foreign Keys: *Referenzielle Integrität*)
- **Sicherheit**: Zugriffskontrolle, Verschlüsselung
- **Syncronisation**: Mehrere Benutzer gleichzeitig
- **Datenunabhängigkeit**: Änderungen am Schema haben keine Auswirkungen auf die Anwendungen

### Datenbankarchitektur: Drei-Schichten-Konzept

- **Externe Ebene**: Sicht der Benutzer
- **Konzeptionelle Ebene**: Sicht der Datenbank
- **Interne Ebene**: Speicherung der Daten

#### Externe Ebene

- Sicht der Benutzer
- Benutzer sieht nur die für ihn relevanten Daten
- z.B. Student sieht nur seine Noten

#### Konzeptionelle Ebene

- Sicht der Datenbank
- Struktur der Datenbank
- z.B. Tabellen, Beziehungen

### Interne Ebene

- Speicherung der Daten
- meist Bäume oder Listen
- z.B. Speicherung auf Festplatte

#### Datenunabhängigkeit der Ebenen

- **Logische Datenunabhängigkeit**: Änderungen am konzeptionellen Schema haben keine Auswirkungen auf das *externe Schema*
- **Physische Datenunabhängigkeit**: Änderungen am internen Schema haben keine Auswirkungen auf das *konzeptionelle Schema*

---

## ER-Diagramm mit Arten der Beziehungs-Typen

- **1:1**: Ein Datensatz in Tabelle A ist mit genau einem Datensatz in Tabelle B verknüpft
- **1:n**: Ein Datensatz in Tabelle A ist mit einem oder mehreren Datensätzen in Tabelle B verknüpft
- **n:m**: Ein Datensatz in Tabelle A ist mit einem oder mehreren Datensätzen in Tabelle B verknüpft und umgekehrt

### Min-Max-Notation

Bsp: 1:n Ein Bezirk hat 1 bis n Niederösterreicher

[Bezirk] ---(1,n)--- bewohnt von ---(1,1)--- [Niederösterreicher]

### Beziehungs-Typ oder Entitätstyp?

- **Beziehungs-Typ**: Verbindung zwischen zwei Entitäten
- **Entitätstyp**: Entität/Tabelle in der Datenbank

Wie man will: Beziehungs-Typen können auch als Entitätstypen dargestellt werden. Datenbankmäßig sind sie meistens Entitätstypen.

### Attribut oder Entity-Typ?

- **Attribut**: Eigenschaft einer Entität
- **Entity-Typ**: Entität/Tabelle in der Datenbank

Wenn ein Attribut häufig vorkommt, kann es auch als eigene Entität dargestellt werden um Redundanz zu vermeiden. Außerdem können so mehrere Werte gespeichert werden. (z.B. Telefonnummern)

### Rekursive Beziehung

![Rekursive Beziehung img.](/images/rekursion.png)

---

## Beziehungen zwischen mehr als zwei Entity-Typen

![mehrere Entity-typen Beziehung img.](/images/multiple-relations.png)

---

## Identifizierung von Entities

- **Identifizierende Attribute**: Attribute, die eine Entität eindeutig identifizieren
- **Schlüsselattribute**: Attribute, die als Schlüssel dienen

### Schlüssel

- **Einfacher Schlüssel**: Ein Attribut als Schlüssel
- **Zusammengesetzter Schlüssel**: Mehrere Attribute als Schlüssel
- **Künstlicher Schlüssel**: Automatisch generierter Schlüssel (z.B. ID)
- **Natürlicher Schlüssel**: Ein Attribut als Schlüssel (z.B. E-Mail)

Regeln für die Wahl des Primärschlüssels:

- Der Primärschlüsselwert muss beim Hinzufügen eines Entities vollständig **bekannt** sein (Entity-Integrität)
- Da der Primärschlüssel das Entity während der ganzen Lebenszeit identifiziert, darf sein Wert **nicht geändert
werden** müssen (dadurch würde eigentlich ein neues Entity entstehen).
- Der Primärschlüssel soll **möglichst wenige Attribute** umfassen, die Darstellung der Attributwerte soll
möglichst kurz sein.

---

## Redundanz und Fremdschlüssel

- **Redundanz**: Mehrfache Speicherung von Daten
- **Fremdschlüssel**: Verweis auf einen anderen Datensatz

### Probleme mit Redundanz

- **Inkonsistenz**: Daten sind nicht mehr konsistent
- **Speicherplatz**: Mehr Speicherplatz wird benötigt
- **Einfüge u. Löschanomalien**: Daten können nicht mehr korrekt eingefügt oder gelöscht werden



---

## Weiterführende ER-Modellierung

- **Kardinalität**: Anzahl der Beziehungen zwischen Entitäten
- **Partizipation**: Pflichtteilnahme an einer Beziehung

---

## Arten von Attributen

- **Einfach**: Attribut, das nicht weiter unterteilt werden kann
- **Zusammengesetzt**: Attribut, das in mehrere Unterattribute unterteilt werden kann
- **Abgeleitet**: Attribut, das aus anderen Attributen berechnet wird


---
---
### Schwache Entitäten + Owner

meist 1:N (1 Owner, N Schwache Entitäten) oder 1:1

- Entitäten, die von einer anderen Entität abhängig sind
- z.B. Adresse ist abhängig von Person

Eigenschaften:

- **Schwache Entität**: Kann nicht ohne Besitzer existieren
- **Owner Entität**: Besitzt die schwache Entität
- Wird die Owner Entität gelöscht, wird auch die schwache Entität gelöscht
- Owner Entität wird auch als **Identifizierende Entität** bezeichnet
- Die schwache Entität hat einen **Teil des Schlüssels** der Owner Entität als **Teil des eigenen Schlüssels**
