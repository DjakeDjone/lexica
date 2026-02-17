---
title: SystemVersionedTables
generateTableOfContents: false
protocolAbgabedatum: 22.02.2026
protocolAbgabetermin: 30.01.2026
protocolAufgabenNr: 9
protocolDescription: Your task is to perform research regarding System-Versioned Tables in MS SQL Server.
protocolGruppe: "1"
protocolKlasse: 5AHIF
protocolName: Benjamin Friedl
tags: []
---

## 1. Szenario Beschreibung

SAS Handyapp mit Kunden- und Vertragsdaten. Verträge müssen über die Zeit
verfolgt werden können, zB. wann ein Vertrag aktiv war, wann er geändert wurde,
etc.

### Domänbeschriftung

- **Kunde**(Customer)
  - KundenID (CustomerID) (PK)
  - Name (Name)
  - Adresse (Address)
- **Vertrag**(Contract)
  - VertragsID (ContractID) (PK)
  - KundenID (CustomerID) (FK)
  - Vertragsdetails (ContractDetails)
  - GültigVon (ValidFrom) (Anwendungszeit Start)
  - GültigBis (ValidTo) (Anwendungszeit Ende)

## Create a temporal table, following the application time approach with interval representation

```sql
DROP DATABASE ApplicationTimeDB;
CREATE DATABASE ApplicationTimeDB;
USE ApplicationTimeDB;
CREATE TABLE Customer (
  CustomerID INT PRIMARY KEY,
  Name NVARCHAR(100),
  Address NVARCHAR(255)
);

CREATE TABLE Contract (
  ContractID INT,
  CustomerID INT NOT NULL,
  ContractDetails NVARCHAR(255) NOT NULL,
  ValidFrom DATETIME2 NOT NULL,
  ValidTo DATETIME2 NOT NULL,
  CONSTRAINT PK_Contract PRIMARY KEY (ContractID, ValidFrom),
  CONSTRAINT FK_Contract_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
  CONSTRAINT CHK_ValidInterval CHECK (ValidFrom < ValidTo)
);

-- DECLARE @Snap DATETIME2 = '2024-01-15';
-- SELECT * FROM Contract WHERE @Snap >= ValidFrom AND @Snap < ValidTo;
```

![alt text](/images/dbi_applicationtime/application-time-schema.png)

## c. Decide on a primary key and give a rationale for your personal choice

- **Kunde**: KundenID (CustomerID) als Primärschlüssel — eindeutige
  Identifikation des Kunden.
- **Vertrag**: Composite-PK (ContractID, ValidFrom). Rationale: ContractID
  identifiziert die logische Entität, ValidFrom unterscheidet die zeitliche
  Versionen. So sind mehrere zeitlich aufeinanderfolgende Zustände desselben
  Vertrags möglich.

## d. Create test data with at least ten state transitions within your entities

```sql
INSERT INTO Customer (CustomerID, Name, Address) VALUES
(1, 'James Bond', 'MI6 Headquarters 7'),
(2, 'Benjamin Friedl', 'Bachalee 32');


INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo) VALUES
-- Contract 1 (customer 1) : 4 transitions
(1, 1, 'Vertrag A - Initial',     '2006-01-01', '2007-05-31'),
(1, 1, 'Vertrag A - Änderung 1',  '2007-06-01', '2007-12-31'),
(1, 1, 'Vertrag A - Änderung 2',  '2008-01-01', '2008-06-30'),
(1, 1, 'Vertrag A - Änderung 3',  '2008-07-01', '9999-12-31'),
-- Contract 2 (customer 1) : 3 transitions
(2, 1, 'Vertrag A2 - Initial',    '2006-03-01', '2007-09-30'),
(2, 1, 'Vertrag A2 - Änderung 1', '2007-10-01', '2008-03-31'),
(2, 1, 'Vertrag A2 - Änderung 2', '2008-04-01', '9999-12-31'),
-- Contract 3 (customer 2) : 3 transitions
(3, 2, 'Vertrag B - Initial',     '2006-02-01', '2007-07-31'),
(3, 2, 'Vertrag B - Änderung 1',  '2007-08-01', '2008-02-28'),
(3, 2, 'Vertrag B - Änderung 2',  '2008-03-01', '9999-12-31'),
-- Contract 6 (customer 2) : 3 transitions
(6, 2, 'Vertrag E - Initial',     '2009-01-01', '2009-12-31'),
(6, 2, 'Vertrag E - Update 1',    '2010-01-01', '2010-12-31'),
(6, 2, 'Vertrag E - Update 2',    '2011-01-01', '9999-12-31'),
-- Contract 7 (customer 1) : 2 transitions
(7, 1, 'Vertrag F - Initial',     '2010-06-01', '2011-05-31'),
(7, 1, 'Vertrag F - Update 1',    '2011-06-01', '9999-12-31');
```

