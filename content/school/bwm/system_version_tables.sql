-- ============================================================
-- Part I: Application Time (Interval Representation)
-- ============================================================

DROP DATABASE IF EXISTS ApplicationTimeDB;
GO
CREATE DATABASE ApplicationTimeDB;
GO
USE ApplicationTimeDB;
GO

-- b. Create temporal table with application time (interval representation)
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

-- d. Test data with at least ten state transitions
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

-- e. Snapshot on birthday
DECLARE @Birthday DATETIME2 = '2007-01-13';
SELECT * FROM Contract
WHERE @Birthday >= ValidFrom AND @Birthday < ValidTo;

-- f.i. Add two new entities
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES
(4, 1, 'Vertrag C - Initial', '2012-02-01', '9999-12-31'),
(5, 2, 'Vertrag D - Initial', '2012-03-01', '9999-12-31');

-- f.ii. Terminate two entities
UPDATE Contract
SET ValidTo = '2010-06-30'
WHERE ContractID = 2 AND ValidFrom = '2008-04-01';

UPDATE Contract
SET ValidTo = '2011-12-31'
WHERE ContractID = 3 AND ValidFrom = '2008-03-01';

-- f.iii. Change state of at least three entities, one twice
-- Change 1: Contract 1 (once)
UPDATE Contract SET ValidTo = '2012-06-30' WHERE ContractID = 1 AND ValidFrom = '2008-07-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Änderung 4', '2012-07-01', '9999-12-31');

-- Change 2: Contract 2 (twice)
UPDATE Contract SET ValidTo = '2010-08-31' WHERE ContractID = 2 AND ValidFrom = '2008-04-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 1b', '2010-09-01', '2011-12-31');
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 2b', '2012-01-01', '9999-12-31');

-- Change 3: Contract 3 (once)
UPDATE Contract SET ValidTo = '2010-05-31' WHERE ContractID = 3 AND ValidFrom = '2008-03-01';
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (3, 2, 'Vertrag B - Änderung 3', '2010-06-01', '9999-12-31');

-- Snapshot at 2011-01-01
DECLARE @Snap DATETIME2 = '2011-01-01';
SELECT * FROM Contract
WHERE @Snap >= ValidFrom AND @Snap < ValidTo;

-- g. Alternate solution: point representation
CREATE TABLE Contract_Point (
  ContractID INT,
  CustomerID INT,
  ContractDetails NVARCHAR(255),
  EffectiveDate DATETIME2,
  CONSTRAINT PK_ContractPoint PRIMARY KEY (ContractID, EffectiveDate)
);

INSERT INTO Contract_Point (ContractID, CustomerID, ContractDetails, EffectiveDate) VALUES
(1, 1, 'Vertrag A - Initial', '2023-01-01'),
(1, 1, 'Vertrag A - Änderung 1', '2023-06-01'),
(1, 1, 'Vertrag A - Änderung 2', '2024-01-01');

-- h. Bonus: No-overlap trigger
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
GO

-- Test overlap (should fail)
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Overlap Test', '2012-01-01', '2012-12-31');


-- ============================================================
-- Part II: System-Versioned Tables (Transaction Time)
-- ============================================================

USE master;
GO
ALTER DATABASE TransactionTimeDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE IF EXISTS TransactionTimeDB;
GO
CREATE DATABASE TransactionTimeDB;
GO
USE TransactionTimeDB;
GO

-- 1c. Kunden-Tabelle (nicht temporal)
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

-- 1d.i. Mindestens drei Entitäten erstellen
INSERT INTO Customer (CustomerID, Name, Address) VALUES
(1, 'James Bond', 'MI6 Headquarters 7'),
(2, 'Benjamin Friedl', 'Bachalee 32');

INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(1, 1, 'Mobilfunkvertrag Premium');

WAITFOR DELAY '00:00:01';

INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(2, 1, 'Datenvertrag Business');

WAITFOR DELAY '00:00:01';

INSERT INTO Contract (ContractID, CustomerID, ContractDetails) VALUES
(3, 2, 'Mobilfunkvertrag Basic');

-- 1d.ii. Mindestens fünf Zustandsänderungen
WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Premium Plus' WHERE ContractID = 1;

WAITFOR DELAY '00:00:01';
UPDATE Contract SET CustomerID = 2 WHERE ContractID = 2;

WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Standard' WHERE ContractID = 3;

WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Mobilfunkvertrag Standard' WHERE ContractID = 1;

WAITFOR DELAY '00:00:01';
UPDATE Contract SET ContractDetails = 'Datenvertrag Business XL' WHERE ContractID = 2;

-- 1d.iii. Mindestens eine Entität terminieren
WAITFOR DELAY '00:00:01';
DELETE FROM Contract WHERE ContractID = 3;

-- Überprüfung: Aktuelle Verträge
SELECT * FROM Contract;
-- ![Current Contracts](/images/dbi_applicationtime/system_versioned/current_contracts.png)

-- Vollständige History (alle Versionen aller Verträge)
SELECT * FROM Contract FOR SYSTEM_TIME ALL
ORDER BY ContractID, ValidFrom;
-- ![Full History](/images/dbi_applicationtime/system_versioned/full_history.png)

-- History nur für den gekündigten Vertrag (ContractID = 3)
SELECT * FROM Contract FOR SYSTEM_TIME ALL
WHERE ContractID = 3
ORDER BY ValidFrom;
-- ![Contract 3 History](/images/dbi_applicationtime/system_versioned/contract_3_history.png)