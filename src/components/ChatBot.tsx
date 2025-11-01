import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Shield, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE_URL = "http://localhost:5000";

// Define message structure
interface Message {
  role: "user" | "bot";
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "👋 Hi! I'm your FraudGuard AI Assistant. I can help you identify scams, understand fraud prevention, and answer questions about digital payment security. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      icon: "🎣",
      text: "Identify phishing emails",
      query: "How can I identify phishing emails?",
    },
    {
      icon: "💳",
      text: "Safe payment practices",
      query: "What are safe online payment practices?",
    },
    {
      icon: "🔒",
      text: "Protect my accounts",
      query: "How do I protect my accounts from fraud?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customQuery?: string) => {
    const query = customQuery || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: "user", content: query };
    const loadingMessage: Message = { role: "bot", content: "..." };

    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    const payload = { message: query };

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      let botResponse: Message;

      if (!response.ok || !data.success) {
        const errorContent =
          data.error || "Sorry, I couldn't connect to the AI service.";
        botResponse = {
          role: "bot",
          content: `⚠️ **Error:** ${errorContent}`,
        };
      } else {
        const aiResponseText =
          data.reply ||
          "I received your message, but the AI response was empty. Try again?";
        botResponse = { role: "bot", content: aiResponseText };
      }

      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        return [...newMessages, botResponse];
      });
    } catch (error) {
      console.error("ChatBot API network error:", error);
      const botResponse: Message = {
        role: "bot",
        content:
          "🚨 **Network Error**: Could not reach the FraudGuard server. Please ensure the backend is running.",
      };
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1);
        return [...newMessages, botResponse];
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Using pixel button style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-pixel-main fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-glow z-50 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window - Changed card-glass to pixel-box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-lg h-[700px] pixel-box flex flex-col z-50">
          {/* Header - Updated styling */}
          <div className="p-4 border-b border-gray-600 flex items-center gap-3 bg-gray-900 rounded-t-lg">
            <div className="w-10 h-10 bg-cyan-300/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">FraudGuard AI Assistant</h3>
              <p className="text-xs text-gray-400">Fraud Detection Expert</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/90">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Message Bubble styling update */}
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-700 text-white border border-gray-600"
                  } ${msg.content === "..." ? "animate-pulse" : ""}`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 text-center mb-3">
                  Quick Actions:
                </p>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors border border-gray-600"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-sm text-cyan-300">
                        {action.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Info Banner */}
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-600">
            <div className="flex items-center gap-2 text-xs text-cyan-300">
              <Lightbulb className="w-4 h-4" />
              <span>Ask me anything about fraud prevention!</span>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-600 bg-gray-900 rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about fraud prevention..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
                disabled={loading}
              />
              <button
                onClick={() => handleSend()}
                className="btn-pixel-main w-10 h-10 flex items-center justify-center"
                disabled={loading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
