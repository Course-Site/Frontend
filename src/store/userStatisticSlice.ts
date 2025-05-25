// userStatisticSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Types
export interface IUserStatisticsEntity {
  id?: string;
  totalTestScore: number;
  totalLabScore: number;
  lastUpdated: Date;
  userId: string;
}

export interface UserStatisticsState {
  currentUserStats: IUserStatisticsEntity | null;
  allStats: IUserStatisticsEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: UserStatisticsState = {
  currentUserStats: null,
  allStats: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserStatisticsByUserId = createAsyncThunk<
  IUserStatisticsEntity,
  string,
  { rejectValue: string }
>(
  "userStatistics/fetchByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4200/api/v1/user_statistics/findByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch user statistics");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const createUserStatistics = createAsyncThunk<
  IUserStatisticsEntity,
  Omit<IUserStatisticsEntity, "id">,
  { rejectValue: string }
>(
  "userStatistics/create",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4200/api/v1/user_statistics/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to create user statistics");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchAllUserStatistics = createAsyncThunk<
  IUserStatisticsEntity[],
  void,
  { rejectValue: string }
>(
  "userStatistics/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4200/api/v1/user_statistics/getAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch all statistics");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchUserStatisticsById = createAsyncThunk<
  IUserStatisticsEntity,
  string,
  { rejectValue: string }
>(
  "userStatistics/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4200/api/v1/user_statistics/findById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch statistics by ID");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateUserStatistics = createAsyncThunk<
  IUserStatisticsEntity,
  { id: string; data: Partial<IUserStatisticsEntity> },
  { rejectValue: string }
>(
  "userStatistics/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4200/api/v1/user_statistics/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update user statistics");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteUserStatistics = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "userStatistics/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4200/api/v1/user_statistics/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete user statistics");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const userStatisticsSlice = createSlice({
  name: "userStatistics",
  initialState,
  reducers: {
    resetUserStatistics: () => initialState,
    updateLocalStats: (state, action: PayloadAction<Partial<IUserStatisticsEntity>>) => {
      if (state.currentUserStats) {
        state.currentUserStats = {
          ...state.currentUserStats,
          ...action.payload,
          lastUpdated: new Date(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStatisticsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatisticsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserStats = action.payload;
      })
      .addCase(fetchUserStatisticsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user statistics";
      })
      .addCase(createUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserStats = action.payload;
        state.allStats.push(action.payload);
      })
      .addCase(createUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create user statistics";
      })
      .addCase(fetchAllUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.allStats = action.payload;
      })
      .addCase(fetchAllUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch all statistics";
      })
      .addCase(fetchUserStatisticsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatisticsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserStats = action.payload;
      })
      .addCase(fetchUserStatisticsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch statistics by ID";
      })
      .addCase(updateUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserStats = action.payload;
        const index = state.allStats.findIndex(stat => stat.id === action.payload.id);
        if (index !== -1) {
          state.allStats[index] = action.payload;
        }
      })
      .addCase(updateUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user statistics";
      })
      .addCase(deleteUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUserStats?.id === action.payload) {
          state.currentUserStats = null;
        }
        state.allStats = state.allStats.filter(stat => stat.id !== action.payload);
      })
      .addCase(deleteUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user statistics";
      });
  },
});

export const { resetUserStatistics, updateLocalStats } = userStatisticsSlice.actions;

// Selectors
export const selectCurrentUserStats = (state: RootState) => state.userStatistics.currentUserStats;
export const selectAllUserStats = (state: RootState) => state.userStatistics.allStats;
export const selectUserStatsLoading = (state: RootState) => state.userStatistics.loading;
export const selectUserStatsError = (state: RootState) => state.userStatistics.error;

export default userStatisticsSlice.reducer;