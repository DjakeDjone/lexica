-- Application Time Temporal Table - Single Execution Script
-- Generated on 2026-02-11

IF DB_ID('ApplicationTimeDB') IS NOT NULL
BEGIN
  ALTER DATABASE ApplicationTimeDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
  DROP DATABASE ApplicationTimeDB;
END;
GO

CREATE DATABASE ApplicationTimeDB;
GO

USE ApplicationTimeDB;
GO

CREATE TABLE Customer (
  CustomerID INT PRIMARY KEY,
  Name NVARCHAR(100),
  Address NVARCHAR(255)
);
GO

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
GO

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

INSERT INTO Customer (CustomerID, Name, Address) VALUES
(1, 'James Bond', 'MI6 Headquarters 7'),
(2, 'Benjamin Friedl', 'Bachalee 32');
GO

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
GO

-- Snapshot on birthday example
DECLARE @Birthday DATETIME2 = '2007-01-13';
SELECT * FROM Contract
WHERE @Birthday >= ValidFrom AND @Birthday < ValidTo;
GO

-- i. Add two new entities
INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES
(4, 1, 'Vertrag C - Initial', '2012-02-01', '9999-12-31'),
(5, 2, 'Vertrag D - Initial', '2012-03-01', '9999-12-31');
GO

-- ii. Terminate the existence of two entities
UPDATE Contract
SET ValidTo = '2010-06-30'
WHERE ContractID = 2 AND ValidFrom = '2008-04-01';
GO

UPDATE Contract
SET ValidTo = '2011-12-31'
WHERE ContractID = 3 AND ValidFrom = '2008-03-01';
GO

-- iii. Change the state of at least three entities
-- Change 1: Contract 1, add a new version (change once)
UPDATE Contract SET ValidTo = '2012-06-30' WHERE ContractID = 1 AND ValidFrom = '2008-07-01';
GO

INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Änderung 4', '2012-07-01', '9999-12-31');
GO

-- Change 2: Contract 2, change twice (two sequential versions)
UPDATE Contract SET ValidTo = '2010-08-31' WHERE ContractID = 2 AND ValidFrom = '2008-04-01';
GO

INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 1b', '2010-09-01', '2011-12-31');
GO

INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (2, 1, 'Vertrag A2 - Änderung 2b', '2012-01-01', '9999-12-31');
GO

-- Change 3: Contract 3, single change
UPDATE Contract SET ValidTo = '2010-05-31' WHERE ContractID = 3 AND ValidFrom = '2008-03-01';
GO

INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (3, 2, 'Vertrag B - Änderung 3', '2010-06-01', '9999-12-31');
GO

-- Alternate solution: point representation (brief)
CREATE TABLE Contract_Point (
  ContractID INT,
  CustomerID INT,
  ContractDetails NVARCHAR(255),
  EffectiveDate DATETIME2,
  CONSTRAINT PK_ContractPoint PRIMARY KEY (ContractID, EffectiveDate)
);
GO

INSERT INTO Contract_Point (ContractID, CustomerID, ContractDetails, EffectiveDate) VALUES
(1, 1, 'Vertrag A - Initial', '2023-01-01'),
(1, 1, 'Vertrag A - Änderung 1', '2023-06-01'),
(1, 1, 'Vertrag A - Änderung 2', '2024-01-01');
GO

DECLARE @D DATETIME2 = '2023-10-01';
SELECT TOP(1) * FROM Contract_Point
WHERE ContractID = 1 AND EffectiveDate <= @D
ORDER BY EffectiveDate DESC;
GO


---
---

DECLARE @Snap DATETIME2 = '2011-01-01';
SELECT * FROM Contract
WHERE @Snap >= ValidFrom AND @Snap < ValidTo;

DECLARE @D DATETIME2 = '2023-10-01';
SELECT TOP(1) * FROM Contract_Point
WHERE ContractID = 1 AND EffectiveDate <= @D
ORDER BY EffectiveDate DESC;

INSERT INTO Contract (ContractID, CustomerID, ContractDetails, ValidFrom, ValidTo)
VALUES (1, 1, 'Vertrag A - Overlap Test', '2012-01-01', '2012-12-31'); -- This should fail due to overlap


DECLARE @Snap DATETIME2 = '2024-01-15';
SELECT * FROM Contract WHERE @Snap >= ValidFrom AND @Snap < ValidTo;
