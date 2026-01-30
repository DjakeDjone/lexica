---
title: "Application Time"
protocolAbgabedatum: "30.01.2026"
protocolAufgabenNr: 07
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "30.01.2026"
protocolDescription: "Your task is to create a temporal table based on application time on your MS SQL Server database."
---

## 1. Szenario Beschreibung

**Domäne:** Abo-Management-System (Subscription Management) **Beschreibung:**
Wir verwalten einen Abonnement-Dienst (z.B. für eine Streaming-Plattform).
Benutzer können verschiedene Abo-Stufen (Basic, Premium, Family) über die Zeit
hinweg haben. Wir müssen die Historie des Abo-Status eines Benutzers verfolgen,
um Abrechnungen korrekt durchzuführen und Upgrade/Downgrade-Verhalten zu
analysieren.

**Entitäten:** `Subscription`

**Attribute:**

- `SubscriptionID` (Surrogate Key)
- `UserID` (Foreign Key zu einer User-Tabelle - simuliert)
- `Tier` (VARCHAR: 'Basic', 'Premium', etc.)
- `Price` (DECIMAL)
- `ValidFrom` (DATETIME2)
- `ValidTo` (DATETIME2)

## 2. Lösungsimplementierung

Wir implementieren die Lösung unter Verwendung des "Application Time"-Ansatzes
mit **Intervall-Repräsentation**.

### a. Tabellenerstellung

Die Tabelle `Subscriptions` wurde mit `ValidFrom` und `ValidTo` Spalten
erstellt.

```sql
CREATE TABLE Subscriptions (
    SubscriptionID INT NOT NULL,
    UserID INT NOT NULL,
    Tier VARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ValidFrom DATETIME2 NOT NULL,
    ValidTo DATETIME2 NOT NULL,
    CONSTRAINT PK_Subscriptions PRIMARY KEY (SubscriptionID, ValidFrom),
    CONSTRAINT CK_ValidDates CHECK (ValidFrom < ValidTo)
);
```

### b. Wahl des Primärschlüssels (Primary Key Rationale)

Da sich ein Abonnement über die Zeit ändern kann (z.B. Upgrade von Basic auf
Premium), ist die `SubscriptionID` allein nicht eindeutig. Ein Datensatz (State)
wird eindeutig durch die Kombination aus der Entitäts-ID (`SubscriptionID`) und
dem Beginn des Gültigkeitszeitraums (`ValidFrom`) identifiziert. Daher wurde der
zusammengesetzte Primärschlüssel `(SubscriptionID, ValidFrom)` gewählt.

### c. Testdaten

Es wurden Testdaten generiert, die mindestens 10 Zustandsübergänge (State
Transitions) für 5 Benutzer (Alice, Bob, Charlie, Dave, Eve) abbilden.

- **Alice:** Basic -> Premium -> Basic -> Gekündigt
- **Bob:** Premium -> Family -> Premium
- **Charlie:** Basic -> Preiserhöhung -> Premium -> Basic -> Frozen
- **Dave:** Family -> Gekündigt
- **Eve:** Basic -> Gekündigt

### d. Abfragen und Ergebnisse

Die folgenden Abfragen wurden ausgeführt, um ein verwaltendes System zu
simulieren. Die Ergebnisse sind im Screenshot unten zu sehen.

1. **Snapshot am Geburtstag (2024-05-15):** Zeigt den aktiven Status aller Abos
   zu diesem Zeitpunkt. ![Snapshot Results](/images/dbi_applicationtime/snapshot.png)

2. **Hinzufügen von zwei neuen Entitäten:** IDs 6 und 7 wurden erstellt.
   ![Add Entities Results](/images/dbi_applicationtime/add_entities.png)

3. **Beendigung von zwei Entitäten:** Dave (4) und Eve (5) wurden gekündigt
   (ValidTo aktualisiert). ![Terminate Results](/images/dbi_applicationtime/terminate.png)

4. **Zustandsänderungen:**
   - Bob (2) wechselte von Family zurück zu Premium.
   - Charlie (3) wechselte mehrfach (Downgrade, dann Frozen Status).
     ![Changes Results](/images/dbi_applicationtime/changes.png)

### g. Alternative Lösung - Punkt-Repräsentation (Point Representation)

Beim Punkt-Repräsentations-Ansatz speichern wir nur den Beginn (`ValidFrom`)
eines Zustands. Das Ende ist implizit durch den Beginn des nächsten Eintrags
derselben Entität definiert.

**Vorteil:** Einfachere Inserts (kein Update des vorherigen Rows nötig).
**Nachteil:** Teurere Abfragen (Self-Join oder Subquery nötig, um Gültigkeit zu
prüfen).

**Struktur:**

```sql
CREATE TABLE SubscriptionsPoint (
    SubscriptionID INT NOT NULL,
    UserID INT NOT NULL,
    Tier VARCHAR(50) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ValidFrom DATETIME2 NOT NULL,
    CONSTRAINT PK_SubscriptionsPoint PRIMARY KEY (SubscriptionID, ValidFrom)
);
```

**Beispiel-Query (Zustand zum Zeitpunkt T):** Um den Status zum Zeitpunkt `T` zu
finden, wählen wir den Eintrag mit dem höchsten `ValidFrom`, das kleiner oder
gleich `T` ist.

```sql
SELECT TOP 1 *
FROM SubscriptionsPoint
WHERE SubscriptionID = @id AND ValidFrom <= @TargetTime
ORDER BY ValidFrom DESC;
```

### h. Bonusaufgabe: Überlappungen verhindern

Um sicherzustellen, dass keine zeitlichen Überlappungen für eine Entität
auftreten, wurde ein `CHECK`-Constraint in Kombination mit einer Scalar
User-Defined Function (UDF) implementiert.

**1. Funktion zur Überlappungsprüfung:** Die Funktion prüft, ob für eine
gegebene ID bereits ein Zeitraum existiert, der sich mit dem neuen Zeitraum
überschneidet.

**Wichtig:** Beim Erstellen des Constraints prüft SQL Server alle
_bestehenden_ Zeilen. Dabei vergleicht sich jede Zeile mit sich selbst, was
fälschlicherweise als Überlappung erkannt wird. Daher muss die Funktion so
angepasst werden, dass sie die aktuell geprüfte Zeile (anhand von `ValidFrom`)
ignoriert: `AND ValidFrom <> @ValidFrom`.

```sql
CREATE FUNCTION dbo.CheckOverlap (...) RETURNS INT AS BEGIN
    SELECT @OverlapCount = COUNT(*1o)
    FROM Subscriptions
    WHERE SubscriptionID = @SubID
      AND ValidFrom < @ValidTo 
      AND ValidTo > @ValidFrom
      AND ValidFrom <> @ValidFrom; -- Ausschluss der eigenen Zeile
    RETURN ...;
END;
```

**2. Constraint:**

```sql
ALTER TABLE Subscriptions
ADD CONSTRAINT CK_NoOverlap CHECK (dbo.CheckOverlap(SubscriptionID, ValidFrom, ValidTo) = 0);
```

**Ergebnis:** Wie im Screenshot unten zu sehen ist, wurde der Versuch, einen
überlappenden Zeitraum einzufügen, erfolgreich blockiert:

![Bonus Results](/images/dbi_applicationtime/bonus.png)
