# 5. Klasse - 2. Test - DBI

## Stoff

- [07 Storage And Buffer (inkl. Aufzeichnungstechnologien!!)](storage_and_buffer)
- [08 RAID (siehe auch "Add 08 Additional RAID Levels")](raid)
- 09 ISAM
- 10 Advanced Tree Structures (B-Baum)

## Storage and Buffer

### Welche Data Storage Technologie - Einflüsse in die Entscheidung

- **Access Time**: wie schnell kann auf Daten zugegriffen werden? |> SSDs + In-Memory DBs (zB Redis); HDDs für Archive
- **Cost**: HDDs sind deutlich billiger als SSDs oder RAM
- **Data Size**: bei größeren Data sets sind Hybride modelle (HDD für selten zugegriffene Daten) oft ein Kompromiss zwischen Performance und Preis
- **Maintenance effort**: On-Premise Speicher benötigt deutlich mehr Wartung als Cloud Storage Lösungen (vor allem wenn das System horizontal skaliert werden soll)

### Klassifizierung der Speichermedien

1. **Primärspeicher**: flüchtig, direkter CPU-Zugriff (zB RAM, Cache, Register)
2. **Sekundärspeicher**: nicht-flüchtig, langsamerer Zugriff (zB HDDs, SSDs, CDs/DVDs)
3. **Tertiärspeicher**: für Backup und Archivierung (zB Magnetbänder (**LTO**: **L**inear **T**ape-**O**pen standard), Cloud Storage)

In der Hierarchie gilt: Je höher die Ebene, desto kleiner die Kapazität, aber desto schneller und teurer der Speicher.

![Computer Memory Hierarchy](/images/computer_memory_hierarchy.png)

### Struktur einer HDD

Komponenten:

- **Track**: Kreisförmige Bahn auf der Disk
- **Head** (Schreib-Lese-Kopf): Liest/schreibt die Daten magnetisch
- **Cylinder**: Vertikal übereinanderliegende Tracks auf mehreren Platten
- **Block / Page**: kleinste addressierbare Einheit auf der Disk

#### Berechnung der Zugriffszeit

Die Zugriffszeit setzt sich aus drei Faktoren zusammen:

1. **Seek Time**: Kopf auf richtige Spur bewegen
2. **Rotational Latency**: Zeit bis der Kopf über den Block rotiert ist
3. **Transfer Time**: Übertragung der Daten in den Hauptspeicher

$$
Gesamtzugriffszeit=Seek Time+Rotational Latency+Transfer Time
$$

### DBMS Architektur

#### Database Buffer

Ein Datengank-Buffer **speichert häufig genutzte Daten** von der Festblatte im RAM, da RAM zugriffe um den Faktor ~$10^5$ schneller sind als Festplattenzugriffe.

Daten werden in **Pages** (typischerweise 4KB oder 8KB) vom Datenträger in den Buffer geladen. Der Buffer besteht aus mehreren solcher Pages.
Weil der Buffer begrenzt ist müssen Pages, die länger nicht genutzt wurden, wieder aus dem Buffer entfernt werden um Platz für neue Seiten zu schaffen. Dafür gibt es verschiedene **Buffer Replacement Policies**:

- **LRU (Least Recently Used)**: Die am längsten nicht benutzte Page wird ersetzt
- **FIFO (First In First Out)**: die älterste Page wird ersetzt

<!-- Page 8 oben -->

### Mapping of Relations onto Pages

Ein Datensatz in einer Tabelle wird **Tuple** genannt. Ein Tuple wird über die **Tupel-ID (TID)** referenziert, die aus der **Page-ID** und dem **Offset** innerhalb der Page besteht.

Wenn ein Tuple wächst:

- *platz reicht*: Page wird intern neu geordnet
- *reicht nicht*: Tuple wird auf eine neue Page verschoben. Auf der ursprünglichen Page wird ein **Marker (Forwarding Pointer)** gesetzt, damit die ursprüngliche TID gültig bleibt. Es sind maximal eine Rekursionstiefe von **2** erlaubt.

## RAID

RAID (**R**edundant **A**rray of **I**ndependent **D**isks) verbindet mehrere physische Disks die als **eine logische Einheit** arbeiten. Ziel ist es, **Fehlertoleranz** und/oder **Leistungssteigerung** zu erreichen.

### Single Disk Storage

Nachteile einer einzelnen Festblatte sind:

