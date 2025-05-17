import { useState, useEffect, useRef } from 'react';

type Message = {
  content: string;
  isUser: boolean;
};

type AuthState = {
  isAuthenticated: boolean;
  jwtToken: string | null;
};

const NeuralNetworkChat = () => {
  // Authentication state
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    jwtToken: null,
  });
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { content: 'Добрый день! Пожалуйста, авторизуйтесь для начала общения.', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuth({
        isAuthenticated: true,
        jwtToken: token,
      });
      loadHistory(token);
    }
  }, []);
  
  // Update UI based on authentication
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setMessages([
        { content: 'Вы вышли из системы. Пожалуйста, авторизуйтесь для продолжения.', isUser: false }
      ]);
    }
  }, [auth.isAuthenticated]);
  
  // Add message to chat
  const addMessage = (content: string, isUser: boolean) => {
    setMessages(prev => [...prev, { content, isUser }]);
  };
  
  // Try to refresh token
  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const newToken = data.token;
        localStorage.setItem('jwtToken', newToken);
        setAuth({
          isAuthenticated: true,
          jwtToken: newToken,
        });
        return true;
      }
    } catch (e) {
      console.error("Refresh failed:", e);
    }
    return false;
  };
  
  // Send message to server
  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || !auth.isAuthenticated || !auth.jwtToken) return;

    addMessage(message, true);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.jwtToken}`
        },
        body: JSON.stringify({ message })
      });

      if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          logout();
          addMessage("Токен истек. Пожалуйста, войдите снова.", false);
          return;
        }
        return sendMessage();
      }

      const data = await response.json();
      setIsTyping(false);
      addMessage(data.reply, false);
      
    } catch (error) {
      setIsTyping(false);
      addMessage("Ошибка соединения", false);
    }
  };
  
  // Load chat history
  const loadHistory = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:5000/ai/history`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) throw new Error("Auth failed");
        return;
      }
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        const historyMessages = data.messages.map((msg: any) => ({
          content: msg.content,
          isUser: msg.role === 'user'
        }));
        setMessages(prev => [...prev, ...historyMessages]);
      }
    } catch (error) {
      console.error("Ошибка загрузки истории:", error);
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:4200/api/v1/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка авторизации");
      }

      const data = await response.json();
      localStorage.setItem('jwtToken', data.token);
      setAuth({
        isAuthenticated: true,
        jwtToken: data.token,
      });
      setShowLoginModal(false);
      setLoginError(null);
      addMessage("Вы авторизованы. Чем могу помочь?", false);
      loadHistory(data.token);
      
    } catch (error) {
      console.error("Ошибка входа:", error);
      setLoginError(error instanceof Error ? error.message : "Неизвестная ошибка");
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setAuth({
      isAuthenticated: false,
      jwtToken: null,
    });
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  // Handle login form submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginForm.email, loginForm.password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Main chat container */}
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-md overflow-hidden">
        {/* Chat header */}
        <div className="bg-blue-700 text-white p-4 text-center text-2xl flex justify-between items-center">
          <span>Чат с GigaChat</span>
          <div className="flex gap-2">
            {!auth.isAuthenticated ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1 bg-white text-blue-700 rounded text-sm"
              >
                Войти
              </button>
            ) : (
              <button 
                onClick={logout}
                className="px-3 py-1 bg-white text-blue-700 rounded text-sm"
              >
                Выйти
              </button>
            )}
          </div>
        </div>
        
        {/* Chat messages */}
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
        
        {/* Chat input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={auth.isAuthenticated ? "Введите ваше сообщение..." : "Войдите, чтобы отправить сообщение..."}
              disabled={!auth.isAuthenticated}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!auth.isAuthenticated || !inputValue.trim()}
              className="ml-3 px-5 py-2 bg-blue-700 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
      
      {/* Login modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowLoginModal(false);
            setLoginError(null);
          }}
        >
          <div 
            className="bg-white p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Авторизация</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                placeholder="Email"
                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
                required
              />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Пароль"
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                required
              />
              {loginError && (
                <p className="text-red-500 mb-3">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralNetworkChat;