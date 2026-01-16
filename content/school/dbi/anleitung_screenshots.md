# Anleitung zum Erstellen der Execution Plan Screenshots

Da die generierten Bilder nicht realistisch genug waren, hier eine
Schritt-für-Schritt-Anleitung, wie du die Screenshots selbst im SQL Server
Management Studio (SSMS) erstellen kannst.

## Vorbereitung

1. Öffne **SQL Server Management Studio (SSMS)**.
2. Verbinde dich mit deiner Datenbank-Instanz.
3. Stelle sicher, dass du die **AdventureWorks** Datenbank (oder deine Kopie)
   ausgewählt hast.
4. **WICHTIG:** Aktiviere die Option **"Tatsächlichen Ausführungsplan
   einschließen" (Include Actual Execution Plan)**.
   - Shortcut: `Ctrl + M` (Strg + M)
   - Oder klicke auf das Icon in der Toolbar (sieht aus wie ein kleiner
     Ausführungsplan neben dem "Execute"-Button).

## Die Screenshots erstellen

Führe die folgenden SQL-Blöcke nacheinander aus und mache jeweils einen
Screenshot vom Reiter **"Ausführungsplan" (Execution Plan)** im unteren Bereich.

### 1. Heap (Table Scan) -> für `execution_plan_heap_scan.png`

Dieser Screenshot soll zeigen, dass ohne Index die ganze Tabelle gescannt wird.

**SQL:**

```sql
SELECT * FROM [Sales].[SalesOrderDetail_Heap] WHERE SalesOrderID = 43659;
```

**Ausführung:**

