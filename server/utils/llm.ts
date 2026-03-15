import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { H3Event } from "h3";
import { openLink } from "./search";
import type { SearchResult } from "./search";
import { getRelevantSections } from "./llm-search";

const groqApiKey = useRuntimeConfig().groqApiKey;

const getResponseContent = (
      response: { choices?: Array<{ message?: { content?: string | null } }> },
      fallback = "{}",
): string => {
      return response.choices?.[0]?.message?.content || fallback;
};

export const systemPromptWithTools =
      `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

You have access to a search tool that allows you to search through the documentation. Use this tool whenever you need to find specific information to answer the user's question.

**CRITICAL INSTRUCTIONS:**
- Do NOT output <function=...> or similar constructs.
- Do NOT put JSON arguments in the tool name.
- I will provide you with relevant documentation sections as context.
- Base your answers EXCLUSIVELY on the provided context.
- NEVER invent information or answer from your general knowledge alone.
- If the context does not contain sufficient information, state that you could not find the information.
- **Language:** Always respond in the same language as the user's question.

**SEARCH STRATEGY:**
- Start with broad searches, then narrow down with specific queries if needed.
- Use different search terms if initial results are insufficient.
- Search in both English and German if relevant.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise, one or two-sentence summary that directly answers the user's question.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format (e.g., > "This is a quote." (<source>)).

### Sources
- List the titles and URLs of the documentation sections you found as properly formatted Markdown links.
`;

export const systemPromptWithContext =
      `You are Lexa, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

Your primary task is to provide structured answers to user questions based *exclusively* on the provided documentation sections (context).

**CRITICAL INSTRUCTIONS:**
- You MUST ground your entire answer in the provided context.
- **NEVER** use outside knowledge or answer from your general knowledge base. If the answer is not in the context, state: "I cannot answer this question based on the available documentation."
- **Language:** Always respond in the same language as the user's question.

**RESPONSE FORMAT:**
You must format your response using the following Markdown structure:

### Summary
Provide a concise summary that directly answers the user's question based ONLY on the context.

### Relevant Information
- Use bullet points to detail the key information from the documentation that supports the summary.
- You can use direct quotes from the text using the blockquote format.

### Sources
- You MUST list every source you used.
- Format: \`- [Title](URL)\`
- ONLY use the Title and URL provided in the context blocks.
`;

const systemPromptWithoutContext = `
You are Zenia, a helpful and professional AI assistant for the documentation website of Benjamin Friedl, a student at the HTL St. Pölten.

**CRITICAL INSTRUCTIONS:**
- You MUST NOT answer questions that cannot be answered with your general knowledge.
- If you do not know the answer, you MUST state that you do not know.
- NEVER invent information or make up answers.

**LANGUAGE:** Always respond in the same language as the user's question.

answer short and concisely.
`;

export const sectionsToContext = (sections: SearchResult[]): string => {
      return sections.map((section) =>
            `Title: ${section.title}\nContent: ${section.content}\nURL: ${section.url}`
      ).join("\n\n");
};

const systemPromptForTestGeneration =
      `You are Lexa, an educational AI assistant.
Your task is to generate a test/quiz based EXCLUSIVELY on the provided documentation sections (context).

**INSTRUCTIONS:**
- Generate 3-5 multiple choice or short answer questions.
- Return the result as a strictly formatted JSON object with a "questions" key.
- The object must follow this structure:
  {
      "questions": [
          {
              "id": "unique_string",
              "question": "string",
              "type": "multiple_choice" | "short_answer",
              "options": ["string"] (only for multiple_choice),
              "correctAnswer": "string"
          }
      ]
  }
- Do NOT output markdown formatting (like \`\`\`json), just the raw JSON string.
- The questions must be answerable from the context.
`;

