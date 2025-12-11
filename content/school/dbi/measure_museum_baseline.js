
const db = db.getSiblingDB("indizes");

// Drop indexes first to ensure baseline
db.museum.dropIndexes();

function runExplain(label, cursor) {
    print("\n========== " + label + " ==========");
    const exp = cursor.explain("executionStats");
    printjson({
        plan: exp.executionStats.executionStages.stage, // use executionStages.stage for top level
        docsExamined: exp.executionStats.totalDocsExamined,
        time: exp.executionStats.executionTimeMillis,
        keysExamined: exp.executionStats.totalKeysExamined
    });
}

// Q1.2
runExplain("Q1.2", db.museum.find({ "properties.BEZIRK": 4 }, { "properties.ADRESSE": 1, _id: 0 }));

// Q1.3
runExplain("Q1.3", db.museum.find({}, { "properties.NAME": 1 }).sort({ "properties.NAME": 1 }).limit(3));

// Q1.4
runExplain("Q1.4", db.museum.find({ "properties.BEZIRK": { $in: [13, 14] } }).sort({ "properties.BEZIRK": 1, "properties.NAME": 1 }));

// Q1.5 ($ne 1)
runExplain("Q1.5", db.museum.find({ "properties.BEZIRK": { $ne: 1 } }));

// Q1.6 ($gt 9)
runExplain("Q1.6", db.museum.find({ "properties.BEZIRK": { $gt: 9 } }));

// Q1.7 Regex
runExplain("Q1.7", db.museum.find({ "properties.NAME": { $regex: "Bezirksmuseum" } }));

// Q1.8 Regex End
runExplain("Q1.8", db.museum.find({ "properties.ADRESSE": { $regex: " 5$" } }));

// Q Agg 1
runExplain("Q_Agg_1", db.museum.aggregate([
    { $group: { _id: "$properties.BEZIRK", museumCount: { $sum: 1 } } },
    { $match: { museumCount: { $gte: 5 } } },
    { $sort: { _id: 1 } }
]));

// Q Agg 2
runExplain("Q_Agg_2", db.museum.aggregate([
    { $group: { _id: "$properties.BEZIRK", museumCount: { $sum: 1 } } },
    { $sort: { museumCount: -1 } },
    { $limit: 3 }
]));
