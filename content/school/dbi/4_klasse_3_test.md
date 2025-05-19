# DBI Test 3. Klasse

```sql

DECLARE @Zaehler INT = 1;

IF @Zaehler > 0
BEGIN
  PRINT N'COOL';
  WHILE @Zaehler < 10
  BEGIN
    EXEC PrintText2 @Zaehler, 1;
    SET @Zaehler = @Zaehler+1;
  END;
END;
```

```sql
CREATE OR ALTER PROCEDURE PrintText
@Txt VARCHAR(200)
AS
BEGIN
 DECLARE @PRINTER TABLE (txt NVARCHAR(max));
    
    INSERT INTO @PRINTER (txt) VALUES (@Txt);
    
    SELECT * FROM @PRINTER;
END;
```

```sql
-- cursor

DECLARE my_cursor CURSOR
FOR SELECT N'HELLO CURSOR';

-- open cursor
DECLARE @output NVARCHAR(50) = '';
OPEN my_cursor;

FETCH NEXT FROM my_cursor INTO @output;

EXEC PrintText @output;

CLOSE my_cursor;
DEALLOCATE my_cursor;
```

## Backup

### Full Backup

Speichert gesamte DB

```sql
BACKUP DATEABSE SurrealDB
TO DISK = "Pfad"
WITH
    NAME = 'BACKUP'
    DESCRIPTION = 'test'
    STATS = 10; -- 10% Steps
GO
```

### Differential Backup

Backup, welches nur die Changes nach dem letztem Full-Backup gemacht wurden speichert.

```sql
BACKUP DATABASE SurrealDB
TO DISK = 'DiskPfad'
WITH
    DIFFERENTIAL, -- wichtig
    NAME = 'BACKUP'
    DESCRIPTION = 'test'
    STATS = 10; -- 10% Steps
GO
```

### Transaction Log Backup

```sql
-- Erfordert, dass das Recovery Model der Datenbank auf FULL oder BULK_LOGGED eingestellt ist.
ALTER DATABASE IhreDatenbank SET RECOVERY FULL; -- Falls noch nicht geschehen
BACKUP LOG IhreDatenbank
TO DISK = 'Pfad\Zu\Ihrem\Backup\IhreDatenbank_Log.trn'
WITH
    NAME = 'IhreDatenbank-Transaction Log Backup',
    DESCRIPTION = 'Transaction log backup of IhreDatenbank',
    STATS = 10;
GO
```
