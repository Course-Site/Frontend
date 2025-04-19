import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface Topic {
  id: string;
  title: string;
  description: string;
}

interface Lecture {
  id: string;
  title: string;
  topicId: string;
  lectureFileUrl: string;
}

interface Lab {
  id: string;
  title: string;
  topicId: string;
}

interface Test {
  id: string;
  title: string;
  topicId: string;
}

interface LearningState {
  topics: Topic[];
  lectures: Lecture[];
  labs: Lab[];
  tests: Test[];
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  topics: [],
  lectures: [],
  labs: [],
  tests: [],
  loading: false,
  error: null,
};

export const fetchTopics = createAsyncThunk<Topic[], void, { rejectValue: string }>(
  "learning/fetchTopics",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/topic/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки тем");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const fetchLectures = createAsyncThunk<Lecture[], void, { rejectValue: string }>(
  "learning/fetchLectures",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lecture/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки лекций");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

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
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки лабораторных");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const fetchTests = createAsyncThunk<Test[], void, { rejectValue: string }>(
  "learning/fetchTests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/test/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка загрузки тестов");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const createTopic = createAsyncThunk<Topic, { title: string; description?: string }, { rejectValue: string }>(
  "learning/createTopic",
  async ({ title, description = "" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/topic/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка создания темы");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const saveLecture = createAsyncThunk<
  void,
  { title: string; lectureFileUrl: string; topicId: string; id?: string }, // Добавили topicId
  { state: RootState }
>("learning/saveLecture", async ({ title, lectureFileUrl, topicId, id }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const isEdit = Boolean(id);

    const response = await fetch(
      isEdit ? `http://localhost:4200/api/v1/lecture/${id}` : "http://localhost:4200/api/v1/lecture/create",
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, lectureFileUrl, topicId }), // Добавили topicId
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Ошибка при сохранении лекции");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Неизвестная ошибка");
  }
});

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures = action.payload;
      })
      .addCase(fetchLabs.fulfilled, (state, action) => {
        state.labs = action.payload;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.tests = action.payload;
      })
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка при создании темы";
      })
      .addCase(saveLecture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLecture.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveLecture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default learningSlice.reducer;
