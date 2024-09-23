export type Question = {
    question: string;
    answers: string[];
    correct: number | number[];
    explanation: string;
    image?: string;
}