## e. Snapshot of the table's data on your birthday

```sql
DECLARE @Birthday DATETIME2 = '2007-01-13';
SELECT * FROM Contract
WHERE @Birthday >= ValidFrom AND @Birthday < ValidTo;
```

![alt text](/images/dbi_applicationtime/contract-snapshot-birthday.png)

## f. Simulate a managing application (SQL statements)

\-- i. Add two new entities (new logical contracts)

```sql
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES
(4, 1, 'Vertrag C - Initial', '2012-02-01', '9999-12-31'),
(5, 2, 'Vertrag D - Initial', '2012-03-01', '9999-12-31');
```

![Add Entities](/images/dbi_applicationtime/add_entities.png)

\-- ii. Terminate the existence of two entities (set ValidTo to termination date)

```sql
-- terminate contract 2's current version as of 2010-06-30
UPDATE Contract
SET ValidTo = '2010-06-30'
WHERE ContractID = 2 AND ValidFrom = '2008-04-01';

-- terminate contract 3's current version as of 2011-12-31
UPDATE Contract
SET ValidTo = '2011-12-31'
WHERE ContractID = 3 AND ValidFrom = '2008-03-01';
```

![Terminate Entities](/images/dbi_applicationtime/terminate.png)

\-- iii. Change the state of at least three entities and change at least one
entity twice

```sql
-- Change 1: Contract 1, add a new version (change once)
UPDATE Contract SET ValidTo = '2012-06-30' WHERE ContractID = 1 AND ValidFrom = '2008-07-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Änderung 4', '2012-07-01', '9999-12-31');

-- Change 2: Contract 2, change twice (two sequential versions)
UPDATE Contract SET ValidTo = '2010-08-31' WHERE ContractID = 2 AND ValidFrom = '2008-04-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 1b', '2010-09-01', '2011-12-31');
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 2b', '2012-01-01', '9999-12-31');

-- Change 3: Contract 3, single change
UPDATE Contract SET ValidTo = '2010-05-31' WHERE ContractID = 3 AND ValidFrom = '2008-03-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (3, 2, 'Vertrag B - Änderung 3', '2010-06-01', '9999-12-31');
```

![State Changes](/images/dbi_applicationtime/changes.png)

```sql
DECLARE @Snap DATETIME2 = '2011-01-01';
SELECT * FROM Contract
WHERE @Snap >= ValidFrom AND @Snap < ValidTo;
```

![alt text](/images/dbi_applicationtime/contract-snapshot-2011-01-01.png)

## g. Alternate solution: point representation (brief)

- Structure (one point = effective date per version):

```sql
CREATE TABLE Contract_Point (
  ContractID INT,
  CustomerID INT,
  ContractDetails NVARCHAR(255),
  EffectiveDate DATETIME2,
  CONSTRAINT PK_ContractPoint PRIMARY KEY (ContractID, EffectiveDate)
);

-- Example data (one entity):
INSERT INTO Contract_Point (ContractID, CustomerID, ContractDetails, EffectiveDate) VALUES
(1, 1, 'Vertrag A - Initial', '2023-01-01'),
(1, 1, 'Vertrag A - Änderung 1', '2023-06-01'),
(1, 1, 'Vertrag A - Änderung 2', '2024-01-01');

-- Query: state as of a date (pick @D):
-- DECLARE @D DATETIME2 = '2023-10-01';
-- SELECT TOP(1) * FROM Contract_Point
-- WHERE ContractID = 1 AND EffectiveDate <= @D
-- ORDER BY EffectiveDate DESC;
```

