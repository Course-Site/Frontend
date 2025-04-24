import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createLecture, updateLecture, fetchLectureById } from '../store/lectureSlice';
import type {LectureEditorProps} from "../types/types";


const LectureEditor: React.FC<LectureEditorProps> = ({ isEdit }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const { lectures, loading, error } = useAppSelector((state) => state.lecture);
  const lecture = isEdit && id ? lectures.find((l) => l.id === id) : null;

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topicIdFromUrl = queryParams.get('topicId');
    if (topicIdFromUrl) setTopicId(topicIdFromUrl);

    if (isEdit && id) {
      dispatch(fetchLectureById(id));
    }
  }, [dispatch, id, isEdit, location.search]);

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
      setContent(lecture.content);
      if (lecture.topicId) setTopicId(lecture.topicId);
    }
  }, [lecture]);

  const handleEditorChange = (newContent: string) => setContent(newContent);

  const handleSave = async () => {
    if (!topicId) return alert('Не указана тема для лекции');
    try {
      if (isEdit && id) {
        await dispatch(updateLecture({ id, title, content, topicId })).unwrap();
        alert('Лекция обновлена');
      } else {
        await dispatch(createLecture({ title, content, topicId })).unwrap();
        alert('Лекция сохранена');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? `Ошибка: ${err.message}` : 'Неизвестная ошибка');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? 'Редактировать лекцию' : 'Создать лекцию'}
      </h1>

      {loading && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          Загрузка данных лекции...
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          Ошибка: {error}
        </div>
      )}

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
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          menubar: false,
          plugins: ['link', 'image', 'media'],
          toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright | outdent indent | link image',
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
