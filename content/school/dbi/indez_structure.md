---
title: "MongoDB Index Structure"
protocolAbgabedatum: "12.12.2025"
protocolAufgabenNr: 06
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "12.12.2025"
protocolDescription: "Indexes Structures wie zB. der B-Baum"
---

## ISAM (Index Sequential Access Method)

ISAM ist eine Indexstruktur, die für die effiziente Suche und Verwaltung von Daten in Datenbanken verwendet wird. Sie kombiniert die Vorteile von sequentiellem und direktem Zugriff auf Daten.

### Begriffe Erklärt

- **Leaf Node:** Die unterste Ebene eines Indexbaums, die die tatsächlichen Datenzeiger enthält.
- **Non-Leaf Node:** Knoten im Indexbaum

### Describe an algorithm for insertion of a data record with a new key in an ISAM structure in pseudo code or natural language

```python
function insertInISAM(record):
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
