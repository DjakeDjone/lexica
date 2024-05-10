import type { LstDataIn } from "./lohnsteuer";


import Groq from "groq-sdk";

export interface Ai {
  id: number;
  name: string;
  model: string;
  apiKey: string;
  // advanced
  apiURL?: string;
  temperature?: number;
  maxTokens?: number;
  loading?: boolean;
}

export const SystemPrompt = `
Convert the text to JSON in the format: \`\`\` 
  export interface LstDataIn {
  brutto: number;

  ueberstunden50?: number; // wie viele Stunden wurden mit 50% Zuschlag bezahlt
  ueberstunden100?: number;
  ueberstundenTeiler?: number;

  fabo: boolean;
  fabo_voll: boolean; // voller Bonus/halber Bonus
  avabae: boolean;
  minderj_kinder: number;
  vollj_kinder: number;

  freibetrag?: number;
  pendlerpauschale?: number;
  pendlerpauschaleKostenUebername?: number;
  pendlereuro_km?: number;

  gewerkschaftsbeitrag?: number;
  betriebsratsumlage?: number;
  serviceentgelt?: number;
  akontozahlung?: number;
}
}\`\`\`
The 'ueberstundenTeiler' should be the divisor.
`;

export const genGehaltInputByAi = async (text: string, ai: Ai) => {
    if (ai.apiURL === "groq") ai.apiURL = undefined;
    try {
        const groq = new Groq({
        apiKey: ai.apiKey,
        dangerouslyAllowBrowser: true,
        });
        const answer = await groq.chat.completions.create({
        messages: [
            {
            role: "system",
            content: SystemPrompt,
            },
            {
            role: "user",
            content: text,
            },
        ],
        model: ai.model,
        temperature: ai.temperature || 0,
        max_tokens: ai.maxTokens || 1024,
        top_p: 1,
        stream: false,
        response_format: {
            type: "json_object",
        },
        stop: null,
        });
        const response = answer.choices[0].message.content;
        console.log(response);
        return JSON.parse(response) as LstDataIn;
    } catch (error) {
        console.error(error);
        throw new Error("Could not generate Gehalt Input");
    }
};
