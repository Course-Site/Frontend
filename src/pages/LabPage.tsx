/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchLabById } from "../store/labSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store/store"; // Убедись, что путь корректный

const LabPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentLab: lab, loading, error } = useAppSelector((state) => state.lab);
  const { user } = useSelector((state: RootState) => state.auth);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [grade, setGrade] = useState("Оценка пока не выставлена");

  useEffect(() => {
    if (id) {
      dispatch(fetchLabById(id));
    }
  }, [dispatch, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        alert("Можно загружать только .pdf или .doc/.docx файлы");
        return;
      }
      setUploadedFile(file);
      console.log("Файл загружен:", file.name);
    }
  };

  if (loading) return <p className="text-center">Загрузка лабораторной работы...</p>;
  if (error) return <p className="text-center text-red-500">Ошибка: {error}</p>;
  if (!lab) return <p className="text-center">Лабораторная работа не найдена.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{lab.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: lab.content }} />

      {user?.role === "user" && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Загрузка лабораторной работы</h2>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 mb-2"
          />
          {uploadedFile && <p className="text-green-600">Загружен файл: {uploadedFile.name}</p>}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ваша оценка:</label>
            <div className="p-2 border rounded bg-white text-gray-800">{grade}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPage;