const systemPromptForGrading = `You are Lexa, an educational AI assistant.
Your task is to grade a user's answers to a test based on the provided documentation sections (context) and the original questions.

**INSTRUCTIONS:**
- You will receive the Questions, the User's Answers, and the Context.
- For each answer, determine if it is correct based on the context. Accept answers that are supported by the context, even if they are not verbatim correct, as long as the meaning is correct.
- Return the result as a strictly formatted JSON object with a "grading" key.
- The object must follow this structure:
  {
      "grading": [
          {
              "questionId": "string",
              "correct": boolean,
              "explanation": "string"
          }
      ]
  }
- Do NOT output markdown formatting, just the raw JSON string.
`;

const systemPromptForLearnPlan = `You are Lexa, an educational AI assistant creating a guided study flow.
Your task is to turn documentation sections into a concise learning plan.

INSTRUCTIONS:
- Base the plan EXCLUSIVELY on the provided sections.
- Keep the original section order.
- Return one learning plan item per input section id.
- Rewrite titles only if it improves clarity.
- Each learningGoal must be short, concrete, and action-oriented.
- Return strict JSON with this shape:
      {
            "title": "string",
            "introduction": "string",
            "sections": [
                  {
                        "id": "section-id",
                        "title": "string",
                        "learningGoal": "string"
                  }
            ]
      }
- Do NOT output markdown fences or extra text.
`;

const systemPromptForLearnQuiz = `You are Lexa, an educational AI assistant.
Create a short quiz for one learning section based EXCLUSIVELY on the provided section content.

INSTRUCTIONS:
- Generate 2-3 questions.
- Prefer a mix of short answer and multiple choice when possible.
- Every question must be answerable directly from the section.
- Return strict JSON:
      {
            "questions": [
                  {
                        "id": "unique_string",
                        "question": "string",
                        "type": "multiple_choice" | "short_answer",
                        "options": ["string"],
                        "correctAnswer": "string"
                  }
            ]
      }
- Do NOT output markdown fences or extra text.
`;

const systemPromptForLearningSessionSummary = `You are Lexa, an educational AI assistant.
Summarize a finished learning session based EXCLUSIVELY on the provided plan results.

INSTRUCTIONS:
- Return strict JSON:
      {
            "summary": "string",
            "strengths": ["string"],
            "reviewTopics": ["string"]
      }
- Keep the tone concise and useful.
- Mention what was covered and what should be reviewed next.
- Do NOT output markdown fences or extra text.
`;

interface TestQuestion {
      id: string;
      question: string;
      type: "multiple_choice" | "short_answer";
      options?: string[];
      correctAnswer: string;
}

interface TestGrading {
      questionId: string;
      correct: boolean;
      explanation: string;
}

interface TestAnswer {
      questionId: string;
      answer: string;
}

interface LearnSectionCandidate {
      id: string;
      title: string;
      sourceTitle: string;
      content: string;
      contentMarkdown?: string;
      url: string;
}

interface LearnPlanSection {
      id: string;
      title: string;
      learningGoal: string;
      content: string;
      sourceTitle: string;
      url: string;
}

interface LearnPlan {
      title: string;
      introduction: string;
      sections: LearnPlanSection[];
}

interface LearningSessionResult {
      title: string;
      learningGoal: string;
      passed: boolean;
      attempts: number;
}

