import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { env, pipeline } from "@xenova/transformers";
import MarkdownIt from "markdown-it";
import { defineNuxtModule } from "nuxt/kit";

export default defineNuxtModule({
    meta: {
        name: "embeddings-generator",
    },
    setup(options, nuxt) {
        // Register the server asset directory dynamically
        nuxt.hook("nitro:config", (nitroConfig) => {
            nitroConfig.serverAssets = nitroConfig.serverAssets || [];
            nitroConfig.serverAssets.push({
                baseName: "embeddings",
                dir: path.resolve(nuxt.options.srcDir, "server/assets"),
            });
        });

        nuxt.hook("build:before", async () => {
            console.log("[Embeddings] Starting embedding generation...");

            // Configure transformers cache
            // In Nuxt module context, we should probably stick to a safe cache dir or /tmp if in Vercel
            // But for generation (build time), node_modules is usually fine.
            const cacheDir = path.resolve("./node_modules/.cache/transformers");
            env.cacheDir = cacheDir;
            env.localModelPath = cacheDir;
            env.allowLocalModels = false;

            const contentDir = path.resolve(nuxt.options.srcDir, "content");
            const outputFile = path.resolve(
                nuxt.options.srcDir,
                "server/assets/embeddings.json",
            );

            if (!fs.existsSync(contentDir)) {
                console.warn(
                    `[Embeddings] Content directory not found at ${contentDir}. Skipping.`,
                );
                return;
            }

            // Define interfaces for our data structures
            interface Section {
                id: string;
                title: string;
                titles: string[];
                level: number;
                content: string;
                url: string;
            }

            interface EmbeddingOutput extends Section {
                embedding: number[];
            }

            const md = new MarkdownIt();

            // Function to split markdown into sections based on headers
            function parseMarkdown(
                content: string,
                id: string,
                filePath: string,
            ): Section[] {
                const tokens = md.parse(content, {});
                const sections: Section[] = [];

                let currentTitle = "Untitled";
                let currentTitles = ["Untitled"];
                let currentLevel = 1;
                let currentContent: string[] = [];

                // Helper to push current section
                const pushSection = () => {
                    const textContent = currentContent.join("\n").trim();
                    if (textContent.length > 0 || currentTitles.length > 1) {
                        // Create a unique ID for the section
                        const sectionId = id +
                            (sections.length > 0
                                ? `#section-${sections.length}`
                                : "");

                        sections.push({
                            id: sectionId,
                            title: currentTitle,
                            titles: [...currentTitles],
                            level: currentLevel,
                            content: textContent,
                            url: "/docs/" + id.replace(/^\//, "") +
                                (sections.length > 0
                                    ? `#${
                                        currentTitle.toLowerCase().replace(
                                            /[^a-z0-9]+/g,
                                            "-",
                                        )
                                    }`
                                    : ""),
                        });
                    }
                };

                tokens.forEach((token) => {
                    if (token.type === "heading_open") {
                        // Push previous section before starting new one
                        pushSection();

                        // Reset for new section
                        currentLevel = parseInt(token.tag.slice(1));
                        currentContent = [];
                    } else if (token.type === "heading_close") {
                        // The title content was in the inline token just before this
                    } else if (
                        token.type === "inline" &&
                        tokens[tokens.indexOf(token) - 1]?.type ===
                            "heading_open"
                    ) {
                        currentTitle = token.content;

                        if (currentLevel === 1) {
                            currentTitles = [currentTitle];
                        } else {
                            if (currentTitles.length >= currentLevel) {
                                currentTitles = currentTitles.slice(
                                    0,
                                    currentLevel - 1,
                                );
                            }
                            currentTitles.push(currentTitle);
                        }
                    } else if (
                        token.type === "inline" || token.type === "text" ||
                        token.type === "fence" || token.type === "code_block"
                    ) {
                        if (token.content && token.content.trim().length > 0) {
                            const prevToken = tokens[tokens.indexOf(token) - 1];
                            if (prevToken?.type !== "heading_open") {
                                currentContent.push(token.content);
                            }
                        }
                    }
                });

                // Push the last section
                pushSection();

                return sections;
            }

            async function getAllFiles(dir: string): Promise<string[]> {
                const entries = await fs.promises.readdir(dir, {
                    withFileTypes: true,
                });
                const files = await Promise.all(entries.map((entry) => {
                    const res = path.resolve(dir, entry.name);
                    return entry.isDirectory()
                        ? getAllFiles(res)
                        : Promise.resolve([res]);
                }));
                return (files.flat() as string[]).filter((file) =>
                    file.endsWith(".md")
                );
            }

            try {
                const files = await getAllFiles(contentDir);
                console.log(
                    `[Embeddings] Found ${files.length} markdown files.`,
                );

                // Load existing embeddings for caching
                let existingEmbeddings: EmbeddingOutput[] = [];
                if (fs.existsSync(outputFile)) {
                    try {
                        const data = await fs.promises.readFile(
                            outputFile,
                            "utf-8",
                        );
                        existingEmbeddings = JSON.parse(data);
                        console.log(
                            `[Embeddings] Loaded ${existingEmbeddings.length} existing embeddings for caching.`,
                        );
                    } catch (e) {
                        console.warn(
                            "[Embeddings] Failed to load existing embeddings, starting fresh.",
                            e,
                        );
                    }
                }

                // Create a cache map: hash(contentForEmbedding) -> embedding
                const embeddingCache = new Map<string, number[]>();

                function generateHash(text: string): string {
                    return crypto.createHash("md5").update(text).digest("hex");
                }

                for (const item of existingEmbeddings) {
                    const contentForEmbedding =
                        (item.title + " " + item.content).slice(0, 1000);
                    const hash = generateHash(contentForEmbedding);
                    embeddingCache.set(hash, item.embedding);
                }

                const allSections: Section[] = [];

                for (const file of files) {
                    const content = await fs.promises.readFile(file, "utf-8");
                    // Calculate relative ID (e.g., 'school/lexica')
                    let relativeId = path.relative(contentDir, file).replace(
                        /\.md$/,
                        "",
                    );
                    // Replace backslashes for Windows
                    relativeId = relativeId.replace(/\\/g, "/");

                    // Ensure leading slash to match Nuxt Content _path
                    if (!relativeId.startsWith("/")) {
                        relativeId = "/" + relativeId;
                    }

                    const sections = parseMarkdown(content, relativeId, file);
                    allSections.push(...sections);
                }

                console.log(
                    `[Embeddings] Extracted ${allSections.length} sections. Generating embeddings...`,
                );

                const pipe = await pipeline(
                    "feature-extraction",
                    "Xenova/all-MiniLM-L6-v2",
                );

                const outputData: EmbeddingOutput[] = [];

                let processed = 0;
                let cachedCount = 0;
                let generatedCount = 0;

                for (const section of allSections) {
                    try {
                        const contentForEmbedding =
                            (section.title + " " + section.content).slice(
                                0,
                                1000,
                            );
                        const hash = generateHash(contentForEmbedding);

                        let embedding: number[];

                        if (embeddingCache.has(hash)) {
                            embedding = embeddingCache.get(hash)!;
                            cachedCount++;
                        } else {
                            const output = await pipe(contentForEmbedding, {
                                pooling: "mean",
                                normalize: true,
                            });
                            embedding = Array.from(output.data);
                            generatedCount++;
                        }

                        outputData.push({
                            ...section,
                            embedding,
                        });

                        processed++;
                        if (processed % 100 === 0) {
                            console.log(
                                `[Embeddings] Processed ${processed}/${allSections.length} sections... (Cached: ${cachedCount}, Generated: ${generatedCount})`,
                            );
                        }
                    } catch (error) {
                        console.error(
                            `[Embeddings] Failed to generate embedding for section ${section.id}:`,
                            error,
                        );
                    }
                }

                console.log(
                    `[Embeddings] Finished. Cached: ${cachedCount}, Generated: ${generatedCount}.`,
                );

                // Ensure output directory exists (server/assets)
                const outputDir = path.dirname(outputFile);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                await fs.promises.writeFile(
                    outputFile,
                    JSON.stringify(outputData, null, 2),
                );
                const stats = await fs.promises.stat(outputFile);
                console.log(
                    `[Embeddings] Saved ${outputData.length} embeddings to ${outputFile} (Size: ${stats.size} bytes)`,
                );
            } catch (err) {
                console.error("[Embeddings] Fatal error:", err);
                // Fail the build if embeddings fail!
                process.exit(1);
            }
        });
    },
});