![alt text](/images/dbi_applicationtime/contract-point-example.png)

## h. Bonus Exercise: Ensure that no overlaps can occur on your table

\-- Simple trigger-based protection um sicherzustellen, dass keine überlappenden Zeitintervalle für die gleiche ContractID eingefügt oder aktualisiert werden können:

```sql
CREATE OR ALTER TRIGGER TRG_Contract_NoOverlap
ON Contract
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  IF EXISTS (
    SELECT 1
    FROM Contract c
    JOIN inserted i ON c.ContractID = i.ContractID
    WHERE c.ValidFrom < i.ValidTo AND i.ValidFrom < c.ValidTo
      AND NOT (c.ValidFrom = i.ValidFrom AND c.ValidTo = i.ValidTo)
  )
  BEGIN
    RAISERROR('Interval overlap detected for the same ContractID.', 16, 1);
    ROLLBACK TRANSACTION;
  END
END;
```

\-- Note: Der Trigger prüft, ob es für die gleiche ContractID überlappende Zeitintervalle gibt. Wenn ja, wird eine Fehlermeldung ausgegeben und die Transaktion zurückgesetzt.

> Validierung durch Versuch eines überlappenden Einfügens:

```sql
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Overlap Test', '2012-01-01', '2012-12-31'); -- This should fail due to overlap
```

![failed query due overlap](/images/dbi_applicationtime/overlap-trigger-error.png)

---

# Part II: System-Versioned Tables (Transaction Time)

## 1a. Research: Besonderheiten und Einschränkungen von System-Versioned Tables in MS SQL Server

Quelle: [Microsoft Docs – Temporal Table Considerations and Limitations](https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-table-considerations-and-limitations?view=sql-server-ver16)

### Grundprinzip

Eine system-versioned temporal table besteht aus zwei Tabellen: der **aktuellen Tabelle** (current table) und der **History-Tabelle**. Das System verwaltet automatisch zwei `DATETIME2`-Spalten (`ValidFrom`, `ValidTo`), die als `GENERATED ALWAYS AS ROW START / ROW END` definiert werden. Bei jedem `INSERT`, `UPDATE` oder `DELETE` wird der vorherige Zeilenzustand automatisch in die History-Tabelle verschoben.

### Wichtige Einschränkungen und Besonderheiten

| Thema                                      | Beschreibung                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Primary Key**                            | Die aktuelle Tabelle **muss** einen Primärschlüssel haben. Die History-Tabelle **darf keinen** PK haben.                                                                             |
| **Period-Spalten**                         | Müssen `DATETIME2` sein und als `NOT NULL` definiert werden. Sie werden mit `PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)` deklariert.                                                |
| **Schema-Alignment**                       | Die History-Tabelle muss schema-konform zur aktuellen Tabelle sein (gleiche Spaltenanzahl, -namen, -reihenfolge, -datentypen).                                                       |
| **Keine direkte Manipulation der History** | Daten in der History-Tabelle können nicht direkt mit `INSERT`, `UPDATE` oder `DELETE` geändert werden, solange `SYSTEM_VERSIONING = ON` ist.                                         |
| **TRUNCATE TABLE**                         | Ist nicht erlaubt, solange `SYSTEM_VERSIONING = ON` ist.                                                                                                                             |
| **INSTEAD OF Trigger**                     | Sind weder auf der aktuellen noch auf der History-Tabelle erlaubt. `AFTER`-Trigger nur auf der aktuellen Tabelle.                                                                    |
| **Period-Spalten in DML**                  | `INSERT` und `UPDATE` dürfen die `SYSTEM_TIME`-Spalten nicht direkt setzen – diese werden vom System automatisch befüllt.                                                            |
| **History-Tabelle Constraints**            | Keine PKs, FKs, Table- oder Column-Constraints auf der History-Tabelle möglich.                                                                                                      |
| **Indexed Views**                          | Indexed Views auf temporale Abfragen (`FOR SYSTEM_TIME`) werden nicht unterstützt.                                                                                                   |
| **BLOB-Datentypen**                        | Unterstützt, aber mit erheblichen Speicher- und Performance-Kosten.                                                                                                                  |
| **Replikation**                            | Change Data Capture/Tracking nur auf der aktuellen Tabelle. Merge Replication wird nicht unterstützt.                                                                                |
| **Gleiche Datenbank**                      | History-Tabelle muss in derselben Datenbank wie die aktuelle Tabelle liegen. Temporal Querying über Linked Server nicht möglich.                                                     |
| **Indexing-Empfehlung**                    | Clustered Columnstore Index auf der History-Tabelle empfohlen für optimale Performance und Speicher.                                                                                 |
| **Keine Vererbung**                        | Period-Definition, Identity, Indexes, Statistiken, Check-Constraints, Trigger, Partitionierung und Berechtigungen werden nicht von der aktuellen auf die History-Tabelle repliziert. |

