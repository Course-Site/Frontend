import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer, Question, ServerQuestion, Test, TestState } from "../types/types";
import { RootState } from "./store";

interface FullTestPayload {
  title: string;
  topicId: string;
  questions: Question[];
  answers: Answer[];
}

// Вспомогательная функция получения токена
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const initialState: TestState & { questions: Question[] } = {
  tests: [],
  questions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTests = createAsyncThunk<Test[], void, { rejectValue: string }>(
  "test/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test/getAll", {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки тестов");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createTest = createAsyncThunk<Test, { title: string; topicId: string }, { rejectValue: string }>(
  "test/createTest",
  async ({ title, topicId }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, topicId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при создании теста");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const updateTest = createAsyncThunk<Test, { id: string; title: string; topicId: string }, { rejectValue: string }>(
  "test/updateTest",
  async ({ id, title, topicId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, topicId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при обновлении теста");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const deleteTest = createAsyncThunk<string, string, { rejectValue: string }>(
  "test/deleteTest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при удалении теста");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createQuestions = createAsyncThunk<void, { testId: string; questions: ServerQuestion[] }, { rejectValue: string }>(
  "test/createQuestions",
  async ({ testId, questions }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/question/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ testId, questions }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при создании вопросов");
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const fetchTestQuestions = createAsyncThunk<Question[], string, { rejectValue: string }>(
  "test/fetchTestQuestions",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/question/${testId}`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки вопросов");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createAnswers = createAsyncThunk<void, { questionId: string; answers: Answer[] }, { rejectValue: string }>(
  "test/createAnswers",
  async ({ questionId, answers }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/answer/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ questionId, answers }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при создании ответов");
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createFullTest = createAsyncThunk<
  void,
  {
    title: string;
    topicId: string;
    questions: Array<{
      questionText: string;
      imageUrl: string;
    }>;
    answers?: Array<{ // Сделаем answers опциональным
      text: string;
      isCorrect: boolean;
      questionIndex: number;
    }>;
  },
  { state: RootState }
>('test/createFullTest', async ({ title, topicId, questions, answers = [] }, thunkAPI) => {
  try {
    console.group('Создание полного теста');
    
    // 1. Создание теста
    const testResponse = await fetch('http://localhost:4200/api/v1/test/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, topicId }),
    });

    if (!testResponse.ok) {
      const error = await testResponse.json();
      throw new Error(error.message || 'Ошибка при создании теста');
    }

    const test = await testResponse.json();
    console.log("Тест создан, ID:", test.id);

    // 2. Создание вопросов
    const createdQuestions = await Promise.all(
      questions.map(async (q, index) => {
        const questionData = {
          title: q.questionText,
          text: q.questionText,
          imageUrl: q.imageUrl || null,
          number: index + 1,
          testId: test.id,
        };

        const questionResponse = await fetch('http://localhost:4200/api/v1/testQuestion/create', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(questionData),
        });

        if (!questionResponse.ok) {
          const error = await questionResponse.json();
          throw new Error(`Вопрос ${index + 1}: ${error.message || 'Ошибка создания вопроса'}`);
        }

        return await questionResponse.json();
      })
    );

    console.log("Созданные вопросы:", createdQuestions);

    // 3. Создание ответов (только если они есть)
    if (answers && answers.length > 0) {
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const questionId = createdQuestions[answer.questionIndex]?.id;
        
        if (!questionId) {
          console.error(`Не найден вопрос для ответа ${i + 1}`);
          continue;
        }

        const answerData = {
          text: answer.text,
          isCorrect: answer.isCorrect,
          testQuestionId: questionId,
          number: i + 1,
        };

        console.log(`Отправка ответа ${i + 1}:`, answerData);
        
        const answerResponse = await fetch('http://localhost:4200/api/v1/testAnswer/create', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(answerData),
        });

        if (!answerResponse.ok) {
          const error = await answerResponse.json();
          throw new Error(`Ответ ${i + 1}: ${error.message || 'Ошибка создания ответа'}`);
        }

        const createdAnswer = await answerResponse.json();
        console.log(`Ответ ${i + 1} создан:`, createdAnswer);
      }
    } else {
      console.log("Нет ответов для создания");
    }

    console.groupEnd();
    return;
  } catch (error) {
    console.groupEnd();
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    );
  }
});

// Slice
const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.tests = action.payload;
        state.loading = false;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка при загрузке тестов";
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.tests.push(action.payload);
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        const idx = state.tests.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tests[idx] = action.payload;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter(test => test.id !== action.payload);
      })
      .addCase(fetchTestQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      });
  },
});

export default testSlice.reducer;