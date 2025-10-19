<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import type { DocsCollectionItem, MinimarkElement } from '@nuxt/content';

interface LearningCard {
    heading: MinimarkElement;
    content: any[]; // Allow any type of content nodes
}

const props = defineProps<{
    page: DocsCollectionItem
}>()

// Extract headings and their content sections
const learningCards = computed<LearningCard[]>(() => {
    if (!props.page.body) return [];

    const cards: LearningCard[] = [];
    const bodyContent = props.page.body.value;
    let currentCard: LearningCard | null = null;

    for (const node of bodyContent) {
        // Check if node is a heading (h1, h2, h3, etc.)
        if (Array.isArray(node) && typeof node[0] === 'string' && node[0].match(/^h[1-6]$/)) {
            // If we have a current card, save it
            if (currentCard) {
                cards.push(currentCard);
            }
            // Start new card with this heading
            currentCard = {
                heading: node,
                content: []
            };
        } else if (currentCard) {
            // Add content to current card
            currentCard.content.push(node);
        }
    }

    // Don't forget the last card
    if (currentCard) {
        cards.push(currentCard);
    }

    return cards;
});

const getCardContent = (content: any[]): Record<string, any> => {
    return {
        body: {
            type: 'minimark',
            value: content
        }
    }
}

const getHeadingText = (heading: MinimarkElement): string => {
    if (Array.isArray(heading) && heading.length > 2 && typeof heading[2] === 'string') {
        return heading[2];
    }
    return 'Untitled';
}

const currentCardIdx = ref(0);
const isFlipped = ref(false);

const nextCard = () => {
    isFlipped.value = false;
    currentCardIdx.value = (currentCardIdx.value + 1) % learningCards.value.length;
}

const prevCard = () => {
    isFlipped.value = false;
    currentCardIdx.value = (currentCardIdx.value - 1 + learningCards.value.length) % learningCards.value.length;
}

const flipCard = () => {
    if (!isFlipped.value) {
        // check if the current card has content
        if (learningCards.value[currentCardIdx.value] && learningCards.value[currentCardIdx.value]!.content.length === 0) {
            // increase idx
            nextCard();
            return; // do not flip if no content
        }
    }
    isFlipped.value = !isFlipped.value;
}


const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'ArrowRight') {
        // Next card
        nextCard();
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        // Previous card
        prevCard();
    } else if (e.key === ' ') {
        // Flip card
        e.preventDefault();
        flipCard();
    } else if (e.key === 'f' || e.key === 'F') {
        // Toggle fullscreen
        e.preventDefault();
        toggleFullscreen();
    }
};

const fullscreen = ref(false);

// New: root element ref for fullscreen requests
const rootEl = ref<HTMLElement | null>(null);

// New: toggle fullscreen using Fullscreen API with vendor fallbacks
const toggleFullscreen = async () => {
    if (!rootEl.value) return;
    try {
        if (!document.fullscreenElement) {
            // Request fullscreen on the root element
            const el: any = rootEl.value as any;
            if (el.requestFullscreen) {
                await el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                await el.webkitRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
                await el.mozRequestFullScreen();
            } else if (el.msRequestFullscreen) {
                await el.msRequestFullscreen();
            }
            // focus so key handlers continue to work
            rootEl.value.focus();
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
                await (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
                await (document as any).msExitFullscreen();
            }
        }
    } catch (err) {
        console.warn('Fullscreen toggle failed', err);
    }
};

// New: keep fullscreen ref in sync with browser state
const onFsChange = () => {
    fullscreen.value = !!document.fullscreenElement;
    // ensure focus remains on our root for keyboard shortcuts
    if (fullscreen.value && rootEl.value) {
        rootEl.value.focus();
    }
};

onMounted(() => {
    document.addEventListener('fullscreenchange', onFsChange);
    // vendor prefixed events (some browsers)
    document.addEventListener('webkitfullscreenchange', onFsChange as any);
    document.addEventListener('mozfullscreenchange', onFsChange as any);
});

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', onFsChange);
    document.removeEventListener('webkitfullscreenchange', onFsChange as any);
    document.removeEventListener('mozfullscreenchange', onFsChange as any);
});