const stripMarkdownNoise = (markdown: string): string => {
      return markdown
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
            .replace(/[>#*_`~-]/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim();
};

const truncateText = (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength - 3).trim()}...`;
};

const createParagraphChunks = (
      text: string,
      sourceTitle: string,
      url: string,
): LearnSectionCandidate[] => {
      const paragraphs = text.split(/\n\s*\n/).map((paragraph) => paragraph.trim())
            .filter(Boolean);
      const chunks: LearnSectionCandidate[] = [];
      let currentChunk = "";
      let chunkIndex = 0;

      for (const paragraph of paragraphs) {
            const nextChunk = currentChunk
                  ? `${currentChunk}\n\n${paragraph}`
                  : paragraph;
            if (nextChunk.length > 1200 && currentChunk) {
                  chunkIndex += 1;
                  chunks.push({
                        id: `${url}::chunk-${chunkIndex}`,
                        title: chunkIndex === 1 ? `${sourceTitle} Overview` : `${sourceTitle} Part ${chunkIndex}`,
                        sourceTitle,
                        content: currentChunk.trim(),
                        url,
                  });
                  currentChunk = paragraph;
            } else {
                  currentChunk = nextChunk;
            }
      }

      if (currentChunk.trim()) {
            chunkIndex += 1;
            chunks.push({
                  id: `${url}::chunk-${chunkIndex}`,
                  title: chunkIndex === 1 ? `${sourceTitle} Overview` : `${sourceTitle} Part ${chunkIndex}`,
                  sourceTitle,
                  content: currentChunk.trim(),
                  url,
            });
      }

      return chunks;
};

const splitMarkdownIntoLearnSections = (
      sourceTitle: string,
      markdown: string,
      url: string,
): LearnSectionCandidate[] => {
      const lines = markdown.split("\n");
      const sections: LearnSectionCandidate[] = [];
      let currentTitle = `${sourceTitle} Overview`;
      let currentLines: string[] = [];
      let sectionIndex = 0;

      const pushSection = () => {
            const content = currentLines.join("\n").trim();
            if (!content) return;
            sectionIndex += 1;
            sections.push({
                  id: `${url}::section-${sectionIndex}`,
                  title: currentTitle,
                  sourceTitle,
                  content,
                  url,
            });
      };

      for (const line of lines) {
            const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
            if (headingMatch) {
                  const headingHashes = headingMatch[1] || "";
                  const headingText = (headingMatch[2] || "").trim();
                  const normalizedHeading = headingText.replace(/[*_`]/g, "").trim();
                  const normalizedSourceTitle = sourceTitle.trim().toLowerCase();

                  if (
                        headingHashes.length === 1 &&
                        normalizedHeading.toLowerCase() === normalizedSourceTitle
                  ) {
                        continue;
                  }

                  pushSection();
                  currentTitle = normalizedHeading || `${sourceTitle} Part ${sectionIndex + 1}`;
                  currentLines = [];
                  continue;
            }

            currentLines.push(line);
      }

      pushSection();

      const normalizedSections = sections
            .map((section) => ({
                  ...section,
                  contentMarkdown: section.content,
                  content: stripMarkdownNoise(section.content),
            }))
            .filter((section) => section.content.length > 80);

      if (normalizedSections.length === 0) {
            const rawChunks = createParagraphChunks(markdown, sourceTitle, url);
            return rawChunks.map((chunk) => ({
                  ...chunk,
                  contentMarkdown: chunk.content,
                  content: stripMarkdownNoise(chunk.content),
            })).filter((chunk) => chunk.content.length > 80);
      }

      if (normalizedSections.length <= 8) {
            return normalizedSections;
      }

      const compactSections: LearnSectionCandidate[] = [];
      let buffer: LearnSectionCandidate | null = null;

      for (const section of normalizedSections) {
            if (!buffer) {
                  buffer = { ...section };
                  continue;
            }

            const shouldMerge = compactSections.length + 1 >= 8 || buffer.content.length < 500;
            if (shouldMerge) {
                  buffer = {
                        ...buffer,
                        title: `${buffer.title} + ${section.title}`,
                        content: `${buffer.content}\n\n${section.content}`.trim(),
                        contentMarkdown: `${buffer.contentMarkdown ?? ''}\n\n${section.contentMarkdown ?? ''}`.trim(),
                  };
            } else {
                  compactSections.push(buffer);
                  buffer = { ...section };
            }
      }

      if (buffer) {
            compactSections.push(buffer);
      }

      return compactSections.slice(0, 8);
};