- Markiere die Zeile und drücke `F5`.
- Gehe auf den Reiter **Ausführungsplan**.
- **Screenshot:** Mache einen Screenshot vom Operator **"Table Scan"**.
- Bewege die Maus über den Operator, bis der Tooltip erscheint (mit "Geschätzte
  Anzahl von Zeilen" etc.), und includiere diesen idealerweise im Screenshot.

---

### 2. Clustered Index (Clustered Index Seek) -> für `execution_plan_clustered_index_seek.png`

Dieser Screenshot zeigt den effizienten direkten Zugriff.

**Vorbereitung (falls Index noch nicht existiert):**

```sql
CREATE CLUSTERED INDEX CIX_SalesOrderDetail_SalesOrderID
ON [Sales].[SalesOrderDetail_Clustered](SalesOrderID);
```

**SQL:**

```sql
SELECT * FROM [Sales].[SalesOrderDetail_Clustered] WHERE SalesOrderID = 43659;
```

**Ausführung:**

- Führe das SELECT aus.
- Gehe auf den Reiter **Ausführungsplan**.
- **Screenshot:** Der Operator sollte nun **"Clustered Index Seek"** heißen.
  Dies zeigt, dass er direkt zum Ziel springt.

---

### 3. Non-Clustered Index (Index Seek + Key Lookup) -> für `execution_plan_nonclustered_index_seek.png`

Hier sieht man, dass der Index zwar gefunden wird, aber noch zusätzliche Daten
aus der Tabelle geholt werden müssen (Lookup).

**Vorbereitung:**

```sql
CREATE NONCLUSTERED INDEX NCIX_SalesOrderDetail_SalesOrderID
ON [Sales].[SalesOrderDetail_NonClustered](SalesOrderID);
```

**SQL:**

```sql
SELECT * FROM [Sales].[SalesOrderDetail_NonClustered] WHERE SalesOrderID = 43659;
```

**Ausführung:**

- Führe das SELECT aus.
- Gehe auf den Reiter **Ausführungsplan**.
- **Screenshot:** Du solltest zwei Haupt-Operatoren sehen:
  1. **Index Seek (NonClustered)**
  2. **Key Lookup (Heap)** (oder RID Lookup)
  - Diese sind oft über einen "Nested Loops" Operator verbunden. Versuche,
    diesen Baum auf den Screenshot zu bekommen.

---

### 4. Columnstore Index (Columnstore Index Scan) -> für `execution_plan_columnstore_scan.png`

Zeigt die spaltenbasierte Verarbeitung.

**Vorbereitung:**

```sql
CREATE CLUSTERED COLUMNSTORE INDEX CCIX_SalesOrderDetail
ON [Sales].[SalesOrderDetail_ClusteredColumnstore];
```

**SQL:**

```sql
SELECT * FROM [Sales].[SalesOrderDetail_ClusteredColumnstore] WHERE SalesOrderID = 43659;
```

**Ausführung:**

- Führe das SELECT aus.
- Gehe auf den Reiter **Ausführungsplan**.
- **Screenshot:** Der Operator heißt **"Columnstore Index Scan"**.
- Achte im Tooltip eventuell auf den Hinweis "Batch Mode" oder die I/O
  Statistiken, falls sichtbar.

---

### 5. FullText Index

Hier vergleichen wir eine `LIKE`-Suche (Tabellenscan) mit einer `CONTAINS`-Suche
(FullText Match).

#### A) Ohne FullText Index -> für `execution_plan_fulltext_no_index.png`

**SQL:**

```sql
SELECT * FROM [Production].[ProductDescription_FullText] 
WHERE Description LIKE '%comfortable%';
```

**Ausführung:**

- Führe das SELECT aus.
- Gehe auf **Ausführungsplan**.
- **Screenshot:** Du wirst wahrscheinlich einen **Table Scan** sehen.

#### B) Mit FullText Index -> für `execution_plan_fulltext_with_index.png`

**Vorbereitung (einmalig):**

```sql
CREATE FULLTEXT CATALOG ftCatalog AS DEFAULT;
CREATE UNIQUE INDEX UIX_ProductDescription_ID 
ON [Production].[ProductDescription_FullText](ProductDescriptionID);
CREATE FULLTEXT INDEX ON [Production].[ProductDescription_FullText](Description)
KEY INDEX UIX_ProductDescription_ID
ON ftCatalog;
```

**SQL:**

```sql
SELECT * FROM [Production].[ProductDescription_FullText] 
WHERE CONTAINS(Description, 'comfortable');
```

**Ausführung:**

- Führe das SELECT aus.
- Gehe auf **Ausführungsplan**.
- **Screenshot:** Der Operator sollte **FullText Match** (oder ähnlich) heißen.
- **Wichtig:** Es kann sein, dass der FullText Index einen Moment braucht um
  sich aufzubauen. Warte ggf. ein paar Sekunden.

---

### 6. Index Fragmentierung -> für `index_fragmentation_results.png`

Hiervon brauchen wir einen Screenshot der _Ergebnistabelle_, nicht vom
Ausführungsplan.

**SQL:**

```sql
SELECT 
    OBJECT_NAME(ips.object_id) AS TableName,
    i.name AS IndexName,
    ips.index_type_desc AS IndexType,
    ips.avg_fragmentation_in_percent AS FragmentationPercent,
    ips.page_count AS PageCount
FROM sys.dm_db_index_physical_stats(
    DB_ID(), 
    OBJECT_ID('[Sales].[SalesOrderDetail_Clustered]'), 
    NULL, NULL, 'LIMITED'
) ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 0;
```

**Ausführung:**

- Führe das Script aus.
- Mach einen Screenshot von dem **Raster "Ergebnisse"**, wo man die
  `FragmentationPercent` sieht.

### Tipps für gute Screenshots

- Benutze das "Snipping Tool" oder `Win + Shift + S`.
- Schneide nur den relevanten Teil des Ausführungsplans aus (nicht den ganzen
  Bildschirm).
- Versuche, den Tooltip mit den Details (Zeilenanzahl, Kosten) mit aufzunehmen,
  da dieser im Protokolltext erwähnt wird.
