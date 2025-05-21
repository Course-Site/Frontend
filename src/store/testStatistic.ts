import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserTestStatistic } from "../types/types";

interface UserTestStatisticsState {
  statistics: UserTestStatistic[];
  loading: boolean;
  error: string | null;
}

const initialState: UserTestStatisticsState = {
  statistics: [],
  loading: false,
  error: null,
};

export const getStatisticsByUserId = createAsyncThunk(
  "userTestStatistics/getByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4200/api/v1/user_test_statistics/findByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Ошибка загрузки статистики");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const deleteUserStatistic = createAsyncThunk(
  "userTestStatistics/deleteById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:4200/api/v1/user_test_statistics/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Ошибка удаления статистики");
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

const userTestStatisticsSlice = createSlice({
  name: "userTestStatistics", // Изменили имя слайса для консистентности
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatisticsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getStatisticsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUserStatistic.fulfilled, (state, action) => {
        state.statistics = state.statistics.filter((s) => s.id !== action.payload);
      });
  },
});

export default userTestStatisticsSlice.reducer;