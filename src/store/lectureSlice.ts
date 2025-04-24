import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Lecture, LectureState } from "../types/types";

const initialState: LectureState = {
  lectures: [],
  loading: false,
  error: null,
};

export const fetchLectures = createAsyncThunk<Lecture[], void, { rejectValue: string }>(
  "learning/fetchLectures",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lecture/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки лекций");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const fetchLectureById = createAsyncThunk<Lecture, string, { rejectValue: string }>(
  "lecture/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const isValidUUID = (id: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!isValidUUID(id)) throw new Error("Неверный формат ID лекции");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Требуется авторизация");

      const res = await fetch(`http://localhost:4200/api/v1/lecture/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ошибка сервера");

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createLecture = createAsyncThunk<
  Lecture,
  { title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/createLecture",
  async ({ title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lecture/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при создании лекции");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const updateLecture = createAsyncThunk<
  Lecture,
  { id: string; title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/updateLecture",
  async ({ id, title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lecture/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при обновлении лекции");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const deleteLecture = createAsyncThunk<string, string, { rejectValue: string }>(
  "learning/deleteLecture",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lecture/delete/{id}${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при удалении лекции");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures = action.payload;
      })
      .addCase(createLecture.fulfilled, (state, action) => {
        state.lectures.push(action.payload);
      })
      .addCase(updateLecture.fulfilled, (state, action) => {
        const idx = state.lectures.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) state.lectures[idx] = action.payload;
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        state.lectures = state.lectures.filter((lecture) => lecture.id !== action.payload);
      })
      .addCase(fetchLectureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLectureById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lectures = [action.payload]; // или можно обновлять по ID
      })
      .addCase(fetchLectureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки лекции";
      });
  },
});

export default lectureSlice.reducer;