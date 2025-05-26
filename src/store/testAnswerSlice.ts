import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer } from "../types/types";
import { getAuthHeaders } from "./apiUtils";

interface TestAnswerState {
  answers: Answer[];
  loading: boolean;
  error: string | null;
}

const initialState: TestAnswerState = {
  answers: [],
  loading: false,
  error: null,
};

export const fetchAllTestAnswers = createAsyncThunk<Answer[], void, { rejectValue: string }>(
  "testAnswer/fetchAllAnswers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test_answer/getAll", {
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

export const createAnswers = createAsyncThunk<void, { questionId: string; answers: Answer[] }, { rejectValue: string }>(
  "testAnswer/createAnswers",
  async ({ questionId, answers }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/test_answer/create", {
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

export const fetchTestAnswerById = createAsyncThunk<Answer, string, { rejectValue: string }>(
  "testAnswer/fetchTestAnswerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_answer/findById/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при загрузке ответа");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const updateAnswer = createAsyncThunk<Answer, Answer, { rejectValue: string }>(
  "testAnswer/updateAnswer",
  async (answer, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_answer/${answer.id}`, {
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

export const deleteTestAnswer = createAsyncThunk<string, string, { rejectValue: string }>(
  "testAnswer/deleteTestAnswer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4200/api/v1/test_answer/delete/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Ошибка при удалении ответа");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

const testAnswerSlice = createSlice({
  name: "testAnswer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default testAnswerSlice.reducer;