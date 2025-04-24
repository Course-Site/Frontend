import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Lecture {
  id: string;
  title: string;
  topicId: string;
  content: string;
}

export interface Lab {
  id: string;
  title: string;
  topicId: string;
  content: string; // Добавляем content для лабораторных работ
}

interface Test {
  id: string;
  title: string;
  topicId: string;
}
interface LabResult {
  id: string;
  submissionFileUrl?: string;
  score?: number;
  submittedAt: Date;
  userId: string;
  labId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface LearningState {
  topics: Topic[];
  lectures: Lecture[];
  labs: Lab[];
  labResults: LabResult[];
  tests: Test[];
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  topics: [],
  lectures: [],
  labs: [],
  labResults: [],
  tests: [],
  loading: false,
  error: null,
};


// Топики
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

// Лекции
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

export const createLecture = createAsyncThunk<
  Lecture,
  { title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/createLecture",
  async ({ title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/lecture/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при создании лекции");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const updateLecture = createAsyncThunk<
  Lecture,
  { id: string; title: string; content: string; topicId: string },
  { rejectValue: string }
>(
  "learning/updateLecture",
  async ({ id, title, content, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lecture/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при обновлении лекции");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const deleteLecture = createAsyncThunk<string, string, { rejectValue: string }>(
  "learning/deleteLecture",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/lecture/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при удалении лекции");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

// Лабораторные работы
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

// Тесты
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

export const createTest = createAsyncThunk<
  Test,
  { title: string; topicId: string },
  { rejectValue: string }
>(
  "learning/createTest",
  async ({ title, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4200/api/v1/test/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при создании теста");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const updateTest = createAsyncThunk<
  Test,
  { id: string; title: string; topicId: string },
  { rejectValue: string }
>(
  "learning/updateTest",
  async ({ id, title, topicId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/test/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, topicId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Ошибка при обновлении теста");

      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

export const deleteTest = createAsyncThunk<string, string, { rejectValue: string }>(
  "learning/deleteTest",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4200/api/v1/test/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Ошибка при удалении теста");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);


const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Топики
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
        state.error = action.payload || "Ошибка загрузки тем";
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

      // Лекции
      .addCase(fetchLectures.fulfilled, (state, action) => {
        state.lectures = action.payload;
      })
      .addCase(createLecture.fulfilled, (state, action) => {
        state.lectures.push(action.payload);
      })
      .addCase(updateLecture.fulfilled, (state, action) => {
        const idx = state.lectures.findIndex((l) => l.id === action.payload.id);
        if (idx !== -1) {
          state.lectures[idx] = action.payload;
        }
      })
      .addCase(deleteLecture.fulfilled, (state, action) => {
        state.lectures = state.lectures.filter((lecture) => lecture.id !== action.payload);
      })

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
      })

      // Тесты
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.tests = action.payload;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.tests.push(action.payload);
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        const idx = state.tests.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) {
          state.tests[idx] = action.payload;
        }
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.tests = state.tests.filter((test) => test.id !== action.payload);
      });
  },
});

export default learningSlice.reducer;