/**
 * Defines the structure of a single data record.
 */
interface Record {
    id: string;
    val: string;
}

/**
 * Defines the structure of a sparse index entry.
 */
interface IndexEntry {
    key: string;
    pageIdx: number;
}

/**
 * A simplified Indexed Sequential Access Method (ISAM) implementation.
 * * ISAM works by keeping data in sorted blocks (data pages) and maintaining
 * a separate sparse index that points to the first key of each block.
 */
class ISAMSystem {
    private pageSize: number;
    private dataPages: Record[][];
    private index: IndexEntry[];
    private overflowArea: Record[];

    constructor(pageSize: number = 4) {
        this.pageSize = pageSize;
        this.dataPages = [];
        this.index = [];
        this.overflowArea = [];
    }

    /**
     * Initializes the ISAM structure with a sorted list of records.
     */
    public loadData(sortedRecords: Record[]): void {
        if (sortedRecords.length === 0) return;

        // Ensure initial load is sorted by ID
        const records = [...sortedRecords].sort((a, b) =>
            a.id.localeCompare(b.id)
        );

        const numPages = Math.ceil(records.length / this.pageSize);
        this.dataPages = [];
        this.index = [];

        for (let i = 0; i < numPages; i++) {
            const start = i * this.pageSize;
            const end = start + this.pageSize;
            const page = records.slice(start, end);

            this.dataPages.push(page);
            // Add entry to sparse index (first key of the page)
            this.index.push({ key: page[0]!.id, pageIdx: i });
        }

        console.log(`Loaded ${records.length} records into ${numPages} pages.`);
    }

    /**
     * Searches for a record using the sparse index.
     */
    public search(recordId: string): string | null {
        if (this.index.length === 0) {
            return "Index is empty.";
        }

        // 1. Search the index to find which page the key should be in
        let targetPageIdx = -1;
        for (const entry of this.index) {
            if (recordId.localeCompare(entry.key) >= 0) {
                targetPageIdx = entry.pageIdx;
            } else {
                break;
            }
        }

        if (targetPageIdx === -1) {
            return null; // Key is smaller than the first index entry
        }

        // 2. Search the specific data page (Primary Area)
        const page = this.dataPages[targetPageIdx];
        const foundInPrimary = page!.find((r) => r.id === recordId);
        if (foundInPrimary) {
            return `Found in Primary Page ${targetPageIdx}: ${
                JSON.stringify(foundInPrimary)
            }`;
        }

        // 3. If not found, search the Overflow Area
        const foundInOverflow = this.overflowArea.find((r) =>
            r.id === recordId
        );
        if (foundInOverflow) {
            return `Found in Overflow Area: ${JSON.stringify(foundInOverflow)}`;
        }

        return "Record not found.";
    }

    /**
     * Inserts a new record. Redirects to overflow to maintain primary sort order.
     */
    public insert(record: Record): void {
        console.log(
            `Inserting ID ${record.id} (${record.val})... (Redirected to Overflow Area)`,
        );
        this.overflowArea.push(record);
        // Keep overflow sorted to maintain searchable order
        this.overflowArea.sort((a, b) => a.id.localeCompare(b.id));
    }

    /**
     * Deletes a record by ID from primary or overflow areas.
     */
    public delete(recordId: string): boolean {
        for (let i = 0; i < this.dataPages.length; i++) {
            const idx = this.dataPages[i]!.findIndex((r) => r.id === recordId);
            if (idx !== -1) {
                this.dataPages[i]!.splice(idx, 1);
                console.log(`Deleted ID ${recordId} from Primary Page ${i}.`);
                return true;
            }
        }

        const overflowIdx = this.overflowArea.findIndex((r) =>
            r.id === recordId
        );
        if (overflowIdx !== -1) {
            this.overflowArea.splice(overflowIdx, 1);
            console.log(`Deleted ID ${recordId} from Overflow Area.`);
            return true;
        }

        console.log(`ID ${recordId} not found.`);
        return false;
    }

    /**
     * Merges overflow into primary pages and rebuilds the index.
     */
    public reformat(): void {
        console.log("Reformatting ISAM structure (Merging Overflow)...");
        const allRecords = [...this.dataPages.flat(), ...this.overflowArea];
        this.overflowArea = [];
        this.loadData(allRecords);
    }

    /**
     * Visualizes the current state of the ISAM file.
     */
    public displayStructure(): void {
        console.log("\nISAM Tree Structure");
        if (this.index.length === 0 && this.overflowArea.length === 0) {
            console.log("└── (Empty)");
            return;
        }

        this.index.forEach((entry, i) => {
            const isLast = i === this.index.length - 1 &&
                this.overflowArea.length === 0;
            const prefix = isLast ? "└── " : "├── ";
            const page = this.dataPages[entry.pageIdx] || [];
            const ids = page.map((r) => r.id).join(", ");
            console.log(
                `${prefix}[Key: ${
                    entry.key.padEnd(10)
                }] ──► Page ${entry.pageIdx}: [${ids}]`,
            );
        });

        if (this.overflowArea.length > 0) {
            const ids = this.overflowArea.map((r) => r.id).join(", ");
            console.log(`└── Overflow: [${ids}]`);
        }
    }
}

// --- Demo Execution with User Names ---
const isam = new ISAMSystem(4);

const names = [
    "Benjamin",
    "Luca",
    "Tobias",
    "Christian",
    "Valentin",
    "David",
    "Nadine",
    "Marko",
    "Aghajhani",
    "Florian",
    "Julian",
    "Max",
    "Michael",
    "Sabinus",
    "Christian",
];

// Use lowercase names as IDs for string indexing
isam.loadData(names.map((name) => ({ id: name.toLowerCase(), val: name })));
isam.displayStructure();

// delete 5 schüler
for (let i = 0; i < 5; i++) {
    const nameToDelete = names[i]!.toLowerCase();
    isam.delete(nameToDelete);
    isam.reformat();
    isam.displayStructure();
}
