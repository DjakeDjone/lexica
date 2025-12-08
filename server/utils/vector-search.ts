
import { pipeline, env } from '@xenova/transformers';
import type { Section, SearchResult } from './search';
import fs from 'node:fs';


// Configure transformers to use /tmp for caching (needed for Vercel/serverless)
const cacheDir = '/tmp/.cache';

try {
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`[VectorSearch] Created cache directory at ${cacheDir}`);
    }
} catch (e) {
    console.error(`[VectorSearch] Failed to create cache directory: ${e}`);
}

env.cacheDir = cacheDir;
env.localModelPath = cacheDir;
env.allowLocalModels = false;
console.log(`[VectorSearch] Configured transformers cacheDir to: ${env.cacheDir}`);


// Using a singleton for the pipeline to avoid reloading the model
let extractor: any = null;

const getExtractor = async () => {
    if (!extractor) {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
};

// Cache for embeddings
const embeddingCache = new Map<string, number[]>();

export const getEmbedding = async (text: string): Promise<number[]> => {
    // Check if we have a valid string
    if (!text || text.trim() === '') {
        return new Array(384).fill(0); // Return zero vector for empty text
    }

    try {
        const pipe = await getExtractor();
        const output = await pipe(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (e) {
        console.error('Error generating embedding:', e);
        return new Array(384).fill(0);
    }
};

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

type VectorSection = Section & {
    embedding?: number[];
};

// Store embeddings in memory
let vectorStore: VectorSection[] = [];

export const initializeVectorStore = async (sections: Section[]) => {
    console.log('[VectorSearch] Initializing vector store with', sections.length, 'sections');
    
    // Load pre-computed embeddings using Nitro storage (assets)
    let preComputedEmbeddings: Record<string, number[]> = {};
    try {
        const data = await useStorage().getItem('assets:embeddings:embeddings.json') as any[];
        if (data) {
             console.log(`[VectorSearch] Loaded ${data.length} pre-computed embeddings from assets`);
             
             // Create a map for faster lookup
             data.forEach((item: any) => {
                 if (item.embedding) {
                     preComputedEmbeddings[item.id] = item.embedding;
                 }
             });
        } else {
             const keys = await useStorage().getKeys('assets');
             console.log('[VectorSearch] No pre-computed embeddings found in assets:embeddings:embeddings.json. All available asset keys:', keys);
        }
    } catch (e) {
        console.error('[VectorSearch] Failed to load pre-computed embeddings:', e);
    }
    
    const newStore: VectorSection[] = [];
    let calculatedCount = 0;
    
    for (const section of sections) {
        const cacheKey = section.id;
        
        let embedding: number[] | undefined;
        
        // 1. Try memory cache (if re-initializing same session)
        if (embeddingCache.has(cacheKey)) {
             embedding = embeddingCache.get(cacheKey);
        } 
        // 2. Try pre-computed file
        else if (preComputedEmbeddings[cacheKey]) {
             embedding = preComputedEmbeddings[cacheKey];
             // Add to memory cache for future access
             embeddingCache.set(cacheKey, embedding);
        }
        // 3. Fallback: Calculate on the fly
        else {
             // limit content length to avoid token limit issues
             const contentForEmbedding = (section.title + " " + section.content).slice(0, 1000); 
             embedding = await getEmbedding(contentForEmbedding);
             if (embedding) {
                 embeddingCache.set(cacheKey, embedding);
                 calculatedCount++;
             }
        }
        
        if (embedding) {
            newStore.push({
                ...section,
                embedding
            });
        }
    }
    
    if (calculatedCount > 0) {
        console.log(`[VectorSearch] Calculated ${calculatedCount} embeddings on the fly (others were pre-computed/cached)`);
    } else {
        console.log('[VectorSearch] All embeddings loaded from cache/pre-computed file');
    }
    
    vectorStore = newStore;
    console.log('[VectorSearch] Vector store initialized');
};

export const searchVectors = async (query: string, sections?: Section[]): Promise<SearchResult[]> => {
    // If sections provided, ensure store is initialized (lazy init)
    // Note: In a real app, you might want to call initializeVectorStore at startup
    if (sections && (vectorStore.length === 0 || vectorStore.length !== sections.length)) {
         await initializeVectorStore(sections);
    }

    const queryEmbedding = await getEmbedding(query);
    
    const results = vectorStore.map(section => {
        if (!section.embedding) return { section, score: 0 };
        return {
            section,
            score: cosineSimilarity(queryEmbedding, section.embedding)
        };
    });
    
    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    // Map to SearchResult
    return results
        .filter(r => r.score > 0.05) // Lower threshold for semantics
        .map(r => ({
            id: r.section.id,
            title: r.section.titles[r.section.titles.length - 1],
            tag: r.section.titles.length > 1 ? r.section.titles[r.section.titles.length - 2] : undefined,
            description: r.section.content.length > 200 ? r.section.content.substring(0, 197) + '...' : r.section.content,
            content: r.section.content,
            titles: r.section.titles,
            level: r.section.level,
            url: `/docs/${r.section.id.replace(/^\//, '')}`,
            score: r.score
        }));
};
