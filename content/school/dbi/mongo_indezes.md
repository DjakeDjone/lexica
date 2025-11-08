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

username: `benji`
password: `9WKKjL2RQEVJrz`

command: `mongosh "mongodb+srv://indezes.ggpglwf.mongodb.net/" --apiVersion 1 --username benji`

complete connection url: `mongodb+srv://benji:9WKKjL2RQEVJrz@indezes.ggpglwf.mongodb.net/`

## Copy sample data

### Clone `museum` and `tweets` collections

the server url: `mongodb+srv://dbi5.4e2bjau.mongodb.net/` with the password `5hif`

cloning the data can be done with the mongodb atls:

## Propose, implement, and compare single-field and compound indexes.

### 1) Single-field index on `properties.NAME` in `museum` collection

```js
db.museum.createIndex({ "properties.NAME": 1 })
```

explain query without index:

```js
db.museum.find({ "properties.NAME": "Kunsthalle Wien" }).explain("executionStats")
```

`
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'test.museum',
    parsedQuery: { 'properties.NAME': { '$eq': 'Kunsthalle Wien' } },
    indexFilterSet: false,
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: { isCached: false, stage: 'EOF' },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 0,
    totalKeysExamined: 0,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'EOF',
      nReturned: 0,
      executionTimeMillisEstimate: 0,
      works: 1,
      advanced: 0,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1
    }
  },
  queryShapeHash: 'FA50D32ADB6FD3F086DA0FB6280DF319E5216E0314588B17A803BDD28509AFCC',
  command: {
    find: 'museum',
    filter: { 'properties.NAME': 'Kunsthalle Wien' },
    '$db': 'test'
  },
  serverInfo: {
    host: 'ac-mcb8f3l-shard-00-01.ggpglwf.mongodb.net',
    port: 27017,
    version: '8.0.15',
    gitVersion: 'f79b970f08f60c41491003cd55a3dd459a279c39'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1762517196, i: 11 }),
    signature: {
      hash: Binary.createFromBase64('QW7klKki0ttsqnPJv2PEXg7OWVk=', 0),
      keyId: Long('7528846600647475265')
    }
  },
  operationTime: Timestamp({ t: 1762517196, i: 11 })
}
`

Important fields:

- winningPlan: COLLSCAN
- totalDocsExamined: 6319

explain query with index:

```js
db.museum.find({ "properties.NAME": "Kunsthalle Wien" }).explain("executionStats")
```

#### Comparison

- without index: COLLSCAN, 6319 documents examined
- with index: IXSCAN, 1 document examined