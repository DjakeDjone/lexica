# Beziehung zwischen Entities desselben Typs

Bsp.:

```sql
CREATE TABLE Mitarbeiter (
    MitarbeiterID INT PRIMARY KEY,
    VorgesetzterID INT, -- VorgesetzterID ist eine MitarbeiterID
    Name VARCHAR(50),
    FOREIGN KEY (VorgesetzterID) REFERENCES Mitarbeiter(MitarbeiterID)
);
```

Wenn die Beziehung mehr als '1-N' ist, dann wird die Beziehung in einer separaten Tabelle gespeichert.

Bsp.:

```sql
CREATE TABLE Mitarbeiter (
    MitarbeiterID INT PRIMARY KEY,
    Name VARCHAR(50)
);
```
