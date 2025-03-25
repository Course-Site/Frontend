import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Определяем тип данных пользователя
interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

// Тип состояния авторизации
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Типизация параметров запроса
interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

// Асинхронные экшены для входа и регистрации
export const signUp = createAsyncThunk<User, SignUpData, { rejectValue: string }>(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data: User = await response.json();
      if (!response.ok) throw new Error(data.token || "Ошибка регистрации"); 
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

export const signIn = createAsyncThunk<User, SignInData, { rejectValue: string }>(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data: User = await response.json();
      if (!response.ok) throw new Error(data.token || "Ошибка входа");
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

// Создаём Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Ошибка регистрации";
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Ошибка входа";
      });
  },
});

// Экспортируем экшены и редьюсер
export const { logout } = authSlice.actions;
export default authSlice.reducer;