const buildLearnSectionCandidates = async (
      contextLinks: string[],
      event: H3Event,
): Promise<LearnSectionCandidate[]> => {
      const candidates: LearnSectionCandidate[] = [];

      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (!section?.contentRaw && !section?.content) {
                  continue;
            }

            candidates.push(
                  ...splitMarkdownIntoLearnSections(
                        section.title,
                        section.contentRaw || section.content || "",
                        section.url,
                  ),
            );
      }

      return candidates.filter((candidate) => candidate.content.trim().length > 0);
};

const normalizeQuestions = (questions: unknown): TestQuestion[] => {
      if (!Array.isArray(questions)) return [];

      return questions.map((question, index): TestQuestion => {
            const candidate = question as Partial<TestQuestion>;
            const type: TestQuestion["type"] = candidate.type === "multiple_choice"
                  ? "multiple_choice"
                  : "short_answer";

            return {
                  id: candidate.id || `question-${index + 1}`,
                  question: candidate.question || `Question ${index + 1}`,
                  type,
                  options: type === "multiple_choice"
                        ? (candidate.options || []).filter(Boolean)
                        : undefined,
                  correctAnswer: candidate.correctAnswer || "",
            };
      }).filter((question) => question.question.trim().length > 0);
};

const normalizeLearnPlan = (
      parsedContent: any,
      candidates: LearnSectionCandidate[],
): LearnPlan => {
      const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]));
      const responseSections = Array.isArray(parsedContent?.sections)
            ? parsedContent.sections
            : [];

      const sections = candidates.map((candidate) => {
            const responseSection = responseSections.find((section: any) => section?.id === candidate.id);
            const c = candidateMap.get(candidate.id);
            return {
                  id: candidate.id,
                  title: responseSection?.title || candidate.title,
                  learningGoal: responseSection?.learningGoal || `Study the key ideas in ${candidate.title}.`,
                  content: c?.contentMarkdown ?? c?.content ?? candidate.content,
                  sourceTitle: candidate.sourceTitle,
                  url: candidate.url,
            };
      });

      return {
            title: parsedContent?.title || candidates[0]?.sourceTitle || "Learning Plan",
            introduction: parsedContent?.introduction || "Work through each section in order. Read it, memorize it, and confirm your understanding with the quiz.",
            sections,
      };
};

export const generateTest = async (contextLinks: string[], event: H3Event) => {
      let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: systemPromptForTestGeneration },
            {
                  role: "user",
                  content: `Context:\n${context}\n\nGenerate a test.`,
            },
      ];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Use a capable model for JSON generation
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return {
            test: (parsedContent.questions || []) as TestQuestion[],
            relevantSections: relevantSections.map((s) => ({
                  title: s.title,
                  url: s.url,
            })),
      };
};

export const gradeTest = async (
      questions: TestQuestion[],
      answers: TestAnswer[],
      contextLinks: string[],
      event: H3Event,
) => {
      let relevantSections: SearchResult[] = [];
      for (const link of contextLinks) {
            const section = await openLink(link, event);
            if (section) {
                  relevantSections.push(section);
            }
      }
      const context = sectionsToContext(relevantSections);

      const groq = new Groq({ apiKey: groqApiKey });
      const messages: ChatCompletionMessageParam[] = [
            { role: "system", content: systemPromptForGrading },
            {
                  role: "user",
                  content: `Context:\n${context}\n\nQuestions:\n${
                        JSON.stringify(questions)
                  }\n\nUser Answers:\n${
                        JSON.stringify(answers)
                  }\n\nGrade the test.`,
            },
      ];

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return (parsedContent.grading || []) as TestGrading[];
};

