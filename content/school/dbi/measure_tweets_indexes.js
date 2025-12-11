
const db = db.getSiblingDB("indizes");
db.tweets.dropIndexes();

function runExplain(label, cursor) {
    print("\n========== " + label + " ==========");
    const exp = cursor.explain("executionStats");
    let stage = exp.executionStats.executionStages;
    let stageName = stage.stage;
    // Drill down to inputStage if needed to find IXSCAN or COLLSCAN
    // But top level is usually enough.
    printjson({
        plan: stageName,
        docsExamined: exp.executionStats.totalDocsExamined,
        keysExamined: exp.executionStats.totalKeysExamined
    });
}

// Baselines
runExplain("Q2.1 Baseline (Friends 80-90)", db.tweets.find({ "user.friends_count": { $gte: 80, $lte: 90 } }));
runExplain("Q2.2 Baseline (Source Missing)", db.tweets.find({ "source": { $exists: false } }));
runExplain("Q2.3 Baseline (Hashtags Size 3)", db.tweets.find({ "entities.hashtags": { $size: 3 } }));
runExplain("Q2.4 Baseline (Hashtag 'love')", db.tweets.find({ "entities.hashtags.text": "love" }));
runExplain("Q2.5 Baseline (Hashtag 'love' i)", db.tweets.find({ "entities.hashtags.text": { $regex: "love", $options: "i" } }));

// Create Indexes
print("\nCreating Indexes...");
db.tweets.createIndex({ "user.friends_count": 1 });
db.tweets.createIndex({ "source": 1 });
db.tweets.createIndex({ "entities.hashtags.text": 1 });
db.tweets.createIndex({ "user.lang": 1 });

// Indexed Runs
runExplain("Q2.1 Indexed", db.tweets.find({ "user.friends_count": { $gte: 80, $lte: 90 } }));
runExplain("Q2.2 Indexed", db.tweets.find({ "source": { $exists: false } }));
runExplain("Q2.3 Indexed", db.tweets.find({ "entities.hashtags": { $size: 3 } }));
runExplain("Q2.4 Indexed", db.tweets.find({ "entities.hashtags.text": "love" }));
runExplain("Q2.5 Indexed", db.tweets.find({ "entities.hashtags.text": { $regex: "love", $options: "i" } }));

