import { createAsyncThunk } from '@reduxjs/toolkit';

interface Message {
  content: string;
  role: 'user' | 'assistant';
}

interface ChatResponse {
  reply: string;
}

interface HistoryResponse {
  messages: Message[];
}

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Требуется авторизация');
  return token;
};

export const fetchChatResponse = createAsyncThunk(
  'ai/chat',
  async (message: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ошибка авторизации. Пожалуйста, войдите снова.');
        }
        throw new Error(`Ошибка: ${response.status}`);
      }

      return await response.json() as ChatResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Ошибка соединения");
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'ai/history',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:5000/ai/history`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ошибка авторизации');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as HistoryResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Не удалось загрузить историю");
    }
  }
);