</script>

<template>
    <div
     ref="rootEl"
     @keydown="handleKeyDown" tabindex="0"
     class="min-h-screen bg-base-100">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-base-content mb-2">{{ props.page.title }}</h1>
                <div class="text-center">
                    <p class="text-base-content opacity-70">Learning Cards</p>
                </div>
            </div>

            <div v-if="learningCards.length === 0" class="text-center">
                <div class="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>No learning cards found. Make sure your content has headings.</span>
                </div>
            </div>

            <div v-else class="space-y-6">
                <!-- Card Container -->
                <div class="flex justify-center">
                    <div class="w-full h-[calc(100vh-30rem)] max-w-xl text-center" @click="flipCard">
                        <div class="flip-card" :class="{ 'flipped': isFlipped }">
                            <!-- Front of card (heading) -->
                            <div class="flip-card-front">
                                <div class="card bg-base-100 shadow-xl cursor-pointer">
                                    <div class="card-body items-center text-center justify-center">
                                        <h2 class="card-title text-2xl text-primary mb-4">
                                            {{ learningCards[currentCardIdx] ?
                                                getHeadingText(learningCards[currentCardIdx]!.heading) : 'Loading...' }}
                                        </h2>
                                        <p class="text-base-content opacity-60 text-sm">Click to reveal content</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Back of card (content) -->
                            <div class="flip-card-back">
                                <div class="card bg-base-100 shadow-xl cursor-pointer">
                                    <div class="card-body p-6 overflow-y-auto">
                                        <ContentRenderer
                                            v-if="learningCards[currentCardIdx] && learningCards[currentCardIdx]!.content.length > 0"
                                            :value="getCardContent(learningCards[currentCardIdx]!.content)"
                                            class="prose prose-sm max-w-none text-base-content" />
                                        <div v-else class="text-center text-base-content opacity-60">
                                            <p>No content available for this heading.</p>
                                        </div>
                                        <p class="text-base-content opacity-60 text-xs mt-4 text-center">Click to show
                                            heading</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center items-center gap-4">
                    <button class="btn btn-outline btn-sm" @click="prevCard" :disabled="learningCards.length <= 1">
                        <Icon name="line-md:arrow-left" size="16" />
                        Previous
                    </button>

                    <div class="badge badge-neutral">
                        {{ currentCardIdx + 1 }} / {{ learningCards.length }}
                    </div>

                    <button class="btn btn-outline btn-sm" @click="nextCard" :disabled="learningCards.length <= 1">
                        Next
                        <Icon name="line-md:arrow-right" size="16" />
                    </button>
                </div>

                <!-- Progress Bar -->
                <div class="w-full max-w-md mx-auto">
                    <progress class="progress progress-primary w-full" :value="currentCardIdx + 1"
                        :max="learningCards.length"></progress>
                </div>

                <!-- Quick Actions -->
                <div class="flex justify-center gap-2">
                    <button class="btn btn-ghost btn-xs" @click="currentCardIdx = 0; isFlipped = false"
                        v-if="currentCardIdx !== 0">
                        Reset to Start
                    </button>
                    <button class="btn btn-ghost btn-xs" @click="isFlipped = false" v-if="isFlipped">
                        Show All Fronts
                    </button>

                    <!-- New: Fullscreen toggle -->
                    <button
                        class="btn btn-ghost btn-xs"
                        :class="{ 'btn-active': fullscreen }"
                        @click="toggleFullscreen"
                        title="Toggle fullscreen (F)">
                        Fullscreen
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.flip-card {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.flip-card.flipped {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 1rem;
}

.flip-card-back {
    transform: rotateY(180deg);
}

/* Ensure the card maintains proper styling */
.flip-card-front .card,
.flip-card-back .card {
    width: 100%;
    height: 100%;
}

/* Fix content overflow */
.flip-card-back .card-body {
    max-height: 100%;
}

.katex-display {
    margin-left: auto;
    margin-right: auto;
}

.prose {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
}
</style>