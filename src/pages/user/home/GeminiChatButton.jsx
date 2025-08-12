import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Cookies from "js-cookie";
import { Send, MessageCircle, X, ShoppingCart, Package, CreditCard, Headphones, Bot, User } from 'lucide-react';

const GeminiChatButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      text: "Xin chào! Tôi là trợ lý ảo của shop. Tôi có thể giúp bạn về sản phẩm, đơn hàng, thanh toán và nhiều vấn đề khác. Bạn cần hỗ trợ gì hôm nay? 😊"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: ShoppingCart, label: 'Sản phẩm', prompt: 'Tôi muốn tìm hiểu về sản phẩm của shop' },
    { icon: Package, label: 'Đơn hàng', prompt: 'Tôi muốn tra cứu đơn hàng của mình' },
    { icon: CreditCard, label: 'Thanh toán', prompt: 'Cho tôi biết các phương thức thanh toán' },
    { icon: Headphones, label: 'Hỗ trợ', prompt: 'Tôi cần hỗ trợ từ nhân viên tư vấn' }
  ];

  const handleSend = async (message = prompt) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const userCookie = Cookies.get("user");
      let userId = null;

      if (userCookie) {
        const userObj = JSON.parse(userCookie);
        userId = userObj.id;
      }

      if (!userId) {
        setChatHistory((prev) => [
          ...prev,
          { role: "ai", text: "Xin lỗi, không xác định được tài khoản của bạn. Vui lòng đăng nhập lại để sử dụng dịch vụ hỗ trợ." },
        ]);
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:8080/api/gemini", {
        prompt: message,
        userId,
      });

      const aiMessage = { role: "ai", text: res.data.reply };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Lỗi API:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", text: " Xin lỗi, hiện tại hệ thống đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ hotline 0905087335 để được hỗ trợ trực tiếp." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (actionPrompt) => {
    handleSend(actionPrompt);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const formatTime = (timestamp) => {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-[80px] right-4 z-50">
      {/* Chat Toggle Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot size={24} />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Cô Trợ Lý AI</h3>
                <span className="text-xs opacity-90">Đang online • Phản hồi ngay</span>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${msg.role === "user" ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3 bg-gradient-to-r from-gray-400 to-gray-600">
                    <Bot size={16} />
                  </div>
                )}

                <div className="max-w-[85%]">
                  <div
                    className={`p-3 rounded-2xl shadow-sm ${msg.role === "user"
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                      }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="ml-4 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="ml-4 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 px-1 ${msg.role === "user" ? 'text-right' : 'text-left'}`}>
                    {formatTime()}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ml-3 bg-gradient-to-r from-blue-500 to-purple-600">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-sm border border-gray-200 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={loading}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-gray-100 hover:border-blue-200 hover:shadow-sm"
                >
                  <action.icon size={18} className="text-blue-500 mb-1" />
                  <span className="text-gray-600 font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex space-x-3">
              <textarea
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-24 min-h-[48px]"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e0 transparent'
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !prompt.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-4 py-3 transition-all duration-200 flex items-center justify-center min-w-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Được hỗ trợ bởi AI • Phản hồi có thể không chính xác 100%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChatButton;