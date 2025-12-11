
const db = db.getSiblingDB("indizes");

function runExplain(label, cursor) {
    print("\n========== " + label + " ==========");
    // Handle find cursor vs aggregation explain
    if (cursor.explain) {
        const exp = cursor.explain("executionStats");
        // Helper to find input stage if projection/sort is top
        let stage = exp.executionStats.executionStages;
        let stageName = stage.stage;
        if (stage.inputStage) {
            stageName += " -> " + stage.inputStage.stage;
        }

        printjson({
            plan: stageName,
            docsExamined: exp.executionStats.totalDocsExamined,
            keysExamined: exp.executionStats.totalKeysExamined
        });
    } else {
        print("Cannot explain cursor");
    }
}

// 1. Index on BEZIRK
db.museum.createIndex({ "properties.BEZIRK": 1 });
print("\nCreated Index: properties.BEZIRK: 1");

// Q1.2 (Filter BEZIRK=4)
runExplain("Q1.2 with BEZIRK Index", db.museum.find({ "properties.BEZIRK": 4 }, { "properties.ADRESSE": 1, _id: 0 }));

// Q1.6 (Range > 9)
runExplain("Q1.6 with BEZIRK Index", db.museum.find({ "properties.BEZIRK": { $gt: 9 } }));

// 2. Index on NAME (for sort)
db.museum.createIndex({ "properties.NAME": 1 });
print("\nCreated Index: properties.NAME: 1");

// Q1.3 (Sort NAME)
runExplain("Q1.3 with NAME Index", db.museum.find({}, { "properties.NAME": 1 }).sort({ "properties.NAME": 1 }).limit(3));

// 3. Compound Index BEZIRK + NAME
db.museum.createIndex({ "properties.BEZIRK": 1, "properties.NAME": 1 });
print("\nCreated Index: properties.BEZIRK: 1, properties.NAME: 1");

// Q1.4 (Filter In, Sort Both)
runExplain("Q1.4 with Compound Index", db.museum.find({ "properties.BEZIRK": { $in: [13, 14] } }).sort({ "properties.BEZIRK": 1, "properties.NAME": 1 }));

// 4. Text Index
db.museum.createIndex({ "properties.NAME": "text" });
print("\nCreated Text Index: properties.NAME: text");

// Q1.7 (Regex)
runExplain("Q1.7 Regex with Text Index (std regex)", db.museum.find({ "properties.NAME": { $regex: "Bezirksmuseum" } }));

// Q1.7 (Text search)
runExplain("Q1.7 with $text", db.museum.find({ $text: { $search: "Bezirksmuseum" } }));
