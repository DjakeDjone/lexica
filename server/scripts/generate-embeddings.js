
import fs from 'node:fs';
import path from 'node:path';
import { pipeline, env } from '@xenova/transformers';
import MarkdownIt from 'markdown-it';

// Configure transformers cache
const cacheDir = path.resolve('./node_modules/.cache/transformers');
env.cacheDir = cacheDir;
env.localModelPath = cacheDir;
env.allowLocalModels = false;

const contentDir = path.resolve('./content');
const outputFile = path.resolve('./server/assets/embeddings.json');

const md = new MarkdownIt();

// Simple implementation to replicate what Nuxt Content might produce for plain text
function extractText(tokens) {
    return tokens
        .filter(t => t.type === 'inline' || t.type === 'text')
        .map(t => t.content)
        .join(' ');
}

// Function to split markdown into sections based on headers
function parseMarkdown(content, id, filePath) {
    const tokens = md.parse(content, {});
    const sections = [];

    let currentTitle = 'Untitled';
    let currentTitles = ['Untitled'];
    let currentLevel = 1;
    let currentContent = [];

    // Helper to push current section
    const pushSection = () => {
        const textContent = currentContent.join('\n').trim();
        if (textContent.length > 0 || currentTitles.length > 1) {
            // Create a unique ID for the section
            const sectionId = id + (sections.length > 0 ? `#section-${sections.length}` : '');

            sections.push({
                id: sectionId,
                title: currentTitle,
                titles: [...currentTitles],
                level: currentLevel,
                content: textContent,
                url: '/docs/' + id.replace(/^\//, '') + (sections.length > 0 ? `#${currentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '')
            });
        }
    };

    tokens.forEach(token => {
        if (token.type === 'heading_open') {
            // Push previous section before starting new one
            pushSection();

            // Reset for new section
            currentLevel = parseInt(token.tag.slice(1));
            currentContent = [];

        } else if (token.type === 'heading_close') {
            // The title content was in the inline token just before this
            // This is handled by capturing inline content next
        } else if (token.type === 'inline' && tokens[tokens.indexOf(token) - 1]?.type === 'heading_open') {
            currentTitle = token.content;

            // Update titles hierarchy logic (simplified)
            // If new level is deeper or same, append/replace last. 
            // This is a naive approximation of hierarchical titles.
            if (currentLevel === 1) {
                currentTitles = [currentTitle];
            } else {
                // Try to maintain a reasonable hierarchy stack
                // If level 2, keep level 1 title and add this one
                if (currentTitles.length >= currentLevel) {
                    currentTitles = currentTitles.slice(0, currentLevel - 1);
                }
                currentTitles.push(currentTitle);
            }

        } else if (token.type === 'inline' || token.type === 'text' || token.type === 'fence' || token.type === 'code_block') {
            if (token.content && token.content.trim().length > 0) {
                // Don't include the title itself in the content if it was just processed
                const prevToken = tokens[tokens.indexOf(token) - 1];
                if (prevToken?.type !== 'heading_open') {
                    currentContent.push(token.content);
                }
            }
        }
    });

    // Push the last section
    pushSection();

    return sections;
}

async function getAllFiles(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getAllFiles(res) : res;
    }));
    return files.flat().filter(file => file.endsWith('.md'));
}

async function generateEmbeddings() {
    console.log('Starting embedding generation...');

    if (!fs.existsSync(contentDir)) {
        console.error(`Content directory not found at ${contentDir}`);
        process.exit(1);
    }

    const files = await getAllFiles(contentDir);
    console.log(`Found ${files.length} markdown files.`);

    const allSections = [];

    for (const file of files) {
        const content = await fs.promises.readFile(file, 'utf-8');
        // Calculate relative ID (e.g., 'school/lexica')
        let relativeId = path.relative(contentDir, file).replace(/\.md$/, '');
        // Replace backslashes for Windows
        relativeId = relativeId.replace(/\\/g, '/');

        // Ensure leading slash to match Nuxt Content _path
        if (!relativeId.startsWith('/')) {
            relativeId = '/' + relativeId;
        }

        const sections = parseMarkdown(content, relativeId, file);
        allSections.push(...sections);
    }

    console.log(`Extracted ${allSections.length} sections. Generating embeddings...`);

    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    const outputData = [];

    let processed = 0;
    for (const section of allSections) {
        try {
            const contentForEmbedding = (section.title + " " + section.content).slice(0, 1000);
            const output = await pipe(contentForEmbedding, { pooling: 'mean', normalize: true });
            const embedding = Array.from(output.data);

            outputData.push({
                ...section,
                embedding
            });

            processed++;
            if (processed % 100 === 0) {
                console.log(`Processed ${processed}/${allSections.length} sections...`);
            }
        } catch (error) {
            console.error(`Failed to generate embedding for section ${section.id}:`, error);
        }
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    await fs.promises.writeFile(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`Saved ${outputData.length} embeddings to ${outputFile}`);
}

generateEmbeddings().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
