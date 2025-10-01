<script setup lang="ts">
import type { Chat } from '~/utils/aiHandler';

const props = defineProps<{
    chats: Chat[];
    currentChatId: string | null;
}>();

const emit = defineEmits<{
    loadChat: [chatId: string];
    deleteChat: [chatId: string];
    newChat: [];
}>();

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return 'Today';
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString();
    }
};
</script>

<template>
    <div class="h-full flex flex-col bg-base-200">
        <!-- Header -->
        <div class="p-4 border-b border-base-300">
            <button @click="emit('newChat')" class="btn btn-primary w-full">
                <Icon name="mdi:plus" class="w-5 h-5" />
                New Chat
            </button>
        </div>

        <!-- Chat List -->
        <div class="flex-1 overflow-y-auto p-2">
            <div v-for="chat in chats" :key="chat.id" class="mb-2">
                <div 
                    @click="emit('loadChat', chat.id)"
                    class="group relative p-3 rounded-lg cursor-pointer transition-colors"
                    :class="currentChatId === chat.id ? 'bg-base-300' : 'hover:bg-base-300'"
                >
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">
                                {{ chat.name }}
                            </div>
                            <div class="text-xs text-base-content/60 mt-1">
                                {{ formatDate(chat.updatedAt) }}
                            </div>
                        </div>
                        <button
                            @click.stop="emit('deleteChat', chat.id)"
                            class="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete chat"
                        >
                            <Icon name="mdi:delete" class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-base-300 text-xs text-base-content/60">
            {{ chats.length }} chat{{ chats.length !== 1 ? 's' : '' }}
        </div>
    </div>
</template>
