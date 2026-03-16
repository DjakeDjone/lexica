<script setup lang="ts">
import type { Chat } from '~/utils/aiHandler';

const props = defineProps<{
    chats: Chat[];
    currentChatId: string | null;
}>();

const emit = defineEmits<{
    select: [id: string];
    delete: [id: string];
}>();

const query = ref('');

const fuzzyMatch = (text: string, pattern: string): { match: boolean; score: number } => {
    if (!pattern) return { match: true, score: 0 };
    const t = text.toLowerCase();
    const p = pattern.toLowerCase();
    let ti = 0, pi = 0, score = 0, lastMatchedIndex = -1;
    while (ti < t.length && pi < p.length) {
        if (t[ti] === p[pi]) {
            // Consecutive matches and start-of-word matches score higher
            score += lastMatchedIndex === ti - 1 ? 2 : 1;
            lastMatchedIndex = ti;
            pi++;
        }
        ti++;
    }
    return { match: pi === p.length, score };
};

const filteredChats = computed(() => {
    if (!query.value.trim()) return props.chats;
    return props.chats
        .map(chat => ({ chat, ...fuzzyMatch(chat.name, query.value) }))
        .filter(r => r.match)
        .sort((a, b) => b.score - a.score)
        .map(r => r.chat);
});

const highlight = (text: string, pattern: string): string => {
    if (!pattern.trim()) return text;
    const p = pattern.toLowerCase();
    let result = '';
    let pi = 0;
    for (let i = 0; i < text.length; i++) {
        if (pi < p.length && text[i]!.toLowerCase() === p[pi]) {
            result += `<mark class="bg-primary/30 text-inherit rounded-sm">${text[i]}</mark>`;
            pi++;
        } else {
            result += text[i];
        }
    }
    return result;
};

const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="relative">
            <input
                v-model="query"
                type="text"
                placeholder="Search chats..."
                class="input input-bordered input-sm w-full pl-8"
                autofocus
            />
            <Icon name="mdi:magnify" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
        <p v-if="!filteredChats.length" class="text-gray-500 text-sm">
            {{ chats.length ? 'No chats match your search.' : 'No chat history yet.' }}
        </p>
        <div
            v-for="chat in filteredChats"
            :key="chat.id"
            class="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-base-200 transition-colors"
            :class="chat.id === currentChatId ? 'border-primary bg-base-200' : 'border-base-300'"
            @click="emit('select', chat.id)"
        >
            <div class="flex flex-col min-w-0">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span class="font-medium truncate" v-html="highlight(chat.name, query)" />
                <span class="text-xs text-gray-400">{{ formatDate(chat.updatedAt) }}</span>
            </div>
            <button
                class="btn btn-ghost btn-xs ml-2 text-error shrink-0"
                @click.stop="emit('delete', chat.id)"
                title="Delete chat"
            >
                <Icon name="mdi:delete-outline" />
            </button>
        </div>
    </div>
</template>
