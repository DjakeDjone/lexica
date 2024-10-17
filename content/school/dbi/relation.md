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

---
---

## Abhängige Entity-Typen

- **Schwache Entity-Typen**: haben keinen eigenen Primärschlüssel, sondern sind abhängig von einem anderen Entity-Typen

Besonderheiten:

- **Identifizierende Beziehung**: Beziehung zwischen schwachem und starkem Entity-Typen
- **Identifizierende Beziehungstypen**: Beziehungstypen, die schwache Entity-Typen involvieren

```sql
CREATE TABLE Lehrer (
    LehrerID INT PRIMARY KEY,
    Name VARCHAR(50)
);

CREATE TABLE Kurs (
    KursID INT PRIMARY KEY,
    Name VARCHAR(50),
    LehrerID INT,
    FOREIGN KEY (LehrerID) REFERENCES Lehrer(LehrerID) ON DELETE CASCADE
);
```

In diesem Beispiel ist `Kurs` ein schwacher Entity-Typ, da er nicht ohne `Lehrer` existieren kann. Das `ON DELETE CASCADE` sorgt dafür, dass beim Löschen eines Lehrers auch alle Kurse gelöscht werden weil ein Kurs ohne Lehrer keinen Sinn macht. Der Primärschlüssel von `Kurs` ist die Kombination aus `KursID` und `LehrerID`.

> ### Hinweis: Schwache Entity-Typen
>
> Der Schwache Entity-Typ wird im ER-Diagramm durch eine doppelte Linie dargestellt und der Identifizierende Beziehungstyp durch ein doppeltes Rautensymbol. Der Primary Key des schwachen Entity-Typen wird durch einen gestrichelten Unterstrich dargestellt.

## Überlagerte Entity-Typen

Überlagerte Entity-Typen lässt sich mit Vererbung in Java vergleichen. Sie haben mehrere Primärschlüssel, die sich aus den Primärschlüsseln der überlagerten Entity-Typen zusammensetzen.

```sql
CREATE TABLE Person (
    PersonID INT PRIMARY KEY,
    Name VARCHAR(50)
);

CREATE TABLE Lehrer (
    LehrerID INT PRIMARY KEY,
    PersonID INT,
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID) ON DELETE CASCADE
);

CREATE TABLE Schüler (
    SchülerID INT PRIMARY KEY,
    PersonID INT,
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID) ON DELETE CASCADE
);
```

In diesem Beispiel ist `Person` ein überlagerter Entity-Typ, da `Lehrer` und `Schüler` von `Person` erben. Der Primärschlüssel von `Person` ist die Kombination aus `PersonID` und `LehrerID` bzw. `SchülerID`.

> ### Hinweis: Überlagerte Entity-Typen

### Total, Disjunkt, Nicht Disjunkt

- **Total**: Jeder Entity-Typ muss in **mindestens einer** Untergruppe vorkommen; *Doppelter Strich als Verbindungslinie*
- **Disjunkt**: Ein Entity-Typ kann nur in **einer** (Entweder Oder) Untergruppe vorkommen: *Wird durch ein volles Dreieck dargestellt*
- **nicht disjunkt**: Ein Entity-Typ kann in **mehreren** Untergruppen vorkommen; *Wird durch ein gefülltes Dreieck dargestellt*
- **partiell**: Ein Entity-Typ kann in **keiner** Untergruppe vorkommen: *Einfacher Strich als Verbindungslinie*

> ### Achtung
>
> Diese Schreibweise ist **kein genormter Standard** sondern eine Konvention. Es gibt auch andere Schreibweisen, diese soll jedoch für den Test verwendet werden.
