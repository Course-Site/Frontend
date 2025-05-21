import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Lab, LabResult, LabState } from "../types/types";

const initialState: LabState = {
  labs: [],
  labResults: [],
  currentLab: null,
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

export const fetchLabById = createAsyncThunk<
  Lab,
  string,
  { rejectValue: string }
>(
  'learning/fetchLabById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4200/api/v1/lab/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Ошибка загрузки лабораторной работы');

      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Неизвестная ошибка');
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
      const response = await fetch(`http://localhost:4200/api/v1/lab/delete/${id}`, {
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

// Загрузка отчета
export const uploadLabReport = createAsyncThunk<
  LabResult,
  FormData,
  { rejectValue: string }
>(
  'lab/uploadLabReport',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4200/api/v1/lab-reports/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка загрузки отчета');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

// Получение всех отчетов
export const getAllLabReports = createAsyncThunk<
  LabResult[],
  void,
  { rejectValue: string }
>(
  'lab/getAllLabReports',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4200/api/v1/lab-reports/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка получения отчетов');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

// Получение отчета по ID
export const getLabReportById = createAsyncThunk<
  LabResult,
  string,
  { rejectValue: string }
>(
  'lab/getLabReportById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4200/api/v1/lab-reports/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка получения отчета');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

// Получение отчета по лабораторной и пользователю
export const getLabReportByLabAndUser = createAsyncThunk<
  LabResult,
  { labId: string; userId: string },
  { rejectValue: string }
>(
  'lab/getLabReportByLabAndUser',
  async ({ labId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:4200/api/v1/lab-reports/GetByLabAndUser?labId=${labId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка получения отчета');
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
      .addCase(fetchLabById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentLab = null;
      })
      .addCase(fetchLabById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLab = action.payload;
      })
      .addCase(fetchLabById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки лабораторной";
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

      // Обработчики для lab reports
      .addCase(uploadLabReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLabReport.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults.push(action.payload);
      })
      .addCase(uploadLabReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки отчета';
      })
      .addCase(getAllLabReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLabReports.fulfilled, (state, action) => {
        state.loading = false;
        state.labResults = action.payload;
      })
      .addCase(getAllLabReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения отчетов';
      })
      .addCase(getLabReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabReportById.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем или добавляем отчет
        const index = state.labResults.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.labResults[index] = action.payload;
        } else {
          state.labResults.push(action.payload);
        }
      })
      .addCase(getLabReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения отчета';
      })
      .addCase(getLabReportByLabAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabReportByLabAndUser.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем или добавляем отчет
        const index = state.labResults.findIndex(r => 
          r.labId === action.payload.labId && r.userId === action.payload.userId
        );
        if (index !== -1) {
          state.labResults[index] = action.payload;
        } else {
          state.labResults.push(action.payload);
        }
      })
      .addCase(getLabReportByLabAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения отчета';
      });
  },
});

export default labSlice.reducer;