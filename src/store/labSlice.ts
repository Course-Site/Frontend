import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Lab, LabState } from "../types/types";

const initialState: LabState = {
  labs: [],
  currentLab: null,
  loading: false,
  error: null,
};

export const fetchLabs = createAsyncThunk<Lab[], void, { rejectValue: string }>(
  "lab/fetchLabs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lab/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const fetchLabById = createAsyncThunk<Lab, string, { rejectValue: string }>(
  "lab/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab/findById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const createLab = createAsyncThunk<Lab, { title: string; content: string; topicId: string }, { rejectValue: string }>(
  "lab/create",
  async ({ title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lab/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка создания");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const updateLab = createAsyncThunk<Lab, { id: string; title: string; content: string; topicId: string }, { rejectValue: string }>(
  "lab/update",
  async ({ id, title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка обновления");
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const deleteLab = createAsyncThunk<string, string, { rejectValue: string }>(
  "lab/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка удаления");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

const labSlice = createSlice({
  name: "lab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabs.fulfilled, (state, action) => {
        state.labs = action.payload;
        state.loading = false;
      })
      .addCase(fetchLabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки";
      })
      .addCase(fetchLabById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabById.fulfilled, (state, action) => {
        state.currentLab = action.payload;
        state.loading = false;
      })
      .addCase(fetchLabById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки";
      })
      .addCase(createLab.fulfilled, (state, action) => {
        state.labs.push(action.payload);
      })
      .addCase(updateLab.fulfilled, (state, action) => {
        const index = state.labs.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.labs[index] = action.payload;
        }
      })
      .addCase(deleteLab.fulfilled, (state, action) => {
        state.labs = state.labs.filter(lab => lab.id !== action.payload);
      });
  },
});

export default labSlice.reducer;