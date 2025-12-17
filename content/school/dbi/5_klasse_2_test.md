# 5. Klasse - 2. Test - DBI

## Stoff

- 07 Storage And Buffer (inkl. Aufzeichnungstechnologien!!)
- 08 RAID (siehe auch "Add 08 Additional RAID Levels")
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