### Querying mit FOR SYSTEM\_TIME

| Klausel                     | Bedingung                               | Beschreibung                                      |
| --------------------------- | --------------------------------------- | ------------------------------------------------- |
| `AS OF <datetime>`          | `ValidFrom <= dt AND ValidTo > dt`      | Zustand zu einem bestimmten Zeitpunkt             |
| `FROM ... TO ...`           | `ValidFrom < end AND ValidTo > start`   | Alle Versionen, die in einem Zeitraum aktiv waren |
| `BETWEEN ... AND ...`       | `ValidFrom <= end AND ValidTo > start`  | Wie FROM/TO, inkl. oberer Grenze                  |
| `CONTAINED IN (start, end)` | `ValidFrom >= start AND ValidTo <= end` | Nur Versionen, die vollständig im Zeitraum liegen |
| `ALL`                       | alle Zeilen                             | Union von aktueller und History-Tabelle           |

## 1b. Szenario: Kunden- und Vertragsverwaltung mit Transaction Time

### Beschreibung

Dasselbe Szenario wie in Part I (SAS Handyapp mit Kunden- und Vertragsdaten), jedoch nun mit **Transaction Time** statt Application Time. Hier geht es nicht darum, wann ein Vertrag in der realen Welt gültig war, sondern **wann welche Änderungen im System erfasst wurden**. Das DBMS verwaltet die Zeitstempel automatisch.

Anwendungsfälle:

- **Audit**: Wann wurde ein Vertrag im System angelegt oder geändert?
- **Fehleranalyse**: Ein Vertrag wurde versehentlich geändert — Wiederherstellen des vorherigen Zustands über die History.
- **Compliance**: Lückenlose Nachvollziehbarkeit aller Datenbankänderungen für Prüfungen.

### Domänenmodell

- **Customer**(Kunde)
  - CustomerID (PK)
  - Name
  - Address
- **Contract** (Vertrag) — **System-Versioned**
  - ContractID (PK)
  - CustomerID (FK → Customer)
  - ContractDetails
  - ValidFrom (GENERATED ALWAYS AS ROW START)
  - ValidTo (GENERATED ALWAYS AS ROW END)

## 1c. Implementierung auf MS SQL Server

```sql
DROP DATABASE IF EXISTS TransactionTimeDB;
CREATE DATABASE TransactionTimeDB;
GO
USE TransactionTimeDB;
GO

-- Kunden-Tabelle (nicht temporal)
CREATE TABLE Customer (
  CustomerID INT PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Address NVARCHAR(255) NOT NULL
);

-- Vertrags-Tabelle (system-versioned temporal table)
CREATE TABLE Contract (
  ContractID INT NOT NULL PRIMARY KEY CLUSTERED,
  CustomerID INT NOT NULL,
  ContractDetails NVARCHAR(255) NOT NULL,
  ValidFrom DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,
  ValidTo DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,
  PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo),
  CONSTRAINT FK_Contract_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.ContractHistory));
```

## 1d. SQL-Kommandos: Entitäten, Zustandsänderungen, Terminierung

### i. Mindestens drei Entitäten erstellen

```sql
-- Kunden einfügen
INSERT INTO Customer (CustomerID, Name, Address) VALUES
(1, 'James Bond', 'MI6 Headquarters 7'),
(2, 'Benjamin Friedl', 'Bachalee 32');

-- Drei Verträge einfügen (= 3 Entitäten)
INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(1, 1, 'Mobilfunkvertrag Premium');

-- kurze Pause damit die Transaktionszeiten unterscheidbar sind
WAITFOR DELAY '00:00:01';

INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(2, 1, 'Datenvertrag Business');

WAITFOR DELAY '00:00:01';

INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(3, 2, 'Mobilfunkvertrag Basic');
```

