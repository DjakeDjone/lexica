# Relationales Datenmodell

## Definition

## Grundbegriffe

- ´Domäne´: Menge von Werten, die ein Attribut annehmen kann
- `Kardinalität`: Anzahl der möglichen Werte, die ein Attribut annehmen kann
- `Tupel`: Zeile in einer Tabelle
- `Attribut`: Spalte in einer Tabelle
- `Projektion`: **Auswahl von Attributen** aus einer Tabelle (z.B. `SELECT name, vorname FROM person`)

### Relation vs Tabelle

| Relation | Tabelle |
|----------|---------|
| mathematischer Begriff | Informatik-Begriff |
| Menge von Tupeln | Menge von Zeilen |
| Menge von Attributen | Menge von Spalten |
| keine Reihenfolge | Reihenfolge |

### Unnormalized Form

- `Unnormalized Form` / 0. Normalform: Datenbank, die noch nicht in die 1. Normalform gebracht wurde
- `1. Normalform`: Jedes Attribut enthält nur einen Wert
- `2. Normalform`: Jedes Attribut ist voll funktional abhängig von dem Primärschlüssel.
- `3. Normalform`: Jedes Attribut ist transitiv abhängig vom Primärschlüssel.

transitive Abhängigkeit: `A -> B -> C`
voll funktional abhängig: `A -> B` und `A -> C`
