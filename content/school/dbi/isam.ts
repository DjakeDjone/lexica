/**
 * ISAM (Indexed Sequential Access Method) Tree Implementation Demo
 * * Concepts:
 * - Records are stored in Leaf Nodes (Primary Data Area).
 * - Index Nodes guide the search to the correct Leaf Node.
 * - If a Leaf Node is full, records are added to an Overflow Node chain linked to that leaf.
 */

type Record<T> = {
    id: number;
    data: T;
};

type IndexNode<T> = {
    type: "index";
    id: number;
    children: Node<T>[];
};

type LeafNode<T> = {
    type: "leaf";
    id: number;
    children: Record<T>[];
    overflow: LeafNode<T> | null;
};

type Node<T> = IndexNode<T> | LeafNode<T>;

class ISAMTree<T> {
    private root: Node<T> | null = null;
    public maxRecordsPerNode: number = 3;
    private nodeIdCounter: number = 0;

    constructor(maxRecordsPerNode: number = 3) {
        this.maxRecordsPerNode = maxRecordsPerNode;
    }

    /**
     * Helper to get the largest ID in a subtree or node.
     * Used for navigation in the Index layers.
     */
    private getMaxKey(node: Node<T>): number {
        if (node.children.length === 0) return -Infinity;

        if (node.type === "leaf") {
            // For a leaf, checks its own children and its overflow chain
            const lastRecord = node.children[node.children.length - 1];
            let max = lastRecord!.id;

            // If there is an overflow chain, the max key is effectively in the overflow
            // (depending on strict sorting, but usually overflow extends the range)
            let currentOverflow = node.overflow;
            while (currentOverflow) {
                if (currentOverflow.children.length > 0) {
                    const lastOverflowRecord = currentOverflow
                        .children[currentOverflow.children.length - 1];
                    if (lastOverflowRecord!.id > max) {
                        max = lastOverflowRecord!.id;
                    }
                }
                currentOverflow = currentOverflow.overflow;
            }
            return max;
        } else {
            // For Index, the max key is the max key of its last child
            return this.getMaxKey(node.children[node.children.length - 1]!);
        }
    }

    /**
     * Traverses the tree to find the correct Leaf Node where the key belongs.
     */
    findLeafNodeForKey(key: number): LeafNode<T> | null {
        if (!this.root) return null;

        let currentNode: Node<T> = this.root;

        while (currentNode.type === "index") {
            // Linear search within the index node to find the child range
            let foundChild = false;

            for (const child of currentNode.children) {
                // In ISAM, we find the first child whose max key is >= our search key
                // OR we take the last child if we are larger than everything (append case)
                if (key <= this.getMaxKey(child)) {
                    currentNode = child;
                    foundChild = true;
                    break;
                }
            }

            // If key is larger than all intervals in this index node, go to the last child
            if (!foundChild && currentNode.children.length > 0) {
                currentNode = currentNode
                    .children[currentNode.children.length - 1] as Node<T>;
            } else if (!foundChild && currentNode.children.length === 0) {
                // Should not happen in a valid tree
                return null;
            }
        }

        // Now currentNode is a LeafNode
        return currentNode as LeafNode<T>;
    }

    hasNodeSpace(node: LeafNode<T>): boolean {
        return node.children.length < this.maxRecordsPerNode;
    }

    /**
     * Traverses the overflow chain to find a node with space, or the last node.
     */
    getOverflowNode(leaf: LeafNode<T>): LeafNode<T> | null {
        let current = leaf.overflow;

        // Traverse to the end of the chain
        while (current) {
            if (this.hasNodeSpace(current)) {
                return current;
            }
            if (current.overflow === null) {
                // This is the last node in the chain, but it's full.
                // We return null to signal we need a NEW overflow node attached to this one.
                return null;
            }
            current = current.overflow;
        }

        return null;
    }

    /**
     * Gets the absolute last node in the overflow chain to attach a new one.
     */
    private getLastOverflowNode(leaf: LeafNode<T>): LeafNode<T> {
        let current = leaf;
        while (current.overflow) {
            current = current.overflow;
        }
        return current;
    }

    createOverflowNode(): LeafNode<T> {
        return {
            type: "leaf",
            id: ++this.nodeIdCounter,
            children: [],
            overflow: null,
        };
    }

    insertInISAM(record: Record<T>) {
        const key = record.id;

        if (!this.root) {
            // Tree is empty, create root as a leaf
            this.root = {
                type: "leaf",
                id: ++this.nodeIdCounter,
                children: [record],
                overflow: null,
            };
            return;
        }

        const leafNode = this.findLeafNodeForKey(key);

        if (!leafNode) {
            console.error("Critical: Could not find leaf node for key", key);
            return;
        }

        // 1. Try to insert into the primary leaf node
        if (this.hasNodeSpace(leafNode)) {
            leafNode.children.push(record);
            leafNode.children.sort((a, b) => (a.id - b.id));
        } // 2. Try to insert into existing overflow chain
        else {
            let targetNode = this.getOverflowNode(leafNode);

            if (!targetNode) {
                // No space in existing chain, or no chain exists.
                // Create new overflow node and attach to the end of the chain.
                const newOverflow = this.createOverflowNode();
                const lastNode = this.getLastOverflowNode(leafNode);
                lastNode.overflow = newOverflow;
                targetNode = newOverflow;
            }

            targetNode.children.push(record);
            targetNode.children.sort((a, b) => (a.id - b.id));
        }

        // NOTE: A real ISAM/B-Tree implementation would handle splitting the root
        // and growing the Index layers here if the primary data area grew too large.
        // For this demo, we assume a static index or a single root leaf that just
        // grows infinite overflow chains (Classic degraded ISAM behavior).
    }

    /**
     * Debug print helper
     */
    printTree() {
        console.log("--- ISAM Tree Structure ---");
        if (!this.root) {
            console.log("(Empty)");
            return;
        }
        this.printNode(this.root, 0);
        console.log("---------------------------");
    }

    private printNode(node: Node<T>, depth: number) {
        const indent = "  ".repeat(depth);
        if (node.type === "index") {
            console.log(`${indent}[Index Node ${node.id}]`);
            node.children.forEach((child) => this.printNode(child, depth + 1));
        } else {
            const dataStr = node.children.map((c) => `${c.id}:${c.data}`).join(
                ", ",
            );
            console.log(
                `${indent}[Leaf Node ${node.id}] Records: [${dataStr}]`,
            );

            let ovf = node.overflow;
            let ovfDepth = 1;
            while (ovf) {
                const ovfData = ovf.children.map((c) => `${c.id}:${c.data}`)
                    .join(", ");
                console.log(
                    `${indent}  -> (Overflow ${ovfDepth}) [Node ${ovf.id}] Records: [${ovfData}]`,
                );
                ovf = ovf.overflow;
                ovfDepth++;
            }
        }
    }
}

// --- DEMO USAGE ---

const tree = new ISAMTree<string>(4);

const names = [
    "Benjamin",
    "Luca",
    "Tobias",
    "Christian",
    "Valentin",
    "David",
    "Nadine",
    "Marko",
    "Christian",
    "Aghajhani",
    "Florian",
    "Julian",
    "Max",
    "Michael",
    "Sabinus",
];
console.log(names.length);

for (const [idx, name] of names.entries()) {
    tree.insertInISAM({ id: idx, data: name });
    tree.printTree();
}
