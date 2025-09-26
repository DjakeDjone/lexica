---
title: "Erste Schritte mit MongoDB"
protocolAbgabedatum: "19.09.2025"
protocolAufgabenNr: 02
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "19.09.2025" # TODO
protocolDescription: "Erste Schritte mit MongoDB, das Erstellen einer Datenbank, das Einfügen von Documents und das einfache Abfragen von Daten."
---
## Verbindung zu MongoDB herstellen

Die MongoDB shell ist basically eine JavaScript-Umgebung, die speziell für die Interaktion mit MongoDB-Datenbanken entwickelt wurde. Sie ermöglicht es, Datenbankoperationen durchzuführen, Abfragen zu schreiben und administrative Aufgaben zu erledigen.

Shell:

```fish
mongosh "mongodb+srv://<cluster-address>/test" --apiVersion 1 --username <username>
```

und zeige alle verfügbaren Datenbanken an:

```js
show dbs
```

![mongoshell welcome](/images/mongosh_welcome_screen.png)

## Eine neue Collection erstellen

Eine neue Collection in der Datenbank wird mit dem Befehl db.createCollection() erstellt. Dies legt eine strukturierte Sammlung von Dokumenten an, mit optionalen Parametern für spezielle Eigenschaften wie begrenzte Größe, Validierung oder Time-Series-Unterstützung.

```js
db.createCollection(<name>, <options>)
```

Optionen (nicht alle):

- capped: boolean, wenn true, erstellt eine begrenzte Collection (feste Größe, überschreibt alte Daten, wenn voll)
- size: number, maximale Größe in Bytes für begrenzte Collectionen
- max: number, maximale Anzahl von Documents für begrenzte Collectionen
- timeseries: object, wenn angegeben, erstellt eine Time-Series-Collection mit den gegebenen Optionen
- validator: object, JSON Schema zur Validierung von Documents in der Collection

![create Collection](/images/create_collection_news.png)

## Viele Documents einfügen

Mehrere Dokumente werden gleichzeitig in eine Collection mit db.collection.insertMany() eingefügt. Dies ist effizient für Bulk-Inserts und unterstützt Optionen wie geordnetes Einfügen oder das Fortfahren bei Fehlern.

```js
db.news.insertMany(<object[]>, options)
```

options:

- ordered: boolean, wenn true (Standard), bricht der Vorgang ab, wenn ein Fehler auftritt; wenn false, fährt fort und überspringt fehlerhafte Inserts
- comment: any, ein optionaler Kommentar zu dem Insert

![insert many](/images/insert_many_documents.png)

## Document finden

Dokumente in einer Collection werden mit db.collection.find() gesucht und abgerufen. Dies filtert Dokumente basierend auf Kriterien und unterstützt Optionen für Projektion, Sortierung und Begrenzung der Ergebnisse.

```js
db.posts.find( { field: value, ... }, <options> )
```

options:

- projection: object, um nur bestimmte Felder zurückzugeben (1 einschließen, 0 ausschließen)
- sort: object, um die Ergebnisse zu sortieren (1 aufsteigend, -1 absteigend)
- limit: number, um die Anzahl der zurückgegebenen Documents zu begrenzen

![find documents](/images/find_by_category_technology.png)

## Advanced Find Queries mit Regular Expressions

Für erweiterte Suchen mit Mustern, wie z.B. Textübereinstimmungen, werden reguläre Ausdrücke in db.collection.find() verwendet. Dies ermöglicht flexible Abfragen, z.B. nach Titeln, mit Optionen für Groß-/Kleinschreibung.

```js
db.posts.find( { title: { $regex: /pattern/, $options: 'i' } } )
```

z.B.

```js
db.posts.find( { title: { $regex: /Post/, $options: 'i' } } )
```

## Document aktualisieren

Ein einzelnes Dokument wird mit db.collection.updateOne() aktualisiert. Dies ändert spezifische Felder basierend auf einem Filter und kann optional ein neues Dokument erstellen, wenn keines gefunden wird.

```js
db.posts.updateOne(
   { _id: ObjectId("68d655bc4b36849879ce5f48") },
   { $set: { title: "Updated Post Title" } }
)
```

![update documents](/images/update_document_title.png)

Wenn das Dokument nicht existiert und du es erstellen möchtest, verwende `upsert: true`

```js
db.posts.updateOne(
    { _id: ObjectId("68d655bc4b36849879ce5f49") },
   { $set: { title: "Updated Post Title" } },
   { upsert: true }
)
```

![update documents with upsert](/images/update_with_upsert_option.png)

andere optionen:

- multi: boolean, wenn true, aktualisiert mehrere Documents, die dem Filter entsprechen (nur bei updateMany)
- arrayFilters: array, um Bedingungen für Array-Elemente in der Aktualisierung zu spezifizieren

## Document löschen

Mehrere Dokumente, die einem Filter entsprechen, werden mit db.collection.deleteMany() gelöscht. Dies entfernt alle passenden Dokumente und unterstützt Optionen wie das Löschen nur eines Dokuments.

```js
db.posts.deleteMany( { category: "News" } )
```

options:

- justOne: boolean, wenn true, löscht nur ein Document, das dem Filter entsprecht (nur bei deleteMany)

![delete many](/images/delete_news_category_documents.png)