- **Keine Fehlertoleranz**: Fällt die Platte aus, sind alle Daten verloren
- **Langsamer Zugriff**: Die Geschwindigkeit ist auf die Leistung einer einzelnen Platte begrenzt

### Die wichtigsten RAID-Level

#### RAID 0 (Striping)

Daten werden blockweise auf mehrere Disks verteilt. Das macht Lese- und Schreiboperationen **schneller**, bietet aber **keine Fehlertoleranz**.

$$
Durchsatz_{RAID 0}=N \times Durchsatz_{Single Disk}
$$

#### RAID 1 (Mirroring)

Alle Daten werden auf zwei (oder mehr) Disks **gespiegelt**.
Das bietet **hohe Fehlertoleranz** (eine Disk kann ausfallen), aber keinen Geschwindigkeitsvorteil beim Schreiben. <mark>Leseoperationen können jedoch schneller sein</mark>, da von beiden Disks gelesen werden kann.

#### RAID 1 + 0

Kombination aus RAID 1 und RAID 0. Daten werden zuerst gespiegelt (RAID 1) und dann auf mehrere Disks verteilt (RAID 0). Bietet sowohl **hohe Fehlertoleranz** als auch **guten Durchsatz**, ist aber teuer in Bezug auf Speicherplatz.

#### RAID 5

**Anordnung**: Daten und Paritätsinformationen werden blockweise auf mindestens 3 Disks verteilt.
**Fehlertoleranz**: Kann den Ausfall einer einzelnen Disk verkraften.

**Vorteile**: Gute Leseleistung und effizientere Speichernutzung im Vergleich zu RAID 1.
**Nachteile**: Schreiboperationen sind langsamer aufgrund der Paritätsberechnung.

$$
Speichereffizienz_{RAID 5}=\frac{N-1}{N}
$$
<!-- TODO: RAID 2, 4, 6, Z2 -->

> Hot Spare: Eine zusätzliche Disk, die automatisch einspringt, wenn eine andere Disk ausfällt.

## ISAM (Indexed Sequential Access Method)

Warum Indizes?

- **Große Datenmengen**
- **Speicherhierarchie**: Zugriff auf Daten von der Festplatte ist langsam
- **Zeitfaktor**: Sekundärspeicher ist um den Faktor ~$10^5$ langsamer als Primärspeicher

> Kein Standard: Unterschiedliche DBMS implementieren Indizes unterschiedlich (zB B-Baum, Hash-Index)

### Index Typen

- **Primärindex**: schneller Zugriff auf Daten basierend auf dem Primärschlüssel, meistens als **B-Baum** implementiert
- **Sekundärindex**: ermöglicht schnellen Zugriff auf Daten basierend auf Nicht-Primärschlüsseln (zB Name, Adresse), *Zu viele Sekundärindizes können die Leistung beeinträchtigen*
- **Clustered Index**: bestimmt die **physische** Reihenfolge der Daten in der Tabelle. Es kann nur einen pro Tabelle geben,
- **Non-Clustered Index**: Seperate Struktur mit **Pointern** auf die eigenen Daten
- **Unique vs. Non-Unique**: Unique Indizes erzwingen die Einzigartigkeit der Werte in der Indexspalte, Non-Unique Indizes erlauben Duplikate
- **Composite Indexes**: Index über mehrere Spalten hinweg, nützlich für komplexere Filter oder Sortierungen

### Funktionsweise und Struktur

- **Index-pages**: bestehen aus einer Sequenz von abwechselnden Pointern (p) und Schlüsselwerten (k) in aufsteigender Reihenfolge. Sie liegen sequenziell auf dem Sekundärspeicher.
- **Data-pages**: Enthalten die eigentlichen Datensätze, ebenfalls nach dem Schlüssel sortiert.
- **Verknüpfung**: Data-Pages sind untereinander **sequenziell** (untereinander) verknüpft, um schnelle Range-Queries zu ermöglichen.

### Wichtige Regeln der ISAM-Struktur

- Jeder Schlüsselwert ist **unique**
- Index-Knoten sind keine **echten Daten**!!

### Wann ist ISAM gut?

- **Stabile Daten**: Ideal für Datensätze, die sich selten ändern.
- **Performance**: Sehr schnell bei exakten Suchen und Bereichssuchen.
- **Einschränkung**: Nicht für hochdynamische Daten (viele Inserts/Deletes) ausgelegt.
- **Historie**: ISAM gilt als der Vorläufer heutiger baumbasierter Indizes.
