import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer, Question, ServerQuestion, Test, TestState, TestResult } from "../types/types";
import { RootState } from "./store";

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
  answers: [],
  results: [],
  loading: false,
  error: null,
  submissionLoading: false,
  submissionError: null,
  testResultByTestAndUser: null,
};

// Async thunks
// test/getAll
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
// test/findById/{testId}
export const fetchTestById = createAsyncThunk<Test[], string, { rejectValue: string }>(
  'test/fetchById',
  async (testId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200//api/v1/test/findById/${testId}`, {
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
// test/create
export const createTest = createAsyncThunk<Test, { title: string; topicId: string; description: string  }, { rejectValue: string }>(
  "test/createTest",
  async ({ title, topicId, description }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, topicId, description }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при создании теста");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// test/${id} (PUT)
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
// test/delete/${id}
export const deleteTest = createAsyncThunk<string, string, { rejectValue: string }>(
  "test/deleteTest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test/delete/${id}`, {
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
//----------------------------------------------------------------------------------------------------------------------------------
// testQuestion/create
export const createQuestions = createAsyncThunk<void, { testId: string; questions: ServerQuestion[] }, { rejectValue: string }>(
  "test/createQuestions",
  async ({ testId, questions }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/testQuestion/create", {
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
// testQuestion/getAll
export const fetchTestQuestions = createAsyncThunk<Question[], void, { rejectValue: string }>(
  "test/fetchTestQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/testQuestion/getAll", {
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
// testQuestion/${question.id} (PUT)
export const updateQuestion = createAsyncThunk<Question, Partial<Question> & { id: string }, { rejectValue: string }>(
  "test/updateQuestion",
  async (questionData, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = questionData;
      const response = await fetch(`http://localhost:4200/api/v1/testQuestion/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при обновлении вопроса");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testQuestion/findById/${questionId}
export const fetchTestQuestionById = createAsyncThunk<Question, string, { rejectValue: string }>(
  "test/fetchTestQuestionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testQuestion/findById/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при загрузке вопроса");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testQuestion/delete/${id}
export const deleteTestQuestion = createAsyncThunk<string, string, { rejectValue: string }>(
  "test/deleteTestQuestion",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testQuestion/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при удалении вопроса");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
//----------------------------------------------------------------------------------------------------------------------------------
// testAnswer/create
export const createAnswers = createAsyncThunk<void, { questionId: string; answers: Answer[] }, { rejectValue: string }>(
  "test/createAnswers",
  async ({ questionId, answers }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/testAnswer/create", {
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
// testAnswer/getAll
export const fetchAllTestAnswers = createAsyncThunk<Answer[], void, { rejectValue: string }>(
  "test/fetchAllAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/testAnswer/getAll", {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки ответов");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testAnswer/findById/${id}
export const fetchTestAnswerById = createAsyncThunk(
  "test/fetchTestAnswerById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4200/api/v1/testAnswer/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch answer");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testAnswer/${id} (PUT)
export const updateAnswer = createAsyncThunk<Answer, Answer, { rejectValue: string }>(
  "test/updateAnswer",
  async (answer, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testAnswer/${answer.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(answer),
      });
      if (!response.ok) throw new Error("Ошибка при обновлении ответа");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testAnswer/delete/${id}
export const deleteTestAnswer = createAsyncThunk(
  "test/deleteTestAnswer",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:4200/api/v1/testAnswer/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to delete answer");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
//----------------------------------------------------------------------------------------------------------------------------------
// testResult/create
export const createTestResult = createAsyncThunk(
  "test/createTestResult",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4200/api/v1/testResult/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create test result");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testResult/getAll
export const fetchAllTestResults = createAsyncThunk<TestResult[], void, { rejectValue: string }>(
  "test/fetchAllTestResults",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/testResult/getAll", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при получении результатов тестов");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testResult/findById/${id}
export const fetchTestResultById = createAsyncThunk<TestResult, string, { rejectValue: string }>(
  "test/fetchTestResultById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testResult/findById/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при получении результата");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testResult/${id} (PUT)
export const updateTestResult = createAsyncThunk<TestResult, TestResult, { rejectValue: string }>(
  "test/updateTestResult",
  async (result, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testResult/${result.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(result),
      });
      if (!response.ok) throw new Error("Ошибка при обновлении результата");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);
// testResult/delete/${id}
export const deleteTestResult = createAsyncThunk<string, string, { rejectValue: string }>(
  "test/deleteTestResult",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/testResult/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при удалении результата");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const getTestResultByTestAndUser = createAsyncThunk(
  'test/getTestResultByTestAndUser',
  async ({ testId, userId }: { testId: string; userId: string }) => {
    const res = await fetch(
      `http://localhost:4200/api/v1/testresult/GetByTestAndUser?testId=${testId}&userId=${userId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return await res.json();
  }
);
//----------------------------------------------------------------------------------------------------------------------------------
export const createFullTest = createAsyncThunk<
  void,
  {
    title: string;
    topicId: string;
    description: string;
    questions: Array<{
      text: string;
      imageUrl: string;
    }>;
    answers?: Array<{ // Сделаем answers опциональным
      text: string;
      isCorrect: boolean;
      questionIndex: number;
    }>;
  },
  { state: RootState }
>('test/createFullTest', async ({ title, topicId, description, questions, answers = [] }, thunkAPI) => {
  try {
    console.group('Создание полного теста');
    
    // 1. Создание теста
    const testResponse = await fetch('http://localhost:4200/api/v1/test/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, topicId, description }),
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
          title: q.text,
          text: q.text,
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
          questionId: questionId,
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

export const submitTestAnswers = createAsyncThunk(
  'test/submitAnswers',
  async (payload: { 
    testId: string; 
    answers: Array<{ 
      questionId: string; 
      selectedAnswerIds: string[] 
    }> 
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authorized');

      // Убедимся, что testId в правильном формате
      const cleanTestId = payload.testId.replace(/['"]/g, '').trim();
      
      const response = await fetch('http://localhost:4200/api/v1/test-evaluate/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          testId: cleanTestId // Используем очищенный testId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Backend error:', error); // Логируем ошибку с бэкенда
        throw new Error(error.message || 'Failed to submit answers');
      }

      return await response.json();
    } catch (error) {
      console.error('Submission error:', error); // Логируем ошибку
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Slice
const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Test
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
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.tests = action.payload;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter(test => test.id !== action.payload);
      })
      // testQuestion
      .addCase(fetchTestQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(createQuestions.fulfilled, () => {
        //
      })
      .addCase(fetchTestQuestionById.fulfilled, (state, action) => {
        const existingIndex = state.questions.findIndex(q => q.id === action.payload.id);
        if (existingIndex !== -1) {
          state.questions[existingIndex] = action.payload;
        } else {
          state.questions.push(action.payload);
        }
      })
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Находим и обновляем вопрос в массиве
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = {
            ...state.questions[index],
            ...action.payload
          };
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка при обновлении вопроса";
      })
      .addCase(deleteTestQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q.id !== action.payload);
      })
      // Answers
      .addCase(fetchAllTestAnswers.fulfilled, (state, action) => {
        state.answers = action.payload;
      })
      .addCase(fetchTestAnswerById.fulfilled, (state, action) => {
        const existingIndex = state.answers.findIndex(a => a.id === action.payload.id);
        if (existingIndex !== -1) {
          state.answers[existingIndex] = action.payload;
        } else {
          state.answers.push(action.payload);
        }
      })
      .addCase(updateAnswer.fulfilled, (state, action) => {
        const idx = state.answers.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.answers[idx] = action.payload;
      })
      .addCase(deleteTestAnswer.fulfilled, (state, action) => {
        state.answers = state.answers.filter(a => a.id !== action.payload);
      })
      // Results
      .addCase(fetchAllTestResults.fulfilled, (state, action) => {
        state.results = action.payload;
      })
      .addCase(fetchTestResultById.fulfilled, (state, action) => {
        const idx = state.results.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) {
          state.results[idx] = action.payload;
        } else {
          state.results.push(action.payload);
        }
      })
      .addCase(createTestResult.fulfilled, (state, action) => {
        state.results.push(action.payload);
      })
      .addCase(updateTestResult.fulfilled, (state, action) => {
        const idx = state.results.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.results[idx] = action.payload;
      })
      .addCase(deleteTestResult.fulfilled, (state, action) => {
        state.results = state.results.filter(r => r.id !== action.payload);
      })
      .addCase(submitTestAnswers.pending, (state) => {
      state.submissionLoading = true;
      state.submissionError = null;
    })
    .addCase(submitTestAnswers.fulfilled, (state) => {
      state.submissionLoading = false;
    })
    .addCase(submitTestAnswers.rejected, (state, action) => {
      state.submissionLoading = false;
      state.submissionError = action.payload as string;
    })
    // 
    builder.addCase(getTestResultByTestAndUser.fulfilled, (state, action) => {
      state.testResultByTestAndUser = action.payload;
    });

  },
});

export default testSlice.reducer;