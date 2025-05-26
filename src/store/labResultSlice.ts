import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LabResult, LabResultState } from "../types/types";

const initialState: LabResultState = {
  results: [],
  loading: false,
  error: null,
};

export const createLabResult = createAsyncThunk<
  LabResult,
  { labId: string; userId: string; score: number },
  { rejectValue: string }
>(
  "labResult/create",
  async ({ labId, userId, score }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lab_result/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ labId, userId, score }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка создания результата");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const getLabResultByLabAndUser = createAsyncThunk<
  LabResult | null,
  { labId: string; userId: string },
  { rejectValue: string }
>(
  "labResult/getByLabAndUser",
  async ({ labId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4200/api/v1/lab_result/GetByLabAndUser?labId=${labId}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка получения результата");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }

      return null; // если массив пуст
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const updateLabResult = createAsyncThunk<
  LabResult,
  { id: string; score: number },
  { rejectValue: string }
>(
  "labResult/update",
  async ({ id, score }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lab_result/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка обновления результата");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

const labResultSlice = createSlice({
  name: "labResult",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLabResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLabResult.fulfilled, (state, action) => {
        state.results.push(action.payload);
        state.loading = false;
      })
      .addCase(createLabResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка создания результата";
      })
      .addCase(getLabResultByLabAndUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLabResultByLabAndUser.fulfilled, (state, action) => {
        const result = action.payload;
        if (result) {
          const index = state.results.findIndex(
            (r) => r.labId === result.labId && r.userId === result.userId
          );
          if (index !== -1) {
            state.results[index] = result;
          } else {
            state.results.push(result);
          }
        }
        state.loading = false;
      })
      .addCase(getLabResultByLabAndUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка получения результата";
      })
      .addCase(updateLabResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabResult.fulfilled, (state, action) => {
        const index = state.results.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.results[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateLabResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка обновления результата";
      });
  },
});

export default labResultSlice.reducer;