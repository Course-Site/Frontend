import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Lecture {
  title: string;
  lectureFileUrl: string; // HTML-контент
}

const LecturePage = () => {
  const { id } = useParams<{ id: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:4200/api/v1/lecture/findById/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setLecture(data);
        } else {
          console.error(data.message || "Ошибка загрузки лекции");
        }
      } catch (error) {
        console.error("Ошибка сети или сервера", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading) return <p className="text-center">Загрузка лекции...</p>;
  if (!lecture) return <p className="text-center">Лекция не найдена или еще не создана.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{lecture.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: lecture.lectureFileUrl }}
      />
    </div>
  );
};

export default LecturePage;
