import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TestResult } from "../types/types";
import { getAuthHeaders } from "./apiUtils";

interface TestResultState {
  results: TestResult[];
  testResultByTestAndUser: TestResult | null;
  submissionLoading: boolean;
  submissionError: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestResultState = {
  results: [],
  testResultByTestAndUser: null,
  submissionLoading: false,
  submissionError: null,
  loading: false,
  error: null,
};

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

const testResultSlice = createSlice({
  name: "testResult",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(getTestResultByTestAndUser.fulfilled, (state, action) => {
        state.testResultByTestAndUser = action.payload;
      });
  },
});

export default testResultSlice.reducer;