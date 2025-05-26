import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface JwtPayload {
  id: string;
  role: UserRole;
}

// Объединённая логика загрузки данных пользователя по токену
const fetchUserByToken = async (token: string): Promise<User> => {
  const decoded: JwtPayload = jwtDecode(token);
  const response = await fetch(`http://localhost:4200/api/v1/user/findById/${decoded.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const userData = await response.json();

  return {
    ...userData,
    id: decoded.id,
    role: decoded.role,
    token,
  };
};

// Регистрация
export const signUp = createAsyncThunk<User, SignUpData, { rejectValue: string }>(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- добавили токен
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка регистрации");

      // const user = await fetchUserByToken(result.token);
      // localStorage.setItem("token", result.token);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

// Авторизация
export const signIn = createAsyncThunk<User, SignInData, { rejectValue: string }>(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка входа");

      const user = await fetchUserByToken(result.token);
      localStorage.setItem("token", result.token);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  }
);

// Инициализация при старте
export const initAuth = createAsyncThunk<User | null>("auth/init", async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const user = await fetchUserByToken(token);
    return user;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(initAuth.rejected, (state) => {
        state.initialized = true;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка регистрации";
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка входа";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
