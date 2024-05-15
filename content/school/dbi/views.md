# DBI TEST

## Allgemein Teststoff DBI

+ wir wissen was views sind und können views definieren
+ wir kennen die Vorteile und Nachteile von views
+ wir kennen die Einschränkungen von views und die verschiedenen Arten (in verschiedenen RDBMS)
+ wir kennen die verschiedenen Key Begriffe und wissen wie man keys auswählen kann
+ wir können Redundanzen erkennen erklären und beseitigen
+ wir kennen uns mit referenzieller Integrität aus (Foreign Key, ..)
+ wir können bestehende Tabellen und constraints mit ALTER verändern
+ wir kennen die Grundbegriffe von XML
+ wir können einfache XSD und XML files erstellen

## Views

Views sind virtuelle Tabellen, die aus einer oder mehreren Tabellen erstellt werden. Sie können wie Tabellen verwendet werden, aber sie enthalten keine Daten. Die Daten werden aus den zugrunde liegenden Tabellen abgerufen, wenn eine Abfrage gegen eine Ansicht ausgeführt wird.

### Vorteile von Views

+ Vereinfachung von Abfragen
+ **Sicherheit**: Zugriffsrechte
+ Reduzierung von Redundanzen
+ Wiederverwendbarkeit
+ Leistungsverbesserung

### Nachteile von Views

+ Leistung
+ Komplexität
+ Aktualisierbarkeit

### Materialisierte Views

Materialisierte Views sind Ansichten, die die Ergebnisse einer Abfrage speichern, um die Leistung zu verbessern. Sie werden in der Regel verwendet, wenn die Abfrageergebnisse teuer sind oder wenn die Abfrageergebnisse häufig abgerufen werden.

```sql
CREATE MATERIALIZED VIEW mv AS SELECT * FROM t;
```

```sql
REFRESH MATERIALIZED VIEW mv;
```

### Einschränkungen von Views

+ Keine ORDER BY Klausel
+ Keine GROUP BY Klausel
+ Keine DISTINCT Klausel
+ Keine Aggregatfunktionen (SUM, COUNT, AVG, MAX, MIN)
+ Keine Subqueries
+ Keine Joins
+ Keine DML-Operationen (INSERT, UPDATE, DELETE)

## Key Begriffe

+ **Primary Key**: Eindeutiger Schlüssel, der die Zeilen in einer Tabelle identifiziert.
+ **Foreign Key**: Spalte oder eine Gruppe von Spalten in einer Tabelle, die auf den Primärschlüssel einer anderen Tabelle verweisen.
+ **Unique Key**: Spalte oder eine Gruppe von Spalten in einer Tabelle, die keine Duplikate zulässt.
+ **Composite Key**: Mehrere Spalten, die zusammen als Primärschlüssel verwendet werden.
+ **Natural Key**: Spalte oder eine Gruppe von Spalten, die natürliche Daten enthalten.
+ **Surrogate Key**: Künstlicher Schlüssel, der keine natürlichen Daten enthält.

## Redundanzen

*Redundanzen sind doppelte oder überflüssige Daten in einer Datenbank. Sie können zu Inkonsistenzen führen und die Leistung beeinträchtigen. Redundanzen können durch Normalisierung beseitigt werden.*

### Beispiel

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    phone_number VARCHAR(20),
    hire_date DATE,
    job_id INT,
    salary DECIMAL(10, 2),
    manager_id INT,
    department_id INT
);
```

Die Spalten `first_name`, `last_name`, `email`, `phone_number` sind redundant, da sie Informationen über den Mitarbeiter enthalten. Sie können in eine separate Tabelle `employee_info` verschoben werden.

## Referenzielle Integrität

Referenzielle Integrität ist ein Konzept in relationalen Datenbanken, das sicherstellt, dass Beziehungen zwischen Tabellen konsistent sind. Sie wird durch Foreign Keys implementiert, die sicherstellen, dass Werte in einer Tabelle auf Werte in einer anderen Tabelle verweisen.

### Beispiel

```sql
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
);
```

In diesem Beispiel verweist die Spalte `department_id` in der Tabelle `employees` auf die Spalte `department_id` in der Tabelle `departments`.

## ALTER TABLE

Mit dem `ALTER TABLE`-Befehl können Sie bestehende Tabellen und Constraints ändern.

### Beispiel

```sql
ALTER TABLE employees
ADD COLUMN birth_date DATE;
```

```sql
ALTER TABLE employees
DROP COLUMN phone_number;
```

```sql
ALTER TABLE employees
ADD CONSTRAINT fk_department
FOREIGN KEY (department_id) REFERENCES departments (department_id);
```

## XML

XML (Extensible Markup Language) ist eine Auszeichnungssprache, die zur Darstellung von Daten in einem hierarchischen Format verwendet wird. Es besteht aus Tags, Attributen und Text.

### Beispiel

```xml
<bookstore>
    <book category="COOKING">
        <title lang="en">Everyday Italian</title>
        <author>Giada De Laurentiis</author>
        <year>2005</year>
        <price>30.00</price>
    </book>
    <book category="CHILDREN">
        <title lang="en">Harry Potter</title>
        <author>J.K. Rowling</author>
        <year>2005</year>
        <price>29.99</price>
    </book>
</bookstore>
```

## XSD

XSD (XML Schema Definition) ist eine Sprache zur Definition von XML-Dokumentenstrukturen. Es definiert die Elemente, Attribute und Datentypen, die in einem XML-Dokument verwendet werden können.

### Beispiel

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="book">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="title" type="xs:string"/>
                <xs:element name="author" type="xs:string"/>
                <xs:element name="year" type="xs:integer"/>
                <xs:element name="price" type="xs:decimal"/>
            </xs:sequence>
            <xs:attribute name="category" type="xs:string"/>
        </xs:complexType>
    </xs:element>
</xs:schema>
```

## Zusammenfassung

+ Views sind virtuelle Tabellen, die aus einer oder mehreren Tabellen erstellt werden.
+ Materialisierte Views speichern die Ergebnisse einer Abfrage, um die Leistung zu verbessern.
+ Einschränkungen von Views: Keine ORDER BY, GROUP BY, DISTINCT, Aggregatfunktionen, Subqueries, Joins, DML-Operationen.
+ Schlüsselbegriffe: Primary Key, Foreign Key, Unique Key, Composite Key, Natural Key, Surrogate Key.
+ Redundanzen können durch Normalisierung beseitigt werden.
+ Referenzielle Integrität wird durch Foreign Keys implementiert.
+ Mit `ALTER TABLE` können bestehende Tabellen und Constraints geändert werden.#
+ XML ist eine Auszeichnungssprache zur Darstellung von Daten in einem hierarchischen Format.
+ XSD ist eine Sprache zur Definition von XML-Dokumentenstrukturen.
