import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const GeminiChatButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/gemini", { prompt });
      const aiMessage = { role: "ai", text: res.data.reply };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "❌ Lỗi gọi API." }]);
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <>
      <style>
        {`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>

      {/* Nút mở chat */}
      <button
        onClick={() => setShowChat(!showChat)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "#1677ff",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 28,
          boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 9999,
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        💬
      </button>

      {/* Khung chat */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 40,
            width: 380,
            height: 540,
            backgroundColor: "#fff",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
            zIndex: 10000,
            overflow: "hidden",
            animation: "slideUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#1677ff", color: "#fff", padding: "12px 16px", fontWeight: "bold", fontSize: 16, display: "flex", justifyContent: "space-between" }}>
            Cô Trợ Lý 🤖
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => setShowChat(false)}
            >
              ✖
            </span>
          </div>

          {/* Nội dung chat */}
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 16,
                    backgroundColor: msg.role === "user" ? "#1677ff" : "#e5e5ea",
                    color: msg.role === "user" ? "#fff" : "#000",
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Nhập prompt */}
          <div style={{ padding: 10, borderTop: "1px solid #eee", backgroundColor: "#fff" }}>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhấn Enter để gửi, Shift+Enter để xuống dòng"
              style={{
                width: "100%",
                resize: "none",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 8,
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: loading ? "#999" : "#1677ff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              {loading ? "Đang phản hồi..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChatButton;
