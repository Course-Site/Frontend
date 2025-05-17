import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchChatResponse, fetchChatHistory } from '../store/aiSlice';
import { useAppDispatch } from '../store/hooks'; // правильно типизированный dispatch

type Message = {
  content: string;
  isUser: boolean;
};

const NeuralNetworkChat = () => {
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<Message[]>([
    { content: 'Добрый день! Чем могу помочь?', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const addMessage = useCallback((content: string, isUser: boolean) => {
    setMessages(prev => [...prev, { content, isUser }]);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const result = await dispatch(fetchChatHistory());
        
        if (fetchChatHistory.fulfilled.match(result)) {
          const historyMessages = result.payload.messages.map(msg => ({
            content: msg.content,
            isUser: msg.role === 'user'
          }));
          setMessages(prev => [prev[0], ...historyMessages]);
        } else if (fetchChatHistory.rejected.match(result)) {
          setError(result.payload as string);
        }
      } catch {
        setError('Не удалось загрузить историю сообщений');
      }
    };

    loadHistory();
  }, [dispatch]);
  
  const sendMessage = useCallback(async () => {
    const message = inputValue.trim();
    if (!message) return;

    try {
      addMessage(message, true);
      setInputValue("");
      setIsTyping(true);
      setError(null);

      const result = await dispatch(fetchChatResponse(message));
      
      if (fetchChatResponse.fulfilled.match(result)) {
        addMessage(result.payload.reply, false);
      } else if (fetchChatResponse.rejected.match(result)) {
        const err = result.payload as string;
        setError(err);
        addMessage(err, false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка соединения";
      setError(errorMessage);
      addMessage(errorMessage, false);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, addMessage, dispatch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  }, [sendMessage]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-700 text-white p-4 text-center text-2xl">
          Чат с GigaChat
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
            <p>{error}</p>
          </div>
        )}
        
        <div className="h-[500px] overflow-y-auto p-5 flex flex-col gap-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`max-w-[70%] px-4 py-3 rounded-2xl ${message.isUser 
                ? 'bg-blue-700 text-white self-end rounded-br-md' 
                : 'bg-gray-200 text-black self-start rounded-bl-md'}`}
            >
              {message.content}
            </div>
          ))}
          
          {isTyping && (
            <div className="text-gray-500 italic self-start mb-3">
              GigaChat печатает...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Введите ваше сообщение..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="ml-3 px-5 py-2 bg-blue-700 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
            >
              {isTyping ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkChat;
