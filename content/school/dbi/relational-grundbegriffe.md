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

### Normalformen

Die `Normalformen` sind Regeln, die eine Datenbank erfüllen muss, um Redundanzen zu vermeiden und die Datenbank zu normalisieren.

- `Unnormalized Form` / 0. Normalform: Datenbank, die noch nicht in die 1. Normalform gebracht wurde
- `1. Normalform`: Jedes Attribut enthält nur einen Wert; keine mehrwertigen Attribute, keine Relationen in Relationen
- `2. Normalform`: Jedes Attribut ist voll funktional abhängig von dem **gesamten** Primärschlüssel.
- `3. Normalform`: Jedes Attribut ist transitiv abhängig vom gesamten Primärschlüssel. Das bedeutet, dass es **keine Abhängigkeiten** zwischen den Attributen gibt.

transitive Abhängigkeit: `A -> B -> C`
triviale Abhängigkeit: `A,B -> A`
voll funktional abhängig: `A -> B` und `A -> C`

**Erklärung voll funktional abhängig:**

- `A` ist der Primärschlüssel
- `B` und `C` sind Attribute

Wenn man `A` kennt, kann man `B` und `C` bestimmen.

**Erklärung triviale Abhängigkeit:**

- `A`und `B` sind der Primärschlüssel
- `A` ist von `A` und `B` abhängig weil es im Schlüssel enthalten ist

**Erklärung transitive Abhängigkeit:**

- `A` ist der Primärschlüssel
- `B` ist von `A` abhängig
- `C` ist von `B` abhäng

Wenn man `A` kennt, kann man auf `B` schließen und damit auch auf `C`.

---

## Beispiel `schueler` und `note`

### 0. Normalform

| Schüler | Note |
|---------|------|
| Max     | 1,4 |
| Lisa    | 2, 3 |

### 1. Normalform

| Schüler | Note |
|---------|------|
| Max     | 1 |
| Max     | 4 |
| Lisa    | 2 |
| Lisa    | 3 |

### 2. Normalform

| Schüler | Note | Fach |
|---------|------|------|
