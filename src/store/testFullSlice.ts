import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "./apiUtils";
import { RootState } from "./store";

export const createFullTest = createAsyncThunk<
  void,
  {
    title: string;
    topicId: string;
    description: string;
    questions: Array<{
      text: string;
      imageUrl: string;
    }>;
    answers?: Array<{
      text: string;
      isCorrect: boolean;
      questionIndex: number;
    }>;
  },
  { state: RootState }
>('test/createFullTest', async ({ title, topicId, description, questions, answers = [] }, thunkAPI) => {
  try {
    // 1. Create test
    const testResponse = await fetch('http://localhost:4200/api/v1/test/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, topicId, description }),
    });

    if (!testResponse.ok) {
      const error = await testResponse.json();
      throw new Error(error.message || 'Ошибка при создании теста');
    }

    const test = await testResponse.json();

    // 2. Create questions
    const createdQuestions = await Promise.all(
      questions.map(async (q, index) => {
        const questionData = {
          title: q.text,
          text: q.text,
          imageUrl: q.imageUrl || null,
          number: index + 1,
          testId: test.id,
        };

        const questionResponse = await fetch('http://localhost:4200/api/v1/testQuestion/create', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(questionData),
        });

        if (!questionResponse.ok) {
          const error = await questionResponse.json();
          throw new Error(`Вопрос ${index + 1}: ${error.message || 'Ошибка создания вопроса'}`);
        }

        return await questionResponse.json();
      })
    );

    // 3. Create answers if provided
    if (answers.length > 0) {
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        const questionId = createdQuestions[answer.questionIndex]?.id;
        
        if (!questionId) continue;

        const answerData = {
          text: answer.text,
          isCorrect: answer.isCorrect,
          questionId: questionId,
          number: i + 1,
        };
        
        const answerResponse = await fetch('http://localhost:4200/api/v1/testAnswer/create', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(answerData),
        });

        if (!answerResponse.ok) {
          const error = await answerResponse.json();
          throw new Error(`Ответ ${i + 1}: ${error.message || 'Ошибка создания ответа'}`);
        }
      }
    }

    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Неизвестная ошибка'
    );
  }
});