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
  description?: string;
  content: string;
  topicId: string;
  maxScore: number;
}

export interface LabReport {
  id: string;
  filename: string;
  filepath: string;
  filetype: string;
  size: number;
  uploadedAt: string;
  userId: string;
  labId: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  topicId: string;
  maxScore: number;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  testResultByTestAndUser: number;
}

export interface LabResult {
  id: string;
  submissionFileUrl?: string;
  score: number;
  percentage: number;
  submittedAt: Date;
  userId: string;
  labId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LabState {
  labs: Lab[];
  currentLab: Lab | null;
  loading: boolean;
  error: string | null;
}

export interface LabReportState {
  reports: LabReport[];
  loading: boolean;
  error: string | null;
}

export interface LabResultState {
  results: LabResult[];
  loading: boolean;
  error: string | null;
}

export interface UserTestStatistic {
  id: string;
  userId: string;
  testId: string;
  score: number;
  test?: {
    id: string;
    title: string;
  };
  labReport?: {
    id: string;
    fileUrl: string;
    labId: string;
  };
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
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

export interface TestState {
  tests: Test[];
  questions: Question[];
  answers: Answer[];
  results: TestResult[];
  loading: boolean;
  error: string | null;
  submissionLoading: boolean; // Добавляем
  submissionError: string | null; // Добавляем
  testResultByTestAndUser: number | null;
}


// Общее состояние (если нужно)
export interface LearningState {
  topic: TopicState;
  lecture: LectureState;
  lab: LabState;
  test: TestState;
}

export interface ServerQuestion {
  text: string;
  imageUrl: string;
  answers: Answer[];
}

export interface TestEditorProps {
  isEdit: boolean;
}

export interface LectureEditorProps {
  isEdit: boolean;
}