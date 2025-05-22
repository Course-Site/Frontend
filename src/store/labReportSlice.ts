import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LabReport, LabReportState } from "../types/types";

const initialState: LabReportState = {
  reports: [],
  loading: false,
  error: null,
};

export const uploadLabReport = createAsyncThunk<
  LabReport,
  FormData,
  { rejectValue: string }
>(
  "labReport/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lab-reports/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка загрузки отчета");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const getLabReportById = createAsyncThunk<
  LabReport,
  string,
  { rejectValue: string }
>(
  "labReport/getById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab-reports/findById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка получения отчета");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const getLabReportByLabAndUser = createAsyncThunk<
  LabReport[], // Теперь ожидаем массив отчетов
  { labId: string; userId: string },
  { rejectValue: string }
>(
  "labReport/getByLabAndUser",
  async ({ labId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:4200/api/v1/lab-reports/GetByLabAndUser?labId=${labId}&userId=${userId}`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка получения отчета");
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const deleteLabReport = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "labReport/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab-reports/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка удаления отчета");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

const labReportSlice = createSlice({
  name: "labReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadLabReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLabReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadLabReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки отчета";
      })
      .addCase(getLabReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabReportById.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        } else {
          state.reports.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(getLabReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения отчета";
      })
      .addCase(getLabReportByLabAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabReportByLabAndUser.fulfilled, (state, action) => {
        // Удаляем все отчеты для этой labId и userId
        state.reports = state.reports.filter(r => 
          !(r.labId === action.meta.arg.labId && r.userId === action.meta.arg.userId)
        );
        // Добавляем новые отчеты
        state.reports.push(...action.payload);
        state.loading = false;
      })
      .addCase(getLabReportByLabAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения отчета";
      })
      .addCase(deleteLabReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(report => report.id !== action.payload);
      });
  },
});

export default labReportSlice.reducer;