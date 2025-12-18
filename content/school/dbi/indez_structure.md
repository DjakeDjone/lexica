---
title: "Index Structures"
protocolAbgabedatum: "18.12.2025"
protocolAufgabenNr: 06
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "19.12.2025"
protocolDescription: "Indexes Structures: der B-Baum & ISAM"
---

## ISAM (Index Sequential Access Method)

ISAM ist eine Indexstruktur, die für die effiziente Suche und Verwaltung von Daten in Datenbanken verwendet wird. Sie kombiniert die Vorteile von sequentiellem und direktem Zugriff auf Daten.

### Begriffe Erklärt

- **Leaf Node:** Die unterste Ebene eines Indexbaums, die die tatsächlichen Datenzeiger enthält.
- **Non-Leaf Node:** Knoten im Indexbaum

### Describe an algorithm for insertion of a data record with a new key in an ISAM structure in pseudo code or natural language

```python
def insertInISAM(record):
    key = record.key
    leafNode = findLeafNodeForKey(key) # Locate the appropriate leaf node

    if leafNode.hasSpace():
        leafNode.insert(record)
    else:
        overflowPage = leafNode.getOverflowPage()
        if overflowPage is None:
            overflowPage = createNewOverflowPage()
            leafNode.setOverflowPage(overflowPage)
        
        overflowPage.insert(record)
```

### Describe an algorithm for deletion of a data record with a new key in an ISAM structure in pseudo code or natural language

```python
function deleteFromISAM(key):
    leafNode = findLeafNodeForKey(key)
    if leafNode.contains(key):
        leafNode.delete(key)
    else:
        overflowPage = leafNode.getOverflowPage()
        if overflowPage is not None:
            overflowPage.delete(key)
```

### Use your descriptions to create an ISAM data structure that contains the first names of your class members

```text
Loaded 15 records into 4 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, benjamin, christian, christian]
├── [Key: david     ] ──► Page 1: [david, florian, julian, luca]
├── [Key: marko     ] ──► Page 2: [marko, max, michael, nadine]
└── [Key: sabinus   ] ──► Page 3: [sabinus, tobias, valentin]
Deleted ID benjamin from Primary Page 0.
Reformatting ISAM structure (Merging Overflow)...
Loaded 14 records into 4 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, christian, christian, david]
├── [Key: florian   ] ──► Page 1: [florian, julian, luca, marko]
├── [Key: max       ] ──► Page 2: [max, michael, nadine, sabinus]
└── [Key: tobias    ] ──► Page 3: [tobias, valentin]
Deleted ID luca from Primary Page 1.
Reformatting ISAM structure (Merging Overflow)...
Loaded 13 records into 4 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, christian, christian, david]
├── [Key: florian   ] ──► Page 1: [florian, julian, marko, max]
├── [Key: michael   ] ──► Page 2: [michael, nadine, sabinus, tobias]
└── [Key: valentin  ] ──► Page 3: [valentin]
Deleted ID tobias from Primary Page 2.
Reformatting ISAM structure (Merging Overflow)...
Loaded 12 records into 3 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, christian, christian, david]
├── [Key: florian   ] ──► Page 1: [florian, julian, marko, max]
└── [Key: michael   ] ──► Page 2: [michael, nadine, sabinus, valentin]
Deleted ID christian from Primary Page 0.
Reformatting ISAM structure (Merging Overflow)...
Loaded 11 records into 3 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, christian, david, florian]
├── [Key: julian    ] ──► Page 1: [julian, marko, max, michael]
└── [Key: nadine    ] ──► Page 2: [nadine, sabinus, valentin]
Deleted ID valentin from Primary Page 2.
Reformatting ISAM structure (Merging Overflow)...
Loaded 10 records into 3 pages.

ISAM Tree Structure
├── [Key: aghajhani ] ──► Page 0: [aghajhani, christian, david, florian]
├── [Key: julian    ] ──► Page 1: [julian, marko, max, michael]
└── [Key: nadine    ] ──► Page 2: [nadine, sabinus]
```

## B-Tree

### Describe an algorithm for insertion of a data record with a new key in a B-Tree in pseudo code or natural language

```python
function insertInBTree(node, record):
    if node is leaf:
        node.insert(record)
        if node.isOverfull():
            splitNode(node)
    else:
        childNode = node.findChildNode(record.key)
        insertInBTree(childNode, record)
```

### Describe an algorithm for deletion of a data record with a new key in a B-Tree in pseudo code or natural language

```python
function deleteFromBTree(node, key):
    if node is leaf:
        node.delete(key)
        if node.isUnderfull():
            handleUnderflow(node) # Mergen oder umordnen
    else:
        childNode = node.findChildNode(key)
        deleteFromBTree(childNode, key)
```

### Use your algorithms to create a B-Tree with k=2

- Monat: 1

```text
87, 8, 91, 13, 9, 24, 73, 10, 29, 67, 63, 81, 58, 92, 45, 4, 1, 60, 23, 44.
```

```text
                                [ 29 ]
                               /      \
          _____________[ 8, 13 ]    __[ 58, 73 ]___
         /    /         /          /      |       \
    [1, 4] [9, 10] [23, 24] [44, 45] [60, 63, 67] [81, 87, 91, 92]
```

Änderungen nach löschen der 5 letzten Elemente:

- 92, 91: nichts, das Blatt hat mehr als k-1=1 Schlüssel
- 87: Merge mit linkem Geschwister, 73 wird nach oben verschoben
- 67: Merge mit linkem Geschwister, 58 wird nach oben verschoben

### Create up to five potential test exercises or questions regarding indexes

1. Was ist der Hauptvorteil eines B-Baums gegenüber einer ISAM-Struktur bei häufigen Einfügungen?
A: B-Bäume passen sich dynamisch an und bleiben balanciert, während ISAM-Strukturen starr sind und bei Einfügungen überlaufende Seiten erzeugen können.
2. Ein B-Baum hat den Parameter k=2. Wie viele Schlüssel darf ein Knoten maximal und wie viele muss er minimal (außer der Wurzel) enthalten?
A: Maximal 4 Schlüssel (2k) und minimal 1 Schlüssel (k-1).
3. Warum führt eine ISAM-Struktur bei vielen Überlaufseiten (Overflow Pages) zu einer schlechteren Suchperformance?
A: Weil die Suche durch die Überlaufseiten verlängert wird, was zu mehr Festplattenzugriffen führt.
4. B-Baum Split: Erklären Sie, was passiert, wenn die Wurzel eines B-Baums gesplittet wird. Wie wirkt sich das auf die Höhe des Baums aus?
A: Wenn die Wurzel gesplittet wird, entsteht eine neue Wurzel, und die Höhe des Baums erhöht sich um 1.
5. Erläutern Sie den Unterschied zwischen einem Primärindex und einem Sekundärindex im Kontext von Datenbanksystemen.
A: Ein Primärindex basiert auf dem Primärschlüssel der Tabelle und bestimmt die physische Reihenfolge der Daten, während ein Sekundärindex auf Nicht-Primärschlüsseln basiert und eine separate Struktur mit Pointern auf die Daten darstellt.
