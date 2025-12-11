---
title: "MongoDB Indizes"
protocolAbgabedatum: "10.10.2025"
protocolAufgabenNr: 04
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "10.10.2025"
protocolDescription: "MongoDB Indexes, how to create and use them"
---

# Index Design & Performance Analysis

## Setup

Database: `indizes` (on Atlas cluster)
Collections: `museum`, `tweets`

## Museum Collection

### 1.2) Filter by District
**Query:**
```js
db.museum.find({ "properties.BEZIRK": 4 }, { "properties.ADRESSE": 1, _id: 0 })
```

**1. Baseline (No Index):**
- Plan: `COLLSCAN`
- Docs Examined: 119
- Time: ~1ms

**2. Index Hypothesis:**
Creating an index on `properties.BEZIRK` will allow the query to jump directly to documents with district 4.

**3. Implementation:**
```js
db.museum.createIndex({ "properties.BEZIRK": 1 })
```

**4. Result (With Index):**
- Plan: `IXSCAN` (Fetch)
- Docs Examined: 6
- **Conclusion:** Huge improvement. Only relevant documents are examined.

---

### 1.3) Sort by Name
**Query:**
```js
db.museum.find({}, { "properties.NAME": 1 }).sort({ "properties.NAME": 1 }).limit(3)
```

**1. Baseline:**
- Docs Examined: 119 (Full scan to sort)

**2. Index Hypothesis:**
Index on `properties.NAME` allow retreiving documents in sorted order without in-memory sort.

**3. Implementation:**
```js
db.museum.createIndex({ "properties.NAME": 1 })
```

**4. Result:**
- Plan: `LIMIT -> PROJECTION` (using index)
- Docs Examined: 3
- **Conclusion:** Optimized. Stops after finding first 3 elements.

---

### 1.4) Filter by District (In) + Sort by District & Name
**Query:**
```js
db.museum.find({ "properties.BEZIRK": { $in: [13, 14] } }).sort({ "properties.BEZIRK": 1, "properties.NAME": 1 })
```

**1. Baseline:**
- Docs Examined: 119 (Sort stage required)

**2. Index Hypothesis:**
A compound index on `properties.BEZIRK` and `properties.NAME` supports both the equality/range filter and the sort.

**3. Implementation:**
```js
db.museum.createIndex({ "properties.BEZIRK": 1, "properties.NAME": 1 })
```

**4. Result:**
- Plan: `IXSCAN`
- Docs Examined: 6
- Keys Examined: 7
- **Conclusion:** Very efficient, handles sort implicitly.

---

### 1.6) Range Filter (Start/End)
**Query:**
```js
db.museum.find({ "properties.BEZIRK": { $gt: 9 } })
```

**Result with `properties.BEZIRK` index:**
- Plan: `IXSCAN`
- Docs Examined: 27
- **Conclusion:** Index used for range query efficiently.

---

### 1.7) Regex Search
**Query:**
```js
db.museum.find({ "properties.NAME": { $regex: "Bezirksmuseum" } })
```

**Hypothesis:**
Standard index with regex scan is faster than collection scan but still scans all index keys. Text index is better for word search.

**Implementation:**
```js
db.museum.createIndex({ "properties.NAME": "text" })
```

**Comparison:**
- **Standard Index (Regex)**: Docs Examined: 14, Keys Examined: 119 (Full Index Scan).
- **Text Index (`$text: { $search: ... }`)**: Docs Examined: 14, Keys Examined: 14.
- **Conclusion:** Text index is superior for token-based search.

---

## Tweets Collection

### 2.1) Range Filter on Friends Count
**Query:**
```js
db.tweets.find({ "user.friends_count": { $gte: 80, $lte: 90 } })
```

**1. Baseline:**
- Plan: `COLLSCAN`
- Docs Examined: 53641

**2. Implementation:**
```js
db.tweets.createIndex({ "user.friends_count": 1 })
```

**3. Result:**
- Plan: `IXSCAN`
- Docs Examined: 2013
- **Conclusion:** Massive reduction in scanned documents (scanning ~2k instead of ~53k).

---

### 2.2) Missing Field (Source)
**Query:**
```js
db.tweets.find({ "source": { $exists: false } })
```

**1. Baseline:**
- Docs Examined: 53641

**2. Implementation:**
```js
db.tweets.createIndex({ "source": 1 })
```

**3. Result:**
- Docs Examined: 2213
- **Conclusion:** Standard index includes nulls/missing values, enabling efficient lookup for non-existent fields.

---

### 2.3) Array Size
**Query:**
```js
db.tweets.find({ "entities.hashtags": { $size: 3 } })
```

**Result:**
- Indexes on array field do **not** support `$size`.
- Plan: `COLLSCAN`
- Docs Examined: 53641
- **Note:** To optimize, store a `hashtags_count` field.

---

### 2.4) Multikey Index (Hashtags)
**Query:**
```js
db.tweets.find({ "entities.hashtags.text": "love" })
```

**1. Baseline:**
- Docs Examined: 53641

**2. Implementation:**
```js
db.tweets.createIndex({ "entities.hashtags.text": 1 })
```

**3. Result:**
- Docs Examined: 6
- **Conclusion:** Multikey index works perfectly for finding documents containing an array element.

---

### 2.5) Case-Insensitive Regex
**Query:**
```js
db.tweets.find({ "entities.hashtags.text": { $regex: "love", $options: "i" } })
```

**Result with Index:**
- Plan: `IXSCAN`
- Keys Examined: 8487 (Scanned index keys matching pattern)
- Docs Examined: 6558
- **Conclusion:** Index is used, but performance depends on regex selectivity. Better than full doc scan.

---

## Final Created Indexes

### Museum
```json
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "properties.BEZIRK": 1 }, "name": "properties.BEZIRK_1" },
  { "v": 2, "key": { "properties.NAME": 1 }, "name": "properties.NAME_1" },
  { "v": 2, "key": { "properties.BEZIRK": 1, "properties.NAME": 1 }, "name": "properties.BEZIRK_1_properties.NAME_1" },
  { "v": 2, "key": { "_fts": "text", "_ftsx": 1 }, "name": "properties.NAME_text", ... }
]
```

### Tweets
```json
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "user.friends_count": 1 }, "name": "user.friends_count_1" },
  { "v": 2, "key": { "source": 1 }, "name": "source_1" },
  { "v": 2, "key": { "entities.hashtags.text": 1 }, "name": "entities.hashtags.text_1" },
  { "v": 2, "key": { "user.lang": 1 }, "name": "user.lang_1" }
]
```