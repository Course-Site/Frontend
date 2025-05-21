import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchLabById, uploadLabReport, getLabReportByLabAndUser } from "../store/labSlice";
import { RootState } from "../store/store";

const LabPage = () => {
  const { id: labId } = useParams<{ id: string }>();
  console.log(labId);
  const dispatch = useAppDispatch();
  const { 
    currentLab: lab, 
    loading, 
    error,
    labResults
  } = useAppSelector((state) => state.lab);
  const { user } = useAppSelector((state: RootState) => state.auth);
  console.log("UserId1:", user.id);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [grade, setGrade] = useState("Оценка пока не выставлена");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (labId) {
      dispatch(fetchLabById(labId));
    }
  }, [dispatch, labId]);

  useEffect(() => {
    if (user && labId) {
      console.log("UserId:", user.id);
      dispatch(getLabReportByLabAndUser({ labId, userId: user.id }));
    }
  }, [dispatch, labId, user]);

  useEffect(() => {
    if (user && labId && labResults.length > 0) {
      const userSubmission = labResults.find(
        result => result.labId === labId && result.userId === user.id
      );
      
      if (userSubmission) {
        setGrade(userSubmission.score ? `Оценка: ${userSubmission.score}` : "Работа проверяется");
        if (userSubmission.submissionFileUrl) {
          setSubmissionStatus(`Работа уже отправлена: ${userSubmission.submissionFileUrl}`);
        }
      }
    }
  }, [labResults, labId, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      if (!validTypes.includes(file.type)) {
        alert("Можно загружать только .pdf или .doc/.docx файлы");
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !labId || !user) {
      console.error("Missing required data for submission");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("labId", labId);
    formData.append("userId", user.id);

    try {
      const result = await dispatch(uploadLabReport(formData)).unwrap();
      setSubmissionStatus("Работа успешно отправлена!");
      setUploadedFile(null);
      
      // Refresh the submission data
      if (user && labId) {
        await dispatch(getLabReportByLabAndUser({ labId, userId: user.id }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      setSubmissionStatus("Ошибка при отправке работы. Пожалуйста, попробуйте снова.");
    } finally {
      setIsSubmitting(false);
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
          
          {submissionStatus && (
            <div className={`mb-4 p-2 rounded ${
              submissionStatus.includes("Ошибка") 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {submissionStatus}
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 mb-2"
            disabled={!!submissionStatus || isSubmitting}
          />
          
          {uploadedFile && (
            <div className="flex items-center gap-2 mb-4">
              <p className="text-green-600">Выбран файл: {uploadedFile.name}</p>
              <button 
                onClick={() => setUploadedFile(null)}
                className="text-red-500 text-sm"
                disabled={isSubmitting}
              >
                Отменить
              </button>
            </div>
          )}

          {uploadedFile && !submissionStatus?.includes("уже отправлена") && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!uploadedFile || isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Отправить работу"}
            </button>
          )}

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