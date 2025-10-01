# Tool-Based Search Streaming Fix

## Problem

After implementing the tool-based search, the AI would successfully:
1. Receive the question
2. Call the search tool
3. Get search results

But then the response would be empty/not stream back to the user.

### Console Output
```
[LLM] Iteration 1
[LLM] Model requested 1 tool call(s)
[Tool] Executing search with query: "tcp"
[Tool] Found 5 results for query: "tcp"
[LLM] Iteration 2
[LLM] Model provided final response
```

**Issue**: No content was streamed to the client after "Model provided final response"

## Root Cause

The original implementation had a critical flaw in the iteration loop:

```typescript
// BROKEN CODE
while (iteration < maxIterations) {
    const response = await groq.chat.completions.create({
        messages,
        tools,
        stream: false, // Always non-streaming
    });

    const message = response.choices[0].message;
    
    if (message.tool_calls) {
        // Execute tools...
    } else {
        // Store the response
        finalResponse = response; // Non-streaming response!
        break;
    }
}

// Then make ANOTHER call for streaming
const streamResponse = await groq.chat.completions.create({
    messages,
    stream: true, // New streaming call
});
```

### The Problem:
1. First loop detected tool calls → executed search
2. Second loop made a **non-streaming** call to check if AI was done
3. AI said "I'm done" and provided response content
4. We stored that **non-streaming** response
5. Then we made a **new** streaming API call
6. This new call generated a **different** (often empty) response

## Solution

The fix ensures we **stream the final response** when we detect tool results are ready:

```typescript
// FIXED CODE
while (iteration < maxIterations) {
    // Check if we just added tool results
    const shouldStream = iteration > 1 && messages[messages.length - 1].role === "tool";
    
    if (shouldStream) {
        // NOW is the time to stream the final answer!
        console.log("[LLM] Streaming final response after tool execution");
        const streamResponse = await groq.chat.completions.create({
            messages, // Includes tool results
            stream: true, // Stream the answer
        });
        finalResponse = streamResponse;
        break; // Done!
    }

    // Otherwise, make non-streaming call to detect tool usage
    const response = await groq.chat.completions.create({
        messages,
        tools,
        stream: false, // Check for tool calls
    });

    const message = response.choices[0].message;
    messages.push(message);

    if (message.tool_calls) {
        // Execute tools and loop again
    } else {
        // Fallback: stream the response if no tools used
        const streamResponse = await groq.chat.completions.create({
            messages,
            stream: true,
        });
        finalResponse = streamResponse;
        break;
    }
}
```

## Key Changes

### 1. Detection Logic
```typescript
const shouldStream = iteration > 1 && messages[messages.length - 1].role === "tool";
```
- Detects when we've just added tool results to messages
- This is the perfect time to get the AI's final answer

### 2. Stream at the Right Time
- **Before**: Stream after the loop ended (too late)
- **After**: Stream immediately after tool results are added

### 3. Fallback Handling
If the AI provides an answer without using tools (edge case), we still stream it properly.

## Flow Diagram

### Before (Broken)
```
Iteration 1:
  ├─ Non-streaming call
  ├─ AI requests tool: "search tcp"
  └─ Execute search → Add to messages

Iteration 2:
  ├─ Non-streaming call
  ├─ AI provides answer (not streamed)
  └─ Store response

After loop:
  └─ New streaming call → Different/empty answer ❌
```

### After (Fixed)
```
Iteration 1:
  ├─ Non-streaming call
  ├─ AI requests tool: "search tcp"
  └─ Execute search → Add to messages

Iteration 2:
  ├─ Detect: Last message was tool result ✓
  ├─ Streaming call with tool results
  └─ AI generates answer (streamed) ✓
```

## Testing

To verify the fix works:

1. Enable "AI Search Tools" toggle in Lexa
2. Ask a question like "What is TCP?"
3. Check console logs:
   ```
   [LLM] Iteration 1
   [LLM] Model requested 1 tool call(s)
   [Tool] Executing search with query: "tcp"
   [Tool] Found 5 results for query: "tcp"
   [LLM] Iteration 2
   [LLM] Streaming final response after tool execution
   ```
4. Verify the answer streams to the UI ✓

## Additional Benefits

The fix also:
- Reduces API calls (no redundant streaming call)
- Improves latency (stream immediately when ready)
- Maintains conversation context properly
- Better TypeScript type safety (separate streaming/non-streaming paths)

## Related Files

- `server/utils/llm.ts` - Main fix location
- `server/api/ai.ts` - Streams response to client
- `utils/aiHandler.ts` - Client-side streaming handler

## Conclusion

The issue was a logic error in the iteration loop timing. By streaming the response **immediately** after tool results are added (rather than after the loop), the AI's answer now correctly streams to the client.
