// store/userSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface UserState {
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
};

export const adminAddUser = createAsyncThunk<
  unknown,
  SignUpData,
  { rejectValue: string }
>("user/adminAddUser", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:4200/api/v1/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...userData, role: "user" }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Ошибка регистрации");

    return result;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Неизвестная ошибка"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminAddUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminAddUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(adminAddUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      });
  },
});

export default userSlice.reducer;
