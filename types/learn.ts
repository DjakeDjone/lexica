export type LearnQuestion = {
    id: string;
    question: string;
    type: 'multiple_choice' | 'short_answer';
    options?: string[];
    correctAnswer: string;
};

export type LearnGrading = {
    questionId: string;
    correct: boolean;
    explanation: string;
};

export type LearnPlanSection = {
    id: string;
    title: string;
    learningGoal: string;
    content: string;
    sourceTitle: string;
    url: string;
};

export type LearnPlan = {
    title: string;
    introduction: string;
    sections: LearnPlanSection[];
};

export type SectionProgress = {
    questions: LearnQuestion[];
    answers: { questionId: string; answer: string }[];
    grading: LearnGrading[];
    attempts: number;
    passed: boolean;
};

export type LearningSummary = {
    summary: string;
    strengths: string[];
    reviewTopics: string[];
};

export type LearnStage = 'idle' | 'study' | 'quiz' | 'feedback' | 'complete';
export type LoadingAction = 'plan' | 'quiz' | 'grading' | 'summary' | null;
