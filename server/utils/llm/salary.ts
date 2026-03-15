import { SystemPromptForSalaryParsing } from "./prompts";
import { createGroqClient } from "./shared";

export const parseSalaryFromText = async (
    text: string,
    model: string = "openai/gpt-oss-120b",
) => {
    const groq = createGroqClient();
    const answer = await groq.chat.completions.create({
        messages: [
            { role: "system", content: SystemPromptForSalaryParsing },
            { role: "user", content: text },
        ],
        model,
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
        stop: null,
    });

    const response = answer.choices[0]?.message?.content;
    return JSON.parse(response || "{}");
};
