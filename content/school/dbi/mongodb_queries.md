---
title: "MongoDB CRUD Operations"
protocolAbgabedatum: "10.10.2025"
protocolAufgabenNr: 02
protocolKlasse: "5AHIF"
protocolName: "Benjamin Friedl"
protocolGruppe: "1"
protocolAbgabetermin: "10.10.2025"
protocolDescription: "MongoDB CRUD operations"
---

## Connect to MongoDB

Connect via Mongo Shell to the database mongodbqueries on a DBI5 cluster.
mongosh `mongodb+srv://dbi5.4e2bjau.mongodb.net/` --username `5hif`

Password is `5hif`

```js
use mongodbqueries
```

## Vienna Museums (collection museum)

### 1.1) How many museums are listed in the collection?

```js
db.museum.countDocuments()
```

![count documents](/images/mongodb_queries_img1.png)

### 1.2) Which museums can be found in the 4th district of Vienna (only address information of interest)?

```js
db.museum.find({ "properties.BEZIRK": 4 }, { "properties.ADRESSE": 1, _id: 0 })
```

- to only show specific fields, use projection (2nd parameter of find)
- set `_id: 0` to hide the `_id` field (shown by default)
- use `1` to show a field, `0` to hide a field

![museum addresses in 4th district](/images/mongodb_queries_img2.png)

### 1.3) What are the first three museums sorted with alphabetical order by name? Make sure to list just the names and the ids

```js
db.museum.find({}, { "properties.NAME": 1 }).sort({ "properties.NAME": 1 }).limit(3)
```

- sorting in ascending order is 1, descending order is -1
- `limit(n)` limits the number of documents returned to n

![museum names and ids](/images/mongodb_queries_img3.png)

### 1.4) Which museums are located in the 13th or 14th district? Sort the result first by district, then by name ascending

```js
db.museum.find({ "properties.BEZIRK": { $in: [13, 14] } }).sort({ "properties.BEZIRK": 1, "properties.NAME": 1 })
```

![museum addresses in 4th district](/images/mongodb_queries_img2.png)

### 1.5) How many museums are located outside the 1st district?

```js
db.museum.countDocuments({ "properties.BEZIRK": { $ne: 1 } })
```

- `$ne` matches all values that are not equal to a specified value

![museum addresses outside 1st district](/images/mongodb_queries_img4.png)

### 1.6) How much is the number of museums outside the inner districts 1 to 9?

```js
db.museum.countDocuments({ "properties.BEZIRK": { $gt: 9 } })
```

![museum addresses outside inner districts](/images/mongodb_queries_img5.png)

### 1.7) In which districts do you find specific museums (“Bezirksmuseen”, district numbers ONLY)?

```js
db.museum.distinct("properties.BEZIRK", { "properties.NAME": { $regex: "Bezirksmuseum" } })
```

![museum districts for Bezirksmuseen](/images/mongodb_queries_img6.png)

### 1.8) Which museums have an address where the house number is 5?

```js
db.museum.find({ "properties.ADRESSE": { $regex: " 5$" } }, { "properties.NAME": 1, "properties.ADRESSE": 1, _id: 0 })
```

- `$regex` provides regular expression capabilities for pattern matching strings in queries
- `$` matches the end of a string

![museum addresses with house number 5](/images/mongodb_queries_img7.png)

## Twitter (collection tweets)

### 2.1) How many tweets in the collection origin from users with friends’ count in [80,90]?

```js
db.tweets.countDocuments({ "user.friends_count": { $gte: 80, $lte: 90 } })
```

- `$gte` matches values that are greater than or equal to a specified value
- `$lte` matches values that are less than or equal to a specified value

**other filter operators:**

- `$in` matches any of the values specified in an array
- `$ne` matches all values that are not equal to a specified value

![tweets from users with friends count in [80,90]](/images/mongodb_queries_img8.png)

### 2.2) Are there any documents that miss the “source” field?

```js
db.tweets.countDocuments({ "source": { $exists: false } })
```

- `$exists` matches documents that have the specified field

![tweets missing source field](/images/mongodb_queries_img9.png)

### 2.3) How many tweets have exactly three hashtags?

```js
db.tweets.countDocuments({ "entities.hashtags": { $size: 3 } })
```

- `$size` matches any array with the specified number of elements

![tweets with exactly three hashtags](/images/mongodb_queries_img10.png)

### 2.4) Give me the tweets contain a hashtag “love” (case-sensitive)?

```js
db.tweets.find({ "entities.hashtags.text": "love" }, { "text": 1, "entities.hashtags": 1 })
```

![tweets with hashtag love (case-sensitive)](/images/mongodb_queries_img11.png)

### 2.5) How many tweets contain a hashtag “love” (case-insensitive)?

```js
db.tweets.countDocuments({ "entities.hashtags.text": { $regex: "love", $options: "i" } })
```

- `i` makes the search case-insensitive (default is case-sensitive)

![tweets with hashtag love (case-insensitive)](/images/mongodb_queries_img12.png)
