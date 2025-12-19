/**
 * B-Tree Node Class
 * Represents a single node in the B-Tree.
 */
class BTreeNode {
    keys: number[];
    children: BTreeNode[];
    leaf: boolean;

    constructor(leaf: boolean = true) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
    }
}

/**
 * B-Tree Class
 * Implements a balanced search tree where nodes can have multiple keys and children.
 * t is the minimum degree (t >= 2).
 * Every node (except root) must have at least t-1 keys.
 * Every node can have at most 2t-1 keys.
 */
class BTree {
    root: BTreeNode | null;
    t: number;

    constructor(t: number) {
        this.root = null;
        this.t = t;
    }

    // Traverse the tree and print keys.
    traverse(): void {
        if (this.root) {
            this._traverse(this.root);
        }
        console.log("");
    }

    private _traverse(node: BTreeNode): void {
        let i: number;
        for (i = 0; i < node.keys.length; i++) {
            if (!node.leaf) {
                const child = node.children[i];
                if (child) this._traverse(child);
            }
            process.stdout.write(String(node.keys[i]) + " ");
        }

        if (!node.leaf) {
            const child = node.children[i];
            if (child) this._traverse(child);
        }
    }

    /**
     * Search for a key in the B-Tree.
     */
    search(key: number): BTreeNode | null {
        return this.root ? this._search(this.root, key) : null;
    }

    private _search(node: BTreeNode, key: number): BTreeNode | null {
        let i = 0;
        const n = node.keys.length;
        while (i < n && key > node.keys[i]!) {
            i++;
        }

        if (i < n && node.keys[i] === key) {
            return node;
        }

        if (node.leaf) {
            return null;
        }

        const child = node.children[i];
        return child ? this._search(child, key) : null;
    }

    /**
     * Insert a new key into the B-Tree.
     */
    insert(key: number): void {
        if (!this.root) {
            this.root = new BTreeNode(true);
            this.root.keys.push(key);
            return;
        }

        // If root is full, the tree grows in height
        if (this.root.keys.length === 2 * this.t - 1) {
            const newRoot = new BTreeNode(false);
            newRoot.children[0] = this.root;
            this.splitChild(newRoot, 0, this.root);

            let i = 0;
            if (newRoot.keys[0]! < key) {
                i++;
            }
            // child exists after split
            this.insertNonFull(newRoot.children[i]!, key);
            this.root = newRoot;
        } else {
            this.insertNonFull(this.root, key);
        }
    }

    /**
     * Helper function to insert a key into a node that is not full.
     */
    private insertNonFull(node: BTreeNode, key: number): void {
        let i = node.keys.length - 1;

        if (node.leaf) {
            // Find location and shift keys
            while (i >= 0 && node.keys[i]! > key) {
                node.keys[i + 1] = node.keys[i]!;
                i--;
            }
            node.keys[i + 1] = key;
        } else {
            // Find the child that is going to have the new key
            while (i >= 0 && node.keys[i]! > key) {
                i--;
            }

            const childIndex = i + 1;
            const child = node.children[childIndex];
            if (child && child.keys.length === 2 * this.t - 1) {
                this.splitChild(node, childIndex, child);

                if (node.keys[childIndex]! < key) {
                    i++;
                }
            }
            // child must exist here
            this.insertNonFull(node.children[i + 1]!, key);
        }
    }

    /**
     * Splits the child y of node x. y must be full.
     */
    private splitChild(x: BTreeNode, i: number, y: BTreeNode): void {
        const t = this.t;
        const z = new BTreeNode(y.leaf);

        // save middle key
        const middleKey = y.keys[t - 1];

        // Z takes the keys after the middle
        z.keys = y.keys.slice(t);

        // Z takes the children after index t if not leaf
        if (!y.leaf) {
            z.children = y.children.slice(t);
        }

        // Reduce Y keys and children
        y.keys = y.keys.slice(0, t - 1);
        if (!y.leaf) {
            y.children = y.children.slice(0, t);
        }

        // Insert Z into x.children at position i+1
        x.children.splice(i + 1, 0, z);

        // Move middle key of Y up to X at position i
        x.keys.splice(i, 0, middleKey!);
    }

    /**
     * Visualizes the tree structure (compact).
     */
    printStructure(): void {
        if (!this.root) return;
        this._printNode(this.root, "", true);
    }

    private _printNode(node: BTreeNode, prefix: string, isLast: boolean): void {
        console.log(
            `${prefix}${isLast ? "└── " : "├── "}[${node.keys.join(", ")}]`,
        );
        if (!node.leaf) {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                if (child) {
                    this._printNode(
                        child,
                        newPrefix,
                        i === node.children.length - 1,
                    );
                }
            }
        }
    }
}

// --- Usage Example ---

const btree = new BTree(3); // Minimum degree t=3 (Max keys 5, Min keys 2)

const valuesToInsert = [10, 20, 5, 6, 12, 30, 7, 17, 13, 14, 2, 1, 8, 9];
console.log("Inserting values:", valuesToInsert.join(", "));

valuesToInsert.forEach((val) => btree.insert(val));

console.log("\nB-Tree Traversal (Sorted Order):");
btree.traverse();

console.log("\nB-Tree Structure (Levels):");
btree.printStructure();

console.log("\nSearching for 6:");
console.log(btree.search(6) ? "Found" : "Not Found");

console.log("Searching for 100:");
console.log(btree.search(100) ? "Found" : "Not Found");