### ii. Mindestens fünf Zustandsänderungen

```sql
-- Transition 1: Vertrag 1 wird auf höheres Paket geändert
WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Premium Plus' WHERE ContractID = 1;

-- Transition 2: Vertrag 2 wird auf anderen Kunden übertragen
WAITFOR DELAY '00:00:01';
UPDATE Contract SET CustomerID = 2 WHERE ContractID = 2;

-- Transition 3: Vertrag 3 Details werden angepasst
WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Standard' WHERE ContractID = 3;

-- Transition 4: Vertrag 1 wird erneut geändert (Downgrade)
WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Standard' WHERE ContractID = 1;

-- Transition 5: Vertrag 2 Details werden aktualisiert
WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Datenvertrag Business XL' WHERE ContractID = 2;
```

### iii. Mindestens eine Entität terminieren (Vertrag wird gekündigt)

```sql
-- Vertrag 3 wird gekündigt und aus der aktuellen Tabelle entfernt
WAITFOR DELAY '00:00:01';
DELETE FROM Contract WHERE ContractID = 3;
```

### Überprüfung: Aktuelle Daten und History

```sql
-- Aktuelle Verträge
SELECT * FROM Contract;
```

![Current Contracts](/images/dbi_applicationtime/system_versioned/current_contracts.png)

```sql
-- Vollständige History (alle Versionen aller Verträge)
SELECT * FROM Contract FOR SYSTEM_TIME ALL
ORDER BY ContractID, ValidFrom;
```

![Full History](/images/dbi_applicationtime/system_versioned/full_history.png)

```sql
-- History nur für den gekündigten Vertrag (ContractID = 3)
SELECT * FROM Contract FOR SYSTEM_TIME ALL
WHERE ContractID = 3
ORDER BY ValidFrom;
```

![Contract 3 History](/images/dbi_applicationtime/system_versioned/contract_3_history.png)

```sql
-- Zustand zu einem bestimmten Zeitpunkt (zB. kurz nach dem Erstellen)
-- Anpassung des Zeitstempels je nach tatsächlichem Ausführungszeitpunkt
-- SELECT * FROM Contract FOR SYSTEM_TIME AS OF '2026-02-13T10:00:00';
```

## 1e. Drei Abfragen mit FOR SYSTEM\_TIME

### Query 1: Zustand aller Verträge zu einem bestimmten Zeitpunkt (AS OF)

Zeigt den exakten Zustand aller Verträge, wie er 3 Sekunden nach dem ersten Insert im System erfasst war — also bevor spätere Updates durchgeführt wurden.

```sql
-- Zeitpunkt kurz nach dem Erstellen aller drei Verträge ermitteln
DECLARE @PointInTime DATETIME2;
SELECT @PointInTime = DATEADD(SECOND, 3, MIN(ValidFrom))
FROM Contract FOR SYSTEM_TIME ALL;

SELECT * FROM Contract
FOR SYSTEM_TIME AS OF @PointInTime
ORDER BY ContractID;
```

### Query 2: Alle Versionen eines Vertrags in einem Zeitfenster (FROM ... TO)

Listet alle historischen Zustände von Vertrag 1 auf, die innerhalb eines bestimmten Zeitfensters aktiv waren. Im Gegensatz zu `AS OF` liefert diese Klausel **mehrere Versionen** zurück.

```sql
DECLARE @Start DATETIME2, @End DATETIME2;

-- Zeitfenster: vom ersten Insert bis zum letzten Update
SELECT @Start = MIN(ValidFrom), @End = MAX(ValidFrom)
FROM Contract FOR SYSTEM_TIME ALL
WHERE ContractID = 1;

SELECT ContractID, ContractDetails, ValidFrom, ValidTo
FROM Contract
FOR SYSTEM_TIME FROM @Start TO @End
WHERE ContractID = 1
ORDER BY ValidFrom;
```

### Query 3: Vollständig innerhalb eines Zeitraums liegende Versionen (CONTAINED IN)

