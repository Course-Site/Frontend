// Базовые интерфейсы
export interface Topic {
  id: string;
  title: string;
  description: string;
}
  
export interface Lecture {
  id: string;
  title: string;
  topicId: string;
  content: string;
}
  
export interface Lab {
  id: string;
  title: string;
  topicId: string;
  content: string;
}


export interface Test {
  id: string;
  title: string;
  description: string;
  topicId: string;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
}

export interface LabResult {
  id: string;
  submissionFileUrl?: string;
  score?: number;
  submittedAt: Date;
  userId: string;
  labId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  testQuestionId: string;
}

export interface Question {
  id: string;
  text : string;
  imageUrl: string;
  number: string;
  testId: string,
}

// Состояния для каждого модуля
export interface TopicState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}

export interface LectureState {
  lectures: Lecture[];
  loading: boolean;
  error: string | null;
}

export interface LabState {
  labs: Lab[];
  labResults: LabResult[];
  loading: boolean;
  error: string | null;
}

export interface TestState {
  tests: Test[];
  questions: Question[];
  answers: Answer[];
  results: TestResult[];
  loading: boolean;
  error: string | null;
}


// Общее состояние (если нужно)
export interface LearningState {
  topic: TopicState;
  lecture: LectureState;
  lab: LabState;
  test: TestState;
}

export interface ServerQuestion {
  questionText: string;
  imageUrl: string;
  answers: Answer[];
}

export interface TestEditorProps {
  isEdit: boolean;
}

export interface LectureEditorProps {
  isEdit: boolean;
}