# Allgemeines zu Datenbanken

## Geschichte der Datenbanken

- **60er Jahre**: Filesysteme, Datenverwaltung in Dateien
- **70er Jahre**: Hierarchische Datenbanken (Baumstruktur); Netzwerkdatenbanken (Graphstruktur)
- **80er Jahre**: Relationale Datenbanken (SQL)
- **90er Jahre**: Client-Server-Systeme (Datenbankserver); Verteilte Datenbanken

## Data dictionary

- Views, können nicht direkt bearbeitet werden
- Enthält Metadaten (Daten über Daten)
- Beschreibt die Struktur der Datenbank

## 3GL vs. 4GL

- 3GL (Dritter-Generations-Sprachen): Programmiersprachen wie C, Java, Python
- 4GL (Vierter-Generations-Sprachen): Datenbanksprachen wie SQL

## Full-Table-Scan vs. Index-Scan

- **Full-Table-Scan**: Durchsucht die gesamte Tabelle, langsam bei großen Tabellen
- **Index-Scan**: Durchsucht nur den Index, schneller als Full-Table-Scan

## Datenbanken in der Cloud

    540 PetaByte limit von SQL Datenbanken

## Eigenschaften von Datenbanksystemen

- **Redundanzfreiheit** (mehr Speicherplatz, Updates problematisch)
- **Konsistenz**, **Integrität**: Daten müssen konsistent und korrekt sein (z.B. Foreign Keys: *Referenzielle Integrität*)
- **Sicherheit**