Zeigt nur jene Vertragsversionen, die **vollständig** (Start und Ende) innerhalb des angegebenen Zeitfensters liegen — also Versionen, die in diesem Zeitraum sowohl erstellt als auch bereits durch ein Update/Delete abgelöst wurden.

```sql
DECLARE @RangeStart DATETIME2, @RangeEnd DATETIME2;

-- Gesamte Zeitspanne aller aufgezeichneten Änderungen
SELECT @RangeStart = MIN(ValidFrom), @RangeEnd = MAX(ValidTo)
FROM ContractHistory;

SELECT ContractID, ContractDetails, ValidFrom, ValidTo
FROM Contract
FOR SYSTEM_TIME CONTAINED IN (@RangeStart, @RangeEnd)
ORDER BY ContractID, ValidFrom;
```

> Diese Query gibt nur Zeilen aus der History-Tabelle zurück, da aktuell gültige Zeilen `ValidTo = '9999-12-31'` haben und somit nicht vollständig im Zeitraum enthalten sind.

---

# 2. Abschließende Testfragen zum Thema Temporal Data

## Wie kann eine History-Tabelle manuell verändert werden, und wann kann das sinn machen?

> **Antwort:** Man kann die History-Tabelle manuell verändert werden, wenn man die System-Versionierung deaktiviert hat. (mit `ALTER TABLE ... SET (SYSTEM_VERSIONING = OFF)`) Das kann z.B. Sinn machen, wenn Daten von einer manuellen Versionierung importiert werden.

## Wahr oder Falsch: `FOR SYSTEM_TIME AS OF` gibt immer genau eine Zeile pro Primärschlüssel zurück.

> **Antwort:** **Wahr.** `AS OF` liefert den Zustand zu einem bestimmten Zeitpunkt. Da zu jedem Zeitpunkt pro Primärschlüssel höchstens eine gültige Version existieren kann, gibt die Abfrage pro Schlüssel maximal eine Zeile zurück (bzw. keine, falls der Datensatz zu diesem Zeitpunkt nicht existierte).

## Multiple Choice: Was gibt `FOR SYSTEM_TIME CONTAINED IN (@Start, @End)` zurück?

a) Alle Zeilen, die irgendwann im Zeitraum gültig waren \
b) Nur Zeilen, deren `ValidFrom` **und** `ValidTo` vollständig innerhalb des Zeitraums liegen \
c) Nur die aktuell gültige Zeile, wenn sie im Zeitraum erstellt wurde \
d) Alle Zeilen aus der History-Tabelle, unabhängig vom Zeitraum

> **Antwort:** **b)** `CONTAINED IN` liefert ausschließlich Zeilen, deren gesamte Gültigkeitsspanne (`ValidFrom` bis `ValidTo`) vollständig innerhalb des angegebenen Zeitfensters liegt.

## Wahr oder Falsch: Wenn eine Zeile mit `DELETE` entfernt wird, wird sie aus der Haupttabelle und aus der History-Tabelle gelöscht.

> **Antwort:** **Falsch.** Bei einer system-versionierten Tabelle wird die Zeile nur aus der Haupttabelle entfernt. In der History-Tabelle bleibt sie mit dem entsprechenden `ValidTo`-Zeitstempel erhalten, sodass der frühere Zustand jederzeit nachvollzogen werden kann.

## Multiple Choice: Welche Schritte sind notwendig, um die System-Versionierung einer Tabelle dauerhaft zu entfernen?

a) `DROP TABLE History` ausführen \
b) `ALTER TABLE ... SET (SYSTEM_VERSIONING = OFF)`, danach die Periodspalten und die History-Tabelle manuell entfernen \
c) Die History-Tabelle leeren (`TRUNCATE`), dann wird die Versionierung automatisch deaktiviert \
d) `ALTER TABLE ... DROP PERIOD FOR SYSTEM_TIME` genügt allein

> **Antwort:** **b)** Zuerst muss die System-Versionierung mit `SET (SYSTEM_VERSIONING = OFF)` deaktiviert werden. Anschließend können die `PERIOD FOR SYSTEM_TIME`-Definition, die `GENERATED ALWAYS`-Spalten und die History-Tabelle manuell entfernt werden.
