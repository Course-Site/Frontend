import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Question } from "../types/types";
import { getAuthHeaders } from "./apiUtils";

interface TestQuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: TestQuestionState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchTestQuestions = createAsyncThunk<Question[], void, { rejectValue: string }>(
  "testQuestion/fetchTestQuestions",
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

export const createQuestions = createAsyncThunk<void, { testId: string; questions: Question[] }, { rejectValue: string }>(
  "testQuestion/createQuestions",
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

export const fetchTestQuestionById = createAsyncThunk<Question, string, { rejectValue: string }>(
  "testQuestion/fetchTestQuestionById",
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

export const updateQuestion = createAsyncThunk<Question, Partial<Question> & { id: string }, { rejectValue: string }>(
  "testQuestion/updateQuestion",
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

export const deleteTestQuestion = createAsyncThunk<string, string, { rejectValue: string }>(
  "testQuestion/deleteTestQuestion",
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

const testQuestionSlice = createSlice({
  name: "testQuestion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
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
        const index = state.questions.findIndex(q => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Неизвестная ошибка при обновлении вопроса";
      })
      .addCase(deleteTestQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q.id !== action.payload);
      });
  },
});

export default testQuestionSlice.reducer;