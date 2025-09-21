import type { DocsCollectionItem } from "@nuxt/content";

export type MathFormula = {
    formula: string;
    items: string[];
};

export const parseMath = (page: DocsCollectionItem) => {
    if (!page.body) return [];

    const mathRegex = /\$\$(.*?)\$\$/gs;
    const inlineMathRegex = /\$(.*?)\$/gs;

    const raw = page.rawbody;
    let mathFormulas: MathFormula[] = [];

    let match;
    while ((match = mathRegex.exec(raw)) !== null) {
        const formula = match[1]!.trim();
        const items = formula.split(/\s+/);
        mathFormulas.push({ formula, items });
    }

    while ((match = inlineMathRegex.exec(raw)) !== null) {
        const formula = match[1]!.trim();
        const items = formula.split(/\s+/);
        mathFormulas.push({ formula, items });
    }

    return mathFormulas;
}