import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Добавили useLocation
import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch } from '../store/hooks';
import { saveLecture } from '../store/learningSlice';

interface LectureEditorProps {
  isEdit: boolean;
  initialContent?: string;
  initialTitle?: string;
}

const LectureEditor: React.FC<LectureEditorProps> = ({
  isEdit,
  initialContent = '',
  initialTitle = ''
}) => {
  const dispatch = useAppDispatch();
  const [lectureFileUrl, setLectureFileUrl] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [topicId, setTopicId] = useState(''); // Добавили состояние для topicId

  const { id } = useParams<{ id: string }>();
  const location = useLocation(); // Для получения query параметров

  useEffect(() => {
    // Получаем topicId из query параметров
    const queryParams = new URLSearchParams(location.search);
    const topicIdFromUrl = queryParams.get('topicId');
    if (topicIdFromUrl) {
      setTopicId(topicIdFromUrl);
    }

    if (isEdit && id) {
      const fetchLectureData = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4200/api/v1/lecture/findById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setTitle(data.title);
        setLectureFileUrl(data.lectureFileUrl);
        // Если редактируем существующую лекцию, получаем topicId из данных
        if (data.topicId) {
          setTopicId(data.topicId);
        }
      };

      fetchLectureData();
    }
  }, [isEdit, id, location.search]);

  const handleEditorChange = (newContent: string) => {
    setLectureFileUrl(newContent);
  };

  const handleSave = async () => {
    if (!topicId) {
      alert('Не указана тема для лекции');
      return;
    }

    try {
      await dispatch(saveLecture({ 
        title, 
        lectureFileUrl, 
        topicId, // Добавили topicId
        id 
      })).unwrap();
      alert(isEdit ? 'Лекция обновлена' : 'Лекция сохранена');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Ошибка: " + err.message);
      } else {
        alert("Неизвестная ошибка");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Редактировать лекцию' : 'Создать лекцию'}</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Тема лекции:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заголовок лекции"
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
        value={lectureFileUrl}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: false,
          plugins: ['link', 'image', 'media'],
          toolbar:
            'undo redo | styles | bold italic | alignleft aligncenter alignright | outdent indent | link image',
        }}
      />

      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Сохранить
      </button>
    </div>
  );
};

export default LectureEditor;