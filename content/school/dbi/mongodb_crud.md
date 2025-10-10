
# MongoDB CRUD Operations

## Data selection and Imports

### Prepare a cluster on your Atlas storage

cluster name: 'school'
database_name: 'dbi'
collection_name: 'teachers'

username: 5ahif
password: 5ahif

### Find/Extract Data

My data:

from 'htlstp.ac.at/lehrer'
convertet to JSON via gemini ai (easier than webscraping and possible because of the small data size)

```json
{
  "meta": {...},
    "data": [
}
```

### Import the data

to import data into mongodb, the options are:

- mongoimport tool
- write a script (e.g. in python)
- use a GUI tool (e.g. MongoDB Compass)
- use the mongo shell

I used the mongodb compass

![alt text](/images/mongodb-compass-insert-data.png)

How the 5ahif user can access the dbi database:

```fish
mongosh "mongodb+srv://school.fu7deyq.mongodb.net/" --apiVersion 1 --username 5ahif
```

and then switch to the dbi database:

```js
use dbi
```

## CRUD Operations

<!-- todo: delete tasks -->
- Add one suitable document with fictional data.
- Formulate three functional questions regarding the data in your collection. Create three
distinctive queries for these questions.
- Update your data with three distinct update statements with suitable filters. One of the
statements needs to be an upsert statement.
- Remove at least one document with a proper delete statement.
- Provide and describe queries that show the effects of your statements.
<!-- -- -->

### Create (Insert) a Document

```js
db.teachers.insertOne(
  {
    "name": "Friedl",
    "firstname": "Benjamin",
    "subject": ["DBI"],
    "age": 18,
    "fulltime": true,
    "hobbies": ["Going to school", "Joking"]
  }
)
```

![alt text](/images/mongodb-compass-insert-one.png)

### Read (Find) Documents

#### Prof. Raab

```js
db.teachers.find({ "name": { $regex: "Raab" } })
```

![query 1: get prof. raab using regex](/images/mongodb-query-one.png)

#### all Abteilungsvorstand

```js
db.teachers.find({ "role": "Abteilungsvorstand" })
```

![query 2: get all Abteilungsvorstand](/images/mongodb-query-many.png)

#### How many teachers are in the department 'Informatik'?

```js
db.teachers.countDocuments({ "departments": "Informatik" })
```

![query 3: get how many teachers are in the department 'Informatik'](/images/mongodb-query-many-all-teachers.png)

### Update Documents

```js
db.teachers.updateOne(
  { "name": "Friedl" },
  { $set: { "age": 19 } }
)
```

![query 4: update teacher Friedl's age](/images/mongodb-update-one.png)

```js
db.teachers.updateMany(
  { "fulltime": true },
  { $set: { "hobbies": [] } }
)
```

![alt text](/images/mongodb-update-many.png)

**Upsert Example**

> Upsert: if the document does not exist, create it.

```js
db.teachers.updateOne(
  { "name": "Mustermann" },
  { $set: { "firstname": "Max", "age": 30, "subject": ["Math"], "fulltime": false } },
  { upsert: true }
)
```

```js
db.teachers.updateMany(
  { "department": "Informatik" },
  { $set: { "image": "htl-logo.png" } }
)
```

### Delete Documents

```js
db.teachers.deleteOne({ "name": "Friedl" })
```
