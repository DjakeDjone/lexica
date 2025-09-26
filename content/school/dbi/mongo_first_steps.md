---
title: "Erste Schritte mit MongoDB"
protocolAbgabedatum: "19.09.2025"
protocolAbgabetermin: "19.09.2025" # TODO
protocolDescription: "Erste Schritte mit MongoDB, das Erstellen einer Datenbank, das Einfügen von Documents und das einfache Abfragen von Daten."
---

## Verbindung zu MongoDB herstellen

Shell:

```fish
mongosh "mongodb+srv://<cluster-address>/test" --apiVersion 1 --username <username>
```

und zeige alle verfügbaren Datenbanken an:

```js
show dbs
```

![mongoshell welcome](/imagesmongosh_welcome_screen.png)

### Eine neue Collection erstellen

```js
db.createCollection(<name>, <options>)
```

Optionen (nicht alle):

- capped: boolean, wenn true, erstellt eine begrenzte Collection (feste Größe, überschreibt alte Daten, wenn voll)
- size: number, maximale Größe in Bytes für begrenzte Collectionen
- max: number, maximale Anzahl von Documents für begrenzte Collectionen
- timeseries: object, wenn angegeben, erstellt eine Time-Series-Collection mit den gegebenen Optionen
- validator: object, JSON Schema zur Validierung von Documents in der Collection

![create Collection](/imagescreate_collection_news.png)

### Viele Documents einfügen

```js
db.news.insertMany(<object[]>, options)
```

options:

- ordered: boolean, wenn true (Standard), bricht den Vorgang ab, wenn ein Fehler auftritt; wenn false, fährt fort und überspringt fehlerhafte Inserts
- comment: any, ein optionaler Kommentar zu dem Insert

![insert many](/imagesinsert_many_documents.png)

### Document finden

```js
db.posts.find( { field: value, ... }, <options> )
```

options:

- projection: object, um nur bestimmte Felder zurückzugeben (1 einschließen, 0 ausschließen)
- sort: object, um die Ergebnisse zu sortieren (1 aufsteigend, -1 absteigend)
- limit: number, um die Anzahl der zurückgegebenen Documents zu begrenzen

![find documents](/imagesfind_by_category_technology.png)

### Document aktualisieren

```js
db.posts.updateOne(
   { _id: ObjectId("68d655bc4b36849879ce5f48") },
   { $set: { title: "Updated Post Title" } }
)
```

![update documents](/imagesupdate_document_title.png)

Wenn das Dokument nicht existiert und du es erstellen möchtest, verwende `upsert: true`

```js
db.posts.updateOne(
    { _id: ObjectId("68d655bc4b36849879ce5f49") },
   { $set: { title: "Updated Post Title" } },
   { upsert: true }
)
```

![update documents with upsert](/imagesupdate_with_upsert_option.png)

### Document löschen

```js
db.posts.deleteMany( { category: "News" } )
```

![delete many](/imagesdelete_news_category_documents.png)
