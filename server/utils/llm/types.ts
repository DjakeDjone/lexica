export interface TestQuestion {
    id: string;
    question: string;
    type: "multiple_choice" | "short_answer";
    options?: string[];
    correctAnswer: string;
}

export interface TestGrading {
    questionId: string;
    correct: boolean;
    explanation: string;
}

export interface TestAnswer {
    questionId: string;
    answer: string;
}

export interface LearnSectionCandidate {
    id: string;
    title: string;
    sourceTitle: string;
    content: string;
    contentMarkdown?: string;
    url: string;
}

export interface LearnPlanSection {
    id: string;
    title: string;
    learningGoal: string;
    content: string;
    sourceTitle: string;
    url: string;
}

export interface LearnPlan {
    title: string;
    introduction: string;
    sections: LearnPlanSection[];
}

export interface LearningSessionResult {
    title: string;
    learningGoal: string;
    passed: boolean;
    attempts: number;
}
