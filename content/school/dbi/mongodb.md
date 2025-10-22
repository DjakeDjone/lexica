# MongoDB

## Big Data

main attributes of Big Data (4Vs):

- **Volume**: große Datenmengen
- **Velocity**: hohe Geschwindigkeit bei der Datenverarbeitung
- **Variety**: Vielfalt der Datenformate und -quellen (Schemaless)
- **Veracity**: Unsicherheit der Daten

### Goals for Databases dealing with Big Data

- **Cost Efficiency**: günstige Speicherung und Verarbeitung großer Datenmengen
- **Elastic Scaling**: horizontale Skalierung durch Hinzufügen weiterer Knoten wenn diese benötigt werden
- **New Insights**: Gewinnung wertvoller Erkenntnisse aus großen Datenmengen
- **Business Intelligence**: Unterstützung bei der Entscheidungsfindung durch Datenanalyse

## Types of NoSQL Databases

- **Key-Value Stores**: einfache Datenmodelle, die Schlüssel-Wert-Paare speichern (z.B. Redis, DynamoDB)
- **Document Stores**: speichern semi-strukturierte Dokumente (z.B. MongoDB, CouchDB)
- **Column-Oriented Databases**: speichern Daten in Spalten statt in Zeilen (z.B. Cassandra, HBase), das macht sie effizient für analytische Abfragen
- **Graph Databases**: speichern Daten in Form von Knoten und Kanten, ideal für Beziehungsdaten (z.B. Neo4j, Amazon Neptune)

## CAP Theorem

Das CAP-Theorem besagt, dass ein verteiltes Datensystem nur zwei der drei folgenden Eigenschaften gleichzeitig garantieren kann:

- **Consistency**: Alle Knoten im System sehen zu jedem Zeitpunkt die gleichen Daten.
- **Availability**: Jeder Knoten im System ist jederzeit erreichbar und kann Anfragen bearbeiten.
- **Partition Tolerance**: Das System funktioniert auch bei Netzwerkpartitionen, d.h. wenn Teile des Systems nicht miteinander kommunizieren können. *Ein Server fällt aus oder die Netzwerkverbindung wird unterbrochen*

In der Praxis bedeutet dies, dass ein System, das hohe Verfügbarkeit und Partitionstoleranz bietet, möglicherweise auf Konsistenz verzichten muss, und umgekehrt.
MongoDB ist ein dokumentenorientiertes NoSQL-Datenbanksystem, das auf dem CAP-Theorem basiert und sich auf Verfügbarkeit und Partitionstoleranz konzentriert, während es eine gewisse Konsistenz gewährleistet.

> **CA**: Konsistenz und Verfügbarkeit (keine Partitionstoleranz) - traditionelle relationale Datenbanken (RDBMS) wie MySQL, PostgreSQL

> **CP**: Konsistenz und Partitionstoleranz (keine Verfügbarkeit) - Bankensysteme, bei denen Konsistenz entscheidend ist

## ACID vs. BASE

- **ACID**: Atomicity, Consistency, Isolation, Durability - Eigenschaften von Transaktionen in traditionellen relationalen Datenbanken
- **BASE**: Basically Available, Soft state, Eventual consistency - Eigenschaften von NoSQL-Datenbanken wie MongoDB, die auf hohe Verfügbarkeit und Skalierbarkeit ausgelegt sind

### Begriffe erklärt

- **Atomicity**: Eine Transaktion wird entweder vollständig ausgeführt oder gar nicht.
- **Consistency**: Die Datenbank bleibt nach einer Transaktion in einem konsistenten Zustand.
- **Isolation**: Transaktionen werden so ausgeführt, als wären sie die einzigen im System.
- **Durability**: Nach Abschluss einer Transaktion bleiben die Änderungen dauerhaft, auch bei Systemausfällen.
- **Basically Available**: Das System garantiert Verfügbarkeit, auch wenn es nicht immer konsistent ist.
- **Soft state**: Der Zustand der Datenbank kann sich im Laufe der Zeit ändern, auch ohne Eingriffe von außen.
- **Eventual consistency**: Die Daten werden im Laufe der Zeit konsistent, auch wenn sie kurzfristig inkonsistent sein können.

## MongoDB Architektur

MongoDB verwendet eine dokumentenorientierte Architektur, bei der Daten in BSON-Dokumenten (Binary JSON) gespeichert werden. Diese Dokumente sind flexibel und können unterschiedliche Strukturen haben, was MongoDB ideal für die Speicherung von semi-strukturierten Daten macht.