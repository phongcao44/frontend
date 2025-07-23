import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown"; 
const GeminiChatButton = () => {
  const [showChat, setShowChat] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // <-- nhiều lượt chat
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/gemini", { prompt });
      const aiMessage = { role: "ai", text: res.data.reply };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "ai", text: "❌ Lỗi gọi API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        💬
      </button>

      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 30,
            width: 400,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: 10,
            padding: 10,
            boxShadow: "0 0 20px rgba(0,0,0,0.15)",
            zIndex: 9999,
            maxHeight: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>Cô trợ lý</div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: 10,
              paddingRight: 5,
              maxHeight: 500,
            }}
          >
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  margin: "5px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 12,
                    backgroundColor: msg.role === "user" ? "#1677ff" : "#f0f0f0",
                    color: msg.role === "user" ? "white" : "black",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}

          </div>

          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Nhập câu hỏi..."
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              width: "100%",
              padding: "6px 12px",
              backgroundColor: "#1677ff",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {loading ? "Đang phản hồi..." : "Gửi"}
          </button>
        </div>
      )}
    </>
  );
};

export default GeminiChatButton;
