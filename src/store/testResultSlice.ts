import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TestResult } from "../types/types";
import { getAuthHeaders } from "./apiUtils";

interface TestResultState {
  resultsByTestId: Record<string, TestResult[]>;
  testResultsByTestAndUser: Record<string, TestResult>; // Изменено на словарь
  submissionLoading: boolean;
  submissionError: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestResultState = {
  resultsByTestId: {},
  testResultsByTestAndUser: {}, // Инициализируем как пустой объект
  submissionLoading: false,
  submissionError: null,
  loading: false,
  error: null,
};

// Thunks (оставляем без изменений)
export const createTestResult = createAsyncThunk(
  "test/createTestResult",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:4200/api/v1/test_result/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

export const fetchAllTestResults = createAsyncThunk<TestResult[], void, { rejectValue: string }>(
  "test/fetchAllTestResults",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test_result/getAll", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при получении результатов тестов");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const fetchTestResultById = createAsyncThunk<TestResult, string, { rejectValue: string }>(
  "test/fetchTestResultById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_result/findById/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при получении результата");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const updateTestResult = createAsyncThunk<TestResult, TestResult, { rejectValue: string }>(
  "test/updateTestResult",
  async (result, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_result/${result.id}`, {
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

export const deleteTestResult = createAsyncThunk<string, string, { rejectValue: string }>(
  "test/deleteTestResult",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_result/delete/${id}`, {
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
  async ({ testId, userId }: { testId: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4200/api/v1/test_result/GetByTestAndUser?testId=${testId}&userId=${userId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) throw new Error('Failed to fetch test result');
      //console.log(res.json());
      return { testId, result: await res.json() };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const submitTestAnswers = createAsyncThunk(
  'test/submitAnswers',
  async (
    payload: {
      testId: string;
      answers: Array<{ questionId: string; selectedAnswerIds: string[] }>;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authorized');

      const cleanTestId = payload.testId.replace(/['"]/g, '').trim();

      const response = await fetch('http://localhost:4200/api/v1/test_evaluate/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...payload,
          testId: cleanTestId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit answers');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Slice
const testResultSlice = createSlice({
  name: "testResult",
  initialState,
  reducers: {
    resetTestResultsByUser(state) {
      state.testResultsByTestAndUser = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTestResults.fulfilled, (state, action) => {
        state.resultsByTestId = {};
        action.payload.forEach((result) => {
          if (!state.resultsByTestId[result.testId]) {
            state.resultsByTestId[result.testId] = [];
          }
          state.resultsByTestId[result.testId].push(result);
        });
      })
      .addCase(fetchTestResultById.fulfilled, (state, action) => {
        const result = action.payload;
        const list = state.resultsByTestId[result.testId] || [];
        const existingIndex = list.findIndex(r => r.id === result.id);
        if (existingIndex !== -1) {
          list[existingIndex] = result;
        } else {
          list.push(result);
        }
        state.resultsByTestId[result.testId] = list;
      })
      .addCase(createTestResult.fulfilled, (state, action) => {
        const result = action.payload;
        if (!state.resultsByTestId[result.testId]) {
          state.resultsByTestId[result.testId] = [];
        }
        state.resultsByTestId[result.testId].push(result);
      })
      .addCase(updateTestResult.fulfilled, (state, action) => {
        const result = action.payload;
        const list = state.resultsByTestId[result.testId];
        if (list) {
          const idx = list.findIndex(r => r.id === result.id);
          if (idx !== -1) {
            list[idx] = result;
          }
        }
      })
      .addCase(deleteTestResult.fulfilled, (state, action) => {
        const idToDelete = action.payload;
        for (const testId in state.resultsByTestId) {
          state.resultsByTestId[testId] = state.resultsByTestId[testId].filter(r => r.id !== idToDelete);
        }
      })
      .addCase(submitTestAnswers.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(submitTestAnswers.fulfilled, (state, action) => {
        state.submissionLoading = false;
        // Обновляем результат теста после успешной отправки ответов
        if (action.payload?.testId) {
          state.testResultsByTestAndUser[action.payload.testId] = action.payload;
        }
      })
      .addCase(submitTestAnswers.rejected, (state, action) => {
        state.submissionLoading = false;
        state.submissionError = action.payload as string;
      })
      .addCase(getTestResultByTestAndUser.fulfilled, (state, action) => {
        const { testId, result } = action.payload;
        if (testId && result) {
          state.testResultsByTestAndUser[testId] = result;
        }
      })
      .addCase(getTestResultByTestAndUser.rejected, (_, action) => {
        // Можно добавить обработку ошибок, если нужно
        console.error('Failed to fetch test result:', action.payload);
      });
  },
});

export default testResultSlice.reducer;
export const { resetTestResultsByUser } = testResultSlice.actions;