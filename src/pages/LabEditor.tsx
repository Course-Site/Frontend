import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch } from '../store/hooks';
import { createLab, updateLab } from '../store/learningSlice';

interface LabEditorProps {
  isEdit: boolean;
  initialContent?: string;
  initialTitle?: string;
}

const LabEditor: React.FC<LabEditorProps> = ({
  isEdit,
  initialContent = '',
  initialTitle = ''
}) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [topicId, setTopicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topicIdFromUrl = queryParams.get('topicId');
    if (topicIdFromUrl) {
      setTopicId(topicIdFromUrl);
    }

    if (isEdit && id) {
      const fetchLabData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          if (!isValidUUID(id)) {
            throw new Error('Неверный формат ID лабораторной работы');
          }

          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error('Требуется авторизация');
          }

          const response = await fetch(`http://localhost:4200/api/v1/lab/findById/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Ошибка загрузки данных');
          }

          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
          if (data.topicId) {
            setTopicId(data.topicId);
          }
        } catch (error) {
          console.error('Ошибка:', error);
          setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        } finally {
          setLoading(false);
        }
      };

      fetchLabData();
    }
  }, [isEdit, id, location.search]);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (!topicId) {
      setError('Не указана тема для лабораторной работы');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        if (!isValidUUID(id)) {
          throw new Error('Неверный формат ID лабораторной работы');
        }
        await dispatch(updateLab({ id, title, content, topicId })).unwrap();
      } else {
        await dispatch(createLab({ title, content, topicId })).unwrap();
      }
      
      alert(isEdit ? 'Лабораторная работа обновлена' : 'Лабораторная работа сохранена');
    } catch (err: unknown) {
      console.error('Ошибка сохранения:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  function isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }

  if (loading) return <p className="text-center">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Редактировать лабораторную работу' : 'Создать лабораторную работу'}
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Название:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          className="w-full p-2 border rounded"
        />
      </div>

      {topicId && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <span className="font-semibold">Привязано к теме:</span> {topicId}
        </div>
      )}

      <Editor
        apiKey="fd4zawezgmeqthwbbgtlvwiievumnw9lob7vw6ljv0napxrl"
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: false,
          plugins: ['link', 'code', 'image'],
          toolbar: 'undo redo | styles | bold italic | code | link image',
          content_style: 'body { font-family: monospace; }' // Стиль для лабораторных работ
        }}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className={`mt-4 px-4 py-2 text-white rounded ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
};

export default LabEditor;