export const generateLearnPlan = async (
      contextLinks: string[],
      event: H3Event,
): Promise<LearnPlan> => {
      const candidates = await buildLearnSectionCandidates(contextLinks, event);

      if (candidates.length === 0) {
            throw new Error("No learnable content found for the selected context.");
      }

      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  { role: "system", content: systemPromptForLearnPlan },
                  {
                        role: "user",
                        content: `Create a learning plan for these sections:\n${JSON.stringify(
                              candidates.map((candidate) => ({
                                    id: candidate.id,
                                    title: candidate.title,
                                    sourceTitle: candidate.sourceTitle,
                                    content: truncateText(candidate.content, 1800),
                              })),
                        )}`,
                  },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return normalizeLearnPlan(parsedContent, candidates);
};

export const generateLearnSectionQuiz = async (
      section: { title: string; content: string; learningGoal?: string },
): Promise<TestQuestion[]> => {
      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  { role: "system", content: systemPromptForLearnQuiz },
                  {
                        role: "user",
                        content: `Section Title: ${section.title}\nLearning Goal: ${section.learningGoal || "Understand the section."}\nSection Content:\n${truncateText(section.content, 2600)}`,
                  },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return normalizeQuestions(parsedContent.questions);
};

export const gradeLearnSectionQuiz = async (
      section: { title: string; content: string },
      questions: TestQuestion[],
      answers: TestAnswer[],
): Promise<TestGrading[]> => {
      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  { role: "system", content: systemPromptForGrading },
                  {
                        role: "user",
                        content: `Context:\nTitle: ${section.title}\nContent: ${truncateText(section.content, 2600)}\n\nQuestions:\n${JSON.stringify(questions)}\n\nUser Answers:\n${JSON.stringify(answers)}\n\nGrade the test.`,
                  },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return (parsedContent.grading || []) as TestGrading[];
};

export const summarizeLearningSession = async (
      planTitle: string,
      results: LearningSessionResult[],
): Promise<{ summary: string; strengths: string[]; reviewTopics: string[] }> => {
      const groq = new Groq({ apiKey: groqApiKey });
      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  { role: "system", content: systemPromptForLearningSessionSummary },
                  {
                        role: "user",
                        content: `Plan Title: ${planTitle}\nResults:\n${JSON.stringify(results)}`,
                  },
            ],
            response_format: { type: "json_object" },
            temperature: 0.2,
      });

      const parsedContent = JSON.parse(getResponseContent(response));
      return {
            summary: parsedContent.summary || "You completed the learning plan.",
            strengths: Array.isArray(parsedContent.strengths)
                  ? parsedContent.strengths.filter(Boolean)
                  : [],
            reviewTopics: Array.isArray(parsedContent.reviewTopics)
                  ? parsedContent.reviewTopics.filter(Boolean)
                  : [],
      };
};

const contextualizeQuery = async (
      query: string,
      history: ChatCompletionMessageParam[],
) => {
      if (!history || history.length === 0) return query;

      const groq = new Groq({ apiKey: groqApiKey });

      // Keep only the last few messages to avoid token limits and keep it relevant
      const relevantHistory = history.slice(-6);

      const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                  {
                        role: "system",
                        content:
                              `You are an AI assistant that rephrases user questions to be standalone based on the conversation history.
      The user is asking a follow-up question that might refer to previous context (e.g., "What is it used for?", "How does that work?").
      Your task is to rewrite the LAST user question so that it contains all necessary context from the history to be understood without the history.
      
      Examples:
      History: User: "What is HTTP?" Assistant: "HTTP is..." User: "Is it secure?"
      Output: "Is HTTP secure?"
      
      History: User: "Tell me about Nginx." Assistant: "Nginx is..." User: "How do I install it?"
      Output: "How do I install Nginx?"
      
      If the question is already standalone, output it exactly as is.
      Do NOT answer the question. ONLY output the rephrased question.
      `,
                  },
                  ...relevantHistory,
                  {
                        role: "user",
                        content: `Rephrase this question: "${query}"`,
                  },
            ],
            temperature: 0.1,
            max_tokens: 200,
      });

      const rephrasedQuery = getResponseContent(response, query).trim() ||
            query;
      console.log(
            `[Contextualization] Original: "${query}" -> Rephrased: "${rephrasedQuery}"`,
      );
      return rephrasedQuery;
};

