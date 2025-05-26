import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Test } from "../types/types";
import { getAuthHeaders } from "./apiUtils";

interface TestState {
  tests: Test[];
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  tests: [],
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

export const fetchTestById = createAsyncThunk<Test, string, { rejectValue: string }>(
  'test/fetchById',
  async (testId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test/findById/${testId}`, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки теста");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createTest = createAsyncThunk<Test, { title: string; topicId: string; description: string }, { rejectValue: string }>(
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
      .addCase(fetchTestById.fulfilled, (state, action) => {
        const idx = state.tests.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.tests[idx] = action.payload;
        } else {
          state.tests.push(action.payload);
        }
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter(test => test.id !== action.payload);
      });
  },
});

export default testSlice.reducer;