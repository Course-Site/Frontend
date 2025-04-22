import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Lab {
  title: string;
  content: string;
  topicId?: string;
}

const LabPage = () => {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("ID лабораторной работы не указан");
        }

        // Проверка формата ID
        const isValidUUID = (id: string) => 
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        
        if (!isValidUUID(id)) {
          throw new Error("Неверный формат ID лабораторной работы");
        }

        const token = localStorage.getItem("token");
        console.log("Используемый токен:", token);
        
        if (!token) {
          throw new Error("Требуется авторизация");
        }

        const response = await fetch(`http://localhost:4200/api/v1/lab/findById/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("Статус ответа:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || 
            `Ошибка сервера: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Полученные данные:", data);
        
        if (!data.title || !data.content) {
          throw new Error("Неполные данные лабораторной работы");
        }

        setLab(data);
      } catch (error) {
        console.error("Полная ошибка:", error);
        setError(error instanceof Error ? error.message : "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
  }, [id]);

  if (loading) return <p className="text-center">Загрузка лабораторной работы...</p>;
  if (error) return <p className="text-center text-red-500">Ошибка: {error}</p>;
  if (!lab) return <p className="text-center">Лабораторная работа не найдена.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lab.title}</h1>
      <div
        className="prose font-mono" // Добавлен font-mono для моноширинного шрифта
        dangerouslySetInnerHTML={{ __html: lab.content }}
      />
    </div>
  );
};

export default LabPage;