export const askLLM = async (
      prompt: string,
      history: ChatCompletionMessageParam[] = [],
      event: H3Event,
      contextLinks?: string[],
      withoutContext?: boolean,
      aiSettings: { model?: string; useTools?: boolean } = {},
) => {
      // Use tool-based approach if enabled
      // Use tool-based approach if enabled
      /* if (aiSettings.useTools) {
             return await askLLMWithTools(prompt, history, event, aiSettings);
       } */

      // Legacy approach with pre-fetched context
      let context = "";
      let relevantSections: SearchResult[] = [];

      // Contextualize the query using history if we are going to search for context
      let searchPrompt = prompt;
      if (!withoutContext && !contextLinks && history.length > 0) {
            try {
                  searchPrompt = await contextualizeQuery(prompt, history);
            } catch (e) {
                  console.error("Failed to contextualize query:", e);
                  // Fallback to original prompt
            }
      }

      if (!withoutContext) {
            if (!contextLinks) {
                  // Use the contextualized prompt for search
                  relevantSections = await getRelevantSections(
                        searchPrompt,
                        event,
                  );
                  context = sectionsToContext(relevantSections);
            } else {
                  relevantSections = [];
                  for (const link of contextLinks) {
                        const section = await openLink(link, event);
                        if (section) {
                              relevantSections.push(section);
                        } else {
                              console.warn(
                                    `Could not fetch section for link: ${link}, ${section}`,
                              );
                        }
                  }
                  console.log(
                        "Fetched sections for provided links:",
                        relevantSections,
                  );
                  console.log("withoutContext:", contextLinks);
                  context = sectionsToContext(relevantSections);
            }
      }

      console.log("Using context:", context);

      const groq = new Groq({
            apiKey: groqApiKey,
      });

      const promptWithContext = `
        Context:
        ${context}
        
        Question:
        ${prompt}
      `;

      const messages: ChatCompletionMessageParam[] = [
            {
                  role: "system",
                  content: withoutContext
                        ? systemPromptWithoutContext
                        : systemPromptWithContext,
            },
            ...history,
            {
                  role: "user",
                  content: withoutContext ? prompt : promptWithContext,
            },
      ];

      console.log(
            "------------------------------------------------------------------",
      );
      console.log("DEBUG: RAG Mode:", !withoutContext);
      console.log("DEBUG: Context Length:", context.length);
      console.log("DEBUG: Context Preview:", context.substring(0, 500));
      console.log(
            "DEBUG: Messages sent to LLM:",
            JSON.stringify(messages, null, 2),
      );
      console.log(
            "------------------------------------------------------------------",
      );

      const response = await groq.chat.completions.create({
            model: aiSettings.model || "openai/gpt-oss-120b",
            messages,
            max_completion_tokens: 4096,
            temperature: 0.1,
            top_p: 1,
            // reasoning_format: 'hidden',
            // reasoning_effort: '',
            stream: true,
      });

      return {
            response,
            relevantSections: relevantSections.map((section) => {
                  const { content, ...rest } = section; // remove content for smaller payload
                  return rest;
            }),
      };
};

export const SystemPromptForSalaryParsing = `
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

export const parseSalaryFromText = async (
      text: string,
      model: string = "openai/gpt-oss-120b",
) => {
      const groq = new Groq({ apiKey: groqApiKey });
      const answer = await groq.chat.completions.create({
            messages: [
                  {
                        role: "system",
                        content: SystemPromptForSalaryParsing,
                  },
                  {
                        role: "user",
                        content: text,
                  },
            ],
            model: model,
            temperature: 0,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            response_format: {
                  type: "json_object",
            },
            stop: null,
      });
      const response = answer.choices[0]!.message.content;
      return JSON.parse(response!);
};
