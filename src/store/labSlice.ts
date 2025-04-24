import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Lab, LabResult, LabState } from "../types/types";

const initialState: LabState = {
  labs: [],
  labResults: [],
  loading: false,
  error: null,
};

export const fetchLabs = createAsyncThunk<Lab[], void, { rejectValue: string }>(
  "learning/fetchLabs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lab/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки лабораторных работ");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const createLab = createAsyncThunk<
  Lab,
  { title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/createLab",
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
      if (!response.ok) throw new Error(result.message || "Ошибка при создании лабораторной работы");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const updateLab = createAsyncThunk<
  Lab,
  { id: string; title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/updateLab",
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
      if (!response.ok) throw new Error(result.message || "Ошибка при обновлении лабораторной работы");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const deleteLab = createAsyncThunk<string, string, { rejectValue: string }>(
  "learning/deleteLab",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при удалении лабораторной работы");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

// Резы лаб
export const uploadLabFile = createAsyncThunk<
  LabResult,
  FormData,
  { rejectValue: string }
>(
  'learning/uploadLabFile',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4200/api/v1/labresult/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки файла');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const fetchLabResults = createAsyncThunk<
  LabResult[],
  string,
  { rejectValue: string }
>(
  'learning/fetchLabResults',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4200/api/v1/labresult/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки результатов');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

export const gradeLab = createAsyncThunk<
  LabResult,
  { resultId: string; score: number; labId: string },
  { rejectValue: string }
>(
  'learning/gradeLab',
  async ({ resultId, score }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4200/api/v1/labresult/${resultId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка оценки работы');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

const labSlice = createSlice({
  name: "lab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Лабораторные работы
            .addCase(fetchLabs.fulfilled, (state, action) => {
              state.labs = action.payload;
            })
            .addCase(createLab.fulfilled, (state, action) => {
              state.labs.push(action.payload);
            })
            .addCase(updateLab.fulfilled, (state, action) => {
              const idx = state.labs.findIndex((l) => l.id === action.payload.id);
              if (idx !== -1) {
                state.labs[idx] = action.payload;
              }
            })
            .addCase(deleteLab.fulfilled, (state, action) => {
              state.labs = state.labs.filter((lab) => lab.id !== action.payload);
            })
      
            // резы лабы
            .addCase(uploadLabFile.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(uploadLabFile.fulfilled, (state, action) => {
              state.loading = false;
              state.labResults.push(action.payload);
            })
            .addCase(uploadLabFile.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Ошибка загрузки файла';
            })
            .addCase(fetchLabResults.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchLabResults.fulfilled, (state, action) => {
              state.loading = false;
              state.labResults = action.payload;
            })
            .addCase(fetchLabResults.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Ошибка загрузки результатов';
            })
            .addCase(gradeLab.fulfilled, (state, action) => {
              const index = state.labResults.findIndex(r => r.id === action.payload.id);
              if (index !== -1) {
                state.labResults[index] = action.payload;
              }
            });
  },
});

export default labSlice.reducer;