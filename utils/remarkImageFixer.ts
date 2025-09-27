import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { MarkdownPlugin } from '@nuxt/content';

export function remarkImageFixer() {
    return function (tree: Root) {
        visit(tree, 'image', (node) => {
            if (!node.url.includes('/images')) {
                // obsidian file, change to /imgs/filename
                node.url = '/imgs/' + node.url;
            }
        })
    }
}

export const remarkeImageFixerPlugin: MarkdownPlugin = {
    instance: remarkImageFixer,
}