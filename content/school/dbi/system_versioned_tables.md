---
protocolAufgabenNr: 09
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "30.01.2026"
protocolAbgabedatum: "22.02.2026"
protocolDescription: "Your task is to perform research regarding System-Versioned Tables in MS SQL Server."
---

## 1. Szenario Beschreibung

SAS Handyapp mit Kunden- und Vertragsdaten. Verträge müssen über die Zeit
verfolgt werden können, zB. wann ein Vertrag aktiv war, wann er geändert wurde,
etc.

### Domänbeschriftung

- **Kunde** (Customer)
  - KundenID (CustomerID) (PK)
  - Name (Name)
  - Adresse (Address)
- **Vertrag** (Contract)
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

-- i. Add two new entities (new logical contracts)

```sql
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES
(4, 1, 'Vertrag C - Initial', '2012-02-01', '9999-12-31'),
(5, 2, 'Vertrag D - Initial', '2012-03-01', '9999-12-31');
```

-- ii. Terminate the existence of two entities (set ValidTo to termination date)

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

-- iii. Change the state of at least three entities and change at least one
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

-- Simple trigger-based protection um sicherzustellen, dass keine überlappenden Zeitintervalle für die gleiche ContractID eingefügt oder aktualisiert werden können:

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

-- Note: Der Trigger prüft, ob es für die gleiche ContractID überlappende Zeitintervalle gibt. Wenn ja, wird eine Fehlermeldung ausgegeben und die Transaktion zurückgesetzt.

> Validierung durch Versuch eines überlappenden Einfügens:

```sql
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Overlap Test', '2012-01-01', '2012-12-31'); -- This should fail due to overlap
```

![failed query due overlap](/images/dbi_applicationtime/overlap-trigger-error.png)