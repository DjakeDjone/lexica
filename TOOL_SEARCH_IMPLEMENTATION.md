# AI Tool-Based Search Implementation

## Overview
This implementation adds a dynamic search tool to the Lexa AI assistant, allowing the AI model to search through documentation on-demand during conversations, rather than relying on pre-fetched context.

## How It Works

### Architecture

1. **Tool Definition** (`server/utils/llm.ts`):
   - Defines `search_documentation` tool using Groq's function calling API
   - Tool allows AI to search with natural language queries
   - Returns top 5 most relevant documentation sections

2. **Tool Execution** (`executeSearchTool`):
   - Fetches all documentation sections
   - Processes search results using existing search logic
   - Returns relevant sections with titles, content, URLs, and descriptions

3. **LLM Flow** (`askLLMWithTools`):
   - Iterative conversation loop (max 5 iterations)
   - AI can call search tool multiple times
   - Each tool call adds results to message history
   - AI synthesizes final answer from all gathered information

4. **API Endpoint** (`server/api/ai.ts`):
   - Accepts `useTools` parameter to enable tool-based search
   - Backwards compatible with existing context-based approach
   - Supports custom model selection

5. **Frontend** (Components):
   - Toggle switch to enable/disable AI Search Tools
   - When enabled, AI autonomously searches for information
   - When disabled, falls back to original context selection

## Benefits

### For Users:
- **No manual context selection needed** - AI finds relevant docs automatically
- **More comprehensive answers** - AI can search multiple times with different queries
- **Better multilingual support** - AI can search in both English and German

### For Developers:
- **More flexible** - AI adapts search strategy based on question
- **Reduced pre-processing** - No need to pre-fetch context
- **Easier to maintain** - Search logic centralized in one place

## Usage

### Backend API

```typescript
// Enable tool-based search
const response = await fetch('/api/ai', {
  method: 'POST',
  body: JSON.stringify({
    question: "What is TCP?",
    history: [],
    useTools: true,  // Enable dynamic search
    model: 'llama-3.3-70b-versatile' // Recommended for tool use
  })
});
```

### Frontend Component

```vue
<script setup>
const { askAi } = useAiHandler();

// Call with tool-based search enabled
await askAi(
  question,
  selectedContext,
  autoContext,
  true,  // useTools = true
  'llama-3.3-70b-versatile'  // model
);
</script>
```

### UI Toggle

The Lexa interface now includes a toggle switch:
- **"AI Search Tools"** - When enabled, AI uses dynamic search
- Context selection UI hidden when tools enabled
- Automatic fallback to legacy mode when disabled

## Models

### Recommended Models for Tool Use:
- `llama-3.3-70b-versatile` (default) - Best balance of speed and accuracy
- `llama-3.3-70b-specdec` - Faster with speculative decoding
- `mixtral-8x7b-32768` - Alternative with large context

### Legacy Models (context-based):
- `qwen/qwen3-32b` (default for legacy mode)
- Other Groq-supported models

## System Prompts

### With Tools (`systemPromptWithTools`):
- Instructs AI to use search tool before answering
- Encourages multiple searches if needed
- Enforces structured response format (Summary, Relevant Info, Sources)
- Maintains language consistency (answers in user's language)

### With Context (`systemPromptWithContext`):
- Legacy mode with pre-fetched context
- Grounds answers exclusively in provided context
- Same structured response format

## Iteration Flow

```
User Question
    ↓
Initial LLM Call (with tools available)
    ↓
AI decides: Need more info? → Call search_documentation
    ↓
Execute search → Return results
    ↓
Add results to message history
    ↓
AI decides: Need more searches? → Repeat or Generate answer
    ↓
Final streaming response
```

## Configuration

The implementation uses these defaults:
- **Max iterations**: 5 (prevents infinite loops)
- **Results per search**: 5 sections
- **Default model (tools)**: `llama-3.3-70b-versatile`
- **Default model (legacy)**: `qwen/qwen3-32b`
- **Temperature**: 0.1 (deterministic)
- **Top-p**: 1.0

## Migration Guide

### Existing Code
No breaking changes! The feature is opt-in via `useTools` parameter.

```typescript
// Old way (still works)
await askAi(question, context, autoContext);

// New way (with tools)
await askAi(question, context, autoContext, true, 'llama-3.3-70b-versatile');
```

### Frontend
The UI automatically shows/hides appropriate controls based on the toggle state.

## Troubleshooting

### AI not using search tool
- Ensure using a tool-compatible model (llama-3.3-70b recommended)
- Check console logs for `[LLM] Model requested X tool call(s)`
- Verify `useTools: true` in API request

### Max iterations reached
- AI called tools 5 times without finalizing answer
- May indicate complex question or insufficient docs
- Check console logs for tool call queries

### No results from search
- Verify documentation is indexed correctly
- Check search query relevance in console logs
- Test search manually via `/api/search`

## Future Improvements

- [ ] Add more tools (e.g., calculator, code execution)
- [ ] Implement streaming tool calls
- [ ] Add token usage tracking
- [ ] Cache frequent searches
- [ ] Support parallel tool calls
- [ ] Add tool call visualization in UI
- [ ] Implement tool call history/analytics

## Technical Details

### Dependencies
- `groq-sdk`: Function calling API
- Existing search infrastructure (`processSearchResults`, `queryCollectionSearchSections`)

### Performance
- Tool-based: ~2-10s (depends on search iterations)
- Legacy context: ~1-3s
- Trade-off: Slower but more accurate and autonomous

### Token Usage
- Each tool call adds context tokens
- Multiple searches increase total tokens
- Streaming reduces perceived latency

## Conclusion

The tool-based search implementation makes Lexa more autonomous and intelligent, removing the burden of context selection from users while providing more comprehensive and accurate answers.
