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

    // 1. Prepare UI for send
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    // --- UPDATED PAYLOAD to match req.body.message ---
    const payload = { message: query };

    try {
      // 2. API Call to backend /chat route
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
        // Handle API/Server Error
        const errorContent =
          data.error || "Sorry, I couldn't connect to the AI service.";
        botResponse = {
          role: "bot",
          content:` ⚠ **Error:** ${errorContent}`,
        };
      } else {
        // Success: Use AI's reply from data.reply
        const aiResponseText =
          data.reply ||
          "I received your message, but the AI response was empty. Try again?";
        botResponse = { role: "bot", content: aiResponseText };
      }

      // 3. Update messages by replacing the loading indicator with the final response
      setMessages((prev) => {
        const newMessages = prev.slice(0, -1); // Remove the last item ("...")
        return [...newMessages, botResponse];
      });
    } catch (error) {
      console.error("ChatBot API network error:", error);
      const botResponse: Message = {
        role: "bot",
        content:
          "🚨 *Network Error*: Could not reach the FraudGuard server. Please ensure the backend is running.",
      };
      // Replace the loading message with the network error
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
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-glow z-50"
        variant="hero"
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-lg h-[700px] card-glass rounded-2xl shadow-card flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3 bg-gradient-primary rounded-t-2xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white">FraudGuard AI Assistant</h3>
              <p className="text-xs text-white/80">Fraud Detection Expert</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-muted border border-border"
                  } ${msg.content === "..." ? "animate-pulse" : ""}`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Quick Actions (only show initially) */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  Quick Actions:
                </p>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="w-full p-3 bg-muted/30 hover:bg-muted/50 rounded-lg text-left transition-colors border border-border/50 hover:border-primary/50"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-sm">{action.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Info Banner */}
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20">
            <div className="flex items-center gap-2 text-xs text-primary">
              <Lightbulb className="w-4 h-4" />
              <span>Ask me anything about fraud prevention!</span>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about fraud prevention..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={() => handleSend()}
                size="icon"
                variant="hero"
                disabled={loading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};